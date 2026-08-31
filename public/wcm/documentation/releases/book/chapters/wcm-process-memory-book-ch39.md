# Capitolo 39 — PROT-010 — Mission Control Authenticated Authority Command

**PARTE VII — Il Libro dei Protocolli WCM**  
**Stato:** FROZEN  
**Data:** 2026-08-31  
**Scope:** WCM generale, domain-agnostic

---

# 39.0 Una decisione visibile non è ancora una decisione eseguibile

In un sistema organizzativo può esistere un punto in cui una persona osserva lo stato del lavoro e prende una decisione: approvare, chiedere modifiche, autorizzare una transizione già prevista.

A prima vista il passaggio sembra semplice. La persona preme un pulsante e il sistema continua.

In realtà, tra quei due momenti esiste un problema delicato: **come trasformare una decisione umana autenticata in un'autorità persistente, verificabile e consumabile dal workflow, senza permettere all'interfaccia di diventare essa stessa la fonte della verità?**

`PROT-010 — Mission Control Authenticated Authority Command` governa precisamente questo passaggio.

L'idea centrale è:

> **La superficie di comando registra una decisione autenticata; il workflow applica soltanto gli effetti che quella decisione autorizza e che erano già definiti.**

Il protocollo separa quindi quattro momenti che non devono essere confusi:

```text
DECISIONE UMANA
→ COMANDO DUREVOLE
→ RECEIPT DI AUTHORITY
→ CONSUMO NEL WORKFLOW
```

Il click non è il freeze. La presenza di un comando non è ancora la sua applicazione. E la ricezione dell'authority non autorizza effetti ulteriori rispetto al perimetro dichiarato.

---

# 39.1 Il problema che PROT-010 risolve

Immaginiamo una situazione quotidiana: un responsabile deve approvare una versione prima che il lavoro possa proseguire. Se l'approvazione resta soltanto nella schermata, in una notifica o nella memoria di chi stava lavorando, al cambio di sessione qualcuno potrebbe non sapere più se l'approvazione sia realmente avvenuta.

Il rischio opposto è altrettanto serio. Se il semplice click modifica direttamente documenti, stato e roadmap, la superficie grafica concentra troppe responsabilità: mostra lo stato, interpreta la decisione, modifica la source of truth e applica gli effetti. Un errore nella UI potrebbe così produrre una mutazione autorevole senza i controlli del workflow.

PROT-010 evita entrambi gli estremi.

La decisione umana viene prima autenticata e validata, poi resa durevole in una coda. Un esecutore dedicato la trasforma in una **ricevuta di authority** persistente e immutabile. Solo successivamente il workflow interessato verifica quella ricevuta e applica la transizione esatta prevista.

La distinzione fondamentale è:

```text
RECORDED = authority persistita
CONSUMED = authority applicata al workflow esatto
```

Questa separazione rende osservabile anche uno stato intermedio importante: una decisione può essere stata ricevuta correttamente ma non ancora eseguita.

---

# 39.2 Perché l'autenticazione non basta

Sapere *chi* ha premuto un comando è necessario, ma non sufficiente.

Una decisione può provenire da una persona autorizzata e tuttavia essere ormai riferita a uno stato vecchio. Per esempio, tra il momento in cui la schermata è stata caricata e quello in cui l'utente decide, il workflow potrebbe essere cambiato.

Per questo PROT-010 richiede che il comando sia valido non solo rispetto all'identità, ma anche rispetto al **contesto corrente**.

Nella baseline corrente vengono controllati almeno:

- esistenza di una sessione autenticata valida;
- ruolo autorizzato;
- Need ancora corrente e aperto;
- compatibilità tra tipo di Need e comando;
- riferimento alla versione dello stato su cui la decisione è stata presa;
- assenza di un comando attivo incompatibile sullo stesso oggetto decisionale.

In linguaggio semplice: non basta sapere che la decisione arriva dalla persona giusta. Bisogna anche sapere che sta decidendo **sulla cosa giusta, nella versione giusta, nel momento giusto**.

---

# 39.3 Il trigger

PROT-010 si attiva quando esiste una decisione umana da trasformare in authority persistente attraverso la Command Surface prevista dalla baseline.

Il protocollo corrente non definisce un vocabolario arbitrario di comandi. Il perimetro è limitato a comandi ammessi su Need `OPEN` di tipo `BOARD_GATE`, oggi:

- `APPROVE_FREEZE`;
- `REQUEST_CHANGES`.

Questo limite è importante. PROT-010 non è un telecomando generale del WCM e non consente di creare nuove forme di authority attraverso l'interfaccia.

Sono fuori scope, tra gli altri, cambiamenti arbitrari del metodo, modifiche autonome di scope o governance, cancellazioni e pubblicazioni esterne.

