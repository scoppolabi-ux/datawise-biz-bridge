# WCM Control Panel (Mission Control) — area privata

Obiettivo: aggiungere una pagina riservata a Stefano, fuori dalla navigazione pubblica, che mostri lo stato dei progetti WCM (primo progetto reale: PRIMA DI NOI). Il sito pubblico resta invariato.

## Contesto verificato

- App React + Vite + React Router, rotte dichiarate in `src/App.tsx` (`/`, `/cookie-policy`, `/privacy-policy`, `/ai-commerce-lab`).
- Nessun backend: il deploy è statico su GitHub Pages (`.github/workflows/deploy.yml`, dominio via `CNAME`). Quindi oggi **qualsiasi pagina pubblicata è tecnicamente scaricabile da chiunque**: nessuna protezione lato client è una vera protezione.
- Navigazione pubblica gestita in `src/components/Header.tsx` e `Footer.tsx`: la nuova rotta semplicemente non verrà aggiunta lì.

## Fase 1 — Prototipo (nessun backend, dati statici)

1. Nuova rotta non linkata: `/wcm` (o `/mission-control`), aggiunta in `src/App.tsx` sopra il catch-all.
2. Nuova pagina `src/pages/WcmControlPanel.tsx` con layout proprio (senza Header/Footer pubblici), responsive: tabella su desktop, card impilate su mobile.
3. Sorgente dati: file locale `src/data/wcm-projects.ts` (o `public/wcm-status.json` caricato via fetch, più facile da aggiornare senza rebuild) con questa forma per progetto:
   - `id`, `name` (es. "PRIMA DI NOI")
   - `status`: `working | waiting | blocked | paused` (badge colorati con token del design system)
   - `lastHeartbeat` (ISO date, mostrata come "x minuti fa")
   - `currentGoal`, `nextAction`, `blocker`
   - `needsStefano` (boolean, con evidenza visiva in cima alla lista)
4. Ordinamento: prima i progetti con `needsStefano`, poi `blocked`, poi heartbeat più vecchio.
5. `<meta name="robots" content="noindex,nofollow">` sulla pagina (via react-helmet-async, già presente) + `Disallow: /wcm` in `public/robots.txt`.

Protezione prototipo (deterrenza, NON sicurezza): rotta segreta non linkata + eventuale passphrase salvata in `sessionStorage` che nasconde il contenuto. Va detto chiaramente: chiunque conosca l'URL o legga il bundle JS vede i dati. Quindi in Fase 1 **non inserire dati sensibili di clienti**.

## Fase 2 — Dati reali da GitHub

Interfaccia dati isolata in un hook (`useWcmProjects`) così la sorgente si può cambiare senza toccare la UI:
- Opzione A (semplice): un file `wcm-status.json` in un repo GitHub pubblico, letto via `fetch` con React Query (già in progetto). Aggiornato da uno script/agente WCM che committa lo stato.
- Opzione B: GitHub API (issues/commits/Actions) per derivare heartbeat e stato — richiede token, quindi solo con backend.

## Fase 3 — Autenticazione reale

Con solo GitHub Pages non è possibile: serve un backend. Due strade:
- **Lovable Cloud** (consigliata): login email/password, tabella `wcm_projects` con RLS che consente lettura solo all'utente owner, aggiornamenti via edge function con token GitHub tenuto server-side. Il sito pubblico resta identico; cambia solo l'hosting/deploy della parte privata.
- Alternativa: hosting con auth a livello di edge (Cloudflare Access/Netlify Identity) davanti al path `/wcm`.

Se in futuro serve auth reale, la pagina e i componenti della Fase 1 restano riutilizzabili: si sostituisce solo la sorgente dati e si aggiunge un guard di rotta.

## File coinvolti

- Modificati: `src/App.tsx` (rotta), `public/robots.txt` (disallow).
- Nuovi: `src/pages/WcmControlPanel.tsx`, `src/components/wcm/ProjectStatusCard.tsx`, `src/hooks/useWcmProjects.ts`, `public/wcm-status.json`.
- Non toccati: Header, Footer, tutte le sezioni della home.

## Da confermare

1. Path preferito: `/wcm` o `/mission-control`?
2. Fase 1 con dati statici + passphrase, oppure andiamo subito su Lovable Cloud con login reale?
