# Capitolo 27 — PROC-011 — Deterministic State Reconciliation

**Parte VI — Il Libro dei Processi WCM**  
**Stato:** FROZEN  
**Data:** 2026-08-30  
**Scope:** WCM generale, domain-agnostic

---

# 27.0 Uno stato può essere vero e tuttavia non essere visibile correttamente

Un workflow può avere già compiuto una transizione materiale mentre una vista umana continua a mostrare lo stato precedente. Oppure due rappresentazioni possono essere entrambe aggiornate, ma derivare da logiche diverse e quindi divergere.

`PROC-011 — Deterministic State Reconciliation` esiste per impedire che la rappresentazione dello stato esecutivo dipenda da interpretazioni opportunistiche.

La domanda fondamentale è:

> **dato lo stesso stato persistente strutturato, possiamo ricostruire sempre la stessa vista esecutiva e verificare che le proiezioni correnti siano coerenti?**

Il principio centrale è:

```text
STATO PERSISTENTE STRUTTURATO
→ DERIVAZIONE DETERMINISTICA
→ VISTE COERENTI
```

Non significa che tutto il WCM sia deterministico. Significa che, dove il significato è già espresso in campi e contratti strutturati, non serve chiedere a un modello linguistico di reinterpretarlo.

---

# 27.1 Che cos'è PROC-011

PROC-011 trasforma checkpoint runtime validi in viste di stato coerenti e riproducibili.

La sequenza canonica è:

```text
WORKFLOW / MATERIAL TRANSITION
      ↓
WRITE RUNTIME CHECKPOINT
      ↓
VALIDATE SHARED WORKFLOW CONTRACT
      ↓
DERIVE PROJECT EXECUTION STATE
      ↓
RENDER / VERIFY HUMAN EXECUTION VIEW
      ↓
SE ESISTE DELTA HUMAN-FACING:
UPDATE STRUCTURED PROJECTOR SOURCE
      ↓
BUILD DETERMINISTIC PROJECTION
      ↓
VALIDATE INVARIANTS
      ↓
PROJECT / PERSIST READ MODEL
```

L'ordine è importante: **prima il checkpoint autorevole per l'esecuzione, poi le viste derivate**.

Una vista non deve diventare una seconda authority.

---

# 27.2 Runtime, Derived State e vista umana non sono la stessa cosa

PROC-011 distingue tre livelli.

## Runtime workflow checkpoint

È l'execution master della transizione. Contiene fatti strutturati sul workflow: stato, step completati, next transition, resume, authority wait e altri campi previsti dal contratto.

## Derived State

È una vista machine-generated ricostruibile dal runtime. Non aggiunge significato e non modifica authority o canon.

## Human execution view

È la rappresentazione leggibile destinata a persone o strumenti di consultazione. Deve riflettere lo stato derivato, non reinterpretarlo.

La relazione è quindi:

```text
RUNTIME
→ DERIVED STATE
→ HUMAN VIEW
```

non:

```text
HUMAN VIEW
→ decide che cosa è successo
```

---

# 27.3 Perché la riconciliazione deve essere deterministica

Se uno stato strutturato dice che un workflow è `INTERRUPTED_RESUMABLE`, una vecchia frase `NOT STARTED` in una vista testuale non può prevalere soltanto perché è più facile da leggere.

Allo stesso modo, un enum sconosciuto o uno schema invalido non devono essere “aggiustati” per intuizione.

PROC-011 applica quindi una regola semplice:

```text
STESSO INPUT CANONICO
→ STESSO OUTPUT
→ STESSO FINGERPRINT
```

Unknown enum, schema incompatibile o conflitto non risolvibile deterministicamente producono **FAIL CLOSED**.

Il determinismo qui non sostituisce il reasoning generale. Delimita un'area in cui il reasoning non è necessario perché il significato operativo è già strutturato.

---

# 27.4 Resume Priority e true stop

