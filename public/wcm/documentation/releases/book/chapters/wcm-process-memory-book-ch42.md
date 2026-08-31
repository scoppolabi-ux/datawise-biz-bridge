# Capitolo 42 — PROT-013 — Knowledge Synapse & Health Standard

**PARTE VII — Il Libro dei Protocolli WCM**  
**Stato:** FROZEN  
**Data:** 2026-08-31  
**Scope:** WCM generale, domain-agnostic

---

# 42.0 Avere memoria non basta

Un archivio può contenere migliaia di informazioni corrette e, allo stesso tempo, essere poco affidabile per lavorare.

Il problema nasce quando le informazioni non sono più collegate nel modo giusto. Una decisione cambia, ma il documento che dipendeva da quella decisione continua a raccontare la versione precedente. Un requisito viene superato, ma altri elementi continuano a puntarlo come se fosse corrente. Una fonte importante esiste, ma non è più raggiungibile dagli entry point usati per orientarsi.

In questi casi la conoscenza non è necessariamente falsa. È **scollegata, stantia o incoerente**.

`PROT-013 — Knowledge Synapse & Health Standard` nasce per affrontare proprio questo problema. La sua idea centrale è semplice:

> **La salute della memoria dipende non soltanto dalla correttezza dei singoli contenuti, ma anche dalla qualità e dalla freschezza delle relazioni che li rendono utilizzabili.**

WCM chiama queste relazioni **sinapsi di conoscenza**.

Il termine può sembrare tecnico, ma il concetto è quotidiano. In un buon archivio non basta conservare una ricevuta: bisogna sapere a quale acquisto appartiene. Non basta conservare una nuova regola: bisogna sapere quali attività vincola. Non basta registrare una decisione: bisogna poter capire che cosa dipende da essa e che cosa potrebbe dover essere rivisto se cambia.

PROT-013 rende queste relazioni osservabili, verificabili e, solo in casi strettamente deterministici, riparabili automaticamente.

---

# 42.1 Il problema che il protocollo risolve

Una memoria organizzativa cresce nel tempo. Crescono le decisioni, i documenti, gli stati, le evidenze, i requisiti, gli output e le procedure. Con la crescita aumenta un rischio particolare: ogni singolo elemento può apparire corretto se osservato isolatamente, mentre l'insieme non lo è più.

Immaginiamo una biblioteca in cui tutti i libri siano al loro posto, ma il catalogo indichi scaffali sbagliati. I libri esistono; il problema è la relazione tra il catalogo e ciò che dovrebbe rappresentare.

Nel WCM lo stesso fenomeno può produrre:

- dipendenze diventate obsolete;
- riferimenti a elementi superati trattati ancora come correnti;
- relazioni rotte perché il nodo di destinazione non esiste più;
- informazioni che dovrebbero essere collegate ma risultano isolate;
- controlli di salute più vecchi delle modifiche che dovrebbero verificare;
- indicatori apparentemente verdi che nascondono un problema critico.

PROT-013 introduce una disciplina per evitare che la memoria diventi un semplice deposito di file. La memoria deve restare **navigabile, coerente e sufficientemente fresca per sostenere il lavoro**.

---

# 42.2 Nodo e sinapsi: due concetti semplici

Il protocollo usa due parole fondamentali.

Un **nodo** è un oggetto persistente rilevante per il ragionamento o per l'esecuzione. Può essere, per esempio, una decisione, una fonte, un requisito, uno stato, un output, un processo, un protocollo o un'evidenza.

Una **sinapsi** è una relazione intenzionale e tipizzata fra due nodi.

“Tipizzata” significa che la relazione non dice soltanto che due cose sono collegate: dice **come** sono collegate.

Per esempio, una relazione può esprimere che un elemento:

- dipende da un altro (`DEPENDS_ON`);
- deriva da una fonte (`DERIVED_FROM`);
- implementa un requisito (`IMPLEMENTS`);
- vincola un altro elemento (`CONSTRAINS`);
- è influenzato da un cambiamento (`AFFECTS`);
- sostituisce una versione precedente (`SUPERSEDES`);
- costituisce evidenza per qualcosa (`EVIDENCE_FOR`);
- contraddice un altro nodo (`CONTRADICTS`).

Il protocollo consente anche relazioni specialistiche quando servono davvero, ma non impone di moltiplicarle.

Qui esiste una regola importante: **un collegamento decorativo non è una sinapsi WCM**.

Aggiungere link solo per rendere una rete più densa non aumenta la qualità della conoscenza. Una relazione è utile se aiuta a rispondere a domande operative reali: da cosa dipende questo elemento? che cosa vincola? quale evidenza lo sostiene? che cosa potrebbe rompersi se cambia?

---

# 42.3 Quando una relazione è affidabile

