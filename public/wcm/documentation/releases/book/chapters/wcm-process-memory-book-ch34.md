# Capitolo 34 — PROT-005 — Index-First Progressive Retrieval

**PARTE VII — Il Libro dei Protocolli WCM**  
**Stato:** FROZEN  
**Data:** 2026-08-30  
**Scope:** WCM generale, domain-agnostic

---

# 34.0 Sapere dove guardare prima di cercare ovunque

Quando un sistema possiede poca conoscenza, il problema è trovare informazioni sufficienti.

Quando la conoscenza cresce, il problema cambia: diventa capire **quali informazioni leggere, in quale ordine e quando fermarsi**.

Una repository, una knowledge base o una memoria organizzativa possono contenere centinaia o migliaia di documenti tutti potenzialmente pertinenti. Leggerli indiscriminatamente può sembrare prudente, ma produce l'effetto opposto: aumenta il rumore, espone più facilmente a versioni storiche o contraddittorie, consuma tempo e rende più difficile distinguere ciò che è autorevole da ciò che è soltanto disponibile.

`PROT-005 — Index-First Progressive Retrieval` nasce per governare questo problema.

La sua idea centrale è semplice:

> **Non partire dalla massa della conoscenza. Parti dalla sua mappa, scendi solo quanto serve e fermati quando il contesto è sufficiente.**

Il protocollo non dice che bisogna leggere poco a ogni costo. Dice che ogni lettura deve avere una ragione collegata al lavoro corrente.

---

# 34.1 Il problema che PROT-005 risolve

Immaginiamo un archivio molto grande.

Una persona deve rispondere a una domanda precisa: qual è la procedura corrente per approvare una consegna?

Potrebbe aprire tutte le cartelle, leggere ogni documento che contiene la parola “approvazione”, confrontare vecchi appunti, bozze, verbali, prove e versioni superate. Alla fine avrebbe moltissime informazioni.

Ma avere più informazioni non significa necessariamente avere più chiarezza.

Tra quelle informazioni potrebbero esserci:

- una procedura corrente;
- una versione precedente ormai superata;
- una proposta mai approvata;
- un esperimento;
- una nota storica;
- un documento che usa la stessa parola con un significato diverso.

La difficoltà non è quindi soltanto **trovare** qualcosa. È **navigare la conoscenza rispettandone struttura, stato e autorità**.

PROT-005 riduce questo rischio imponendo una navigazione progressiva.

---

# 34.2 Index-first non significa “fidarsi dell'indice e basta”

La parola `INDEX-FIRST` può essere fraintesa.

Non significa che l'indice sia la verità finale.

Un indice è prima di tutto una **mappa**: aiuta a capire quali territori esistono e quale percorso è più plausibile per raggiungere la fonte necessaria.

La fonte autorevole può trovarsi più in profondità.

Per questo il protocollo distingue livelli di retrieval:

```text
L0 — ENTRY POINT
      ↓
L1 — INDEX / MAP
      ↓
L2 — ACTIVE AUTHORITY / PROCEDURE
      ↓ solo se necessario
L3 — EVIDENCE / HISTORY / RAW
```

L'entry point orienta.

L'indice indica dove guardare.

La baseline attiva o la procedura autorevole fornisce la regola corrente.

Evidence, storico e materiale raw servono quando occorre capire il perché, verificare un'affermazione, ricostruire un'evoluzione o risolvere una necessità che i livelli precedenti non soddisfano.

L'indice quindi **non sostituisce la fonte**. Evita di cercarla alla cieca.

---

# 34.3 Il trigger

PROT-005 si applica quando un agente cognitivo deve recuperare conoscenza persistente per comprendere o svolgere un task.

Il trigger può comparire in molti momenti:

```text
DEVO CAPIRE / AGIRE
      ↓
MI SERVE CONOSCENZA PERSISTENTE
      ↓
PROT-005
```

