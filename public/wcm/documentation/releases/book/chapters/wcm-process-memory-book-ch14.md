# Capitolo 14 — Come WCM individua i protocolli da applicare

**Stato:** FROZEN  
**Parte:** V — Da una richiesta alle regole applicabili  
**Scope:** WCM generale / domain-agnostic  
**Review:** Technical Review PASS / Human Comprehension Review PASS

---

## 14.0 Il problema non è conoscere i protocolli. È sapere quando servono

Nel Capitolo 13 abbiamo seguito una richiesta dall'intenzione fino all'esecuzione.

A un certo punto della route compare una domanda inevitabile:

> **Quali protocolli devo applicare adesso?**

Il WCM corrente possiede un Protocol Book.

Ma il fatto che un protocollo esista non significa che debba essere caricato in ogni attività.

Se ogni agente, a ogni richiesta, leggesse tutti i protocolli disponibili, avremmo ricreato lo stesso problema che INDEX-FIRST risolve per la conoscenza generale:

- troppo contesto;
- molte regole irrilevanti;
- maggiore costo cognitivo;
- più possibilità di confondere scope differenti;
- difficoltà nel distinguere una regola realmente applicabile da una semplicemente esistente.

La risposta WCM non è quindi:

> «Conosci tutti i protocolli.»

È:

> **«Individua i protocolli applicabili alla situazione corrente attraverso il routing minimo e autorevole.»**

Questo capitolo spiega come.

---

## 14.1 Protocol routing

Un protocollo WCM è una regola operativa con un proprio scope.

Può definire una guard, un obbligo, una verifica, una stop condition, una policy di delega, una regola di retrieval, una condizione di authority, una disciplina di mutazione persistente o una modalità di gestione di failure e dipendenze.

Il **Protocol Routing** è il meccanismo con cui WCM collega una situazione operativa al sottoinsieme di protocolli che devono governarla.

```text
SITUAZIONE
   ↓
TIPO DI OPERAZIONE / EVENTO
   ↓
HOOK APPLICABILE
   ↓
PROCESSI + PROTOCOLLI PERTINENTI
   ↓
AZIONE / GUARD / STOP
```

Nel WCM esistono due livelli complementari:

```text
ROUTING COGNITIVO
= comprendere che tipo di situazione stiamo affrontando

ROUTING DETERMINISTICO
= quando l'evento è già strutturato,
  caricare esattamente la route dichiarata
```

Il primo dà significato. Il secondo evita di reinterpretare ogni volta ciò che il sistema ha già formalizzato.

---

## 14.2 Regole trasversali

Alcuni protocolli sono legati a una fase molto specifica. Altri attraversano molti processi differenti.

Per esempio, INDEX-FIRST può diventare pertinente in molte attività perché riguarda come recuperare il contesto. Persistent Mutation Safety può diventare pertinente quando si sta per modificare stato persistente rilevante. Contiguous Workflow Execution può diventare pertinente quando esiste un workflow già avviato.

Questi protocolli sono trasversali perché non appartengono a un solo processo. Ma trasversale non significa «sempre caricato».

> **Può applicarsi in molti contesti diversi quando il suo trigger è presente.**

```text
TRASVERSALE
≠
UNIVERSALE IN OGNI RUN
```

---

## 14.3 Protocolli condizionali

Molti protocolli diventano necessari soltanto quando si verifica una determinata condizione.

```text
OPERAZIONE NORMALE
→ nessun tool failure
→ nessuna route di capability failure necessaria
```

Poi avviene qualcosa:

```text
TOOL FAILURE
→ capability non ancora verificata
→ protocollo di capability evidence applicabile
```

La condizione modifica il routing perché il protocollo è diventato pertinente a un evento che prima non esisteva.

Il contesto procedurale può quindi crescere progressivamente:

```text
START
→ protocol set minimo

EVENTO NUOVO
→ route aggiuntiva

NUOVO EVENTO
→ eventuale nuova route

STOP
→ nessun caricamento ulteriore
```

È il Progressive Retrieval applicato alla procedura.