Una sinapsi dichiarata `ACTIVE` non è affidabile solo perché è stata scritta.

Per essere valida deve superare alcune verifiche. In particolare, source e target devono esistere — oppure il riferimento esterno deve essere stabile e intenzionale — e il significato della relazione deve essere pertinente e comprensibile.

La relazione non deve inoltre nascondere un conflitto con una fonte più autorevole e non deve puntare silenziosamente a un elemento superato come se fosse ancora corrente.

Quando il significato non è evidente, deve essere ricostruibile anche il motivo della relazione.

Infine conta il tempo: una relazione può essere stata corretta ieri e non esserlo più oggi, se nel frattempo è avvenuto un cambiamento materiale che la riguarda.

PROT-013 usa quindi stati diversi per distinguere situazioni differenti:

- `ACTIVE`: relazione corrente e verificata;
- `AT_RISK`: relazione potenzialmente influenzata da un cambiamento e ancora da verificare;
- `BROKEN`: relazione che punta a un target mancante;
- `OPEN`: relazione ipotetica o non confermata, che non deve essere trattata come fatto;
- `SUPERSEDED`: relazione superata.

Questa distinzione impedisce un errore molto comune: trasformare l'incertezza in certezza solo perché un collegamento esiste già.

---

# 42.4 Il trigger principale: un cambiamento materiale

PROT-013 non richiede di scandire continuamente tutto ciò che esiste.

Il controllo principale è **event-driven**: nasce quando accade qualcosa che può modificare la validità della conoscenza.

Un cambiamento materiale può riguardare, per esempio, una decisione approvata, un freeze o una promozione, una variazione di stato, una modifica di un requisito, un nuovo output corrente o un cambiamento architetturale.

Il principio è proporzionale:

```text
DELTA MATERIALE
      ↓
QUALI NODI SONO CAMBIATI?
      ↓
QUALI RELAZIONI DIPENDONO DA ESSI?
      ↓
QUALI INDICI / LEDGER / VISTE POSSONO ESSERE IMPATTATI?
      ↓
RICONCILIAZIONE + HEALTH CHECK
```

Non serve rileggere l'intera memoria dopo ogni piccola modifica. Serve invece controllare l'**impact set** pertinente: il sottoinsieme di nodi e relazioni che il cambiamento può aver reso non più affidabili.

Il protocollo prevede inoltre controlli prima di passaggi sensibili, quando una transizione dipende fortemente dalla coerenza della memoria, e controlli periodici quando il loro valore operativo lo giustifica.

La periodicità, però, non sostituisce i controlli generati dagli eventi reali.

---

# 42.5 Knowledge Health: quando la memoria può dirsi sana

PROT-013 introduce un concetto più ampio della semplice correttezza di un link: il **Knowledge Health**.

In linguaggio semplice, è la condizione complessiva della memoria rispetto alla capacità di sostenere il lavoro corrente in modo affidabile.

Il protocollo ammette cinque stati principali:

- `HEALTHY`: gli invarianti richiesti sono soddisfatti e non esistono problemi aperti che rendano inaffidabile il lavoro corrente;
- `DEGRADED`: la memoria resta utilizzabile, ma contiene drift, debt o relazioni a rischio che devono essere gestiti;
- `STALE`: il controllo di assurance è più vecchio dell'ultimo cambiamento materiale rilevante, oppure viste e ledger correnti non sono stati verificati;
- `CRITICAL`: esiste un problema tale da rendere insicuro bootstrap o esecuzione, come una contraddizione critica o una relazione critica rotta;
- `UNKNOWN`: non c'è evidenza sufficiente per classificare la salute.

Uno degli invarianti più importanti riguarda la **freschezza**:

```text
ULTIMO CONTROLLO DI INTEGRITÀ
        <
ULTIMO CAMBIAMENTO MATERIALE
        ↓
NON PUÒ ESSERE HEALTHY
```

Questo evita il “verde storico”: un sistema non può continuare a dichiararsi sano usando un controllo eseguito prima di un cambiamento che avrebbe dovuto rivalutare.

---

# 42.6 Perché uno score alto non basta

La salute della conoscenza può essere accompagnata da metriche: numero di relazioni attive, relazioni a rischio o rotte, nodi isolati, drift aperti, freschezza dei ledger, età della conoscenza e altri indicatori pertinenti.

Ma PROT-013 introduce una precauzione fondamentale: **la quantità non deve essere scambiata per qualità**.

Aggiungere cento relazioni inutili non rende una memoria più sana. Allo stesso modo, uno score numerico elevato non può cancellare un blocker critico.

È lo stesso principio che useremmo per valutare la sicurezza di un edificio: cento controlli superati non compensano una sola crepa strutturale grave.

Le metriche servono quindi a rendere osservabile la memoria, non a produrre un numero da ottimizzare a qualsiasi costo.

