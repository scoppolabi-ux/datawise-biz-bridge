# Diagnosi — /wcm/prima-di-noi mostra una fotografia vecchia

Solo analisi: nessun file modificato, nessun comando di scrittura eseguito.

## 1) Da dove arrivano i dati di Board e Documents

Tutta la pagina legge **esclusivamente dal read-model nel database Lovable Cloud**, mai da GitHub.

- `src/pages/WcmProjectDetail.tsx` monta i tab e chiama gli hook.
- `src/hooks/useWcmProjects.ts`:
  - `useWcmProject` → tabella `wcm_project_status` (campi Board: `needs_stefano`, `board_gate_reason`, `board_gate_action_requested`, `board_verdict`, …)
  - `useWcmProjectNeeds` → tabella `wcm_project_needs` (il Board Gate visibile)
  - `useWcmDocuments` → tabella `wcm_project_documents` (elenco Documents)
- `src/components/wcm/WcmBoardTab.tsx` rende i Need aperti (`isOpenNeed`) + il blocco Board dallo status.
- `src/components/wcm/WcmDocumentsTab.tsx` + `wcmFormat.ts` (`bucketOf`) raggruppano i documenti nei bucket, incluso "Manoscritto approvato".

L'unico scrittore di queste tabelle è la funzione server `supabase/functions/wcm-projector/index.ts`, che accetta solo chiamate firmate da GitHub Actions del repo `scoppolabi-ux/WCM-LAB` su `main` (OIDC, audience `wcm-projector`).

## 2) Perché resta fermo su CH2 / PRIMA + Chapter 1

Il read-model non è stato aggiornato: nessuna projection nuova è arrivata dopo l'ultimo invio.

Stato attuale letto dal database:

- `wcm_project_status.prima-di-noi`: `status = waiting_board`, `phase = BOARD_DECISION`, `needs_stefano = true`, `source_state_sha = fb78d4c6…`, ultimo aggiornamento **14/09/2026 21:50 UTC**.
- `wcm_project_needs`: esiste **un solo** need, `…g3-new-chapter-02-…-board-gate`, ancora `OPEN` (aggiornato 14/09 13:09). Nessun need per "Chapter 3 — ORIGINE".
- `wcm_project_documents`: i soli documenti `MANUSCRIPT_APPROVED` sono `prima` e `g3-new-chapter-01-03-17-v0-2`. Nessun documento di CH2 approvato/frozen.

Quindi non è un bug di classificazione o di UI: la fotografia nel database è letteralmente la situazione precedente. Il canon GitHub è avanzato (CH2 APPROVED/FROZEN, nuovo gate su Chapter 3) ma quella nuova projection non è mai stata consegnata al Mission Control — o il workflow che la invia non è partito, o è fallito, o non ha raggiunto la funzione.

## 3) Il pulsante "Aggiorna" chiama GitHub?

No. `refetchAll()` in `WcmProjectDetail.tsx` (righe ~111-123) si limita a rieseguire le query verso il database. Stesso discorso per il refresh automatico ogni 30 secondi (`REFETCH = 30_000`). Se la projection nel database è vecchia, "Aggiorna" ricarica all'infinito la stessa fotografia vecchia.

## 4) Modifica minima e corretta per riallineare, senza seconda source of truth

GitHub deve restare l'unica verità; il database resta solo la proiezione. La correzione giusta è **rendere possibile richiedere una nuova proiezione**, non leggere GitHub dal browser.

Intervento minimo consigliato, in ordine di priorità:

1. **Verifica operativa prima di ogni codice**: controllare nel repo WCM-LAB se il workflow che chiama `wcm-projector` è girato dopo il 14/09 21:50 e con quale esito. Se è semplicemente fallito, non serve alcuna modifica al sito: basta ri-eseguirlo e la UI si allinea da sola entro 30 secondi.
2. **Refresh reale su richiesta** (se serve un pulsante che "tiri" davvero): riusare il meccanismo di wake già esistente in `supabase/functions/_shared/wcmWorkerWake.ts` (`requestWorkerWake`, già usato da `wcm-command-submit`) dentro una nuova funzione server minimale, protetta come `wcm-command-submit` (sessione utente + ruolo `owner`/`admin`). Il pulsante "Aggiorna" chiamerebbe quella funzione e poi rifarebbe le query. La proiezione continuerebbe ad arrivare solo da GitHub Actions via `wcm-projector`: nessuna seconda fonte, nessun token nel browser.
3. **Rendere visibile la staleness**: mostrare nell'intestazione del progetto `updated_at` e `source_state_sha` della projection, così una fotografia vecchia è evidente invece di sembrare corrente. È un cambiamento puramente di presentazione.

Da evitare esplicitamente: leggere il repository GitHub dal frontend, o scrivere a mano nel read-model per "sistemare" CH2/CH3 — creerebbe esattamente la seconda source of truth da escludere.

## File coinvolti nella diagnosi

- `src/pages/WcmProjectDetail.tsx` (`refetchAll`)
- `src/hooks/useWcmProjects.ts` (`useWcmProject`, `useWcmProjectNeeds`, `useWcmDocuments`, `REFETCH`)
- `src/components/wcm/WcmBoardTab.tsx`, `src/components/wcm/WcmDocumentsTab.tsx`, `src/components/wcm/wcmFormat.ts`
- `supabase/functions/wcm-projector/index.ts` (unico scrittore)
- `supabase/functions/_shared/wcmWorkerWake.ts` (meccanismo di wake già esistente)
