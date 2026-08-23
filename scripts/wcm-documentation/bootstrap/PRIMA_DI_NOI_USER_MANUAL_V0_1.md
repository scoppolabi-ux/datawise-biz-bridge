# PRIMA DI NOI — User Manual

**Versione:** 0.1  
**Data:** 2026-08-23  
**Stato:** ACTIVE / LIVING PROJECTION / FIELD VALIDATION  
**Pubblico:** Stefano / Author & Creative Director e utenti autorizzati del progetto  
**Authority:** DEC-014 + PRIMA DI NOI project authority; human-facing projection, non source of truth

---

# 1. A cosa serve questo manuale

Questo manuale spiega come usare e governare **PRIMA DI NOI** dentro il WCM senza dover leggere repository, workflow JSON o documentazione tecnica.

Ti aiuta a capire:

- dove siamo nel progetto;
- cosa sta facendo WCM automaticamente;
- quando non devi fare nulla;
- quando serve una tua decisione;
- come leggere Candidate, Board Report, Execution Health e Knowledge Health;
- cosa succede dopo l'approvazione di un capitolo;
- come distinguere un problema editoriale da un problema di memoria/stato.

---

# 2. Dove entrare

Mission Control:

`/wcm/prima-di-noi`

Da qui puoi consultare, in funzione della sezione disponibile:

- Overview;
- Board / Needs;
- Documents;
- Activity;
- Roadmap;
- Knowledge;
- Execution Health / workflow;
- Steward Activity.

Per lo stato live usa Mission Control; per dettagli tecnici la source of truth è GitHub/runtime.

---

# 3. Regola fondamentale sullo stato

Il progetto può attraversare più heartbeat e sessioni.

Non assumere che "la chat è finita" significhi "il lavoro è finito".

Lo stato esecutivo segue:

```text
runtime workflow
→ Derived State
→ State human view
→ Mission Control
```

Se una vista è in ritardo, il lavoro non va ricreato da zero.

---

# 4. Come capire se devi fare qualcosa

## Caso A — compare un Need / `WAITING_AUTHORITY` / `BLOCKED_BOARD`

Serve una tua decisione.

Apri:

1. il Need;
2. la Candidate collegata;
3. il Board Report;
4. eventuali review/supporting material necessari;
5. il command disponibile.

## Caso B — workflow `ACTIVE`

WCM può continuare il lavoro già autorizzato. Normalmente non devi intervenire.

## Caso C — `INTERRUPTED_RESUMABLE`

Il lavoro è stato interrotto tecnicamente ma ha checkpoint e next transition. Il successivo heartbeat deve riprenderlo. Non ricominciare manualmente il capitolo.

## Caso D — `DEGRADED` Knowledge Health

Apri il dettaglio. Può essere non bloccante se le issue non toccano la transizione corrente.

---

# 5. Il ciclo di un capitolo

Quando un capitolo è eleggibile, il workflow normale è:

```text
Brief / Dependency Check
→ Research JIT
→ Draft
→ Review professionali
→ Narrative Mass Control
→ Editorial Synthesis / Revision
→ Candidate
→ Editorial Board Report
→ Need / Board Gate
→ tua decisione
→ Post-Freeze Reconciliation
→ Knowledge Trust Gate
→ Completion Gate
→ prossimo capitolo eleggibile
```

La bozza non è un capitolo approvato.

La Candidate non è frozen finché non la approvi.

---

# 6. Cosa succede durante il PRIMA DI NOI Heartbeat

L'heartbeat è il wake-up automatico del progetto.

Ad ogni ciclo, in forma semplificata:

1. legge i workflow persistenti;
2. verifica se esiste lavoro riprendibile;
3. ricostruisce authority e contesto minimo;
4. applica Knowledge Trust Gate;
5. continua le transizioni già autorizzate;
6. aggiorna checkpoint dopo delta materiali;
7. lascia alle routine deterministiche l'allineamento di state e Mission Control;
8. continua finché incontra una vera stop condition.

## Cosa non devi fare

Non devi dirgli ogni ora quale capitolo scrivere. Il task dinamico deve essere letto dalle fonti persistenti.

---

# 7. Perché non si ferma dopo il Draft

Per PRIMA DI NOI, Draft, Reviews, Narrative Mass Control, Editorial Synthesis e Candidate sono passaggi intermedi.

Se tutto è autorizzato e non c'è un vero blocker, WCM deve continuare nello stesso ciclo fino al Board Gate o a una reale interruzione.

Questo evita heartbeat che producono un singolo artefatto e poi si fermano senza motivo.

---

# 8. Candidate e Board Report

Quando arriva il tuo momento di decidere, i due oggetti principali sono:

## Candidate

Il testo proposto che può diventare frozen/approved.

## Editorial Board Report

