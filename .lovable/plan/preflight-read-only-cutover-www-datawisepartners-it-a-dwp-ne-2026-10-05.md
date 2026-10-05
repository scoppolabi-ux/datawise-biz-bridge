# Preflight read-only — cutover www.datawisepartners.it a DWP Next

Nessuna modifica, nessun commit, nessuna pubblicazione. Questo è il risultato della preflight e il piano proposto, da approvare prima di qualunque intervento.

## 1) Accesso al codice di DWP Next

**Sì, disponibile.** Da questo progetto posso leggere DWP Next (`9c66e8ce-…`) in sola lettura e copiarne i file: la migrazione può essere una copia esatta del codice, senza ricostruzione visiva.

**Blocco sulla versione:** lo snapshot leggibile corrisponde al commit `c4d920ed5ee630868a051a6577ee848c899c52a3`, non al commit approvato `1a4675564d0083d625b1089cb0a89828ee51de56`. Lo snapshot non contiene la storia git, quindi non posso dimostrare che i due commit abbiano lo stesso contenuto. Serve una conferma tua: approvare `c4d920ed` come versione equivalente, oppure riportare DWP Next a `1a46755` prima del cutover.

## 2) Rischi bloccanti emersi

1. **Lo stesso repo e lo stesso dominio servono anche il WCM Mission Control.** `scoppolabi-ux/datawise-biz-bridge` contiene, oltre al sito pubblico, `/wcm/*` (Mission Control, Documentation Center, Learning, Issues), le release statiche in `public/wcm/documentation/…`, gli script `scripts/wcm-*` e le funzioni backend `supabase/functions/wcm-*`. Sostituire tutta l'applicazione con DWP Next **rimuoverebbe Mission Control da www.datawisepartners.it**. Le funzioni backend e il database non verrebbero toccati (vivono fuori da GitHub Pages), ma resterebbero senza interfaccia. Serve una decisione esplicita (vedi Decisioni).
2. **DWP Next non è un sito statico.** È un'app TanStack Start con rendering lato server (`src/server.ts`, `src/start.ts`, `nitro` con target Cloudflare, configurazione `@lovable.dev/vite-tanstack-config`). L'attuale `vite build` di DWP Next produce un bundle server, non una cartella `dist/` statica. Il workflow Pages attuale (`npm ci` → `npm run build` → upload `dist`) fallirebbe o pubblicherebbe una cartella sbagliata.
3. **Un'immagine è un riferimento interno Lovable.** `src/assets/dwp-contesto-aziendale-llm.png.asset.json` funziona solo sull'origine Lovable di DWP Next. Va scaricata e salvata come file reale nel repo, altrimenti su GitHub Pages l'immagine risulterebbe rotta.
4. **Lockfile.** DWP Next ha `bun.lock` ma nessun `package-lock.json`; il workflow usa `npm ci` con cache npm, che fallisce senza `package-lock.json`.

Elementi positivi verificati: DWP Next non usa backend, non ha funzioni server applicative né chiamate di rete; il contatto è `mailto:info@datawisepartners.it`. Il contenuto è quindi pre-renderizzabile come statico.

## 3) Da preservare dal repo di produzione

- `CNAME` e `public/CNAME` → `www.datawisepartners.it` (il file in `public/` è quello che finisce nell'output pubblicato)
- `.github/workflows/deploy.yml` → meccanismo Pages (adattato solo nella cartella di output, se necessario)
- `404.html` / `public/404.html` e lo script di redirect SPA in `index.html` → necessari solo se resta un instradamento lato client (Mission Control); con pagine pre-renderizzate per ogni route servono solo come pagina 404
- `public/og-image.png`, `public/favicon.ico` se ancora usati per le anteprime social
- Mail/DNS: non stanno nel repo, quindi nessun file li tocca. Basta non modificare il dominio custom nelle impostazioni Pages
- Se si sceglie di mantenere Mission Control: tutto `src/pages/Wcm*`, `src/components/wcm`, `src/hooks/useWcm*`, `public/wcm/**`, `scripts/wcm-*`, `supabase/**`, `.github/workflows/wcm-documentation-qa.yml`, `src/integrations/supabase/*`

## 4) Modifiche per rendere DWP Next compatibile con GitHub Pages

- Configurare TanStack Start in modalità **prerender/SPA statica** (prerender di `/`, `/about`, `/services`, `/come-lavoriamo`, `/contact`, `/privacy`, `/cookies`), con output statico, senza `nitro`/Cloudflare né dipendenza da `src/server.ts` a runtime
- Allineare la cartella di output: o la build produce `dist/`, o si aggiorna il passo `path:` in `deploy.yml` (unica modifica al workflow)
- Generare un `package-lock.json` coerente, oppure passare il workflow a bun (preferibile non toccarlo: quindi `package-lock.json`)
- Copiare `public/CNAME` e una `404.html` nel `public/` di DWP Next
- Sostituire il puntatore `.asset.json` con il PNG reale in `src/assets/`
- Rimuovere `src/lib/lovable-error-reporting.ts` dai percorsi runtime o lasciarlo innocuo (non deve chiamare endpoint Lovable dal dominio pubblico)
- Verifica locale: build pulita, l'output contiene `index.html` per ogni route + `CNAME`, navigazione e refresh diretto su ogni route

## 5) Cutover con un singolo commit su main?

**Sì, tecnicamente**, una volta prese le decisioni sotto: un commit unico su `main` che sostituisce l'app e lascia invariati CNAME e workflow fa partire `Deploy to GitHub Pages` come oggi. Il job pubblica solo se la build riesce; se la build fallisce, il sito precedente resta online, perché Pages continua a servire l'ultimo deploy riuscito.

Limite dell'ambiente: in questo progetto Lovable i commit sono creati automaticamente dalla piattaforma (non posso fare `git commit`/`push` manuali). Il "singolo commit" corrisponde quindi a un'unica sessione di modifiche sincronizzata su `main`; potrebbe arrivare come più commit ravvicinati. Se serve un commit atomico garantito, va fatto da un clone locale o tramite una PR su GitHub.

## 6) Rollback

- **Build fallita:** nessun impatto, Pages continua a servire il sito precedente. Si corregge e si ripubblica.
- **Build riuscita ma sito errato:** `git revert` del commit (o dei commit) di cutover su `main` → il workflow ripubblica il sito vecchio. In alternativa: ripristino dalla cronologia versioni di Lovable, che sincronizza su `main` e rilancia lo stesso workflow.
- **Emergenza immediata:** rilanciare `Deploy to GitHub Pages` (`workflow_dispatch`) su un commit precedente noto (tag consigliato, es. `pre-dwp-next-cutover`, da creare prima del cutover).

## Decisioni necessarie prima dell'esecuzione

1. Commit di riferimento: `c4d920ed` va bene o va riportato `1a46755`?
2. Mission Control `/wcm`: (a) mantenerlo dentro il nuovo sito, (b) spostarlo su un altro dominio/progetto prima del cutover, (c) dismetterlo sul dominio pubblico.
3. Lockfile/workflow: generare `package-lock.json` (workflow invariato) — raccomandato.