Un caso tipico è il bootstrap di una nuova run o di una nuova sessione. `PROC-005 — Agent-Ready Context Bootstrap` usa infatti PROT-005 per ricostruire il contesto minimo necessario senza caricare indiscriminatamente repository, knowledge base o storico.

Ma il protocollo non vale soltanto all'inizio. Può essere applicato ogni volta che, durante un lavoro, emerge una nuova informazione mancante.

---

# 34.4 Gli input

Per iniziare un retrieval progressivo non serve conoscere già tutto. Serve conoscere abbastanza da formulare la ricerca in modo orientato.

Gli input essenziali sono concettualmente:

- il task o la domanda da risolvere;
- il perimetro in cui si sta lavorando;
- il ruolo e l'authority pertinenti, quando rilevanti;
- l'entry point o l'indice appropriato;
- ciò che è già disponibile e affidabile nel contesto corrente;
- l'informazione che manca.

Quest'ultimo elemento è particolarmente importante.

Se non sappiamo dire **che cosa ci manca**, ogni documento diventa potenzialmente interessante e il retrieval tende ad allargarsi senza controllo.

---

# 34.5 Il flusso: scendere un livello alla volta

Il flusso di PROT-005 può essere letto come una serie di domande.

```text
TASK
  ↓
QUAL È L'ENTRY POINT CORRETTO?
  ↓
QUAL È L'INDICE / MAPPA PERTINENTE?
  ↓
QUAL È LA FONTE ATTIVA PIÙ AUTOREVOLE?
  ↓
IL CONTESTO È SUFFICIENTE?
  ├─ SÌ → STOP RETRIEVAL / AGISCI
  └─ NO
       ↓
   COSA MANCA?
       ↓
   SERVE DAVVERO SCENDERE PIÙ IN PROFONDITÀ?
       ├─ NO → STOP
       └─ SÌ → EVIDENCE / HISTORY / RAW MIRATI
```

Il punto decisivo non è il numero di file letti.

È il fatto che **ogni passaggio a un livello successivo sia motivato**.

Una contraddizione può richiedere una verifica.

Un dato assente può richiedere una fonte ulteriore.

Una richiesta di audit può richiedere una lettura ampia.

La semplice curiosità dell'agente, invece, non è una ragione sufficiente.

---

# 34.6 Il Retrieval Gate

Prima di aprire un nuovo documento, il protocollo pone quattro domande.

1. **Quale informazione manca?**
2. **Questo documento è probabilmente la fonte più autorevole per quell'informazione?**
3. **L'informazione è già disponibile in una fonte letta?**
4. **Il task richiede davvero questo livello di dettaglio?**

Queste domande formano il **Retrieval Gate**.

In pratica, il gate impedisce di trasformare il retrieval in accumulo.

Se un documento non è plausibilmente la fonte giusta, non va aperto soltanto perché è vicino semanticamente al tema.

Se il task non richiede quel dettaglio, non serve approfondire “per sicurezza”.

Se l'informazione è già disponibile da una fonte adeguata, una seconda lettura equivalente può aggiungere rumore senza aggiungere valore.

---

# 34.7 Stop When Sufficient

Una disciplina di retrieval è incompleta se spiega come iniziare ma non come fermarsi.

PROT-005 introduce per questo la regola **Stop When Sufficient**.

Nel contesto del protocollo, il retrieval può fermarsi quando sono sufficientemente chiari:

- authority pertinente;
- goal o task;
- input necessari;
- vincoli applicabili;
- exit condition o risultato atteso.

“Sufficiente” non significa “ho trovato una risposta plausibile”.

Significa che il contesto disponibile è abbastanza solido per svolgere il lavoro senza dover inventare ciò che manca.

È una differenza importante.

Fermarsi troppo presto produce decisioni fragili.

Fermarsi troppo tardi produce contesto sovraccarico.

PROT-005 cerca il punto in cui ulteriore lettura non è più giustificata dal task.