---

# 42.7 Orphan e debt: problemi diversi

Il protocollo distingue anche fenomeni che potrebbero sembrare simili.

Un nodo è **orphan** quando, per la funzione che svolge e per il suo grado di maturità, dovrebbe possedere relazioni significative ma non ne possiede, oppure non è raggiungibile dagli entry point pertinenti.

Non ogni file senza link è automaticamente orphan. La classificazione richiede contesto o una regola deterministica dichiarata.

Il **debt**, invece, è un obbligo ancora aperto.

La `Continuity Debt` riguarda la necessità di mantenere coerenza tra eventi, stato, entità, memoria o dipendenze ancora non risolte. Altre forme specialistiche di debt possono esistere dove la natura del dominio lo richiede.

Il debt non è automaticamente un errore. Può essere semplicemente qualcosa che deve essere ricordato e chiuso più avanti. Diventa problematico quando viene dimenticato, perde il proprio target, supera la finestra prevista o entra in contraddizione con lo stato corrente.

---

# 42.8 Il gate più delicato: riparare o interpretare?

Una delle parti più importanti di PROT-013 riguarda l'auto-riparazione.

Il WCM non assume che ogni problema della memoria debba essere risolto da un'intelligenza artificiale. Al contrario, quando una correzione è puramente meccanica, deterministica e autorizzata, il protocollo preferisce un controllo deterministico.

Il flusso è:

```text
PRE-CHECK DETERMINISTICO
        ↓
TUTTO VERDE?
 ├─ SÌ → registra telemetria; nessun lavoro cognitivo
 └─ NO → classifica l'anomalia
                 ↓
        ESISTE UNA REPAIR CLASS AUTORIZZATA?
        ├─ SÌ → repair meccanica → post-check
        └─ NO → NO WRITE → escalation / gate applicabile
```

Una **repair class** è un contratto esplicito per una specifica correzione automatica. Deve avere precondizioni deterministiche, scope di scrittura chiaro, una sola soluzione dimostrabile, verifica successiva ed evidence.

Senza una repair class attiva, non esiste authority di auto-riparazione.

Il punto decisivo è quindi questo: **se per correggere il problema bisogna capire che cosa “significa” davvero una fonte o scegliere tra due verità concorrenti, non siamo più davanti a una riparazione meccanica**.

---

# 42.9 Dove l'auto-riparazione deve fermarsi

PROT-013 stabilisce un confine netto.

L'auto-riparazione è vietata quando il risultato corretto non è unico, quando due fonti autorevoli confliggono, quando serve interpretazione semantica o quando la correzione inciderebbe su canone, strategia, governance, requisito o altro contenuto che richiede authority specifica.

È vietato anche “riparare” una relazione solo per migliorare uno score.

Questo protegge il sistema da un rischio sottile: un meccanismo nato per mantenere ordine potrebbe altrimenti iniziare a **decidere la verità**.

PROT-013 non concede questa facoltà.

Le riparazioni ammesse devono inoltre essere idempotenti o convergenti: se il controllo viene ripetuto senza un nuovo cambiamento reale, non deve continuare a generare nuove modifiche.

---

# 42.10 Output: non un voto, ma uno stato spiegabile

L'output del protocollo non è semplicemente un'etichetta verde o rossa.

Un health check utile deve rendere ricostruibili almeno:

- lo stato di Knowledge Health;
- la freschezza del controllo;
- le anomalie rilevanti;
- le relazioni rotte o a rischio quando pertinenti;
- l'eventuale repair class applicata;
- l'esito del post-check;
- le escalation residue.

Le superfici di osservazione possono mostrare questi dati, ma non diventano per questo source of truth.

In altre parole, il cruscotto può dire “la memoria è sana”, ma deve esserci una telemetria sottostante che dimostri perché. Un badge verde senza freshness sufficiente non è accettabile.

---

# 42.11 Failure mode principali

PROT-013 serve soprattutto a prevenire alcuni fallimenti ricorrenti.

**Relazione rotta ignorata.** Un nodo dipende da qualcosa che non esiste più, ma il sistema continua a trattare la dipendenza come valida.

**Relazione stale trattata come current.** Dopo un cambiamento materiale, una sinapsi non viene rivalutata e continua a influenzare il lavoro.

**Link inflation.** Si aggiungono relazioni solo per aumentare densità o score, riducendo invece la leggibilità della rete.

**Auto-repair semantica.** Un meccanismo automatico interpreta un conflitto o sceglie quale fonte sia vera senza authority.

**Healthy non fresco.** Il sistema espone uno stato positivo basato su un controllo precedente all'ultimo delta materiale.

**Full scan sproporzionato.** Ogni minima modifica scatena verifiche globali inutili invece di controllare l'impact set pertinente.

