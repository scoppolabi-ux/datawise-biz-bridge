# WCM — User Manual

**Versione:** 0.4  
**Data:** 2026-08-23  
**Stato:** ACTIVE / LIVING PROJECTION / FIELD VALIDATION  
**Pubblico:** utilizzatori WCM / owner / Board  
**Authority:** DEC-010 + DEC-014; human-facing projection, non source of truth

---

# 1. A cosa serve questo manuale

Questo manuale spiega **come usare WCM concretamente**, come leggere Mission Control e cosa aspettarsi dai processi automatici.

Serve a capire:

- dove guardare;
- cosa significa ciò che si vede;
- quali processi partono automaticamente;
- quando WCM continua senza bisogno dell'utente;
- quando è richiesta authority umana;
- come leggere stato, documenti, Execution Health, Knowledge Health e Learning;
- come consultare documentazione generale e di progetto.

---

# 2. Mission Control

Percorso principale:

`/wcm`

Dopo l'accesso autenticato, la Home permette di vedere portfolio, Needs, documenti, learning e documentazione.

Regola pratica:

> Mission Control è il posto in cui guardare cosa sta succedendo; GitHub/runtime restano la source of truth tecnica sottostante.

---

# 3. Home — cosa guardare prima

## Needs Stefano

Se maggiore di zero, normalmente è il primo punto da aprire: significa che esiste una decisione/azione umana realmente richiesta.

## Pending

Una decisione è già stata inviata ma il workflow può stare ancora applicandone gli effetti. Non ripetere automaticamente lo stesso comando.

## Progetti

Apre il portfolio e permette di entrare nel progetto specifico.

## Documenti da leggere

Raccoglie artefatti collegati a Need/gate o altri passaggi human-facing.

## WCM Learning

Mostra cosa il metodo sta imparando dall'esperienza.

## Documentazione

Contiene manuali WCM generali e manuali dei progetti documentati.

---

# 4. Come leggere lo stato di un progetto

WCM distingue:

- **Runtime** — execution master dettagliato;
- **Derived State** — sintesi machine-generated del runtime;
- **STATE.md** — vista umana sintetica;
- **Projector Source** — fatti human/project-facing strutturati;
- **Mission Control** — read-model visuale.

Se una vista sembra in ritardo ma Execution Health mostra un workflow già avanzato, **non ricominciare il lavoro**.

```text
runtime wins for execution
→ resume from next_transition
→ reconcile views
```

---

# 5. Execution Health

Puoi incontrare:

- `ACTIVE` — workflow in corso;
- `INTERRUPTED_RESUMABLE` — interruzione tecnica, lavoro da riprendere;
- `WAITING_AUTHORITY` — fermo corretto in attesa di decisione umana;
- `BLOCKED` — blocker reale;
- `COMPLETED` — true stop e Completion Gate soddisfatti;
- `CANCELLED` — workflow annullato.

## Regola importante

La fine di una sessione o heartbeat non significa fine del workflow. Se il lavoro è riprendibile, il successivo wake-up deve continuare dal checkpoint.

---

# 6. Needs Stefano

Un Need rappresenta qualcosa che richiede attenzione umana.

Procedura:

1. apri il Need;
2. identifica progetto e azione richiesta;
3. leggi documenti collegati;
4. verifica che non sia già Pending;
5. usa il command/canale previsto;
6. dopo la decisione attendi che il workflow la consumi se non compare un nuovo Need.

Leggere ≠ approvare.

---

# 7. Board e authority

Un Board Gate è una vera stop condition.

Quando WCM arriva al gate:

```text
WCM prepara Candidate / materiale decisionale
→ Mission Control mostra Need
→ tu leggi
→ emetti command autorizzato
→ Command Executor valida/persiste receipt
→ workflow consuma authority
→ continua gli effetti previsti
```

`Authority Receipt ≠ execution completed`.

---

# 8. Documents

I documenti possono essere approved/frozen, candidate, unapproved, Board material o working.

Scaricare o condividere:

- non approva;
- non congela;
- non modifica il progetto;
- non conferisce authority.

---

# 9. Activity e Roadmap

- **Activity** = cosa è successo;
- **Roadmap** = percorso pianificato;
- **State/Execution Health** = dove siamo;
- **Need** = cosa richiede te.