Il documento che raccoglie review, rischi, sintesi editoriale, modifiche applicate e Narrative Mass Control.

Il Board Report supporta la decisione ma **non è il testo da congelare**.

`APPROVE_FREEZE` deve puntare alla Candidate.

---

# 9. Come leggere il Narrative Mass Control

Controlla almeno:

- parole della Candidate;
- parole cumulative;
- media pertinente;
- proiezione finale;
- target 85.000–100.000 parole;
- `ON TARGET / UNDER TARGET / OVER TARGET`;
- interpretazione editoriale;
- conferma che non sia stato usato padding.

Se il Board Report contiene soltanto una frase tipo "siamo sotto target" senza numeri, non è Board-ready.

---

# 10. Come approvare o chiedere modifiche

Mission Control espone i command autorizzati dal gate.

In linea generale:

- `APPROVE_FREEZE` — approvi la Candidate e autorizzi gli effetti di freeze previsti;
- `REQUEST_CHANGES` — chiedi una revisione senza congelare la Candidate.

Dopo il command puoi vedere una fase Pending/elaborazione.

Non ripetere il comando soltanto perché il workflow non ha ancora completato tutti gli effetti.

---

# 11. Cosa succede dopo APPROVE/FREEZE

L'approvazione non chiude istantaneamente l'intero workflow.

WCM deve eseguire la **Post-Freeze Reconciliation**:

```text
freeze capitolo
→ aggiorna/assorbe living ledgers
→ riallinea indici/current-facing view
→ runtime/state reconciliation
→ fresh Knowledge Trust Gate
→ Completion Gate
→ workflow completed
```

Solo dopo questa chiusura organizzativa il capitolo successivo può diventare normalmente eleggibile.

---

# 12. Perché esistono i living ledger

Durante un romanzo complesso non basta ricordare la trama generale.

PRIMA DI NOI mantiene registri per:

- relazioni;
- cosa sa/crede ogni personaggio e quando;
- entità, eventi e fazioni;
- semi, payoff e debiti narrativi.

Servono a evitare errori come:

- personaggio che ricorda un evento mai accaduto;
- reveal anticipato;
- nuova minaccia che duplica inutilmente un elemento esistente;
- payoff senza semina;
- contraddizione con un capitolo frozen.

---

# 13. Canon & Continuity

Prima di considerare sicuro un capitolo, il controllo continuity confronta la Candidate con:

- manuscript frozen precedente;
- living ledgers pertinenti;
- Story Architecture / sources autorevoli;
- character knowledge state;
- reveal/holdback.

Non basta che il capitolo sia "plausibile": deve essere coerente con ciò che il lettore e i personaggi hanno realmente vissuto.

---

# 14. Knowledge Health — cosa significa per il libro

## HEALTHY

La memoria del progetto supera i controlli strutturali applicabili ed è sufficientemente fresh.

## DEGRADED

Esistono debt/anomalie. Non significa automaticamente che il capitolo non possa avanzare.

## STALE

Il controllo non è più aggiornato rispetto all'ultimo delta importante.

## CRITICAL

C'è un problema incompatibile con un lavoro knowledge-sensitive sicuro.

Il Knowledge Health non giudica se il capitolo è bello. Giudica l'integrità della memoria che il team sta usando.

---

# 15. Knowledge Assurance — cosa fa automaticamente

Il WCM Knowledge Assurance può partire periodicamente e dopo modifiche sensibili.

Fa:

```text
pre-check
→ identifica anomalie
→ repair solo se meccanico + autorizzato
→ post-check
→ registra activity
→ alert/escalation se resta un problema
```

Non può decidere, per esempio:

- chi deve essere un personaggio;
- chi ha sparato;
- quando rivelare ORIGINE;
- come risolvere un conflitto di canone.

Queste sono decisioni cognitive/autoriali.

---

# 16. Deterministic State — cosa fa automaticamente

Quando cambia il runtime del workflow, una routine deterministica rigenera la vista esecutiva.

Serve a evitare che due sessioni interpretino diversamente "dove eravamo arrivati".

Normalmente non devi fare nulla.

Se c'è un conflitto strutturale, il comportamento corretto è fermarsi/fail-closed, non indovinare.

---

# 17. Mission Control Projector — cosa fa

Per PRIMA DI NOI la projection corrente è deterministica.

```text
runtime + Derived State
+ Projector Source
+ Knowledge Health
+ heartbeat telemetry
→ deterministic projector
→ Supabase
→ Mission Control
```

Il WCM Mission Control Projector cognitivo generale resta router/fallback, ma non deve diventare un secondo writer concorrente per PRIMA DI NOI.

---

# 18. Heartbeat telemetry

Mission Control può mostrare la recency del wake-up mechanism.

Il fatto che un heartbeat sia recente non significa necessariamente che sia avvenuto un cambiamento editoriale materiale.