**Assurance che diventa lavoro cognitivo continuo.** Il controllo della memoria consuma ragionamento anche quando i check deterministici sono verdi.

In tutti questi casi il problema non è semplicemente “un link sbagliato”: è una perdita di affidabilità della memoria come sistema operativo.

---

# 42.12 Relazioni con gli altri elementi WCM

PROT-013 non lavora isolatamente.

Si collega al **Memory Consolidation & Consistency Loop**, perché un delta materiale deve propagare l'analisi alle relazioni e alle viste realmente impattate.

Si collega al **Knowledge Integrity Assurance Loop**, che governa il pre-check, la classificazione delle anomalie, le eventuali repair allowlisted, il post-check e l'escalation.

Si collega inoltre al principio di retrieval progressivo: una memoria ben collegata rende più semplice raggiungere le fonti corrette senza caricare indiscriminatamente tutto il contesto.

Il confine di authority resta però invariato. Il Knowledge Steward può mantenere indici, link, relazioni già determinate, ledger e telemetria entro lo scope autorizzato; non può scegliere autonomamente quale versione semanticamente confliggente sia vera, cambiare il canone o inventare causalità.

---

# 42.13 Proporzionalità: non serve costruire una ragnatela ovunque

Il protocollo non impone la stessa infrastruttura a ogni contesto.

Un insieme piccolo e stabile può richiedere poche relazioni esplicite. Un sistema molto più articolato può aver bisogno di ledger, metriche e contratti di health più strutturati.

Il principio WCM non è “più struttura è sempre meglio”. È **struttura sufficiente a mantenere integrità e relazioni senza generare burocrazia sproporzionata**.

Per questo PROT-013 non trasforma il repository in un graph database e non considera obbligatorio un particolare strumento di visualizzazione. Le typed relations sono la sostanza; grafi e backlink sono possibili proiezioni utili agli esseri umani.

La visualizzazione può aiutare a scoprire aree povere di connessioni, ma non autorizza a creare relazioni che non rappresentino fatti reali.

---

# 42.14 Maturity e limiti della baseline

La baseline corrente di PROT-013 è:

`ACTIVE / CONTROLLED AUTO-REPAIR V1 / FIELD VALIDATION`.

Questo significa che il protocollo è attivo e contiene già una baseline governata per sinapsi, Knowledge Health e auto-repair controllato, ma la validazione sul campo è ancora parte del percorso di maturazione.

Non va quindi interpretato come prova che ogni tipo di memoria, ogni dominio o ogni possibile relazione possa già essere gestito automaticamente.

La baseline corrente limita intenzionalmente l'auto-repair a classi esplicite e meccaniche. Per arrivare a una validazione più forte, il protocollo richiede evidenze reali: capacità di intercettare drift, mantenere relazioni senza costo sproporzionato, produrre telemetria affidabile, evitare loop di modifica e dimostrare sia una repair meccanica corretta sia la capacità di **non** riparare automaticamente un problema semantico.

Questa distinzione è essenziale: maturità non significa eliminare tutti i gate, ma dimostrare che il sistema sa anche quando fermarsi.

---

# 42.15 La regola da ricordare

Se dovessimo ridurre PROT-013 a una sola regola, sarebbe questa:

> **Quando cambia qualcosa di importante, non controllare soltanto il nodo cambiato: controlla le relazioni che rendono quel nodo parte della memoria. Ripara automaticamente solo ciò che ha una soluzione unica, deterministica e autorizzata; tutto il resto deve restare visibile e passare al gate corretto.**

È qui che una raccolta di informazioni comincia a diventare una memoria organizzativa affidabile: non perché ricorda tutto, ma perché sa mantenere vivo e verificabile il significato delle connessioni che servono davvero.

---

## Source Map

Fonte tecnica primaria:

- `wcm/process-book/protocols/PROT-013_KNOWLEDGE_SYNAPSE_HEALTH_STANDARD.md` — versione 1.1, baseline `ACTIVE / CONTROLLED AUTO-REPAIR V1 / FIELD VALIDATION`.

Indice operativo consultato tramite INDEX-FIRST:

- `wcm/process-book/README.md`;
- `wcm/process-book/PROCESS_REGISTER.md`.

Riferimenti richiamati dalla fonte primaria e utilizzati solo per inquadrare le relazioni operative già definite:

- `PROC-006 — Memory Consolidation & Consistency Loop`;
- `PROC-008 — Knowledge Integrity Assurance Loop`;
- `DEC-007 — Knowledge Integrity Assurance Baseline`;
- `DEC-008 — Knowledge Steward Controlled Auto-Repair`.

Il capitolo è una spiegazione editoriale della baseline corrente e non introduce nuovi processi, protocolli, stati, authority o repair class.