---

# 34.8 Più contesto non è sempre contesto migliore

Nei sistemi cognitivi è naturale pensare che fornire più materiale migliori automaticamente il risultato.

Non è sempre così.

Un contesto molto grande può contenere elementi:

- irrilevanti;
- duplicati;
- superati;
- non autorevoli;
- appartenenti a un altro perimetro;
- apparentemente simili ma semanticamente incompatibili.

Il problema è simile a quello di una riunione in cui, per prendere una decisione semplice, vengono portati sul tavolo dieci anni di documentazione. La quantità può rendere più difficile vedere la regola corrente.

Per questo l'anti-pattern esplicito del protocollo è:

> **“Per sicurezza leggo tutto.”**

La sicurezza non deriva dalla quantità di documenti letti. Deriva dalla qualità del percorso con cui sono state selezionate le fonti necessarie.

---

# 34.9 Source precedence: trovare non basta

PROT-005 non si limita a dire **dove cercare**. Richiede anche di distinguere il peso delle fonti.

Una bozza recente non prevale automaticamente su una baseline approvata.

Un ricordo della sessione non sostituisce una fonte persistente autorevole.

Un esperimento interessante non diventa una regola solo perché ha prodotto un buon risultato.

Per questo il retrieval deve rispettare la source precedence applicabile al task.

Il principio generale è:

```text
AUTORITÀ / BASELINE CORRENTE
        ↓
PROCEDURA O CONTRATTO APPLICABILE
        ↓
STATO E DECISIONI PERTINENTI
        ↓
EVIDENCE / ESPERIMENTI
        ↓
CONCEPT / RAW / STORICO
```

La gerarchia concreta può essere più articolata in altri punti della baseline WCM; ciò che conta qui è il principio operativo: **la rilevanza semantica di una fonte non la rende automaticamente autorevole**.

---

# 34.10 Status matters

Due documenti possono parlare dello stesso argomento ma avere status diversi.

Per esempio:

```text
ACTIVE / VALIDATED
≠
OPEN
≠
CONCEPT
≠
EXPERIMENT
≠
SUPERSEDED
```

PROT-005 richiede che lo status venga considerato durante il retrieval.

Questo evita un errore molto comune: trovare un documento perfettamente pertinente e usarlo come regola corrente senza verificare se sia ancora valido.

Il retrieval quindi non è semplice ricerca testuale o semantica.

La ricerca può trovare documenti simili.

Il protocollo deve invece aiutare a capire **quale documento può essere usato per quel compito**.

---

# 34.11 Memory is not authority

La memoria della sessione è preziosa.

Può ricordare che un certo documento esiste, suggerire dove cercare, conservare il contesto recente e ridurre letture ridondanti.

Ma PROT-005 mantiene una separazione netta:

> **ricordare una cosa non equivale a possedere la fonte autorevole di quella cosa.**

La Working Memory può quindi guidare il retrieval, ma non sostituire automaticamente la persistenza autorevole quando il task richiede verifica.

Questo principio è particolarmente importante quando il contesto corrente contiene informazioni recenti ma non ancora consolidate, oppure quando una memoria precedente potrebbe riferirsi a una baseline ormai cambiata.

---

# 34.12 Delta preferred: nei follow-up non si ricomincia sempre da zero

Il retrieval progressivo non impone di rileggere lo stesso percorso completo a ogni interazione.

Quando una base affidabile è già disponibile, PROT-005 preferisce il **delta**: ciò che è cambiato rispetto allo stato già compreso.

Un esempio pedagogico.

Se una persona ha appena letto un regolamento e cinque minuti dopo riceve una modifica a un solo articolo, non è necessariamente utile rileggere l'intero regolamento da capo. Può essere più efficace verificare il delta, la sua authority e il suo impatto.

La stessa logica vale nel WCM: la memoria corrente può ridurre il lavoro di navigazione, purché non venga scambiata per authority e purché il cambiamento sia verificato nelle fonti persistenti pertinenti.

