# Capitolo 21 — PROC-005 — Agent-Ready Context Bootstrap

**Parte VI — Il Libro dei Processi WCM**  
**Stato:** FROZEN  
**Data:** 2026-08-29  
**Scope:** WCM generale, domain-agnostic

---

# 21.0 Riprendere non significa ricominciare

Quando un agente entra in una nuova sessione, viene riattivato da un heartbeat o riceve un lavoro già avviato, il rischio più immediato non è necessariamente quello di non sapere nulla. È quello di sapere abbastanza da agire, ma non abbastanza da capire **dove il lavoro era realmente arrivato**.

Una conversazione precedente può essere terminata. Un processo, invece, può essere ancora aperto. Un documento può riassumere uno stato che nel frattempo è stato superato. Un repository può contenere centinaia di file corretti, ma soltanto pochi sono necessari per decidere la prossima transizione.

`PROC-005 — Agent-Ready Context Bootstrap` governa questo problema.

La sua domanda fondamentale è:

> **qual è il contesto minimo, autorevole e sufficiente che un agente deve ricostruire per continuare correttamente il lavoro senza ricominciare, inventare o leggere tutto?**

Il principio è semplice:

```text
NUOVA SESSIONE
≠
NUOVO WORKFLOW
```

E, di conseguenza:

```text
RIPRENDERE
≠
RICOMINCIARE
```

---

# 21.1 Che cos'è PROC-005

PROC-005 è il processo WCM che prepara un agente autorizzato ad agire ricostruendo il **contesto operativo minimo necessario**.

Combina due famiglie di informazione:

- ciò che è disponibile nella Working Memory pertinente;
- ciò che deve essere recuperato dalla Persistent Organizational Memory e dallo stato esecutivo persistente.

Non ha l'obiettivo di caricare tutta la conoscenza disponibile. Ha l'obiettivo opposto: fermare il retrieval non appena l'agente possiede abbastanza contesto affidabile per operare nel proprio ruolo, scope e authority.

Il bootstrap deve inoltre verificare, **prima di cercare nuovo lavoro**, se esiste un workflow incompleto che richiede Resume Priority.

La sequenza concettuale è:

```text
WORKING MEMORY PERTINENTE?
        ↓
ENTRY POINT E STATO
        ↓
WORKFLOW INCOMPLETO?
   ├─ SÌ → RESUME PRIORITY
   └─ NO → ROUTING NORMALE
        ↓
RETRIEVAL PROGRESSIVO MINIMO
        ↓
CONTEXT SUFFICIENCY GATE
        ↓
AGISCI
```

---

# 21.2 Perché la memoria della conversazione non basta

La Working Memory è preziosa perché conserva continuità semantica, intenzioni recenti e sfumature che non avrebbe senso trasformare tutte in documenti persistenti. Ma proprio perché è viva e temporanea non può essere l'unica fonte per stabilire lo stato di un workflow materiale.

Un agente che si affida soltanto alla conversazione può:

- ripetere attività già completate;
- chiedere nuovamente un'authority già valida;
- saltare una transizione ancora necessaria;
- confondere una proposta con una decisione;
- usare una sintesi umana non più allineata allo stato esecutivo;
- iniziare nuovo lavoro mentre un workflow precedente è ancora riprendibile.

PROC-005 non elimina la Working Memory. La usa, ma la combina con le fonti persistenti appropriate.

È una conseguenza diretta della Dual Memory: la memoria viva e quella organizzativa sono complementari, non intercambiabili.

---

# 21.3 Il primo gate: esiste qualcosa da riprendere?

Prima di cercare un nuovo task, PROC-005 controlla se esiste un workflow persistente incompleto.

Due condizioni hanno particolare rilevanza:

```text
ACTIVE + TRUE STOP NON RAGGIUNTA
```

oppure:

```text
INTERRUPTED_RESUMABLE
```

In entrambi i casi entra in gioco la **Resume Priority**.

La priorità non significa rieseguire tutto. Significa recuperare il checkpoint e continuare dalla `next_transition`, rispettando gli step già completati.

Il bootstrap deve poter ricostruire almeno:

