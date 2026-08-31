# Capitolo 37 — PROT-008 — Owner Source Intake Gate

**PARTE VII — Il Libro dei Protocolli WCM**  
**Stato:** FROZEN  
**Data:** 2026-08-31  
**Scope:** WCM generale, domain-agnostic

---

# 37.0 Prima di dichiarare che manca qualcosa, chiedere che cosa esiste già

Quando un'organizzazione avvia un nuovo lavoro, è facile partire da ciò che il sistema vede in quel momento. Se una cartella è vuota, se un indice non contiene documenti o se una base di conoscenza è appena stata creata, si può concludere troppo rapidamente che le informazioni non esistano.

Ma un progetto può avere una storia precedente al sistema che lo sta prendendo in carico.

Documenti, note, decisioni, bozze, presentazioni, fogli di calcolo, messaggi, analisi o materiali di riferimento possono esistere già, magari in luoghi diversi e senza una struttura coerente. Il fatto che non siano ancora stati organizzati nel WCM non significa che non esistano.

`PROT-008 — Owner Source Intake Gate` nasce per evitare proprio questo errore.

La sua idea centrale è semplice:

> **Prima di dichiarare un source gap o costruire una memoria iniziale incompleta, il WCM deve chiedere esplicitamente all'owner quali materiali esistono già.**

Il protocollo non chiede all'owner di organizzare il sistema. Chiede di rendere visibile il patrimonio informativo già disponibile; sarà poi il WCM a registrarlo, classificarlo e inserirlo nel contesto corretto.

---

# 37.1 Il problema che PROT-008 risolve

Immaginiamo di iniziare un'attività sulla base di tre documenti presenti in una nuova area di lavoro.

Il sistema li legge, li considera sufficienti e costruisce una prima rappresentazione del progetto. Solo più tardi emerge che esisteva già una decisione precedente, contenuta in un documento non ancora consegnato, che cambia il significato di una parte del lavoro.

A quel punto il problema non è soltanto che mancava un file.

Il problema è che il sistema ha costruito una memoria iniziale assumendo, senza verificarlo, che ciò che vedeva fosse tutto ciò che esisteva.

PROT-008 introduce quindi una distinzione fondamentale:

```text
NON VISIBILE AL SISTEMA
        ≠
NON ESISTENTE
```

Il protocollo serve a colmare questo spazio prima che il WCM trasformi una visibilità parziale in una conclusione organizzativa.

---

# 37.2 Quando si applica

Il protocollo canonico prevede tre trigger principali.

Si applica quando:

- un nuovo progetto viene ammesso nel WCM;
- un progetto storico viene ripreso per la prima volta con WCM;
- un progetto entra in un nuovo operating model e la Project KB non rappresenta ancora il patrimonio reale disponibile.

Il denominatore comune è sempre lo stesso: esiste un momento di ingresso o di re-ingresso nel quale la memoria organizzativa WCM potrebbe non conoscere ancora tutte le fonti già disponibili presso l'owner.

PROT-008 non è quindi un rituale da ripetere indiscriminatamente in ogni attività. È un gate di intake legato alla costruzione o ricostruzione della baseline informativa iniziale.

---

# 37.3 Che cosa significa “owner source intake”

L'espressione può sembrare tecnica, ma il concetto è quotidiano.

Prima di iniziare a ricostruire una storia, si chiede a chi la possiede:

> **“Quali materiali esistono già?”**

Questa domanda non implica che l'owner debba conoscere la struttura WCM, nominare correttamente ogni file o stabilire da solo quali documenti siano canonici.

Può semplicemente consegnare ciò che ha.

Il WCM si assume poi il lavoro di:

- identificare le fonti;
- registrarne la provenienza;
- distinguere versioni e stati quando noti;
- rilevare discrepanze;
- applicare source precedence;
- capire quali materiali siano pertinenti alla fase corrente.

Questa separazione è importante perché riduce il carico umano senza togliere all'owner il ruolo essenziale di dichiarare il patrimonio informativo che il sistema non può conoscere da solo.

---

# 37.4 Gli input del gate

Per applicare PROT-008 servono pochi input concettuali, ma devono essere chiari.

## Un progetto o contesto ammesso

Deve esistere una ragione autorizzata per costruire o ricostruire la memoria iniziale.

## Un owner identificabile

Deve essere chiaro chi può dichiarare quali fonti e materiali preesistono per la fase corrente.

## Il patrimonio già visibile