---

## 14.4 Trigger espliciti

Il trigger può essere dichiarato in modo esplicito dalla richiesta o dal workflow. Ma nominarlo non autorizza a saltare Source Precedence e status check.

Se la richiesta nomina un protocollo superseded, prevale la baseline corrente. Se nomina un comportamento incompatibile con governance, il nome del protocollo non crea authority.

Il trigger aiuta il routing. Non sostituisce il controllo della fonte.

---

## 14.5 Trigger derivati dal tipo di operazione

Molto spesso l'utente non nomina alcun protocollo. Dice semplicemente «modifica questo file», «continua il workflow» oppure «non riesco a recuperare il contenuto».

WCM deve derivare il routing dal **tipo di operazione**.

```text
OPERAZIONE
persistent mutation

DERIVAZIONE
questa azione modifica stato persistente

ROUTE
carica le guard di persistent mutation applicabili
```

Oppure:

```text
OPERAZIONE
resume di workflow incompleto

DERIVAZIONE
esiste next_transition persistita

ROUTE
bootstrap + retrieval + contiguous execution
```

Il passaggio cognitivo è riconoscere la classe dell'operazione. Una volta riconosciuta, la parte successiva può essere più meccanica.

---

## 14.6 Process → Protocol relationships

Processi e protocolli non sono due cataloghi separati. Un processo può dipendere da più protocolli e un protocollo può governare più processi.

```text
PROCESSO A
├─ PROTOCOLLO 1
├─ PROTOCOLLO 2
└─ PROTOCOLLO 3

PROCESSO B
├─ PROTOCOLLO 2
└─ PROTOCOLLO 4
```

Il Process Register WCM espone relazioni operative. La navigazione Agent-Ready collega `CONCEPT-007 + PROC-005 + PROT-005`; la Session-Independent Workflow Execution collega `DEC-012 + PROT-009 + PROC-005/006/007`; il capability routing usa `PROT-011 + PROT-003`.

Quando WCM identifica il processo può scoprire i protocolli collegati. Quando identifica un evento può scoprire protocolli che attraversano il processo corrente. Il routing finale nasce dall'intersezione.

---

## 14.7 Knowledge nodes → Procedure relationships

Anche un nodo di conoscenza può indicare che una procedura è necessaria.

Se un documento dichiara `STATUS = SUPERSEDED`, il metadata influenza il routing: non usare quella fonte come baseline corrente e cerca il successore autorevole.

Relazioni come `DEPENDS_ON`, `AFFECTS`, `CONSTRAINS` ed `EVIDENCE_FOR` possono indicare quale protocollo verifica l'integrità, quale processo richiamare, quale nodo è affected da un delta o quale evidence serve prima di una promotion.

```text
KNOWLEDGE GRAPH
→ dice cosa è collegato a cosa

PROTOCOL ROUTING
→ dice quali regole diventano operative
```

Una relazione nella memoria non è automaticamente un comando. Può però essere una route verso la procedura applicabile.

---

## 14.8 Guard deterministici

La baseline corrente mantiene una sorgente machine-readable:

`wcm/runtime/protocol-routing/ROUTING_SOURCE.json`

Essa contiene route nella forma:

```text
EVENT + HOOK
→ LOAD
→ ACTION
→ SERVICE POLICY
```

Esempio corrente:

```text
EVENT = TOOL_OUTPUT_LIMIT
HOOK  = ON_TOOL_FAILURE

LOAD
PROT-011
PROT-003
PROT-009

ACTION
RESOLVE_CAPABILITY

SERVICE POLICY
SERVICE_OPTIONAL
```

Un altro esempio:

```text
EVENT = BOARD_GATE_READY
HOOK  = BEFORE_BOARD_GATE

LOAD
PROT-010
PROT-009

ACTION
WAIT_AUTHORITY
```

Oppure:

```text
EVENT = MATERIAL_DELTA
HOOK  = AFTER_MATERIAL_DELTA

LOAD
PROC-006
PROC-011

ACTION
RECONCILE
```