Sono due cose diverse:

- heartbeat recency;
- material activity.

---

# 19. WCM Learning e PRIMA DI NOI

Il progetto può produrre evidence utile al metodo WCM.

Esempio concettuale:

```text
problema reale nel progetto
→ evidence collector
→ Learning Inbox
→ WCM Learning Review
→ learning linked/candidate/no-learning
→ eventuale WCM Change Gate
```

Non devi approvare ogni evidence. Intervieni soltanto se un learning richiede una modifica materiale del WCM e viene aperto il relativo Change Gate.

---

# 20. WCM Learning Review

È una review cognitiva generale del WCM, non un editor del romanzo.

Serve a capire se ciò che è successo in PRIMA DI NOI insegna qualcosa di riusabile anche altrove.

Non modifica la storia e non ha authority narrativa.

---

# 21. Documentation Continuity

Quando cambiano workflow, automazioni o modalità d'uso del progetto, anche i manuali devono essere aggiornati.

La documentazione di PRIMA DI NOI segue tre manuali:

- Technical Reference;
- Executive / Editorial Partner Guide;
- User Manual.

Word/PDF sono release derivate; Markdown GitHub resta master.

---

# 22. Dove trovare i manuali

Nel Documentation Center WCM:

```text
Documentazione
→ Progetti
→ PRIMA DI NOI
```

Puoi:

- consultare nel browser;
- usare l'indice cliccabile;
- vedere versione/provenance;
- scaricare Word/PDF quando QA è green.

---

# 23. Cosa fare quando…

## …vedo `BLOCKED_BOARD`

Leggi Candidate + Board Report e prendi la decisione richiesta.

## …vedo `WAITING_AUTHORITY`

Il workflow è correttamente fermo su una decisione umana. Non aspettarti che prosegua oltre senza command valido.

## …vedo `INTERRUPTED_RESUMABLE`

Normalmente attendi il successivo heartbeat: deve riprendere dal checkpoint. Non ricreare draft/review già completati.

## …vedo `DEGRADED`

Apri Knowledge; verifica se il problema è pertinente al capitolo/transizione corrente.

## …il Control Panel sembra non aggiornato

Non reinviare decisioni né ricominciare lavoro. La projection deve essere verificata rispetto al runtime/source.

## …il Board Report non ha i numeri di Narrative Mass Control

Il package non è Board-ready: va completato prima di chiederti il freeze.

## …un capitolo è Candidate

È proposto, non frozen.

## …un capitolo è Frozen/Approved

È parte della baseline narrativa corrente e il lavoro successivo deve rispettarlo.

---

# 24. Cosa non devi fare

Non è necessario:

- ricordare in quale chat è stata presa una decisione;
- dire al heartbeat quale task corrente eseguire;
- ripetere un command Pending;
- controllare manualmente ogni sincronizzazione di stato;
- interpretare un Knowledge Health come giudizio letterario;
- modificare la storia per far coincidere una dashboard stale;
- approvare un Board Report al posto della Candidate.

---

# 25. Ruolo dell'autore

Il sistema è progettato per ridurre la micro-supervisione, non l'authority.

La divisione ideale è:

```text
WCM
→ memoria
→ organizzazione
→ produzione
→ review
→ controllo
→ preparazione decisione

STEFANO
→ visione
→ canone
→ scelte materiali
→ freeze
→ pubblicazione
```

---

# 26. Live-state rule

Questo manuale non indica "il capitolo corrente" o "la prossima transizione" come fatto statico.

Per sapere **adesso** dove siamo, usa Mission Control / Execution Health. Il manuale spiega il sistema; il runtime rappresenta il lavoro live.

---

# 27. Automazioni principali — riepilogo

| Blocco | Parte automaticamente? | Quando serve te? |
|---|---:|---|
| PRIMA DI NOI Heartbeat | sì, hourly | solo su Need/gate/blocker |
| Chapter Workflow | prosegue se autorizzato | Board/Author Gate |
| Narrative Mass Control | nel chapter flow | solo se emerge scelta editoriale materiale |
| Knowledge Assurance | schedule + event | semantic escalation |
| Deterministic State | event-driven | normalmente mai |
| Deterministic Projector | event-driven | normalmente mai |
| Command Executor | poll/dispatch | tu emetti il command iniziale |
| WCM Learning Collector | automatico | no |
| WCM Learning Review | automatic review | Change Gate metodologico se necessario |
| Documentation Continuity | su delta rilevanti | solo se modifica significato/metodo richiede authority |

---

# Principio finale

Usa Mission Control per capire **quando devi decidere**. Lascia che WCM continui il lavoro già autorizzato, controlli la propria memoria e sincronizzi lo stato senza trasformare ogni passaggio in una tua micro-approvazione.