Il WCM può già avere accesso a documenti o fonti. Questi costituiscono un punto di partenza, non una prova che non esista altro.

## La domanda di intake

L'owner deve ricevere una richiesta esplicita sui materiali disponibili.

L'elemento decisivo è proprio quest'ultimo. La ricerca autonoma può integrare l'intake, ma non sostituirlo.

---

# 37.5 Il flusso completo

La sequenza canonica può essere letta così:

```text
PROJECT INTENT / BOARD GO
        ↓
OWNER SOURCE INTAKE
        ↓
“QUALI MATERIALI ESISTONO GIÀ?”
        ↓
OWNER DELIVERY
+
DIRECT RETRIEVAL COMPLEMENTARE
        ↓
SOURCE REGISTER / PROVENANCE
        ↓
CLASSIFICATION + PRECEDENCE
        ↓
PROJECT MEMORY BASELINE
        ↓
GOAL / ROADMAP
```

Il punto importante è l'ordine.

Prima si rende visibile il patrimonio informativo. Poi lo si registra e classifica. Solo dopo si costruisce una baseline abbastanza affidabile da alimentare goal, roadmap e lavoro successivo.

Questo non significa che ogni documento debba essere letto integralmente prima di procedere. PROT-008 lavora insieme a `PROT-005 — Index-First Progressive Retrieval`: raccogliere l'esistenza delle fonti non equivale a caricarne indiscriminatamente tutto il contenuto nel contesto.

---

# 37.6 L'owner non deve pre-organizzare il materiale

Una delle failure mode esplicitamente evitate dal protocollo è trasformare l'intake in un compito amministrativo per l'owner.

Il sistema non dovrebbe chiedere:

> “Prima di consegnarmi i materiali, costruisci cartelle, indici, tassonomie e naming convention.”

Se questa organizzazione può essere svolta dal WCM, deve essere il WCM a farla.

L'owner può consegnare file e documenti nello stato in cui si trovano.

Questo non significa accettare tutto senza controllo. Significa separare due responsabilità:

```text
OWNER
→ rende disponibile il patrimonio reale

WCM
→ organizza, registra, classifica, verifica
```

La distinzione rende il gate utile senza renderlo burocratico.

---

# 37.7 La ricerca autonoma è complementare, non sostitutiva

Il WCM può avere accesso diretto ad alcune fonti e può cercarle autonomamente per ridurre il lavoro umano.

Questa capacità è utile, ma PROT-008 stabilisce un limite importante: la ricerca autonoma non sostituisce la richiesta esplicita all'owner.

Perché?

Perché nessun motore di ricerca interno può garantire di conoscere materiali conservati fuori dal proprio raggio di accesso.

Un sistema potrebbe trovare dieci documenti e ignorare l'undicesimo, che esiste ma non è accessibile. Se considera la propria ricerca come prova di completezza, trasforma un limite di visibilità in una falsa certezza.

Per questo la combinazione corretta è:

```text
INTAKE ESPLICITO DELL'OWNER
+
RETRIEVAL DIRETTO COMPLEMENTARE
```

Non è necessario chiedere all'owner di recuperare manualmente qualcosa che il sistema può già ottenere. Ma è necessario chiedergli se esistono altre fonti rilevanti che il sistema potrebbe non vedere.

---

# 37.8 Registrare la provenance: sapere da dove arriva una fonte

Ricevere un documento non basta.

Perché possa entrare nella memoria organizzativa in modo utile, il WCM deve sapere almeno che cosa sia e da dove provenga.

Il protocollo canonico richiede, a livello minimo e quando le informazioni sono disponibili:

- identificativo;
- nome file o titolo interno;
- provenienza;
- data o versione nota;
- stato o authority dichiarati;
- funzione;
- precedence o supersession quando note;
- discrepanze rilevanti.

Per un lettore non tecnico, “provenance” significa semplicemente **tracciare l'origine e il contesto della fonte**.

Un documento senza provenance può essere corretto, ma è più difficile capire che peso attribuirgli, se sia ancora corrente e con quali altre fonti debba essere confrontato.

---

# 37.9 Nome, metadati e contenuto sono segnali diversi

Un file può chiamarsi “finale” e contenere una bozza.

Può avere una data recente ma riportare nel testo una decisione più vecchia.

Può essere stato consegnato dall'owner ma dichiarare al proprio interno di essere soltanto una proposta.