```text
WORKFLOW_INSTANCE_ID
STATUS
AUTHORITY_REFS
SCOPE
LAST_COMPLETED_TRANSITION
NEXT_TRANSITION
TRUE_STOP_CONDITION
RESUME_REQUIRED
COMPLETED_STEP_IDS
```

Questi elementi trasformano la continuità da ricordo narrativo a proprietà operativa verificabile.

---

# 21.4 La fine di una sessione non è una stop condition

Una sessione può terminare per ragioni tecniche, temporali o di capacità. Nessuna di queste ragioni rende automaticamente completo il workflow.

La distinzione è essenziale:

```text
FINE SESSIONE
≠
FINE WORKFLOW
```

Se la true stop condition non è stata raggiunta, il lavoro rimane da riprendere. PROC-005 impedisce che il semplice cambio di sessione venga interpretato come una nuova partenza.

Lo stesso vale per l'authority. Se un workflow è già stato autorizzato nel proprio scope, il cambio di sessione non crea da solo la necessità di una nuova autorizzazione.

Diverso è il caso di `WAITING_AUTHORITY`: qui il bootstrap deve riconoscere una vera stop condition e non può riprendere il workflow finché l'authority richiesta non è disponibile.

---

# 21.5 Resume Priority non significa priorità assoluta universale

Resume Priority ha un perimetro preciso. Un workflow `ACTIVE` o `INTERRUPTED_RESUMABLE` ha priorità sul nuovo lavoro **dello stesso progetto e nel medesimo contesto operativo**, salvo sospensione, cancellazione o cambio di priorità autorizzato.

Non significa che qualunque workflow incompleto nel sistema blocchi qualsiasi altra attività.

PROC-005 deve quindi ricostruire:

- identità del workflow;
- progetto o ambito pertinente;
- authority associata;
- scope;
- stato;
- transizione successiva.

La priorità nasce dalla continuità autorizzata, non dalla sola presenza di un file incompleto.

---

# 21.6 Dal contesto massimo al contesto sufficiente

Un errore intuitivo consiste nel pensare che un agente sia tanto più preparato quanto più materiale legge.

In realtà, oltre una certa soglia, più contesto può significare:

- più rumore;
- maggiore probabilità di incontrare storico superato;
- più conflitti apparenti;
- maggiore costo;
- minore chiarezza sulla fonte realmente autorevole.

PROC-005 usa quindi `PROT-005 — Index-First Progressive Retrieval`.

Il percorso è selettivo:

```text
ENTRY POINT
   ↓
INDEX / MAPPA
   ↓
FONTE AUTOREVOLE NECESSARIA
   ↓
EVIDENCE O STORICO SOLO SE SERVONO
```

Non si legge tutto “per sicurezza”. Si legge ciò che manca per rispondere alle domande operative ancora aperte.

---

# 21.7 Il Context Sufficiency Gate

Il bootstrap è sufficiente quando l'agente sa rispondere con affidabilità alle domande necessarie per agire.

Deve sapere:

- chi è e quale ruolo ricopre;
- qual è il progetto o goal pertinente;
- se esiste un workflow da riprendere;
- che cosa è già disponibile e affidabile;
- quale fonte persistente è autorevole;
- quale authority possiede;
- quale scope è autorizzato;
- quale transizione viene dopo;
- quali processi e protocolli sono applicabili;
- quali azioni richiedono escalation;
- quale true stop condition deve raggiungere.

Quando queste risposte sono disponibili, continuare a leggere richiede una motivazione concreta.

Il gate non misura la quantità di token caricati. Misura la **sufficienza decisionale del contesto**.

---

# 21.8 Entry point generale ed entry point specifico

Il bootstrap parte dal livello generale WCM e, quando opera su un progetto, passa all'entry point specifico.

Un entry point di progetto dovrebbe orientare verso:

- stato corrente;
- goal o focus;
- indice della knowledge base pertinente;
- workflow checkpoint attivi;
- decisioni frozen o materiali;
- path principali;
- route di navigazione successive.

L'entry point non sostituisce le fonti autorevoli. È una mappa per raggiungerle con meno ambiguità.

Questa distinzione è importante:

