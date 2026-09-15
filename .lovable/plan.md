# Diagnosi — perché la Mission Control di PRIMA DI NOI è ferma su CH2

Solo lettura e analisi: nessun file dell'app modificato, nessun comando di scrittura eseguito.

## Risposta sintetica

L'autorità di CH2 è stata registrata correttamente su GitHub, ma **nessuno ha generato la nuova fotografia dopo**. Il sito non è rotto e non va cambiata l'architettura: manca solo l'ultimo passaggio, che oggi non è automatico.

## 1) Esiste già qualcosa che apre una issue `[WCM-PROJECTOR]` o costruisce l'envelope?

**No.** Ricerca su tutto il codice del sito (`supabase/functions`, `src/hooks`, `src/components/wcm`): nessun riferimento a `[WCM-PROJECTOR]`, nessuna creazione di issue, nessuna costruzione di envelope.

L'unico punto in cui il sito parla con GitHub in scrittura è `supabase/functions/_shared/wcmWorkerWake.ts` (`requestWorkerWake`), che sveglia **solo** il workflow `wcm-command-executor.yml` tramite `workflow_dispatch` / `repository_dispatch`. Non tocca `wcm-projector-dispatch.yml` e non apre issue.

## 2) Come viene generato oggi l'envelope di projection

Non viene generato dal sito. L'envelope (`project_id`, `projection`, `source_state_sha`, `semantic_fingerprint`, documenti, runtime) nasce interamente dentro WCM-LAB, nel workflow `.github/workflows/wcm-projector-dispatch.yml`, innescato dall'apertura di una issue `[WCM-PROJECTOR]`.

Il sito ne è solo il destinatario: `supabase/functions/wcm-projector/index.ts` riceve il POST, verifica l'identità GitHub (OIDC, audience `wcm-projector`, repo `scoppolabi-ux/WCM-LAB`, ref `main`) e scrive nelle tabelle `wcm_project_status`, `wcm_project_documents`, `wcm_project_needs`, `wcm_project_roadmap`, `wcm_project_activity`.

## 3) Cosa succede dopo un `APPROVE_FREEZE` — e perché CH2 è stale

Catena attuale, verificata nel codice:

```text
UI (WcmCommandSurface) -> wcm-command-submit  -> riga SUBMITTED + wake del worker
worker GitHub           -> wcm-command-pull   -> CLAIMED (rivalida sha + fingerprint)
worker GitHub scrive l'autorità su WCM-LAB
worker GitHub           -> wcm-command-complete -> RECORDED
[ qui la catena FINISCE ]
```

`supabase/functions/wcm-command-complete/index.ts` aggiorna solo la riga del comando (`status`, `recorded_at`, `receipt_path`, `receipt_sha`). **Non esiste nessun passo che richieda una nuova projection.** La riproiezione dipende da una issue `[WCM-PROJECTOR]` aperta a mano, o da un passo equivalente dentro il worker in WCM-LAB.

Evidenza sui dati reali:

- comando `c1513907-…`, `APPROVE_FREEZE`, need `…g3-new-chapter-02-…-board-gate`, `expected_state_sha = fb78d4c6…`, creato 14/09 22:03:50, **RECORDED** (autorità su GitHub eseguita);
- `wcm_project_status.prima-di-noi`: `source_state_sha = fb78d4c6…`, `updated_at = 14/09 21:50:26`, cioè **13 minuti prima** della registrazione dell'autorità;
- `wcm_project_needs`: il gate CH2 è ancora l'unico, `OPEN`; nessun need per "Chapter 3 — ORIGINE";
- `wcm_project_documents`: `MANUSCRIPT_APPROVED` contiene solo `prima` e `g3-new-chapter-01-03-17-v0-2`.

Quindi: la fotografia nel database è precedente all'approvazione. Non è un bug di classificazione, di bucket o di UI.

Lo stesso schema si vede negli approve precedenti (tutti `RECORDED`): finora l'allineamento è arrivato da una riproiezione lanciata a parte, che stavolta non è partita.

## 4) Azione operativa già disponibile senza toccare codice

**Sì — ed è il percorso più conservativo.** Aprire su `scoppolabi-ux/WCM-LAB` una issue con titolo `[WCM-PROJECTOR]` per `prima-di-noi`, esattamente come previsto da `wcm-projector-dispatch.yml`. Il workflow idrata i documenti e il runtime da `main` (che ora contiene CH2 FROZEN e il gate su Chapter 3 — ORIGINE) e POSTa l'envelope completo a `wcm-projector`.

Effetto atteso, senza alcuna modifica al sito:

- `wcm_project_status` aggiornato con il nuovo `source_state_sha`;
- il gate CH2 chiuso e sostituito dal gate Chapter 3 nel tab Board;
- CH2 visibile in "Manoscritto approvato" nel tab Documents.

La UI si riallinea entro 30 secondi grazie al refetch automatico, oppure subito con "Aggiorna".

Nota: `wcm-command-pull` rivalida `expected_state_sha` contro la projection. Finché la fotografia resta vecchia, un eventuale nuovo comando Board sul gate sbagliato verrebbe marcato `STALE`. La riproiezione va quindi fatta prima di qualunque nuova decisione.

## Miglioramento successivo possibile (non ora, solo per completezza)

Per non dipendere più da un passo manuale, la modifica minima e coerente sarebbe far sì che il worker in WCM-LAB, subito dopo `wcm-command-complete`, inneschi da solo la riproiezione. È lavoro lato WCM-LAB, non lato sito, e non introduce una seconda fonte di verità.

## File e funzioni citati

- `supabase/functions/wcm-projector/index.ts` — unico scrittore del read-model
- `supabase/functions/wcm-command-submit/index.ts`, `wcm-command-pull/index.ts`, `wcm-command-complete/index.ts` — ciclo di vita del comando Board
- `supabase/functions/_shared/wcmWorkerWake.ts` (`requestWorkerWake`) — sveglia solo l'executor, non il projector
- `src/hooks/useWcmProjects.ts`, `src/pages/WcmProjectDetail.tsx` (`refetchAll`) — lettura e refresh, entrambi solo sul database
- `src/components/wcm/WcmBoardTab.tsx`, `WcmDocumentsTab.tsx`, `wcmFormat.ts` — presentazione