---

# 34.13 Project isolation: somiglianza non significa trasferibilità

Una fonte può sembrare perfettamente pertinente perché descrive un problema simile in un altro perimetro.

PROT-005 vieta di trasferire automaticamente quella conoscenza soltanto sulla base della somiglianza semantica.

Il motivo è semplice: due contesti possono condividere parole e problemi ma avere authority, vincoli, decisioni o baseline differenti.

L'isolamento del perimetro impedisce che la ricerca “trovi troppo bene” una soluzione appartenente al posto sbagliato.

La somiglianza può suggerire una pista.

Non crea da sola autorizzazione né validità.

---

# 34.14 Evidence on demand

Evidence, POC, materiale raw e storico sono importanti. PROT-005 non li considera conoscenza di serie B.

Stabilisce però **quando** aprirli.

Normalmente servono quando occorre:

- verificare perché una baseline esiste;
- controllare un'affermazione;
- ricostruire una decisione;
- confrontare alternative;
- promuovere evidence verso una baseline attraverso il processo appropriato;
- risolvere una contraddizione che le fonti correnti non chiariscono.

Non sono invece il bootstrap standard di ogni task.

La differenza è quella tra consultare l'archivio storico quando serve una prova e portare l'intero archivio sulla scrivania prima ancora di sapere quale domanda stiamo facendo.

---

# 34.15 Le eccezioni: quando leggere molto è corretto

PROT-005 non trasforma la lettura ampia in un divieto assoluto.

Esistono task in cui l'ampiezza è proprio parte dello scopo.

La baseline cita, tra gli altri:

- audit della knowledge base o della documentazione;
- ricognizione completa;
- migrazione o reindicizzazione;
- ricerca di contraddizioni trasversali;
- attività di Evidence → Baseline Promotion che richiedono confronto multiplo.

In questi casi leggere molto non è un'eccezione arbitraria. È una conseguenza del task.

Il discrimine è quindi:

```text
LETTURA AMPIA PERCHÉ IL TASK LA RICHIEDE
= AMMESSA

LETTURA AMPIA PERCHÉ “MAGARI SERVE”
= ANTI-PATTERN
```

---

# 34.16 No silent conflict resolution

La navigazione progressiva può portare a due fonti entrambe apparentemente autorevoli ma in conflitto.

PROT-005 stabilisce che l'agente non deve risolvere silenziosamente il conflitto scegliendo, mediando o fondendo le due versioni a intuito.

Il comportamento corretto è riconoscere il conflitto e applicare l'escalation o il processo pertinente.

Questo è un punto fondamentale perché il retrieval non possiede authority semantica autonoma.

Trovare due fonti non autorizza l'agente a inventare una terza verità.

---

# 34.17 Output

PROT-005 non richiede necessariamente la creazione di un documento.

Il suo output principale è un **contesto sufficiente e selezionato**, ottenuto attraverso un percorso tracciabile nella logica:

```text
ENTRY POINT
→ INDEX
→ FONTI ATTIVE NECESSARIE
→ EVENTUALE APPROFONDIMENTO MOTIVATO
→ CONTEXT SUFFICIENT
```

In un'esecuzione concreta, l'output può essere semplicemente la capacità di procedere correttamente con il task successivo.

Quando utile, può essere anche accompagnato dalla traccia delle fonti effettivamente lette e dei gap rimasti aperti.

---

# 34.18 Failure mode

I principali failure mode del protocollo sono facili da riconoscere proprio perché assomigliano a comportamenti apparentemente prudenti.

**Leggere tutto per sicurezza.** Il contesto cresce senza un bisogno task-specifico.

**Partire da raw o storico.** Il retrieval salta la baseline attiva e rischia di trattare materiale precedente come corrente.

**Confondere pertinenza e authority.** Un documento parla esattamente del tema ma non ha lo status o l'autorità per governarlo.