```text
ENTRY POINT
=
DOVE GUARDARE
```

non:

```text
ENTRY POINT
=
AUTORITÀ SU TUTTO
```

---

# 21.9 Source of truth e source precedence

Il bootstrap deve stabilire non soltanto quali informazioni esistono, ma quale fonte prevale per la domanda corrente.

Per gli execution facts, un checkpoint runtime strutturato può avere precedenza su una sintesi testuale dello stato. Questo non rende però il runtime autorità sul significato del metodo, sulla governance o sul canon.

PROC-005 mantiene quindi separati due piani:

```text
STATO ESECUTIVO
→ fonti strutturate pertinenti

SIGNIFICATO / CANON / GOVERNANCE
→ fonti autorevoli del metodo
```

Una fonte può essere più recente senza essere più autorevole. Il bootstrap deve conoscere la differenza.

---

# 21.10 Authority e scope devono essere ricostruiti, non immaginati

Sapere cosa fare non equivale a essere autorizzati a farlo.

Prima della ripresa, PROC-005 verifica che `authority_refs`, scope e `next_transition` siano coerenti.

Questo impedisce due errori opposti:

- **authority amnesia**: chiedere nuovamente un permesso già valido solo perché è cambiata la sessione;
- **authority inflation**: interpretare un'autorizzazione circoscritta come permesso generale.

L'authority sopravvive alla sessione quando appartiene al workflow e al suo scope. Non si espande per inferenza.

Se il workflow richiede una nuova authority materiale, il bootstrap deve riconoscere il gate e fermarsi.

---

# 21.11 Bootstrap e idempotenza

Riprendere correttamente significa anche evitare duplicazioni.

I `completed_step_ids` e l'ultima transizione completata permettono di distinguere ciò che deve essere continuato da ciò che non deve essere rieseguito.

L'obiettivo non è rendere ogni attività cognitiva matematicamente deterministica. È rendere più deterministiche le parti che possono esserlo:

- identificazione dello stato persistente;
- riconoscimento degli step completati;
- scelta della next transition già strutturata;
- applicazione di una true stop condition esplicita.

Il reasoning resta necessario dove il significato non è già codificato.

---

# 21.12 Cosa succede se Working Memory e memoria persistente divergono

Il bootstrap può scoprire che ciò che l'agente ricorda e ciò che la memoria organizzativa registra non coincidono.

Non deve scegliere arbitrariamente.

Se il delta riguarda stato esecutivo strutturato, si applicano le regole di riconciliazione previste dalla baseline. Se riguarda conoscenza persistente, entra in gioco il Memory Consolidation Loop. Se modifica una decisione materiale, si applica il relativo change impact analysis.

PROC-005 quindi non “risolve” ogni conflitto. Identifica il tipo di conflitto e instrada verso il processo appropriato.

---

# 21.13 Quando il bootstrap incontra un gap

Durante il retrieval può emergere un'informazione mancante, una capability non verificata o un gap generalizzabile.

Il comportamento corretto non è inventare ciò che manca.

Prima di dichiarare un blocco occorre distinguere:

- contesto non ancora recuperato;
- authority mancante;
- capability non verificata;
- vero capability gap;
- knowledge gap potenzialmente generalizzabile.

Se emerge un apprendimento significativo, questo può alimentare `PROC-004 — Evidence → Baseline Promotion`, ma non diventa automaticamente baseline.

Il bootstrap prepara l'azione; non è una scorciatoia per modificare il metodo.

---

# 21.14 Output del processo

PROC-005 non richiede necessariamente la creazione di un nuovo documento.

Quando è utile rendere esplicito il risultato del bootstrap, può essere rappresentato con campi come:

```yaml
WORKING_CONTEXT_USED:
BOOTSTRAP_ROUTE:
FILES_READ:
WORKFLOW_INSTANCE_ID:
RESUME_PRIORITY: true|false
AUTHORITY_RESOLVED:
SCOPE_RESOLVED:
NEXT_TRANSITION:
TRUE_STOP_CONDITION:
CONTEXT_SUFFICIENT: true|false
OPEN_GAPS:
```

