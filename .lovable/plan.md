# WCM Canonical States — ricognizione e piano minimo (analisi, nessuna modifica applicata)

## 1. Inventario reale dei valori (DB, oggi)

`wcm_project_documents` — coppie category/status effettivamente presenti:

| category | status | righe | requires_stefano | distribution_ready |
|---|---|---|---|---|
| MANUSCRIPT_APPROVED | APPROVED_FROZEN_CURRENT | 3 | false | true |
| MANUSCRIPT_APPROVED | APPROVED_FROZEN_PRESERVE_COMPATIBLE | 3 | false | true |
| MANUSCRIPT_APPROVED | FROZEN_PRESERVE | 1 | false | true |
| BOARD_REPORT | BOARD_GATE_CLOSED_SUPPORTING_MATERIAL | 1 | false | true |
| PRODUCTION_BRIEF | WORKFLOW_ACTIVE_RESUMABLE | 1 | false | true |
| WORKING_DRAFT | DRAFT_COMPLETED_REVIEW_PENDING | 1 | false | false |

Altro:
- `wcm_project_needs`: **0 righe** (nessun need aperto o chiuso).
- `wcm_project_roadmap` status: ACTIVE, ACTIVE_MAINTENANCE, ACTIVE_RESUMABLE, DONE, NOT_ELIGIBLE, PLANNED.
- `wcm_project_status.status`: `active_resume_required` (unico valore) — **non** previsto in `STATUS_LABELS` di `wcmFormat.ts`, quindi già oggi cade nel ramo default "Waiting/ambra".
- `wcm_command_requests`: solo APPROVE_FREEZE (3 RECORDED, 2 STALE). CHECK constraint limita `command_type` a `APPROVE_FREEZE | REQUEST_CHANGES` e `status` a SUBMITTED/CLAIMED/RECORDED/STALE/REJECTED/FAILED.

## 2. Dove il frontend interpreta status/category

Cuore euristico: `src/components/wcm/wcmFormat.ts`
- `bucketOf()` — match esatto su alcune category, poi **fallback substring** su `approved|frozen|working|editorial|draft`.
- `isApprovedDocument()` — whitelist di category, poi **regex** `/approved|frozen|locked|preserve/` con negazione `/(un ?approved|not approved|candidate|draft|proposal)/`.
- `isUnapprovedDistribution()` = `distribution_ready && !isApprovedDocument`.
- `statusClasses()` / `STATUS_LABELS` (progetto) e `roadmapStatusClasses()` / `ROADMAP_STATUS_LABELS` — switch con default silenzioso.

Consumatori: `WcmUnapprovedBadge.tsx`, `WcmDocumentsTab.tsx` (bucket + ordinamento), `WcmDocumentReader.tsx`, `WcmDocumentsToReadPage.tsx`, `WcmProjectCard.tsx`, `WcmBoardTab.tsx`, `WcmOverviewTab.tsx`, `WcmRoadmapTab.tsx`.
Altre interpretazioni (fuori scope, già enum-based): `wcmExecution.ts`, `wcmKnowledge.ts`, `wcmHealthPlanes.ts`.
Server-side: `supabase/functions/_shared/wcmBoardGate.ts` usa già confronti **esatti** (`BOARD_CANDIDATE`) — è il modello da estendere.

"Needs Stefano" oggi **non** deriva da stringhe: viene dal boolean `requires_stefano` e dai record `wcm_project_needs`. Non va toccato.

## 3. Superficie riutilizzabile per persistere una decisione

Non esiste nulla di direttamente riutilizzabile:
- `wcm_command_requests` è vincolata da CHECK a due soli command_type e il suo ciclo di vita è pull/complete con receipt su GitHub: piegarla a "mapping di stato" richiederebbe comunque una migrazione del CHECK e un nuovo consumer nel worker.
- Tutte le altre tabelle WCM sono read-model scrivibili solo dal Projector (RLS: nessun INSERT/UPDATE per authenticated).
- Nessuna persistenza client (localStorage usato solo per la sessione auth).

Conclusione: serve **una sola** tabella nuova, minima, oppure — opzione a costo zero infrastrutturale — nessuna persistenza e mapping dichiarato solo nel codice. La richiesta "la decisione deve essere ricordata" implica la tabella.

## 4. Set canonico minimo proposto (mapping esatto, nessuna euristica)

Stati canonici documento (5):

```text
APPROVED_FROZEN     documento approvato e congelato (autorità applicata)
BOARD_SUPPORTING    materiale di supporto di un gate, non oggetto di autorità
WORKING_DRAFT       lavoro in corso, non approvato
BOARD_CANDIDATE     candidata congelabile, target legittimo di APPROVE_FREEZE
UNKNOWN             non riconosciuto → richiede decisione di Stefano
```

Mapping esatto dei valori realmente presenti (chiave = `CATEGORY|STATUS`):