L'introduzione o la modifica materiale del vocabolario dei comandi costituisce infatti un `WCM CHANGE`: non può nascere per estensione editoriale o per interpretazione del comando esistente.

---

# 39.4 Gli input necessari

Prima che il comando possa diventare authority, il sistema deve conoscere abbastanza da poterlo identificare senza ambiguità.

Gli input principali sono:

- identità autenticata e ruolo dell'utente;
- progetto e Need a cui la decisione appartiene;
- tipo di comando;
- documento target e relativa versione, quando richiesti;
- versione attesa dello stato;
- fingerprint atteso del Need;
- eventuale Human Note;
- timestamp e identificatore univoco del comando.

Il **fingerprint** può essere immaginato come un'impronta del Need: una rappresentazione deterministica dei suoi campi di governance rilevanti. Serve a capire se l'oggetto decisionale è rimasto lo stesso tra visualizzazione e consumo del comando.

L'identificatore del documento target, inoltre, non è un semplice link per aprire un file. Quando il comando è `APPROVE_FREEZE`, identifica l'oggetto sul quale l'authority deve realmente agire.

---

# 39.5 Il Target Gate: approvare l'oggetto corretto

Una delle failure più insidiose in un sistema di approvazione è approvare formalmente un oggetto diverso da quello che si intende congelare.

Per questo la baseline di PROT-010 contiene un **Authority Target Contract**.

Nel caso `APPROVE_FREEZE`:

1. il target è obbligatorio;
2. deve appartenere ai documenti collegati al Need;
3. deve essere la Candidate effettivamente approvabile;
4. nella baseline corrente deve appartenere alla categoria prevista per una Candidate di Board;
5. materiale di supporto non può diventare il target del freeze;
6. versione del comando e versione del target devono coincidere;
7. se non esiste una Candidate univoca, il comando non deve essere emesso.

Il principio, però, è più semplice della terminologia:

> **Una decisione autorevole deve indicare esattamente l'oggetto sul quale agisce.**

La verifica viene applicata in più punti indipendenti. Questo riduce il rischio che l'errore di un singolo componente possa produrre una nuova authority malformata.

---

# 39.6 Il flusso: dalla decisione alla ricevuta

Il percorso principale è event-driven: reagisce all'evento della decisione e non richiede un controllo continuo in idle.

La sequenza concettuale è:

```text
DECISIONE AUTENTICATA
→ VALIDAZIONE SERVER-SIDE
→ COMANDO SUBMITTED IN CODA DUREVOLE
→ WAKE DELL'ESECUTORE
→ CLAIMED
→ RECEIPT IMMUTABILE SU MAIN
→ RECORDED
```

Il passaggio più importante avviene molto presto: **il comando viene reso durevole prima di tentare la consegna al worker**.

Questo significa che un problema temporaneo nel meccanismo di wake-up non cancella la decisione umana. Il comando resta `SUBMITTED` con lo stesso `command_id` e può essere ripreso.

Il ciclo ammette gli stati principali:

```text
SUBMITTED → CLAIMED → RECORDED
```

con terminali alternativi:

```text
STALE
REJECTED
FAILED
```

`RECORDED` significa che l'authority receipt è stato persistito. Non significa ancora che tutti gli effetti downstream siano stati applicati.

---

# 39.7 Il Concurrency Gate: la decisione vale ancora?

Quando una persona decide su una schermata, quella schermata rappresenta una certa versione dello stato. PROT-010 congela quindi due riferimenti:

```text
expected_state_sha
expected_need_fingerprint
```

Prima di creare il receipt, il sistema ricontrolla che quei riferimenti coincidano ancora con la source of truth corrente.

Se non coincidono, il comando diventa `STALE`.

`STALE` non significa che la persona non avesse authority. Significa che **l'authority è stata espressa su una baseline che nel frattempo è cambiata** e non può essere applicata automaticamente a uno stato diverso.

Questa è una forma di concorrenza ottimistica: il sistema consente alla persona di lavorare sulla vista corrente, ma verifica nuovamente la coerenza prima della persistenza autorevole.

---

# 39.8 Il receipt: memoria immutabile dell'authority

Quando il comando supera i gate, l'esecutore crea un **Authority Receipt**.

È una ricevuta persistente che registra almeno l'identità del comando, il Need, il tipo di decisione, il target, l'identità autenticata, i riferimenti allo stato atteso, l'eventuale nota umana e la semantica dell'authority.

Nella baseline corrente il receipt vive su `main` nel percorso previsto dal protocollo ed è trattato come **append-only / immutable**.

Questo significa che una correzione successiva non riscrive la storia della decisione originaria. Se emerge un problema, si crea nuova evidence o una nuova decisione collegata.

L'immutabilità serve a preservare il lineage:

```text
che cosa è stato deciso
chi era autorizzato a deciderlo
su quale stato
su quale target
quando
con quale nota
```