Quando evento e hook coincidono con una route dichiarata, il set da caricare non viene ricostruito per similarità semantica. Viene letto.

---

## 14.9 Perché servono sia Source sia Registry

Il runtime mantiene anche `PROTOCOL_ROUTING_REGISTRY.json`.

`ROUTING_SOURCE` è la dichiarazione corrente delle route: event, hook, target da caricare, action, service policy e note.

`PROTOCOL_ROUTING_REGISTRY` è una rappresentazione materializzata che aggiunge path e status dei target instradabili.

Il routing corretto è:

```text
EVENT + HOOK
→ ROUTING SOURCE
→ target IDs
→ REGISTRY / path / status
→ documento canonico
→ regola applicabile
```

Questa catena riduce tre failure mode: protocollo inventato, path inventato, protocollo stale o non corrente.

---

## 14.10 Exact event + exact hook

Per le route strutturate la baseline corrente vieta il fuzzy matching.

`CAPABILITY_UNVERIFIED` e `TOOL_OUTPUT_LIMIT` riguardano entrambi difficoltà tecniche, ma non sono identici. Il primo carica `PROT-011 + PROT-003`; il secondo anche `PROT-009`, perché può essere necessario preservare la continuità del workflow durante una failure.

```text
SIMILE
≠
UGUALE

EVENT NAME MATCH
+
HOOK MATCH
=
ROUTE APPLICABILE
```

L'exact matching non significa che ogni evento del mondo debba essere già formalizzato. Significa che quando un evento formalizzato esiste non deve essere sostituito da un'approssimazione cognitiva.

---

## 14.11 Gli hook: quando applicare la regola

L'evento dice che cosa è successo. L'hook dice in quale punto del ciclo operativo la route deve essere valutata.

La baseline corrente usa hook come `ON_WAKE`, `ON_TOOL_FAILURE`, `BEFORE_STOP`, `AFTER_MATERIAL_DELTA`, `BEFORE_BOARD_GATE`.

Per `MEMORY_OR_INDEX_DRIFT`, per esempio, l'hook `BEFORE_STOP` impone di caricare `PROC-008 + PROT-013 + PROT-005` e tentare la reconciliation prima di trasformare il drift in una conclusione definitiva.

```text
EVENTO CORRETTO
+
MOMENTO SBAGLIATO
≠
ROUTE CORRETTA
```

---

## 14.12 Un evento può richiedere processi e protocolli

Il nome Protocol Routing potrebbe far pensare che la route carichi soltanto protocolli. Non è così.

`MATERIAL_DELTA` carica `PROC-006 + PROC-011`; `MEMORY_OR_INDEX_DRIFT` carica `PROC-008 + PROT-013 + PROT-005`.

Per affrontare un evento possono quindi servire un processo che descrive il flusso, un protocollo che impone la guard, una decisione che stabilisce authority o precedence e uno stato runtime che dice dove siamo.

Il routing trova il bundle minimo applicabile.

---

## 14.13 Service policy

Le route strutturate possono dichiarare `service_policy` come `NONE` o `SERVICE_OPTIONAL`.

`NONE` indica che la route non prevede service per la normale risoluzione. `SERVICE_OPTIONAL` permette di arrivare a una delega soltanto dopo i controlli precedenti.

```text
TOOL_OUTPUT_LIMIT
→ verifica capability diretta
→ Direct Before Delegate
→ preserva continuità workflow
→ service solo se realmente necessario
```

La policy di service fa parte del routing; non è una delega automatica.

---

## 14.14 Interpretazione cognitiva

Il routing deterministico funziona soltanto dopo che abbiamo un evento strutturato. Ma riconoscere l'evento può richiedere reasoning.

Una frase come «la pagina non sembra aggiornata» può significare projection stale, cache, runtime non riconciliato, release non pubblicata, errore dell'utente o problema di rete.

```text
FRASE AMBIGUA
↓
REASONING
↓
EVIDENCE
↓
EVENTO STRUTTURATO, se giustificato
↓
ROUTE DETERMINISTICA
```

