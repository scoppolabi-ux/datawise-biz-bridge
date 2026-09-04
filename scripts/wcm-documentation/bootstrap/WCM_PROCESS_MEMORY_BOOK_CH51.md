# Capitolo 51 — La matrice Processi × Protocolli

**PARTE VIII — Come processi e protocolli lavorano insieme**  
**Stato:** FROZEN  
**Data:** 2026-09-03  
**Scope:** WCM generale, domain-agnostic

---

Nel capitolo precedente abbiamo visto che il WCM non funziona come una catena rigida di istruzioni. Una richiesta può attivare un processo principale, richiamare altri processi, incontrare gate, attraversare loop e, nello stesso tempo, essere vincolata da protocolli trasversali.

Questa struttura è più vicina a una rete governata che a una procedura lineare. Ma una rete pone immediatamente un problema pratico: **come facciamo a sapere quali protocolli riguardano un determinato processo?**

È qui che diventa utile la matrice Processi × Protocolli.

La matrice non aggiunge nuovi processi e non inventa nuove regole. È una rappresentazione delle relazioni tra elementi che esistono già. Serve a rendere leggibile una domanda fondamentale:

> quando un processo è in esecuzione, quale ruolo può avere ciascun protocollo?

La risposta non è sempre “si applica” oppure “non si applica”. Le relazioni possono avere natura diversa. Per questo la matrice usa una classificazione più ricca.

---

## 51.1 Due assi, una sola domanda

Immaginiamo una tabella. Sulle righe mettiamo i processi WCM. Sulle colonne mettiamo i protocolli. Ogni incrocio è una cella.

```text
                    PROTOCOLLI
               P1   P2   P3   P4   ...
PROCESSI
PROC-001       [ ]  [ ]  [ ]  [ ]
PROC-002       [ ]  [ ]  [ ]  [ ]
PROC-003       [ ]  [ ]  [ ]  [ ]
...
```

La cella non dice semplicemente se i due elementi “sono collegati”. Dice **che tipo di relazione operativa esiste nel contesto considerato**. Un protocollo può essere sempre necessario per una certa operazione, necessario soltanto quando compare una particolare condizione, invocato esplicitamente da un processo oppure usato come guardia che impedisce una transizione non sicura.

---

## 51.2 Le cinque classificazioni

L'indice editoriale del libro prevede cinque classi: **MANDATORY, CONDITIONAL, CALLED BY, GUARD, NOT APPLICABLE**.

### MANDATORY
Significa che, nel perimetro descritto dalla relazione, il protocollo costituisce una regola necessaria del percorso. Se il trigger del protocollo è intrinseco all'esecuzione considerata, ignorarlo renderebbe il percorso incompleto o non conforme.

### CONDITIONAL
Il protocollo diventa applicabile soltanto se si verifica una condizione specifica. Per esempio, un protocollo che governa una modifica persistente diventa pertinente quando quella specifica esecuzione sta realmente per produrre una persistent mutation.

### CALLED BY
Indica che il processo richiama esplicitamente il protocollo come parte del proprio funzionamento. È più forte di una semplice affinità concettuale: il protocollo è un componente dichiarato del percorso operativo.

### GUARD
Il protocollo svolge una funzione di controllo su una transizione, un'azione o una chiusura. È simile a una porta con un controllo di accesso: la porta non decide dove vuoi andare, ma impedisce di attraversare il confine quando le condizioni richieste non sono soddisfatte.

### NOT APPLICABLE
Nel contesto rappresentato non esiste una relazione operativa rilevante. Una buona architettura non cerca di collegare tutto a tutto: applicare ogni protocollo a ogni processo produrrebbe ritualismo procedurale.

---

## 51.3 La matrice non è una tabella di verità universale

La matrice non deve essere interpretata come una griglia eterna nella quale ogni cella possiede per sempre un unico valore indipendente dal contesto. Alcune relazioni sono strutturali. Altre dipendono dal tipo di esecuzione.

Un processo può, in una run, elaborare informazioni senza modificare alcuna fonte persistente: il protocollo di sicurezza delle persistent mutation non viene attivato. In una seconda run, lo stesso processo può arrivare a scrivere uno stato durevole: il trigger si materializza e il protocollo diventa applicabile.

Quindi la matrice ha due livelli di lettura:

1. **relazioni strutturali**, derivabili dalla baseline del metodo;
2. **relazioni contestuali**, determinate dal trigger concreto della run.

