# Diagnosi read-only — "Capitolo 5 V0.2 ancora da approvare"

Nessun codice, dato o configurazione è stato modificato.

## Esito: il Projector ha funzionato, il read-model è corretto

Righe correnti (unica coppia, nessun duplicato/storico):

| document_id | category | status | requires_stefano | distribution_ready | updated_at |
|---|---|---|---|---|---|
| `chapter-05-v0-2` | MANUSCRIPT_APPROVED | APPROVED_FROZEN_CURRENT | false | true | 2026-08-21 22:30 UTC |
| `chapter-05-v0-2-board-report` | BOARD_REPORT | BOARD_GATE_CLOSED_SUPPORTING_MATERIAL | false | true | 2026-08-21 22:30 UTC |

- `wcm_project_needs`: **0 righe** in tutto il progetto → nessun Need aperto.
- `wcm_project_status`: `active` / `CHAPTER_6_V0_2_ELIGIBLE`, `needs_stefano=false`, `documents_to_read_count=0`, verdict "CHAPTER 5 V0.2 APPROVED / FROZEN / WORKFLOW COMPLETED".
- Roadmap `phase-5c-chapter-5-v0-2` = DONE.

Quindi: nessun record duplicato, nessun residuo storico, dispatch applicato.

## Causa concreta

Il badge "IN VALUTAZIONE · NON APPROVATO" **non è sul Capitolo 5**, è sul suo **Board Report**, ed è un falso positivo della sola logica di presentazione.

In `src/components/wcm/wcmFormat.ts`:

- `isApprovedDocument()` riconosce come approvato solo `MANUSCRIPT_APPROVED`, `APPROVED_BASELINE`, `APPROVED_FROZEN`, `LOCKED`, `PRESERVE`, oppure stringhe che matchano `/approved|frozen|locked|preserve/`.
- Il Board Report ha `category=BOARD_REPORT` e `status=BOARD_GATE_CLOSED_SUPPORTING_MATERIAL`: nessuna di queste parole compare → `isApprovedDocument = false`.
- Essendo `distribution_ready=true`, `isUnapprovedDistribution` diventa true → `WcmUnapprovedBadge` viene renderizzato in `WcmDocumentsTab`, `WcmDocumentReader` e `/wcm/documents`.
- Sempre per lo stesso motivo, `bucketOf()` lo classifica in **"Altri documenti"** invece che in una sezione di materiale di supporto chiuso, rafforzando la percezione di "capitolo 5 non chiuso".

Il Capitolo 5 vero (`MANUSCRIPT_APPROVED`) finisce correttamente nel bucket "Manoscritto approvato" e **non** riceve badge.

## Fattori esclusi

- **Duplicati/storici**: 2 sole righe, stesso `updated_at`, nessuna versione precedente residua.
- **Need aperti**: tabella vuota → la Command Surface e il banner "blocco di coerenza" non vengono nemmeno montati (richiedono un Need BOARD_GATE aperto), nonostante esista un comando RECORDED con target `chapter-05-v0-2-board-report`.
- **Cache/local state**: React Query con `refetchInterval: 30s` e nessuna persistenza; al massimo una latenza di 30 s dopo il dispatch, non uno stato permanente.
- **Query della sezione Documenti**: `useWcmDocuments` fa `select *` filtrato per `project_id`, senza filtri di stato — non introduce righe stantie.

## Correzione minima proposta (NON applicata)

Solo presentazione, in `src/components/wcm/wcmFormat.ts`:

1. In `isApprovedDocument()`, trattare come stato governato/chiuso anche `category=BOARD_REPORT` con status che contiene `BOARD_GATE_CLOSED` (o più in generale `closed`/`supporting_material`), così il badge "non approvato" non compare su materiale di supporto di un gate già chiuso.
2. Opzionale, per leggibilità: in `bucketOf()` mappare `BOARD_REPORT` a un bucket dedicato ("Materiale di supporto Board") invece di "Altri documenti".
3. Aggiornare/aggiungere i test su `isUnapprovedDistribution` e `bucketOf` per il caso BOARD_REPORT chiuso.

Nessuna modifica a DB, Projector, authority, Needs o pipeline è necessaria.