Usali insieme, non come fonti intercambiabili.

---

# 10. Knowledge Health

## HEALTHY

Memoria strutturalmente coerente e check sufficientemente recente. Non significa "nessun problema possibile".

## DEGRADED

Esistono anomalie/debiti; possono essere non bloccanti se non toccano la transizione corrente.

## STALE / CHECK REQUIRED

Il check è precedente a un delta materiale o non è più rappresentativo.

## CRITICAL

Esiste un problema incompatibile con un lavoro knowledge-sensitive sicuro.

---

# 11. Knowledge Steward

Il Knowledge Steward controlla la memoria meccanica.

Può correggere automaticamente solo repair class autorizzate e deterministiche.

Non può decidere canone, strategia, significato o requisito.

Se il problema è semantico, fa escalation.

---

# 12. WCM Learning

`/wcm/learning`

Puoi vedere Method Health, learning Candidate/Promoted, evidence/review, relazioni e provenance.

## Candidate

Ipotesi metodologica sostenuta da evidence; non è ancora regola.

## Promoted

Learning trasferito nella baseline tramite il processo previsto.

La pagina è osservazione, non authority.

---

# 13. Documentazione — general + project

`/wcm/documentation`

La struttura è:

```text
Documentazione
├─ WCM
│  ├─ Technical Reference
│  ├─ Executive / Client Guide
│  └─ User Manual
└─ Progetti
   └─ <project>
      ├─ Technical Reference
      ├─ Executive / Commercial Guide
      └─ User Manual
```

Per ogni manuale puoi consultare nel reader con indice cliccabile e, quando la release è verificata, scaricare Word/PDF.

GitHub Markdown è master. Word/PDF sono derivati.

---

# 14. Quali processi automatici esistono

Questa sezione non serve per amministrarli tecnicamente, ma per sapere **cosa succede senza che tu debba premere un pulsante** e quando invece serve il tuo intervento.

## 14.1 Heartbeat di progetto

**Cosa fa:** sveglia Wise per quel progetto, legge runtime e contesto e continua il lavoro già autorizzato fino a una vera stop condition.

**Cosa NON fa:** non inventa nuova authority e non contiene il task dinamico hard-coded.

**Cosa devi fare tu:** nulla finché non compare un Need/gate o un blocker che richiede te.

## 14.2 Deterministic State

**Cosa fa:** mantiene coerente lo stato esecutivo derivato dai workflow persistenti.

**Cosa devi fare tu:** normalmente nulla. Se compare conflitto/error, il sistema deve fail-closed invece di indovinare.

## 14.3 Deterministic Projector

**Cosa fa:** aggiorna Mission Control a partire da fonti strutturate validate.

**Cosa devi fare tu:** non modificare manualmente il progetto per "far tornare la dashboard". La correzione deve partire dalla source responsabile.

## 14.4 WCM Mission Control Projector

**Cosa fa:** gestisce portfolio/fallback e i progetti non ancora migrati alla projection deterministica.

**Nota:** per un progetto già deterministic-owned non deve essere un secondo writer.

## 14.5 Command Executor

**Cosa fa:** preleva e valida decisioni Mission Control e le rende receipt durevoli.

**Cosa devi fare tu:** se la decisione è Pending, non reinviarla senza motivo.

## 14.6 Knowledge Assurance

**Cosa fa:** controlla periodicamente e dopo delta sensibili l'integrità della memoria; può riparare solo problemi meccanici autorizzati.

**Cosa devi fare tu:** intervieni soltanto se emerge un'escalation/Need o un issue semantico.

## 14.7 Learning Evidence Collector

**Cosa fa:** raccoglie evidence metodologica e aggiorna Method Health.

**Cosa NON fa:** non decide autonomamente nuove regole.

## 14.8 WCM Learning Review

**Cosa fa:** Wise rivede periodicamente l'evidence pending e valuta learning utili.

**Cosa devi fare tu:** soltanto se un learning implica una WCM CHANGE e viene presentato un Impact Preview.

## 14.9 Method Learning Projector

**Cosa fa:** aggiorna la pagina WCM Learning partendo dai file strutturati della Method Experience Memory.