Il WCM evita così due errori opposti: dimenticare una regola necessaria oppure applicare meccanicamente regole irrilevanti.

---

## 51.4 Una vista compatta della baseline editoriale

La baseline editoriale di questo libro descrive dodici processi, da PROC-001 a PROC-012, e i venti protocolli da PROT-001 a PROT-020. La baseline metodologica può evolvere nel tempo; il libro distingue quindi la fotografia editoriale approvata dalle evoluzioni successive del metodo.

Una matrice completa di 12 × 20 contiene 240 incroci. Stamparli tutti come una parete di sigle aiuterebbe poco il lettore. È più utile raggruppare i protocolli per funzione.

| Famiglia operativa | Protocolli della baseline editoriale | Domanda che presidiano |
|---|---|---|
| Sicurezza e baseline | PROT-001, PROT-006, PROT-017 | Possiamo operare o scrivere senza introdurre drift o mutazioni non controllate? |
| Chiusura e continuità | PROT-002, PROT-009, PROT-019 | Il lavoro può davvero fermarsi o dichiararsi concluso? |
| Capability e dispatch | PROT-003, PROT-004, PROT-011, PROT-018 | Chi deve eseguire, come evitare duplicati e come gestire dipendenze interne? |
| Conoscenza e decisioni | PROT-005, PROT-007, PROT-008, PROT-013, PROT-014 | Quali fonti servono, come cambiano decisioni e conoscenza, cosa impariamo? |
| Authority e delivery | PROT-010, PROT-012 | Come vengono ricevuti comandi autorevoli e verificata una delivery? |
| Documentazione e stato | PROT-015, PROT-016 | Le viste umane e lo stato derivato restano coerenti con le fonti? |
| Issue tecniche | PROT-020 | Una failure tecnica deterministica bloccante è osservabile e tracciata? |

Questa vista non sostituisce il routing. Serve a capire la topologia del sistema.

---

## 51.5 Come leggere le righe: il processo è il percorso principale

### PROC-005 — Agent-Ready Context Bootstrap
Il suo compito è ricostruire il contesto minimo sufficiente prima di operare. PROT-005, dedicato al retrieval progressivo INDEX-FIRST, ha una relazione strutturale forte. PROT-009 entra in gioco quando emerge un workflow incompleto da riprendere. Altri protocolli possono diventare pertinenti in base a ciò che il bootstrap scopre.

### PROC-006 — Memory Consolidation & Consistency Loop
Qui il percorso principale riguarda il passaggio di un delta materiale verso la memoria persistente e la verifica della coerenza. Diventano centrali i protocolli che presidiano relazioni, knowledge health, decision change e sicurezza delle scritture persistenti quando i rispettivi trigger sono presenti. “Consolidare memoria” non significa semplicemente salvare un testo.

### PROC-009 — WCM Learning Loop
Il Learning Loop trasforma esperienza ed evidence in candidate learning e, quando necessario, porta verso meccanismi di promozione controllata. La Method Experience Memory è parte naturale del percorso. Ma un apprendimento non acquisisce automaticamente authority per cambiare il metodo. **Imparare** e **avere authority per modificare** non sono la stessa cosa.

### PROC-011 — Deterministic State Reconciliation
Questo processo presidia la coerenza fra execution master, stato derivato e projection. PROT-016 è strettamente connesso perché definisce il contratto di stato e projection. Se la riconciliazione comporta una persistent mutation, anche la sicurezza della mutazione diventa pertinente.

### PROC-012 — WCM Change Propagation & Closure
Qui il sistema deve impedire che un cambiamento venga dichiarato chiuso prima che gli impatti previsti siano stati propagati e verificati. PROT-019 presidia direttamente la closure; PROT-015 diventa rilevante quando il change ha impatto documentale; PROT-007 quando cambia una decisione materiale; PROT-017 sulle scritture persistenti.

Non esiste quindi “il protocollo del processo”. Esiste una composizione governata di protocolli con ruoli differenti.

---

## 51.6 Come leggere le colonne: il protocollo attraversa più processi

Se leggiamo la matrice verticalmente, una colonna mostra **dove una stessa regola trasversale può ricomparire**.

PROT-005 può diventare pertinente ogni volta che un percorso deve recuperare conoscenza. PROT-009 attraversa i workflow che non devono interrompersi artificialmente al confine di una sessione. PROT-017 può entrare in molti processi diversi, ma soltanto quando esiste davvero una persistent mutation. PROT-019 è più specifico: presidia la closure dei WCM CHANGE materiali.