Assegnare troppo presto un event ID solo per somiglianza di parole renderebbe il sistema formalmente deterministico ma semanticamente sbagliato.

---

## 14.15 Reasoning vs mechanical enforcement

Il reasoning serve quando dobbiamo interpretare intenzione, classificare un caso nuovo, comprendere una contraddizione semantica, capire se un problema corrisponde davvero a un evento canonico, valutare la sufficienza del contesto o distinguere RUN da CHANGE in base al significato materiale.

Il mechanical enforcement serve quando workflow status, event ID, hook, path/status, schema o mapping sono già strutturati.

```text
USA REASONING
PER SCOPRIRE IL SIGNIFICATO

USA DETERMINISMO
PER NON REINTERPRETARE
IL SIGNIFICATO GIÀ STRUTTURATO
```

Il WCM non elimina il reasoning. Lo circoscrive.

---

## 14.16 Cosa succede se la route non esiste?

Non ogni situazione possibile è già presente in `ROUTING_SOURCE.json`.

Se un evento non ha una route strutturata, WCM non deve inventare un ID. Torna al routing generale:

```text
SITUAZIONE NON COPERTA
↓
INDEX-FIRST
↓
Process Register / Protocol Book / KB
↓
Source Precedence
↓
processi e protocolli realmente applicabili
```

Se emerge un gap metodologico, può diventare evidence. Non autorizza una modifica automatica del metodo.

```text
ROUTE MANCANTE
≠
PERMESSO DI CREARE UNA NUOVA ROUTE
```

Aggiungere una nuova route al routing canonico sarebbe un WCM CHANGE e richiederebbe il relativo gate.

---

## 14.17 Drift tra Source e Registry

Se Source e Registry divergono, WCM non sceglie a intuito.

```text
ROUTING_SOURCE
+
verifica target ACTIVE
→ riferimento operativo

REGISTRY STALE
→ MEMORY_OR_INDEX_DRIFT
→ reconciliation
```

Una cache o una vista materializzata non acquisisce authority superiore alla propria source.

---

## 14.18 Esempio 1 — Resume al wake

`WAKE_RESUME_REQUIRED + ON_WAKE` carica `PROC-005 + PROT-005 + PROT-009` e action `CONTINUE`: bootstrap, retrieval minimo, Resume Priority e continuazione dal checkpoint senza duplicare step completati.

---

## 14.19 Esempio 2 — Dipendenza interna pending

`INTERNAL_DEPENDENCY_PENDING + ON_WAKE` carica `PROT-018 + PROT-009` e action `WAIT_INTERNAL_RESOLUTION`.

```text
PENDING
≠
BLOCKER DI PROGETTO
≠
GATE UMANO
≠
AUTORIZZAZIONE A RIFARE IL LAVORO
```

---

## 14.20 Esempio 3 — Stato operativo sconosciuto

`UNKNOWN_OPERATIONAL_STATE + BEFORE_STOP` carica `PROT-016 + PROC-011` con action `FAIL_CLOSED`.

Il sistema non deduce lo stato con fuzzy parsing quando il contratto strutturato è incoerente: prima tenta la reconciliation deterministica.

---

## 14.21 Esempio 4 — Drift della conoscenza

`MEMORY_OR_INDEX_DRIFT + BEFORE_STOP` carica `PROC-008 + PROT-013 + PROT-005` con action `RECONCILE`.

Il bundle combina assurance della conoscenza, health delle relazioni e retrieval autorevole.

---

## 14.22 Esempio 5 — Material delta

`MATERIAL_DELTA + AFTER_MATERIAL_DELTA` carica `PROC-006 + PROC-011` con action `RECONCILE`.

La route indica quali processi governano la continuità dopo il delta; non ordina di «riscrivere tutto».

---

## 14.23 Esempio 6 — Board Gate pronto

`BOARD_GATE_READY + BEFORE_BOARD_GATE` carica `PROT-010 + PROT-009` con action `WAIT_AUTHORITY`.

Il routing collega contract dell'authority command e true stop del workflow. Il risultato è una fermata governata.

---