| chiave | canonico |
|---|---|
| MANUSCRIPT_APPROVED\|APPROVED_FROZEN_CURRENT | APPROVED_FROZEN |
| MANUSCRIPT_APPROVED\|APPROVED_FROZEN_PRESERVE_COMPATIBLE | APPROVED_FROZEN |
| MANUSCRIPT_APPROVED\|FROZEN_PRESERVE | APPROVED_FROZEN |
| BOARD_REPORT\|BOARD_GATE_CLOSED_SUPPORTING_MATERIAL | BOARD_SUPPORTING |
| PRODUCTION_BRIEF\|WORKFLOW_ACTIVE_RESUMABLE | WORKING_DRAFT |
| WORKING_DRAFT\|DRAFT_COMPLETED_REVIEW_PENDING | WORKING_DRAFT |
| (BOARD_CANDIDATE\|*) | BOARD_CANDIDATE (invariante board gate già in uso) |
| qualsiasi altra coppia | UNKNOWN |

Effetti canonici (deterministici, nessun substring):
- APPROVED_FROZEN → bucket "Manoscritto approvato", nessun badge, target valido di freeze già registrato.
- BOARD_SUPPORTING → bucket "Materiale di supporto Board", **nessun** badge "IN VALUTAZIONE", mai target di autorità.
- WORKING_DRAFT → bucket "Working / Editorial", badge "non approvato" solo se `distribution_ready`.
- BOARD_CANDIDATE → bucket "Da approvare", target legittimo APPROVE_FREEZE.
- UNKNOWN → badge neutro "STATO NON RICONOSCIUTO" + blocco delle sole azioni di autorità su quel documento.

## 5. Modifica minima end-to-end proposta (da implementare in un secondo step)

**A. Core deterministico (frontend, nessun DB)**
- Nuovo `src/components/wcm/wcmCanonicalState.ts`: enum canonico, tabella di mapping esatta sopra, `canonicalStateOf(doc, overrides)`, `effectsOf(canonical)`.
- `wcmFormat.ts`: `bucketOf` e `isApprovedDocument` delegano al core; **rimossi** i rami regex/substring. Fallback = UNKNOWN, non "approvato" né "non approvato".
- `WcmUnapprovedBadge.tsx`: tre esiti (nessun badge / "IN VALUTAZIONE · NON APPROVATO" / "STATO NON RICONOSCIUTO").

**B. Superficie di decisione (solo se lo stato è UNKNOWN)**
- Nuovo `WcmUnknownStateResolver.tsx`, montato inline sulla riga/reader del solo documento interessato: mostra category+status grezzi, proposta di mapping con motivo/confidenza/effetto, scelta alternativa tra i canonici esistenti, oppure "proponi nuova categoria canonica" (che resta una **proposta**, non crea nulla).
- Blocco locale: solo le azioni di autorità del documento UNKNOWN sono disabilitate; il resto di Mission Control resta operativo.

**C. Persistenza della decisione (minima)**
- Una sola tabella nuova `wcm_state_mappings` (`category`, `status`, `canonical_state`, `decided_by`, `reason`, `confidence`, `created_at`, unique(category,status)), RLS: SELECT owner/admin, INSERT/UPDATE **solo owner** (Stefano). Nessuna edge function nuova: insert diretto dal client sotto RLS owner.
- `canonicalStateOf` legge prima la tabella di mapping statica, poi gli override persistiti — o viceversa, da decidere: proposta = statico prima, override solo per chiavi UNKNOWN, così una decisione non può silenziosamente ribaltare un invariante di metodo.
- Nuova categoria canonica: **non** creabile da UI. La proposta viene registrata come riga con `canonical_state = 'PROPOSED'` e richiede una modifica di codice/metodo per diventare canonica.

**D. Regressione BOARD_REPORT (caso 6)**
- Test: `{category: BOARD_REPORT, status: BOARD_GATE_CLOSED_SUPPORTING_MATERIAL, distribution_ready: true}` → canonico BOARD_SUPPORTING, `isUnapprovedDistribution === false`, bucket ≠ "Altri documenti". Questo è esattamente il falso positivo osservato oggi sul Capitolo 5 V0.2.

## File e tabelle toccabili

- Nuovi: `src/components/wcm/wcmCanonicalState.ts`, `wcmCanonicalState.test.ts`, `WcmUnknownStateResolver.tsx`; migrazione `wcm_state_mappings` (+ GRANT).
- Modificati: `wcmFormat.ts`, `WcmUnapprovedBadge.tsx`, `WcmDocumentsTab.tsx`, `WcmDocumentReader.tsx`, `WcmDocumentsToReadPage.tsx`, `useWcmProjects.ts` (hook mapping), eventualmente `WcmCommandSurface.tsx` per il blocco locale.
- **Non** toccati: Projector, edge functions di comando, `wcm_command_requests`, Needs, Learning, auth, pipeline documentazione.

## Rischi

- Passare al mapping esatto rende UNKNOWN ogni coppia non censita: se il Projector introduce nuovi status, compariranno segnalazioni. È l'effetto voluto, ma va comunicato.
- Un override persistito che riclassifica un documento come APPROVED_FROZEN sarebbe una forma di autorità fuori GitHub: per questo la proposta limita gli override alle sole chiavi UNKNOWN e non ammette la creazione di nuovi stati canonici da UI.
- La tabella di mapping è l'unica nuova infrastruttura; se preferisci zero DB, si può partire con solo A+B+D (mapping in codice, nessuna memoria delle decisioni) e aggiungere C dopo.
