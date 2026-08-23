# Diagnosi card PRIMA DI NOI (sola lettura)

Nessun file di progetto è stato modificato. Di seguito i tre punti, con dati reali letti dal read-model.

## Dato reale attuale (wcm_project_status · prima-di-noi)

```text
status                 = active_resume_required
heartbeat_last_run_at  = 2026-08-20 02:44:38Z      (ora: 2026-08-23 ~06:20Z)
heartbeat_last_outcome = chapter_7_v0_1_narrative_mass_control_completed_
                         editorial_synthesis_revision_resume_required
heartbeat_cadence      = hourly
updated_at             = 2026-08-23 04:11:26Z
```

Il record del progetto è stato aggiornato stanotte, ma `heartbeat_last_run_at` è fermo al 20 agosto: è il payload del Projector a non aggiornarlo, non la UI.

---

## 1) Heartbeat "3 giorni fa"

- **Dove**: `src/components/wcm/WcmProjectCard.tsx` (righe 117–126) usa `relativeTime(project.heartbeat_last_run_at)` da `src/components/wcm/wcmFormat.ts`. Stesso valore in `wcmHealthPlanes.ts` (Execution plane) e `WcmOverviewTab.tsx`.
- **Origine dati**: colonna `heartbeat_last_run_at`, scritta solo da `supabase/functions/wcm-projector` tramite `STATUS_FIELDS`.
- **Causa precisa**: dato a monte stale. `relativeTime` è corretta (`> 48h` → giorni) e mostra fedelmente 2026-08-20. Le ultime proiezioni hanno aggiornato status/summary/workflows ma hanno riproposto lo stesso `heartbeat_last_run_at`. La cadenza dichiarata è `hourly`, quindi la card è nel vero: non c'è heartbeat recente proiettato.
- **Fix minimo**: **a monte** — il generatore payload su GitHub deve valorizzare `heartbeat_last_run_at`/`heartbeat_last_outcome` con l'esecuzione corrente ad ogni dispatch. Nessuna modifica UI necessaria. Opzionale (UI, separato): quando `heartbeat_last_run_at` supera N volte la cadenza dichiarata, mostrare un marcatore "stale" invece di un tempo relativo nudo.
- **Rischi**: se si "aggiusta" lato UI (es. usare `updated_at` come proxy) si crea un verde falso e si viola l'invariante "nessuno stato dedotto dall'assenza di evidenza". Da evitare.

## 2) Titolo e project_id troncati ("PRI…", "prima...")

- **Dove**: `WcmProjectCard.tsx` righe 64–72: `h2` e `p` hanno entrambi `truncate`, dentro `div.min-w-0`, in un header `flex … justify-between gap-3`. Il blocco badge a destra (`flex-wrap` con status + phase) è `shrink-0`. Analogo `truncate` in `WcmProjectsPage.tsx` (lì solo su niente, ma il layout è identico) e nel titolo di `WcmMissionControl.tsx`.
- **Origine dati**: `project_name = "PRIMA DI NOI"`, `project_id = "prima-di-noi"` — stringhe corte, quindi non è un problema di dato.
- **Causa precisa**: è di layout. Il badge di destra è `shrink-0` e il valore `status` non mappato (`active_resume_required`, vedi punto 3) viene renderizzato per intero come testo lungo: occupa quasi tutta la riga e comprime la colonna sinistra `min-w-0`, dove `truncate` taglia già a poche lettere. Sulle griglie strette (`lg:grid-cols-2`, mobile) l'effetto è massimo.
- **Fix minimo**: **UI** — nel solo header della card, far andare a capo il blocco badge invece di comprimere il titolo: mettere la colonna sinistra su una riga propria (header in colonna su viewport stretti) oppure togliere `truncate` dal titolo e usare `break-words`/`line-clamp-2`, lasciando `truncate` solo sul `project_id`. Il fix del punto 3 riduce comunque la larghezza del badge e mitiga da solo il problema.
- **Rischi**: bassi e puramente visivi. Rimuovendo `truncate` su nomi progetto molto lunghi la card può crescere in altezza; `line-clamp-2` limita il rischio. Va tenuto l'allineamento con la card compatta di `/wcm/projects` per non creare due stili diversi.