PROT-008 vieta di risolvere queste divergenze in silenzio.

Nome file, metadati e contenuto sono segnali distinti. Se non coincidono, la discrepanza deve diventare visibile.

Questo principio evita un errore molto comune: correggere mentalmente l'incoerenza e poi registrare soltanto la versione “che sembra giusta”.

Il WCM deve invece preservare ciò che sa e ciò che non sa.

---

# 37.10 Consegnato dall'owner non significa automaticamente canonico

Questo è uno dei gate concettuali più importanti del protocollo.

Una fonte consegnata direttamente dall'owner ha una provenance forte: sappiamo da chi arriva.

Ma la provenance non determina automaticamente lo status.

Un file può essere:

- una bozza;
- una proposta;
- una versione superata;
- un documento informativo;
- una decisione;
- una baseline attiva;
- un artefatto storico.

Per questo vale la distinzione:

```text
OWNER DELIVERY
        ≠
AUTOMATIC CANONIZATION
```

L'authority deriva dal contenuto dichiarato e/o da una decisione competente, non dal semplice fatto che il file sia stato consegnato dall'owner.

Questa regola impedisce al processo di intake di trasformarsi, accidentalmente, in un processo di approvazione.

---

# 37.11 Il gate non deve diventare infinito

Un protocollo pensato per evitare una baseline incompleta potrebbe produrre il problema opposto: impedire qualsiasi avanzamento finché non esiste la certezza assoluta che nessun'altra fonte possa emergere.

PROT-008 lo evita esplicitamente.

Il gate può essere superato quando l'owner dichiara che, per la fase corrente, non esistono altre fonti oppure che quelle disponibili sono state consegnate.

Non serve dimostrare l'inesistenza universale di altri documenti.

Serve eliminare un **source gap noto che impedisca materialmente la next action**.

La differenza è sostanziale.

Il WCM cerca sufficienza operativa, non onniscienza.

---

# 37.12 Se una nuova fonte emerge dopo

Superare il gate non rende la baseline immutabile.

Un documento può emergere più tardi. Una persona può ricordare l'esistenza di una vecchia analisi. Una fonte può diventare accessibile in un secondo momento.

Il protocollo prevede che venga acquisita con lo stesso standard di provenance.

La sua comparsa non invalida retroattivamente il launch solo perché non era nota prima.

Naturalmente, se la nuova fonte contiene informazioni materiali in conflitto con la baseline corrente, quel conflitto dovrà essere governato dai processi e protocolli applicabili. Ma PROT-008 non introduce da solo una regola di invalidazione automatica.

Questo permette al sistema di restare aperto a nuova conoscenza senza rendere impossibile iniziare a lavorare.

---

# 37.13 Un esempio pedagogico

Immaginiamo che un'organizzazione debba riprendere un'attività iniziata mesi prima.

Nel nuovo workspace sono presenti due documenti: una descrizione generale e una lista di attività.

Prima di considerarli la baseline completa, il WCM chiede all'owner se esistano altri materiali rilevanti.

L'owner risponde che esistono anche:

- una presentazione precedente;
- alcune note decisionali;
- un foglio con dati di partenza.

Il WCM può quindi registrare l'esistenza e la provenance di queste fonti, capire quali siano pertinenti e recuperare progressivamente soltanto ciò che serve.

Se la presentazione si chiama “FINAL” ma nel contenuto è marcata “DRAFT”, la discrepanza viene registrata invece di decidere silenziosamente quale etichetta sia corretta.

L'esempio è puramente pedagogico. Non aggiunge categorie o obblighi ulteriori rispetto al protocollo canonico.

---

# 37.14 Gate e decision point

Il protocollo contiene alcuni decision point semplici ma essenziali.

## L'owner è stato interpellato?

Se no, non è corretto dichiarare che il patrimonio disponibile è stato verificato.

## L'owner ha consegnato o dichiarato le fonti disponibili per la fase corrente?

Se no, il gate non è ancora superato.

## Le fonti ricevute sono registrate con provenance sufficiente?

Se no, il WCM possiede materiale ma non ancora una baseline informativa governabile.

## Esistono discrepanze?

Se sì, devono essere visibili; non vanno risolte silenziosamente.

## Esiste un source gap noto che blocca materialmente la next action?

Se sì, il gate resta aperto per quel motivo concreto.

Se no, il WCM può procedere.

---

# 37.15 Output del protocollo

PROT-008 non produce necessariamente un singolo documento.