Il processo descrive principalmente **che lavoro stiamo facendo**. Il protocollo descrive principalmente **quale regola deve essere rispettata mentre quel lavoro viene fatto**.

---

## 51.7 La matrice come strumento di routing

```text
RICHIESTA
   ↓
GOAL + SCOPE + AUTHORITY + STATO
   ↓
PROCESSO PRINCIPALE
   ↓
TRIGGER OSSERVATI
   ↓
MATRICE PROCESSI × PROTOCOLLI
   ↓
PROTOCOLLI STRUTTURALI + CONDIZIONALI
   ↓
GATE / GUARD APPLICABILI
   ↓
ESECUZIONE
```

La matrice non sostituisce la comprensione del contesto. La organizza.

Il Cognitive Core può contribuire a interpretare intenzione, significato e condizioni non puramente meccaniche. Dove trigger e contratti sono strutturati, il Deterministic Core può verificare condizioni ripetibili senza affidarsi all'interpretazione libera dell'AI.

---

## 51.8 MANDATORY non significa “esegui tutto sempre”

Se un protocollo è mandatory **quando si verifica un certo trigger**, non significa che debba essere eseguito in ogni run dell'intero WCM.

Un controllo sulle persistent mutation è obbligatorio quando si effettua una persistent mutation. Un protocollo di closure è pertinente quando si sta tentando una closure.

Il principio è:

> obbligatorietà rispetto al trigger, non ritualismo rispetto all'esistenza del protocollo.

Questa distinzione permette al WCM di essere governato senza diventare burocratico.

---

## 51.9 La matrice deve poter evolvere

Processi e protocolli non sono necessariamente immobili. Un nuovo learning può mostrare che una relazione prima considerata occasionale è ricorrente. Un failure mode può rendere necessario un nuovo guard. Un protocollo può essere superseded. Un processo può evolvere.

Quando la baseline cambia con la necessaria authority, anche le relazioni devono essere riesaminate. Una matrice operativa deve quindi restare riconducibile alle fonti canoniche, agli status e alle relazioni correnti.

L'esperienza operativa ha qui un ruolo importante: successi e fallimenti possono fornire evidence per migliorare il modo in cui il sistema comprende le proprie relazioni. Ma l'esperienza non riscrive automaticamente la governance. Produce conoscenza; la promozione materiale resta governata.

---

## 51.10 Cosa ci fa vedere la matrice che i singoli documenti non mostrano

Leggere un processo alla volta permette di comprenderlo bene. Leggere un protocollo alla volta permette di comprenderne la regola. Ma nessuna delle due letture, da sola, mostra immediatamente la struttura complessiva delle interdipendenze.

La matrice fa emergere protocolli fortemente trasversali, protocolli specialistici, processi ad alta densità di governance e zone in cui una relazione è contestuale. Trasforma un catalogo di elementi in una **mappa di composizione operativa**.

---

## 51.11 Dal foglio a due dimensioni alla rete

La matrice ha un limite: è bidimensionale. Mette in relazione processi e protocolli, ma il WCM contiene anche richieste, decisioni, evidence, workflow, gate, stati, authority, documenti, learning e projection.

Per questo la matrice è un passaggio intermedio, non la rappresentazione finale dell'architettura procedurale. Il passo successivo consiste nel trasformare righe e colonne in **nodi e relazioni**. È ciò che faremo nel prossimo capitolo con la mappa dei nodi procedurali.

---

## 51.12 In sintesi

La matrice Processi × Protocolli permette di vedere il WCM come un sistema composto, non come una collezione di documenti indipendenti.

I processi descrivono i percorsi di lavoro. I protocolli introducono regole trasversali. Le celle descrivono il ruolo che una regola può assumere rispetto a un percorso: MANDATORY, CONDITIONAL, CALLED BY, GUARD oppure NOT APPLICABLE.

Alcune relazioni sono strutturali, altre dipendono dai trigger della singola esecuzione.

> **La matrice rende esplicita la composizione tra lavoro e regole, senza trasformare il WCM né in una sequenza rigida né in una rete priva di governo.**

Nel capitolo successivo passeremo dalla matrice bidimensionale alla mappa dei nodi procedurali, dove richiesta, processi, protocolli, gate, execution, consolidation e assurance potranno essere osservati come parti della stessa rete.