## 14.10 Documentation Continuity

**Cosa fa:** quando WCM/progetti cambiano, verifica quali manuali/cataloghi devono essere aggiornati.

## 14.11 Documentation Release

**Cosa fa:** genera release consultabili/scaricabili con provenance e QA.

---

# 15. Cosa è automatico e cosa richiede l'utente

| Situazione | WCM | Tu |
|---|---|---|
| workflow autorizzato ha next step eleggibile | continua | nulla |
| sessione termina ma workflow non è finito | riprende al wake-up | nulla |
| stato meccanico cambia | riconcilia/proietta | nulla |
| anomaly meccanica allowlisted | può riparare e ricontrollare | nulla |
| decisione semantica/materiale | prepara Need/gate | decidi |
| WCM CHANGE | prepara Impact Preview | approva o rifiuta |
| Candidate learning | osserva/matura | nulla, salvo Change Gate |
| Board Gate | si ferma | approva/chiedi modifiche |

---

# 16. Come iniziare un nuovo progetto

```text
INTENZIONE
→ CLASSIFICAZIONE
→ ADMISSION PREVIEW
→ BOARD ADMISSION
→ OWNER SOURCE INTAKE
→ MEMORY + GOAL + STATE + ROADMAP
→ READINESS
→ ACTIVATION
→ WCM RUN
```

Se il progetto è sufficientemente maturo/complesso, WCM valuta anche il Project Documentation Set.

---

# 17. Come interagire con Wise

Puoi esprimere obiettivi, problemi o intenzioni, non soltanto micro-task.

Wise deve:

1. ricostruire contesto minimo;
2. verificare runtime/state/authority;
3. classificare RUN/CHANGE;
4. usare capability dirette prima di delegare;
5. continuare transizioni autorizzate fino alla vera stop;
6. fermarsi sui gate reali.

---

# 18. WCM RUN vs WCM CHANGE

## RUN

Lavoro già previsto/autorizzato: report, projection, release, workflow step, update coerente.

## CHANGE

Modifica metodo, governance, authority, architecture, goal/scope o altra baseline materiale. Richiede Impact Preview + tua authority.

---

# 19. Cosa fare quando…

## vedo `WAITING_AUTHORITY` / `BLOCKED_BOARD`

Apri Need e materiali collegati. È il tuo momento di decidere.

## vedo `INTERRUPTED_RESUMABLE`

Normalmente non devi riavviare a mano il lavoro: il successivo wake-up applica Resume Priority.

## vedo `DEGRADED`

Apri Knowledge e verifica se le issue toccano la transizione corrente.

## vedo `STALE`

Serve un check fresh prima di trattare Knowledge Health come corrente.

## vedo un documento `UNAPPROVED`

Puoi leggerlo/scaricarlo se distribution-ready; non è frozen.

## una decisione è Pending

Attendi il consumo del workflow, salvo errore/nuovo Need.

## il Control Panel sembra in ritardo

Non ripetere lavoro. Lo stato esecutivo va verificato a monte; la projection deve riallinearsi dalla source.

## un manuale non riflette una feature corrente

È Documentation Drift: va corretto tramite PROC-010, non reinterpretato dall'utente.

---

# 20. Glossario minimo

| Termine | Significato pratico |
|---|---|
| WCM | Wise Centric Model |
| Wise | cognitive core / orchestratore |
| Runtime | execution master strutturato dei workflow |
| Derived State | vista deterministica del runtime |
| Mission Control | superficie umana di osservazione/governance |
| Need | richiesta di attenzione/decisione |
| Board Gate | stop che richiede authority owner/Board |
| Knowledge Health | stato strutturale della memoria |
| Knowledge Steward | controllo/riparazione meccanica bounded |
| Learning | esperienza metodologica governata |
| Flow Block | componente identificabile di un flusso |
| Project Documentation Set | terna di manuali specifici del progetto |
| Source SHA | impronta del master da cui deriva una release |

---

# 21. Regola finale

Non devi supervisionare ogni passaggio dell'AI. Devi poter capire **quando il sistema può continuare da solo, quando sta semplicemente sincronizzando/controllando, e quando invece la decisione è realmente tua**.