Il valore dell'output non sta nel formato in sé. Sta nella possibilità di dimostrare che l'agente possiede il contesto necessario e non sta agendo per supposizione.

---

# 21.15 Failure mode

PROC-005 considera problematici comportamenti come:

- ignorare un workflow incompleto e iniziare nuovo lavoro;
- affidarsi alla sola memoria della chat per sapere dove riprendere;
- chiedere nuova authority soltanto perché è cambiata sessione;
- rieseguire step già completati;
- leggere indiscriminatamente l'intero repository;
- usare raw o storico prima della baseline attiva;
- confondere knowledge base di metodo e knowledge base di progetto;
- continuare il retrieval dopo che il contesto è sufficiente;
- trattare una proposta recente come decisione attiva;
- interpretare `WAITING_AUTHORITY` come semplice interruzione tecnica.

Questi failure mode hanno una radice comune: perdere la distinzione tra **continuità**, **conoscenza**, **stato** e **authority**.

---

# 21.16 Relazioni con gli altri processi

PROC-005 è un processo di ingresso e continuità. Per questo si collega a diversi elementi del sistema.

Con `PROT-009 — Contiguous Workflow Execution` condivide checkpoint, Resume Priority e Completion Gate.

Con `PROT-005 — Index-First Progressive Retrieval` condivide la disciplina del retrieval minimo.

Con `PROC-006 — Memory Consolidation Loop` gestisce il passaggio dai delta osservati alla memoria persistente.

Con `PROC-004 — Evidence → Baseline Promotion` instrada eventuali gap o learning generalizzabili senza promuoverli automaticamente.

Con i meccanismi di state reconciliation mantiene distinta la fotografia esecutiva dalle sintesi human-facing.

PROC-005 non sostituisce questi processi: li rende raggiungibili con il contesto corretto.

---

# 21.17 Maturità e limiti

Il processo canonico è classificato **VALIDATED BY GOVERNANCE / SESSION-INDEPENDENT EVOLUTION ACTIVE / FIELD VALIDATION IN PROGRESS**.

Questa formulazione va letta con precisione.

La disciplina di bootstrap, Resume Priority, context sufficiency e retrieval progressivo appartiene alla baseline corrente. Ciò non implica che ogni possibile agente, dominio, piattaforma o scenario operativo sia già stato validato sul campo.

In particolare, PROC-005 non garantisce che:

- ogni conflitto semantico possa essere risolto deterministicamente;
- ogni fonte persistente sia automaticamente aggiornata;
- ogni capability sia disponibile;
- ogni workflow possieda checkpoint perfetti;
- la qualità del reasoning cognitivo sia resa deterministica dal solo bootstrap.

Il processo riduce l'ambiguità operativa e protegge la continuità. Non elimina la necessità di ragionamento dove il significato resta aperto.

---

# 21.18 La regola da ricordare

Se dovessimo comprimere PROC-005 in una sola idea, sarebbe questa:

> **prima di iniziare qualcosa di nuovo, ricostruisci abbastanza contesto autorevole da sapere se devi invece continuare qualcosa che è già iniziato.**

Il bootstrap non serve a sapere tutto.

Serve a sapere **abbastanza**, dalla fonte giusta, con l'authority giusta, per compiere la prossima transizione senza perdere la storia operativa.

```text
CONTESTO MINIMO
+
STATO PERSISTENTE
+
AUTHORITY
+
RESUME PRIORITY
+
INDEX-FIRST
+
SUFFICIENCY GATE
=
AGENT-READY CONTEXT
```

È così che WCM prova a trasformare la continuità tra sessioni da una speranza affidata alla memoria in una proprietà governata del sistema.

---

## Source Map

- `wcm/process-book/processes/PROC-005_AGENT_READY_CONTEXT_BOOTSTRAP.md` — fonte canonica primaria del processo;
- `WCM_AGENT_START.md` — entry point generale e invarianti di session-independence, Resume Priority, source precedence e Completion Gate;
- `wcm/documentation/process-memory-book/BOOK_INDEX.md` — perimetro editoriale approvato e mapping CH21 → PROC-005;
- Capitoli FROZEN precedenti — riferimento per tono, struttura e continuità editoriale.
