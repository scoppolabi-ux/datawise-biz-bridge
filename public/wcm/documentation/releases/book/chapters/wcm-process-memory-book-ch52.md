# Capitolo 52 — La mappa dei nodi procedurali

**PARTE VIII — Come processi e protocolli lavorano insieme**  
**Stato:** FROZEN  
**Data:** 2026-09-03  
**Scope:** WCM generale, domain-agnostic

---

Nel capitolo precedente abbiamo osservato processi e protocolli attraverso una matrice. La matrice risponde bene a una domanda: **quale tipo di relazione può esistere tra un processo e un protocollo?**

Ma il lavoro reale non arriva al WCM sotto forma di una riga e una colonna. Arriva come richiesta, continuazione di un workflow, decisione, anomalia, evidenza o cambiamento. Per capire come questi elementi si muovono nel sistema serve quindi una seconda rappresentazione: **la mappa dei nodi procedurali**.

La mappa non introduce una nuova authority e non sostituisce processi, protocolli o fonti canoniche. È una vista pedagogica della loro topologia: mostra quali nodi possono comparire nel percorso e perché il WCM assomiglia più a una rete governata che a una procedura lineare.

---

## 52.1 Che cos'è un nodo procedurale

Un nodo procedurale è un punto del percorso nel quale il sistema deve **capire qualcosa, verificare una condizione, applicare una regola, eseguire un lavoro o consolidarne gli effetti**.

Non coincide necessariamente con un file o con un singolo componente software. È prima di tutto una funzione logica nel percorso operativo.

Per esempio, “verificare se esiste un workflow incompleto” è un nodo procedurale. Anche “stabilire se la richiesta è RUN o CHANGE”, “controllare l'authority”, “eseguire”, “verificare la closure” e “consolidare un delta materiale” sono nodi.

Questo modo di vedere il sistema è utile perché sposta l'attenzione dalla domanda «quale documento devo aprire?» alla domanda più importante:

> **in quale punto del lavoro mi trovo, e quale condizione devo soddisfare per attraversarlo correttamente?**

---

## 52.2 La mappa minima

Una vista molto compatta del percorso è questa:

```text
RICHIESTA / EVENTO / WORKFLOW DA RIPRENDERE
                  ↓
              BOOTSTRAP
                  ↓
        CONTESTO + AUTHORITY + STATO
                  ↓
               ROUTING
          ↙       ↓        ↘
      PROCESSI  PROTOCOLLI  GUARD/GATE
          \        |        /
                  ↓
              EXECUTION
                  ↓
          COMPLETION GATE
             ↙         ↘
        CONTINUA       STOP REALE
                         ↓
                  CONSOLIDATION
                         ↓
                     ASSURANCE
                         ↓
                 MEMORIA COERENTE
```

Questa figura non va letta come una sequenza obbligatoria in cui ogni richiesta attraversa sempre ogni casella. Alcuni nodi sono condizionali, alcuni possono richiamarne altri, alcuni generano loop e alcuni possono impedire la transizione.

Il valore della mappa sta proprio nel rendere visibili **i confini decisionali e di controllo**.

---

## 52.3 Primo nodo: richiesta, evento o continuità

Il percorso può iniziare da una richiesta esplicita, ma non solo.

Un heartbeat può riattivare un'attività. Un evento può rendere disponibile una dipendenza. Un workflow persistente può risultare incompleto. Una nuova evidenza può richiedere valutazione. In tutti questi casi il WCM deve evitare un errore comune: comportarsi come se ogni attivazione fosse un lavoro completamente nuovo.

Per questo il bootstrap controlla prima la continuità. Se esiste un workflow `ACTIVE` o `INTERRUPTED_RESUMABLE` che non ha raggiunto la propria true stop condition, la **Resume Priority** orienta il sistema verso la ripresa del lavoro già autorizzato.

La continuità, quindi, non è un dettaglio successivo. È uno dei primi nodi della mappa.

---

## 52.4 Bootstrap: sapere abbastanza prima di agire

Il bootstrap serve a ricostruire il contesto minimo sufficiente. Non significa caricare tutta la memoria persistente.

Il sistema deve arrivare a conoscere almeno ciò che serve per operare in sicurezza: ruolo, progetto o scope, authority, stato esecutivo, eventuale workflow da riprendere, processi e protocolli pertinenti, transizione successiva e vera condizione di stop.

Qui INDEX-FIRST svolge una funzione essenziale. Il retrieval procede dalle fonti più adatte e si ferma quando il contesto è sufficiente. La mappa mostra quindi una relazione importante:

```text
BOOTSTRAP
   ↓
INDEX-FIRST RETRIEVAL
   ↓
CONTEXT SUFFICIENCY
   ↓
ROUTING
```

L'indice aiuta a trovare. Non decide al posto dell'authority e non trasforma automaticamente ciò che trova in verità corrente.

---

## 52.5 Routing: dal significato alle regole applicabili

Una volta ricostruito il contesto, il WCM deve capire che tipo di percorso sta affrontando.

Qui entrano domande come:

- qual è l'intenzione della richiesta?
- qual è lo scope?
- quale authority è disponibile?
- si tratta di una normale esecuzione o di un cambiamento materiale?
- quale processo rappresenta il lavoro principale?
- quali protocolli diventano applicabili per trigger?
- esistono guard o gate che devono essere superati?

Il routing non è una scelta di un singolo file. È la costruzione del **percorso applicabile**.

La matrice del capitolo 51 aiuta a comprendere le possibili relazioni. La mappa dei nodi aggiunge la dimensione temporale: mostra **quando** quelle relazioni entrano nel flusso.

---

## 52.6 Processi e protocolli non occupano lo stesso posto

Un processo descrive principalmente un lavoro organizzato. Un protocollo impone o disciplina una regola che può attraversare più lavori.

Per questo nella mappa non conviene disegnarli come una lunga catena del tipo:

```text
PROC-001 → PROC-002 → PROC-003 → ...
```

Sarebbe fuorviante.

È più corretto immaginare un processo principale attraversato da regole trasversali:

```text
                 PROTOCOLLO A
                     ↓
INPUT → [ PROCESSO PRINCIPALE ] → OUTPUT
            ↑              ↑
       PROTOCOLLO B      GUARD C
```

Un protocollo può essere obbligatorio, condizionale, esplicitamente richiamato oppure svolgere funzione di guard. La sua presenza dipende dal contratto e dal trigger reale, non dalla semplice vicinanza grafica.

---

## 52.7 Gate e guard: i confini che non si attraversano per intuizione

Un gate rappresenta un punto in cui il sistema deve verificare una condizione prima di procedere. Alcuni gate riguardano l'authority, altri la sufficienza del contesto, la sicurezza di una mutazione, l'accettazione del risultato o la closure.

Il principio è semplice:

```text
TRANSIZIONE DESIDERATA
        ↓
      GATE
   ↙       ↘
 PASS      FAIL / WAIT
  ↓           ↓
PROSEGUI    NON ATTRAVERSARE
```

Questa struttura riduce una delle fragilità tipiche dei sistemi basati soltanto sulla cognizione: la tentazione di “interpretare” una condizione mancante come se fosse soddisfatta.

Quando il requisito è strutturabile e verificabile meccanicamente, il WCM tende a preferire un controllo deterministico. Quando invece serve interpretare significato, contesto o intenzione, entra in gioco il Cognitive Core. I due ruoli non sono intercambiabili.

---

## 52.8 Execution: il centro non è sempre l'AI

Il nodo di execution è il punto in cui il lavoro viene effettivamente svolto. Ma “esecuzione” non significa automaticamente “chiedere a un modello AI”.

A seconda del compito, l'esecuzione può essere cognitiva, deterministica, diretta oppure affidata a un servizio specializzato. Il routing delle capability deve evitare sia deleghe inutili sia false dichiarazioni di impossibilità.

La mappa può quindi essere letta così:

```text
                 ROUTING
                    ↓
             CAPABILITY CHECK
          ↙          ↓          ↘
      COGNITIVE  DETERMINISTIC  SERVICE
          \          |          /
                    ↓
                 RESULT
```

La scelta del percorso dipende dal lavoro concreto. Il WCM non assume che una sola tecnologia sia adatta a ogni nodo.

---

## 52.9 Completion Gate: aver prodotto qualcosa non significa aver finito

Dopo l'esecuzione compare un nodo spesso sottovalutato: il **Completion Gate**.

Un output esistente non dimostra da solo che il workflow sia concluso. Occorre verificare la true stop condition, lo stato del checkpoint, eventuali dipendenze, consistenza e requisiti di accettazione.

Se la condizione di stop non è stata raggiunta, il percorso deve continuare oppure diventare esplicitamente resumable. Non dovrebbe essere dichiarato completato soltanto perché una sessione termina o perché un singolo passaggio ha prodotto un risultato.

Questo trasforma la closure da impressione narrativa a condizione verificabile.

---

## 52.10 Consolidation: ciò che cambia deve sopravvivere correttamente