Il suo output reale è una condizione organizzativa verificabile:

- l'owner è stato esplicitamente coinvolto nell'intake;
- i materiali disponibili per la fase corrente sono stati consegnati o dichiarati;
- le fonti ricevute hanno provenance sufficiente per il bootstrap;
- le discrepanze conosciute sono visibili;
- non resta un source gap noto che impedisca materialmente l'azione successiva.

A questo punto la Project Memory Baseline può essere costruita su basi più affidabili.

---

# 37.16 Failure mode

Le failure mode canoniche mostrano bene che cosa PROT-008 vuole evitare.

## Dichiarare “documento mancante” senza aver chiesto all'owner

È una conclusione non supportata: il sistema conosce soltanto ciò che riesce a vedere.

## Scaricare sull'owner il lavoro di organizzazione

Chiedere all'owner di costruire manualmente strutture che il WCM può produrre da solo trasforma il gate in burocrazia.

## Promuovere automaticamente una fonte a canone

La consegna non equivale ad approvazione.

## Ignorare un file perché il nome non coincide con il contenuto

La divergenza è informazione da registrare, non motivo per eliminare una fonte senza analisi.

## Correggere silenziosamente titoli, versioni o funzioni discordanti

Nasconde incertezza e rende la memoria meno auditabile.

## Leggere indiscriminatamente tutto

L'intake serve a sapere che cosa esiste; il retrieval progressivo decide poi che cosa è necessario leggere.

---

# 37.17 Relazioni con gli altri elementi WCM

PROT-008 non opera isolatamente.

È collegato a:

- `PROC-005 — Agent-Ready Context Bootstrap`, perché una memoria iniziale affidabile migliora il contesto disponibile al sistema;
- `PROC-006 — Memory Consolidation Loop`, perché le fonti e le informazioni materiali devono entrare nella memoria persistente in modo controllato;
- `PROT-005 — Index-First Progressive Retrieval`, perché conoscere il patrimonio non significa leggerlo tutto;
- `DEC-006 — Owner Source Intake Gate`, che costituisce una fonte decisionale collegata al protocollo;
- i concetti Agent-Ready Knowledge Architecture e Dual-Memory Cognitive Continuity richiamati dal protocollo canonico.

Il ruolo specifico di PROT-008 resta però circoscritto: **assicurare che il sistema non costruisca una baseline iniziale ignorando il patrimonio informativo già disponibile presso l'owner.**

---

# 37.18 Maturity e limiti

La baseline canonica di PROT-008 è qualificata come:

`VALIDATED BY GOVERNANCE / FIELD VALIDATION IN PROGRESS`

Questo significa che il protocollo è parte della baseline governata corrente, mentre la sua validazione sul campo è ancora in corso.

Non significa che il protocollo sia stato dimostrato universalmente ottimale in ogni organizzazione, dominio, scala o configurazione tecnica.

Esistono inoltre limiti intrinseci che il protocollo non pretende di eliminare:

- l'owner può non ricordare immediatamente tutte le fonti;
- alcune fonti possono essere temporaneamente inaccessibili;
- la provenance può essere incompleta;
- una discrepanza può richiedere authority o analisi ulteriori;
- una nuova fonte può emergere dopo il gate.

PROT-008 non promette completezza assoluta. Riduce invece il rischio di confondere una memoria appena costruita con l'intero patrimonio informativo realmente esistente.

---

# 37.19 Source map del capitolo

Fonte tecnica primaria:

- `wcm/process-book/protocols/PROT-008_OWNER_SOURCE_INTAKE_GATE.md`

Mapping editoriale:

- `wcm/documentation/process-memory-book/BOOK_INDEX.md` → CH37 = `PROT-008 — Owner Source Intake Gate`.

Bootstrap e contesto metodologico minimo:

- `WCM_AGENT_START.md`, per source precedence, authority, INDEX-FIRST e distinzione WCM RUN / WCM CHANGE.

Il capitolo non introduce nuovi stati, gate, authority, processi o protocolli rispetto alle fonti sopra indicate.

---

# 37.20 La regola da ricordare

Il significato operativo di PROT-008 può essere ricordato così:

> **Prima di concludere che una fonte manca, chiedi che cosa esiste già; poi registra e classifica senza trasformare la consegna in approvazione.**

Il WCM non deve sapere tutto prima di iniziare.

Deve però evitare di scambiare ciò che non vede per ciò che non esiste.