## 3) Enum grezzi in UI

### 3a) `active_resume_required`

- **Dove**: `WcmProjectCard.tsx` riga 81 e `WcmProjectsPage.tsx` riga 64: `STATUS_LABELS[project.status] ?? project.status`. La mappa in `wcmFormat.ts` copre solo `working, waiting, waiting_board, blocked, paused`.
- **Origine dati**: `wcm_project_status.status`, valore libero scritto dal Projector.
- **Causa precisa**: valore non presente in `STATUS_LABELS`, quindi scatta il fallback che stampa l'enum grezzo; `statusClasses` cade sul `default` ambra, quindi anche il colore non riflette lo stato reale.
- **Fix minimo**: **UI** — aggiungere in `wcmFormat.ts` il mapping `active_resume_required → "Attivo · ripresa necessaria"` (+ classe di tono coerente con `RESUME_REQUIRED` di `wcmExecution.ts`), e normalizzare la chiave (`trim().toLowerCase()`) prima del lookup. Il fallback resta come rete di sicurezza per stati mai visti.
- **Rischi**: se in futuro il Projector introduce altri stati, ricompare l'enum grezzo. Contromisura coerente col metodo: mantenere il fallback visibile (non inventare un'etichetta) e trattarlo come segnale "da classificare", come già fatto per i canonical states dei documenti. Da NON fare: derivare l'etichetta con euristiche su sottostringhe.

### 3b) `CHAPTER_7_V0_1_..._EDITORIAL_SYNTHESIS_REVISION_RESUME`

- **Dove**: `WcmProjectCard.tsx` righe 120–125, riquadro Heartbeat: dopo il tempo relativo stampa `· {project.heartbeat_last_outcome}` senza mappatura. Stesso valore grezzo in `WcmOverviewTab.tsx` riga 146 (`font-mono`) e in `wcmHealthPlanes.ts` come "Ultimo esito registrato".
- **Origine dati**: `heartbeat_last_outcome`, oggi una frase-enum di 96 caratteri prodotta dal generatore payload upstream (non è un valore dell'insieme atteso `ok/failed/blocked_board/...`).
- **Causa precisa**: doppia. **A monte**: il campo "esito" viene usato come descrizione dello stato del workflow anziché come esito dell'heartbeat, fuori dal vocabolario riconosciuto (per questo `executionPlane` lo classifica `DEGRADED` con "Esito heartbeat non riconosciuto"). **In UI**: viene renderizzato tale e quale, senza normalizzazione né troncamento controllato.
- **Fix minimo**:
  - a monte (corretto): `heartbeat_last_outcome` deve tornare a un esito breve del vocabolario (`ok`, `failed`, `blocked_board`, `resume_required`); la narrazione del capitolo appartiene già a `summary`/`current_focus` e a `execution_workflows`.
  - in UI (cosmetico, indipendente): nel riquadro Heartbeat mostrare l'esito con `truncate` + `title` completo, e per gli esiti non riconosciuti presentarli come tali invece che come testo di stato.
- **Rischi**: mappare lato UI questa stringa specifica sarebbe un'euristica su sottostringhe — esattamente il pattern rimosso con i Canonical States. Va evitato. Toccare il vocabolario a monte cambia il piano Execution Health (da `DEGRADED` a valore riconosciuto): la variazione è attesa e va verificata contro `wcmHealthV061.test.ts`.

---

## Riepilogo attribuzione

| Sintomo | Dato a monte | UI |
| --- | --- | --- |
| Heartbeat "3 giorni fa" | Sì (causa unica) | No |
| Titolo/ID troncati | No | Sì (layout header) |
| `active_resume_required` | No | Sì (mapping mancante) |
| Esito heartbeat verboso | Sì (causa primaria) | Sì (rendering non troncato) |

Nessun edit eseguito. Dimmi se vuoi che prepari il piano di intervento per la sola parte UI (punti 2, 3a e il rendering di 3b), lasciando invariati Projector, DB e command surface.