Se l'esecuzione produce un delta materiale, il lavoro non termina con l'output.

Il delta deve essere classificato e propagato verso le parti pertinenti della memoria persistente. Se cambia una decisione, va preservata la lineage. Se modifica relazioni, stato o documentazione, l'Impact Set deve essere considerato. Se non è materiale, non occorre trasformare ogni dettaglio in memoria durevole.

La mappa diventa quindi:

```text
RESULT
  ↓
MATERIAL DELTA?
 ├─ NO → CLOSURE ELIGIBILITY
 └─ YES
      ↓
 CONSOLIDATION
      ↓
 IMPACT / CONSISTENCY
```

Consolidare non significa copiare la conversazione. Significa preservare ciò che deve sopravvivere nella forma e nel luogo appropriati.

---

## 52.11 Assurance: la memoria deve restare navigabile e coerente

Dopo una modifica persistente può essere necessario verificare che la rete di conoscenza resti integra.

L'assurance osserva aspetti come relazioni rotte, nodi orfani, freshness, coerenza degli indici e health della conoscenza. Non decide però il significato di un conflitto semantico. Un controllo deterministico può rilevare che due elementi non rispettano un contratto; non può inventare quale dei due debba diventare canone.

Questo confine è fondamentale:

> **l'assurance può verificare l'integrità; l'authority decide il significato quando il significato non è determinabile dalle fonti.**

---

## 52.12 I loop emergono dalla rete

A questo punto si vede perché il WCM non è lineare.

Un Completion Gate fallito può riportare all'execution. Un delta materiale può attivare consolidation e assurance. Un'anomalia può richiedere nuova evidenza. Un workflow interrotto può essere ripreso in una sessione successiva. Un'esperienza può entrare nel Learning Loop senza diventare immediatamente una nuova regola.

La mappa reale assomiglia quindi più a questo:

```text
                 ┌───────────────┐
                 │   BOOTSTRAP   │
                 └───────┬───────┘
                         ↓
                     ROUTING
                  ↙      ↓      ↘
              PROCESS  RULES   GATES
                  \      |      /
                         ↓
                     EXECUTION
                         ↓
                  COMPLETION GATE
                    ↙         ↘
               CONTINUE      DELTA
                  ↑            ↓
                  └────── CONSOLIDATION
                               ↓
                           ASSURANCE
                               ↓
                    MEMORY / EXPERIENCE
                               │
                               └──→ futuro BOOTSTRAP
```

È una rappresentazione concettuale, non uno schema eseguibile. Serve a mostrare che **la fine di un ciclo può diventare contesto per il ciclo successivo**.

---

## 52.13 Dove finisce la mappa e dove comincia il metodo

Una mappa è utile finché non viene scambiata per il territorio.

La figura di questo capitolo non stabilisce authority, non assegna automaticamente protocolli, non sostituisce gli indici, non definisce da sola lo stato di un workflow e non autorizza transizioni.

Le fonti canoniche continuano a prevalere. La mappa serve al lettore per orientarsi tra quelle fonti e capire il ruolo dei principali nodi procedurali.

Questa distinzione protegge il WCM da un rischio frequente nelle architetture complesse: trasformare una visualizzazione comoda in una nuova fonte di verità non governata.

---

## 52.14 Dal sistema integrato ai loop fondamentali

Con i capitoli 50, 51 e 52 abbiamo costruito tre viste complementari:

- il **capitolo 50** ha mostrato perché il WCM non è una sequenza lineare;
- il **capitolo 51** ha mostrato le relazioni possibili tra processi e protocolli;
- questo capitolo ha mostrato la **topologia procedurale** che collega richiesta, bootstrap, routing, execution, completion, consolidation e assurance.

Ora possiamo osservare alcuni circuiti in modo più ravvicinato.

Il prossimo capitolo apre la Parte IX con l'**Operational Loop**: il ciclo che porta il sistema dal lavoro da fare alla sua esecuzione, verifica e continuità operativa.

---

## In sintesi

La mappa dei nodi procedurali non è una nuova procedura. È una vista del sistema.

Mostra che una richiesta non passa semplicemente attraverso una lista di processi. Il WCM ricostruisce il contesto, verifica continuità e authority, instrada verso processi e protocolli pertinenti, attraversa gate, usa capability cognitive o deterministiche, verifica la vera condizione di completamento e consolida gli effetti materiali nella memoria persistente.

Il risultato è una rete governata di transizioni.

Ed è proprio da questa rete che emergono i loop fondamentali del WCM.