La riconciliazione conserva la semantica operativa dei workflow.

Uno stato `ACTIVE` o `INTERRUPTED_RESUMABLE` con resume richiesto prevale su una vecchia rappresentazione che dichiara il lavoro non iniziato o fermo.

`WAITING_AUTHORITY`, invece, rappresenta una vera stop condition quando il relativo gate è valido.

```text
ACTIVE / INTERRUPTED_RESUMABLE
→ RESUME PRIORITY

WAITING_AUTHORITY
→ TRUE STOP
```

Se più workflow non terminali risultano incompatibili, PROC-011 non sceglie arbitrariamente quale sia quello corrente: produce `STATE_CONFLICT` e si ferma.

---

# 27.5 Il Workflow Contract viene prima della derivazione

La derivazione è affidabile soltanto se l'input è valido.

Per questo il checkpoint viene verificato attraverso il contratto condiviso prima di generare Derived State e proiezioni.

Questo principio diventa particolarmente importante quando un workflow dichiara `WAITING_AUTHORITY`: il relativo Board Gate deve rispettare il contratto canonico.

Il gate deve identificare in modo stabile almeno:

- che è richiesta authority;
- le opzioni di comando ammesse;
- il target logico della decisione;
- path, versione e blob del target;
- la categoria corretta del target;
- l'eventuale supporting material.

Alias o wording non sostituiscono i campi canonici.

Se il gate è malformato:

```text
BOARD_GATE_SCHEMA_INVALID
→ FAIL CLOSED
→ NO INFERENCE
```

---

# 27.6 Board Gate: una decisione, un target

Per un workflow realmente in attesa di authority, la projection deve mantenere una corrispondenza deterministica fra stato runtime e rappresentazione della necessità decisionale.

L'invariante concettuale è:

```text
WAITING_AUTHORITY
⇔
1 NEED APERTO DI TIPO BOARD_GATE
⇔
1 TARGET BOARD_CANDIDATE COERENTE
```

Un eventuale Board Report resta supporting material. Non diventa il target della decisione soltanto perché accompagna la Candidate.

Questo impedisce una classe importante di drift: workflow fermo correttamente, ma interfaccia che mostra il documento sbagliato, nessun bisogno decisionale o più target concorrenti.

---

# 27.7 Structured Projector Source: ciò che è visibile senza duplicare l'execution truth

Quando esiste un delta materiale human-facing, PROC-011 può aggiornare una sorgente strutturata destinata alla proiezione.

Questa sorgente può contenere, per esempio:

- stato/copy persistito;
- needs;
- documenti;
- roadmap;
- activity.

Ma non deve diventare una seconda execution truth.

Le meccaniche di esecuzione restano nel runtime e nelle viste derivate. La projection combina le fonti strutturate necessarie, valida riferimenti e boundary, ordina le collezioni e produce un payload riproducibile.

Un polling o un no-op non giustificano una falsa modifica materiale della projection.

---

# 27.8 Stable ID e path relativi

La riconciliazione deterministica richiede identità stabili.

ID logici come quelli di documenti, need, item, eventi o workflow non devono cambiare perché cambia il wording o il renderer.

Anche i path trasportati devono restare repository-relative.

Queste regole riducono la possibilità che una semplice variazione di presentazione venga scambiata per un nuovo oggetto operativo.

```text
IDENTITÀ LOGICA
≠
FORMULAZIONE TESTUALE
```

---

# 27.9 Approved output: la projection deve seguire l'authority già consumata

Quando un gate autorizzato produce un output approved/frozen, la riconciliazione non è completa se la vista esterna conserva soltanto metadata vecchi o incompleti.

La baseline corrente richiede che la projection possa ricostruire l'output approvato dal runtime e verificarne la coerenza con la source congelata.

Il contenuto approvato deve essere idratato dalla sorgente prevista e il blob effettivo deve coincidere con quello congelato. Sorgente mancante o mismatch SHA producono fail closed.