Il receipt non è però un nuovo potere generale. Registra l'authority esatta che ha ricevuto.

---

# 39.9 Dal receipt al workflow: il Consumption Gate

Dopo `RECORDED`, il lavoro non è terminato.

Il workflow deve verificare che la ricevuta corrisponda ancora al gate, al target e alla transizione prevista. Solo allora l'authority può essere consumata.

Per `APPROVE_FREEZE`, la baseline distingue un percorso deterministico: il receipt registrato alimenta un inbox durevole; il consumer verifica receipt, target e Board Gate; quindi applica la `approval_transition` già dichiarata.

La regola fondamentale è che la transizione venga definita **prima** della decisione. Il consumer non deve dedurre dalla prosa quale sia il passo successivo, né inventare effetti perché sembrano ragionevoli.

Quando l'authority è stata applicata correttamente, lo stato dell'inbox passa concettualmente da:

```text
RECORDED → CONSUMED
```

Solo a quel punto possiamo dire che quella specifica authority è stata applicata al workflow esatto.

---

# 39.10 Approva e congela non significa “fai qualunque cosa dopo”

Un receipt `APPROVE_FREEZE` può autorizzare gli effetti downstream già previsti dal workflow: congelare la Candidate identificata, chiudere il gate, aggiornare lo stato e rendere eleggibile il passo successivo se quella continuità era già definita.

Non autorizza invece nuove modifiche di scope, canon o workflow.

Questa distinzione protegge un principio generale del WCM:

```text
AUTHORITY RICEVUTA
≠
AUTHORITY ILLIMITATA
```

La decisione umana apre soltanto la porta che era stata dichiarata nel gate. Non apre tutte le porte successive.

Se la transizione prevista richiede un `WCM CHANGE`, continua a valere il relativo Change Gate. Il semplice fatto che esista un comando autenticato non cambia la classificazione di ciò che il workflow sta per fare.

---

# 39.11 Request Changes: rifiutare significa avviare la revisione prevista

`REQUEST_CHANGES` ha una semantica diversa da `APPROVE_FREEZE`.

Nella baseline corrente rappresenta un **rifiuto con richiesta di riscrittura/revisione**. La Human Note non è un commento accessorio: è il mandato autorevole che deve accompagnare la nuova revisione.

Quando esiste un contratto deterministico di rejection già dichiarato, il workflow può preservare l'oggetto rifiutato come evidence, chiudere la versione corrente, creare la revisione prevista e trasferire la nota come istruzione di revisione.

Anche qui non è ammessa invenzione: rewind, nuova versione, path e reset degli step devono essere già dichiarati dal contratto della transizione.

Se manca questa determinazione, il consumer non può colmare il vuoto con una propria interpretazione.

---

# 39.12 Le Human Note: memoria operativa, non commento effimero

Una nota inserita insieme a una decisione può contenere un'indicazione importante.

Per `REQUEST_CHANGES`, la nota appartiene alla revisione della stessa unità.

Per `APPROVE_FREEZE`, se la nota contiene indicazioni per l'unità immediatamente successiva, PROT-010 prevede un contratto **one-hop**: la nota viene propagata una sola volta al workflow successivo dichiarato e deve essere esaminata prima che quel workflow completi le proprie fasi iniziali rilevanti.

La nota non viene propagata indefinitamente.

Questo evita due errori opposti:

- perderla perché l'approvazione è stata registrata ma il commento è rimasto effimero;
- trasformarla in una regola permanente che contamina unità successive non contemplate.

Presenza e provenienza possono essere governate deterministicamente; capire se la nota contiene un requisito applicabile resta invece un'attività cognitiva.

---

# 39.13 Delivery, recovery e idempotenza

Un sistema di authority deve resistere anche alle interruzioni tecniche.

Se il wake dell'esecutore fallisce dopo che il comando è stato reso durevole, il comando resta `SUBMITTED`. Un watchdog periodico può aiutare il recovery, ma non è il motore principale del sistema.

Il principio è:

> **event-driven first, polling only as bounded recovery.**

Il retry riutilizza lo stesso `command_id`. Un comando deve produrre al massimo un receipt logico e il workflow deve riconoscere gli effetti già applicati, evitando di eseguirli due volte.

Se un comando resta `SUBMITTED` troppo a lungo senza essere preso in carico, il problema deve diventare visibile come degradazione della delivery. Non nasce per questo una nuova authority e non è consentito bypassare il worker.

---

# 39.14 Failure mode e comportamento corretto

PROT-010 privilegia il **fail closed**: quando non è possibile dimostrare che comando, stato, target e transizione coincidano, il sistema non deve “provare comunque”.

Tra i failure mode principali:

- stato proiettato privo del riferimento necessario → nessun comando;
- Need non più aperto → reject o stale;
- fingerprint diverso → `STALE`;
- versione reale dello stato diversa → `STALE`;
- target di approvazione non valido o ambiguo → nessun nuovo comando;
- receipt già esistente per lo stesso `command_id` → riuso idempotente;
- incongruenza tra receipt e workflow → stop ed escalation;
- indisponibilità temporanea dell'infrastruttura → comando durevole preservato, nessuna falsa transizione;
- mismatch nel consumo → nessuna applicazione dell'authority.

Esiste inoltre una procedura eccezionale di Controlled Recovery per receipt malformati a causa di regressioni dimostrate. Non è un permesso generale di reinterpretare una decisione: richiede mapping univoco, evidence della regressione e authority esplicita specifica per il recovery.

---

# 39.15 Separation of Duties: quattro responsabilità diverse

Il protocollo mantiene separate quattro responsabilità:

```text
PROJECTOR
mostra lo stato

COMMAND SURFACE
riceve la decisione umana

COMMAND EXECUTOR
persiste l'authority

PROJECT WORKFLOW / CONSUMER
applica la transizione autorizzata
```

Questa separazione è importante anche per un lettore non tecnico.

Pensiamo a un'organizzazione cartacea: chi prepara il fascicolo, chi raccoglie una firma, chi protocolla quella firma e chi esegue l'ordine possono essere funzioni diverse. Se una sola funzione facesse tutto senza controlli incrociati, un errore sarebbe più difficile da individuare e contenere.

Nel WCM la separazione serve allo stesso scopo: **osservare, autorizzare, registrare ed eseguire non sono sinonimi**.

---

# 39.16 Relazioni con gli altri elementi WCM

PROT-010 non opera isolatamente.

Si collega in particolare a:

- `PROT-009 — Contiguous Workflow Execution`, perché l'authority consumata può sbloccare la next transition già prevista;
- `PROT-017 — Persistent Mutation Safety`, applicato alle mutazioni persistenti del ciclo comando/receipt/consumo;
- ai gate e ai workflow che dichiarano in anticipo le transizioni di approvazione o rifiuto;
- alla pipeline di riconciliazione/proiezione, che rende visibili gli effetti dopo la transizione senza trasformare il read-model in source of truth.

La relazione più importante resta però quella con la governance: **capability e autenticazione non ampliano l'authority**. Il protocollo rende affidabile il trasporto di una decisione, non inventa decisioni che non sono state conferite.

---

# 39.17 Maturity e limiti

Nel Process Register e nel protocollo canonico, PROT-010 è qualificato:

```text
ACTIVE / EVENT-DRIVEN DELIVERY / FIELD VALIDATION
```

Questo significa che la baseline è attiva e che il modello di delivery event-driven è parte del contratto corrente, ma la field validation non deve essere interpretata come dimostrazione universale in ogni contesto o infrastruttura.

Il protocollo ha inoltre limiti espliciti:

- il vocabolario dei comandi è ristretto;
- non ogni decisione WCM passa attraverso questa superficie;
- un receipt non sostituisce il workflow;
- `RECORDED` non equivale a `CONSUMED`;
- recovery e retry non possono ampliare l'authority;
- il protocollo non autorizza WCM CHANGE arbitrari;
- le parti cognitive, come comprendere l'applicabilità di una nota, non diventano deterministiche solo perché il trasporto dell'authority lo è.

PROT-010 rende quindi più controllabile il passaggio tra decisione umana e workflow. Non elimina la necessità di governance, validazione semantica e gate correttamente definiti.

---

# 39.18 Source Map

Fonti utilizzate per il Technical Truth Pass:

1. `WCM_AGENT_START.md` — bootstrap, source precedence, distinzione WCM RUN / WCM CHANGE e authority;
2. `wcm/documentation/process-memory-book/BOOK_INDEX.md` — mapping editoriale CH39 = PROT-010;
3. `wcm/process-book/README.md` — ruolo del Process & Protocol Book e natura dei protocolli;
4. `wcm/process-book/PROCESS_REGISTER.md` — titolo, stato e scopo correnti di PROT-010;
5. `wcm/process-book/protocols/PROT-010_MISSION_CONTROL_AUTHORITY_COMMAND.md` — fonte tecnica primaria;
6. `wcm/documentation/process-memory-book/chapters/38_prot_009_contiguous_workflow_execution.md` — continuità editoriale e relazione con PROT-009.

Nessuna nuova regola WCM è introdotta da questo capitolo. Gli esempi sono pedagogici e domain-agnostic.

---

# 39.19 La regola da ricordare

Se di questo capitolo restasse una sola regola, dovrebbe essere questa:

> **Una decisione umana diventa eseguibile solo dopo essere stata autenticata, resa durevole, registrata come authority verificabile e consumata dal workflow esatto; nessuno di questi passaggi autorizza effetti ulteriori rispetto al mandato ricevuto.**