## 14.24 Un protocollo non deve apparire dal nulla

Una route corretta deve essere ricostruibile:

```text
RICHIESTA / EVENTO
↓
CLASSIFICAZIONE
↓
HOOK
↓
ROUTING SOURCE o INDEX
↓
PROCESS / PROTOCOL ID
↓
PATH CANONICO
↓
STATUS
↓
REGOLA APPLICATA
```

Alla domanda «perché hai applicato proprio questo protocollo?» la risposta dovrebbe poter indicare la route, non soltanto dire «perché sembrava adatto».

---

## 14.25 Anti-pattern

- Caricare tutti i protocolli: più regole nel contesto non significa più sicurezza.
- Protocollo scelto per similarità del nome: un nome vicino non equivale a una route valida.
- Fuzzy event routing: `TOOL_OUTPUT_LIMIT` non diventa genericamente «tool problem».
- Registry come authority autonoma: è materializzazione della routing source.
- Evento inventato: se la situazione non è formalizzata, usare il routing generale.
- Determinismo prematuro: non trasformare una frase ambigua in evento senza evidence sufficiente.
- Reasoning dove esiste una primitive: non reinterpretare con LLM un exact event + exact hook dichiarato.
- Mechanical rule per un conflitto semantico: non automatizzare ciò che richiede reasoning o authority.

---

## 14.26 La formula compatta

```text
1. CHE TIPO DI OPERAZIONE / EVENTO HO?
2. ESISTE UN EVENTO STRUTTURATO?
3. QUAL È L'HOOK?
4. ESISTE UNA ROUTE EXACT-MATCH?
5. QUALI TARGET DICHIARA?
6. I TARGET ESISTONO ED SONO CURRENT / ACTIVE?
7. CHE ACTION / GUARD / SERVICE POLICY IMPONGONO?
8. SE NON ESISTE ROUTE, QUAL È IL PERCORSO INDEX-FIRST MINIMO?
9. HO RAGGIUNTO IL CONTESTO SUFFICIENTE?
10. ESISTE UNA TRUE STOP?
```

```text
COGNITIVE CLASSIFICATION
+
EXACT ROUTING WHEN AVAILABLE
+
ACTIVE TARGET VERIFICATION
+
MINIMUM AUTHORITATIVE RETRIEVAL
=
APPLICABLE PROCEDURAL CONTEXT
```

---

## 14.27 Cosa abbiamo ottenuto

```text
REQUEST
↓
INTENT / GOAL / SCOPE
↓
AUTHORITY
↓
RUN / CHANGE
↓
PROCESS
↓
EVENT / HOOK
↓
PROTOCOL ROUTING
↓
GUARD / ACTION / STOP
↓
EXECUTION
```

Ora WCM non deve conoscere a memoria tutti i protocolli per usarli. Deve saper riconoscere la situazione, navigare la baseline e, quando il significato è già stato strutturato, smettere di reinterpretarlo.

Il Capitolo 15 chiuderà questa parte con esempi completamente domain-agnostic seguendo le catene `REQUEST → PROCESS → PROTOCOL → GUARD → ACTION → STOP`.

---

# Source Map

Fonti canoniche principali: `WCM_AGENT_START.md`; `wcm/kb/concepts/CONCEPT-007_AGENT_READY_KNOWLEDGE_ARCHITECTURE.md`; `wcm/process-book/PROCESS_REGISTER.md`; `wcm/runtime/protocol-routing/ROUTING_SOURCE.json`; `wcm/runtime/protocol-routing/PROTOCOL_ROUTING_REGISTRY.json`; `PROC-005`; `PROT-005`; `PROT-009`; `PROT-011`; `PROT-016`.

## Maturity note

Il Protocol Routing machine-readable è parte della baseline WCM implementata per gli eventi operativi formalizzati nel registry corrente. Questo non implica che ogni possibile situazione sia già codificata né che la classificazione semantica di una richiesta sia deterministica. L'exact routing riduce l'ambiguità **dopo** che l'evento è stato sufficientemente identificato; la field validation complessiva del modello continua.