Il principio è:

```text
APPROVAL REGISTRATA
≠
PROJECTION AUTOMATICAMENTE COERENTE
```

La reconciliation deve portare l'authority già consumata fino alla vista, senza crearne una nuova.

---

# 27.10 La barriera runtime → read-model

Una delle evoluzioni più importanti della baseline è la trasformazione della reconciliation in una **barriera ordinata**.

```text
WORKFLOW DELTA
→ DETERMINISTIC STATE RECONCILIATION
→ PERSIST RECONCILED VIEWS
→ PROJECTOR DISPATCH
→ EXACT COHERENCE CHECK
→ READ-MODEL
```

Prima di costruire il payload esterno, lo stato atteso viene ricalcolato dai workflow correnti e confrontato con il Derived State persistito.

Condizione:

```text
DERIVED STATE
==
DERIVE(CURRENT RUNTIME WORKFLOWS)
```

Un mismatch produce una barriera stale e impedisce la projection.

In questo modo non è possibile combinare silenziosamente un runtime nuovo con una vista derivata vecchia.

---

# 27.11 Scrivere un workflow non significa averlo riconciliato

PROC-011 rende esplicita una distinzione spesso invisibile:

```text
WORKFLOW WRITE
≠
RECONCILED STATE
≠
PROJECTED STATE
```

Una transizione materiale è pienamente riconciliata soltanto quando, nel perimetro applicabile:

- il workflow contract è valido;
- il Derived State è corrente;
- la vista execution è corrente;
- gli output approvati sono coerenti quando previsti;
- il replay deterministico è verde;
- la projection usa lo stato riconciliato;
- la coherence barrier è verde;
- la persistenza del read-model termina senza ambiguità.

La latenza di un'interfaccia esterna può essere asincrona. La coerenza interna delle sorgenti GitHub, invece, non può essere lasciata intenzionalmente ambigua.

---

# 27.12 Atomic consistency prima di WAITING_AUTHORITY

La baseline corrente rafforza ulteriormente il confine prima della persistenza di un checkpoint `WAITING_AUTHORITY`.

```text
PROPOSED CHECKPOINT
→ WORKFLOW CONTRACT
→ PASS?
   ├─ NO  → NON PERSISTERE WAITING_AUTHORITY
   └─ YES → PERSIST
            → RECONCILE
            → ATOMIC BOARD SNAPSHOT
            → PROJECT
```

Questo evita che uno stato formalmente in attesa di decisione venga scritto senza avere abbastanza informazioni per rappresentare deterministicamente la decisione stessa.

Una failure resta fail closed, ma deve essere osservabile come problema tecnico. L'osservabilità non modifica authority, runtime o stato Board.

---

# 27.13 Telemetria di heartbeat e stato materiale sono pipeline diverse

Non ogni segnale temporale è una transizione di workflow.

PROC-011 distingue la riconciliazione dello stato materiale dalla semplice liveness telemetry.

```text
MATERIAL WORKFLOW DELTA
→ PROC-011

HEARTBEAT LIVENESS ONLY
→ TELEMETRY PIPELINE
```

Aggiornare un timestamp di heartbeat non deve produrre una falsa activity semantica né una finta transizione di stato.

Questa separazione protegge il modello operativo dal rumore osservativo.

---

# 27.14 Cosa è deterministico e cosa resta cognitivo

PROC-011 è un processo fortemente deterministico, ma non rende deterministico il significato del WCM.

Sono adatti a derivazione meccanica:

- validazione di schema;
- mapping di enum noti;
- scelta secondo precedenze già codificate;
- fingerprint;
- confronto fra stato atteso e persistito;
- materializzazione di viste da input strutturati validi.

Restano cognitivi o soggetti ad authority:

- decidere una nuova regola;
- interpretare un conflitto semantico non strutturato;
- modificare canon o governance;
- scegliere il contenuto di una decisione owner;
- inventare il significato di un campo mancante.