**Continuare dopo la sufficienza.** L'agente ha già ciò che serve ma amplia ancora il contesto.

**Usare la memoria come source of truth.** Un ricordo plausibile sostituisce una verifica necessaria.

**Risolvere silenziosamente conflitti.** Due fonti divergono e l'agente sceglie senza authority.

**Importare conoscenza da un altro perimetro.** La somiglianza viene scambiata per trasferibilità.

**Rileggere tutto nei follow-up.** Si ignora il delta e si ricostruisce inutilmente l'intero contesto.

---

# 34.19 Relazioni con gli altri elementi WCM

PROT-005 è strettamente collegato a `PROC-005 — Agent-Ready Context Bootstrap`.

PROC-005 stabilisce **che cosa deve sapere un agente per poter iniziare o riprendere correttamente un lavoro**. PROT-005 governa **come recuperare la conoscenza necessaria senza caricare indiscriminatamente tutto ciò che esiste**.

La relazione può essere sintetizzata così:

```text
PROC-005
“Quale contesto devo ricostruire?”
        ↓
PROT-005
“Come lo recupero in modo progressivo e task-scoped?”
```

Il protocollo è inoltre collegato alla knowledge architecture Agent-Ready e al processo Evidence → Baseline Promotion, nel quale una lettura più ampia può essere giustificata dal confronto necessario tra evidenze.

PROT-005 non sostituisce source precedence, authority, processi di consolidamento o processi decisionali. Li raggiunge attraverso una navigazione disciplinata.

---

# 34.20 Maturity e limiti

La baseline canonica qualifica `PROT-005` come:

**VALIDATED BY GOVERNANCE / FIELD VALIDATION IN PROGRESS**.

Questo significa che il protocollo è parte della baseline WCM corrente ed è stato validato a livello di governance, mentre la validazione sul campo continua.

Non significa che sia stata dimostrata universalmente, in ogni organizzazione, repository, modello AI o scala operativa, una riduzione misurata di token, latenza o contraddizioni.

Il protocollo indica infatti metriche future utili — per esempio file letti per task, token di bootstrap, percentuale di fonti realmente usate, tempo al primo atto utile e conflitti intercettati — proprio perché la misurazione empirica può essere ulteriormente consolidata.

Un altro limite è importante: PROT-005 disciplina la **navigazione** della conoscenza, non rende automaticamente corretta l'interpretazione semantica di ciò che viene letto.

Riduce il rischio di contesto sbagliato. Non elimina il bisogno di reasoning, authority e gate appropriati.

---

# 34.21 La regola da ricordare

Se di questo capitolo dovesse restare una sola idea, dovrebbe essere questa:

> **Non leggere tutto ciò che puoi leggere. Leggi ciò che serve, partendo dalla mappa più autorevole, scendendo solo quando manca qualcosa e fermandoti quando il contesto è sufficiente.**

È questo il cuore di `PROT-005 — Index-First Progressive Retrieval`.

---

## Source map editoriale

Fonti canoniche utilizzate per il Technical Truth Pass:

- `WCM_AGENT_START.md`;
- `wcm/documentation/process-memory-book/BOOK_INDEX.md`;
- `wcm/documentation/process-memory-book/BOOK_STATUS.md` come bookkeeping derivato;
- `wcm/process-book/protocols/PROT-005_INDEX_FIRST_PROGRESSIVE_RETRIEVAL.md`;
- `wcm/process-book/processes/PROC-005_AGENT_READY_CONTEXT_BOOTSTRAP.md` per la relazione bootstrap/retrieval;
- CH33 FROZEN e relative Technical/Human Comprehension Review per continuità editoriale.

**Maturity qualifier:** `PROT-005 = VALIDATED BY GOVERNANCE / FIELD VALIDATION IN PROGRESS`; nessuna estensione del claim oltre il perimetro documentato.