# Diagnostica read-only: writer_memory / lineage in wcm-projector

## Domanda 1 — `lineage` è accettato/storicizzato?

**No.** La validazione è una whitelist esatta e `lineage` non è inclusa.

- `supabase/functions/wcm-projector/writerMemory.ts`
  - `WRITER_MEMORY_FIELDS` (righe 12–26): `memory_id, scope, category, guidance, origin_type, origin_ref, origin_context, status, source_path, source_sha, sort_order, project_id` — nessun `lineage`.
  - `parseWriterMemoryItem` (righe 50–55): ogni campo fuori whitelist produce `{ error: 'Unsupported writer_memory fields', fields: [...] }`.
- `supabase/functions/wcm-projector/index.ts` (righe 332–338): il risultato non-array di `parseWriterMemory` viene restituito come **HTTP 400**, interrompendo la richiesta.
- Anche la tabella `wcm_project_writer_memory` non ha colonna `lineage` (vedi schema read-model): quindi il campo non è né accettato né persistito.

## Domanda 2 — Un errore writer_memory abortisce le tabelle core?

**Sì, per errori di validazione.** La struttura del projector è fail-fast *pre-write*:

1. Tutta la validazione (projection, board, derived_execution_state, tutte le collections inclusa `writer_memory` a righe 332–338, board-gate cross-check, knowledge_health/checkpoints) avviene nelle righe 260–418, **prima di qualsiasi scrittura DB**.
2. La prima operazione DB è la read di `wcm_project_status` alla riga 429; insert/update status alle righe 465–492; upsert/delete delle collections (needs, execution_workflows, writer_memory, ecc.) alle righe 502–550.

Quindi un 400 da `parseWriterMemory` esce prima della riga 429: **nessuna scrittura** su `wcm_project_status`, `wcm_project_needs`, `wcm_project_execution_workflows`. Non è una transazione DB, ma il confine validazione/scrittura rende il fallimento di validazione atomicamente sicuro.

**Caveat (fuori scope ma rilevante):** gli errori *runtime* DB (500 durante upsert/delete, righe 502–550) NON sono transazionali — lo status può essere già aggiornato quando una collection fallisce. Vale solo per errori DB, non per validazione.

## Opzioni di fix (dalla più stretta), tutte backward-compatible

- **Opzione A — accept-and-ignore (nessuna migration):** aggiungere `lineage` a una lista di chiavi accettate-ma-ignorate in `writerMemory.ts` (stesso pattern di `project_id` o di `NEED_METADATA_KEYS` per needs). La source GitHub può inviarlo, il read-model non lo storicizza. Zero cambi DB/UI.
- **Opzione B — persistenza (migration + whitelist):** migration che aggiunge colonna `lineage` (jsonb se strutturato, text altrimenti, nullable) a `wcm_project_writer_memory`; aggiungere `lineage` a `WRITER_MEMORY_FIELDS` e al mapping della riga in `parseWriterMemoryItem`; test di accettazione. La UI resta invariata salvo esplicita richiesta di visualizzazione.
- **Opzione C — ibrida:** accettare `lineage` ora (Opzione A) e aggiungere la persistenza in una fase successiva se serve esporla in Mission Control.

In tutti i casi i payload esistenti senza `lineage` restano validi (campo opzionale), e il fail-fast pre-write resta invariato.

## Nota

Questa diagnostica non richiede modifiche. Approva il piano solo se vuoi che implementi una delle opzioni (indica quale); altrimenti ignora/rifiuta.