```text
DETERMINISTIC RECONCILIATION
≠
DETERMINISTIC GOVERNANCE
```

---

# 27.15 Failure mode

I failure mode principali includono:

- checkpoint runtime invalido;
- Board Gate malformato;
- più workflow non terminali incompatibili;
- Derived State stale rispetto al runtime;
- vista execution non coerente;
- stable ID o path invalidi;
- output approved non coerente con il blob congelato;
- projection che salta un gate in attesa di authority;
- writer concorrenti che producono snapshot parziali;
- failure di persistenza del read-model.

La risposta corretta non è “aggiustare” semanticamente l'input per far passare il sistema.

È:

```text
DETECT
→ FAIL CLOSED
→ PRESERVE AUTHORITY
→ REPAIR SOURCE / CHECKPOINT
→ RERUN RECONCILIATION
```

---

# 27.16 Relazioni con altri processi e protocolli

PROC-011 lavora in particolare con:

- `PROC-001 — Service Job Lifecycle`, quando lo stato del job deve essere rappresentato correttamente;
- `PROC-005 — Agent-Ready Context Bootstrap`, che usa runtime e Derived State per Resume Priority;
- `PROC-006 — Memory Consolidation & Consistency Loop`, per la coerenza dopo delta materiali;
- `PROC-008 — Knowledge Integrity Assurance Loop`, distinto dalla reconciliation meccanica;
- `PROC-010 — Documentation Continuity Loop`, quando il delta ha impatto documentale;
- `PROT-009 — Contiguous Workflow Execution`, per continuità fino alla true stop;
- `PROT-016 — Deterministic State & Projection Contract`;
- `PROT-017 — Persistent Mutation Safety` prima delle mutazioni persistenti applicabili.

La distinzione più importante è con PROC-008:

```text
STATO RICOSTRUIBILE DAL RUNTIME
→ PROC-011

CONFLITTO DI CONOSCENZA / SIGNIFICATO
→ PROC-008 / COGNITIVE ROUTE
```

---

# 27.17 Evidence e maturity

Il processo canonico è `ACTIVE` e riporta maturità **M3 FIELD VALIDATED** nel perimetro della baseline osservata.

Questa qualificazione va letta con precisione.

Non significa che ogni possibile applicazione, schema, progetto o ambiente sia stato validato. Significa che il processo possiede implementazione ed evidence operative nel perimetro dichiarato dalla baseline corrente, incluse correzioni emerse da defect reali di contract, projection e reconciliation.

Il libro non estende questa evidence oltre il suo scope.

---

# 27.18 In sintesi

`PROC-011 — Deterministic State Reconciliation` impedisce che uno stato strutturato venga raccontato in modi incompatibili da viste diverse.

La sua disciplina può essere riassunta così:

```text
RUNTIME È EXECUTION MASTER
        ↓
VALIDA IL CONTRATTO
        ↓
DERIVA, NON INTERPRETARE
        ↓
VERIFICA COERENZA ESATTA
        ↓
PROIETTA SOLO STATO RICONCILIATO
        ↓
FAIL CLOSED SULL'AMBIGUITÀ
```

Il valore del processo non è eliminare il ragionamento umano o cognitivo. È evitare di usarlo dove il sistema possiede già abbastanza struttura per ottenere una risposta riproducibile.

---

# Source Map del capitolo

Fonte canonica primaria:

- `wcm/process-book/processes/PROC-011_DETERMINISTIC_STATE_RECONCILIATION.md`

Fonti di bootstrap e continuità editoriale:

- `WCM_AGENT_START.md`;
- `wcm/documentation/process-memory-book/BOOK_INDEX.md`;
- `wcm/documentation/process-memory-book/BOOK_STATUS.md`;
- capitoli FROZEN precedenti della Parte VI, usati esclusivamente come riferimento di struttura e stile.

**Nessuna nuova regola WCM è introdotta da questo capitolo.**