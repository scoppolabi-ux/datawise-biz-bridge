# Diagnosi read-only + piano di allineamento contratto `wcm-projector`

## 1. Esito query analitica (stato HTTP)

`function_edge_logs` (ultime invocazioni, tutte POST su `/functions/v1/wcm-projector`):

| Timestamp UTC | Metodo | Status |
|---|---|---|
| 2026-08-22 20:55:21 | POST | **400** |
| 2026-08-22 20:49:49 | POST | 400 |
| 2026-08-22 20:46:33 | POST | 400 |

Il terzo tentativo, dopo il merge delle 20:55, è ancora **400**. Nessuna scrittura è avvenuta: tutti i controlli falliti sono pre-write.

## 2. Whitelist attuali (da `supabase/functions/wcm-projector/index.ts`)

- `projection` — solo `STATUS_FIELDS` (24 chiavi: project_name, short_description, status, phase, summary, current_focus, next_action, needs_stefano, board_gate_reason, board_gate_action_requested, board_verdict, board_narrative_mass, board_review_summary, progress_summary, documents_to_read_count, repo_url, blocker, heartbeat_cadence, heartbeat_last_run_at, heartbeat_last_outcome, last_material_activity_at, last_material_activity, notes, source). Qualsiasi altra chiave ⇒ `400 Unsupported projection fields`.
- `board` — solo: needs_stefano, reason, action_requested, verdict, narrative_mass, review_summary.
- `documents` — document_id, title, category, status, version, source_path, source_url, source_sha, content_markdown, requires_stefano, distribution_ready, sort_order. Obbligatori: document_id, title. `source_path` deve iniziare con `projects/<id>/` e finire in `.md`.
- `needs` — need_id, title, need_type, status, reason, action_requested, related_document_ids, target_tab, target_document_id, sort_order, source_path, source_sha. Obbligatori: need_id, title.
- `roadmap` — item_id, label, item_type, status, sequence, parent_id, related_document_id, source_path, notes.
- `activity` — event_id, occurred_at, event_type, title, description, source_path, source_sha, sort_order (ledger append-only).
- `execution_workflows` — validati da `execution.ts`: obbligatori `workflow_instance_id`, `workflow`, `status` (enum esatto ACTIVE | INTERRUPTED_RESUMABLE | WAITING_AUTHORITY | BLOCKED | COMPLETED | CANCELLED), `true_stop_condition`, e `resume_required` **booleano obbligatorio**. `source_path` deve stare in `projects/<id>/runtime/workflows/` e finire in `.json`.

Chiavi top-level: **non esiste whitelist top-level**. `schema_version`, `derived_execution_state`, `source_execution_fingerprint` sono semplicemente **ignorati** (non causano 400). Sono letti solo: `project_id`, `projection`, `board`, `source_state_sha`, `semantic_fingerprint`, le collezioni, `knowledge_health`, `knowledge_checkpoints`, i flag `*_partial`.

## 3. Causa certa del 400 attuale

Il renderer aggiunge `execution_status`, `resume_required`, `waiting_authority`, `next_transition` **dentro `.projection`**. Nessuna delle quattro è in `STATUS_FIELDS`: il controllo `unknownKeys` risponde `400 {"error":"Unsupported projection fields","fields":[...]}` prima di ogni scrittura. Questa è la causa determinante, indipendente da tutto il resto.

Mismatch ulteriori possibili una volta rimosse quelle chiavi (ordine in cui verrebbero incontrati):
1. `execution_workflows[i].resume_required` mancante o non booleano ⇒ 400.
2. `status` di workflow fuori enum (es. `RESUME_REQUIRED`, `RUNNING`) ⇒ 400.
3. `next_transition` come oggetto invece che stringa/null ⇒ 400.
4. `source_path` di workflow fuori da `projects/<id>/runtime/workflows/*.json` ⇒ 400.
5. Invariante BOARD_GATE: need OPEN con `action_requested = APPROVE_FREEZE` deve puntare a un documento `category = BOARD_CANDIDATE` ⇒ altrimenti 400 sull'intero payload.

## 4. Opzione consigliata (nessuna modifica applicata finora)

Allineare il **renderer lato GitHub**, non il backend: spostare i quattro segnali fuori da `projection`, mappandoli su `execution_workflows[]` (`status`, `resume_required`, `next_transition`) e lasciando `waiting_authority` derivabile da `status = WAITING_AUTHORITY`. Zero modifiche a DB, UI, command surface e whitelist.

Alternativa, se i quattro segnali devono davvero vivere sulla riga di stato: estendere `STATUS_FIELDS` + colonne in `wcm_project_status` (richiede migrazione DB e aggiornamento read-model).

## 5. Prossimo passo che posso eseguire su approvazione

- Modifica minima a `supabase/functions/wcm-projector/index.ts`: log strutturato del motivo del 400 nella risposta già presente — è già incluso nel body JSON, quindi in alternativa basta catturare il body del `curl` nel workflow GitHub.
- Nessun altro intervento finché non indichi quale delle due opzioni al punto 4 preferisci.
