# Capitolo 44 — PROT-015 — Documentation Impact & Publication Standard

**PARTE VII — Il Libro dei Protocolli WCM**  
**Stato:** FROZEN  
**Data:** 2026-09-01  
**Scope:** WCM generale, domain-agnostic

---

# 44.0 Quando la realtà cambia, anche la documentazione deve saperlo

Un sistema può funzionare correttamente e, nello stesso momento, raccontarsi in modo sbagliato.

Può accadere che una procedura venga modificata, che un passaggio automatico cambi comportamento, che una responsabilità venga spostata o che un nuovo controllo diventi obbligatorio. Se i documenti che spiegano il sistema restano fermi alla versione precedente, nasce una frattura: **la realtà operativa evolve, ma la rappresentazione umana resta indietro**.

Questo problema è più serio di un semplice manuale non aggiornato. Una persona può prendere una decisione sulla base di istruzioni ormai superate. Un operatore può ripetere un comando che il sistema sta già eseguendo. Un responsabile può credere che una funzione sia disponibile quando è ancora sperimentale. Una pagina di consultazione può mostrare come “corrente” ciò che in realtà è soltanto una copia derivata da una fonte più autorevole.

`PROT-015 — Documentation Impact & Publication Standard` esiste per impedire questo tipo di deriva.

Il principio di fondo è semplice:

> **Se cambia qualcosa di materiale, bisogna verificare che cosa quel cambiamento rende necessario aggiornare prima di considerare coerente la documentazione.**

Il protocollo non dice che ogni modifica richieda la riscrittura di ogni documento. Dice qualcosa di più preciso: ogni delta materiale deve essere sottoposto a un controllo esplicito di impatto documentale.

---

# 44.1 Il problema che il protocollo risolve

La documentazione tende a essere trattata come l'ultimo passaggio di un lavoro: prima si cambia il sistema, poi — se resta tempo — si aggiorna ciò che lo descrive.

Nel WCM questa impostazione non è sufficiente.

La documentazione è una delle superfici attraverso cui esseri umani e altri componenti comprendono il metodo. Se diventa obsoleta, il problema non è soltanto editoriale: diventa un problema di continuità, comprensione e controllo.

PROT-015 protegge da quattro errori ricorrenti.

Il primo è il **documentation drift**: il comportamento corrente e la documentazione non descrivono più la stessa realtà.

Il secondo è la **confusione tra fonte e rappresentazione**: una pagina, un PDF o un manuale vengono trattati come se fossero automaticamente la fonte autorevole, anche quando sono soltanto projection derivate.

Il terzo è la **semplificazione che falsifica**: per rendere un contenuto più accessibile si eliminano proprio i limiti, i gate o le condizioni che ne determinano il significato corretto.

Il quarto è la **pubblicazione non verificata**: un artefatto viene distribuito senza controllare se deriva davvero dalla baseline corrente.

Il protocollo mette ordine in questi quattro punti.

---

# 44.2 Documentazione non significa una sola cosa

Quando si dice “aggiorniamo la documentazione” si può intendere più di una cosa.

Una **Technical Reference** parla a chi deve capire struttura, stati, relazioni, componenti, input, output, authority e failure mode.

Una **Executive o Client Guide** racconta soprattutto problema, valore, funzionamento generale, controlli e limiti in un linguaggio più accessibile.

Un **User Manual** aiuta invece una persona a capire che cosa può fare, che cosa significa ciò che vede e quando deve intervenire.

A questi livelli generali possono aggiungersi documenti specifici per un particolare contesto operativo.

PROT-015 non impone che ogni cambiamento tocchi tutte queste categorie. Impone che la domanda venga posta esplicitamente.

In altre parole, il protocollo sostituisce il generico:

> “Dobbiamo aggiornare i documenti?”

con una verifica più disciplinata:

> “Quali superfici documentali sono realmente impattate, e perché?”

---

# 44.3 Il trigger: che cosa attiva il controllo

Il protocollo entra in gioco quando esiste un **delta materiale** coperto dal Documentation Continuity Loop.

“Materiale” non significa necessariamente grande. Significa abbastanza significativo da poter cambiare ciò che una persona dovrebbe sapere, ciò che un documento dichiara, il modo in cui un flusso viene descritto oppure la maturity attribuita a una capability.

Il trigger può quindi essere, per esempio:

- una modifica a una regola o a un processo;
- un nuovo gate;
- una capability che passa da sperimentale a corrente;
- un blocco operativo introdotto, modificato o ritirato;
- un cambiamento a input, output, authority o failure behaviour;
- una variazione che modifica ciò che un utente può realmente fare.

Il protocollo non autorizza da solo questi cambiamenti. Entra in gioco **dopo che esiste un delta materiale valido nel suo percorso di governance**, per capire come quel delta deve propagarsi nella documentazione.

---

# 44.4 L'input: partire dalle fonti autorevoli

Un documento non dovrebbe essere aggiornato perché “ricordiamo che adesso funziona così”.

PROT-015 impone una source discipline: il contenuto deve derivare dalle fonti autorevoli pertinenti.

In linguaggio semplice, prima di riscrivere bisogna chiedersi:

1. qual è la decisione o regola valida;
2. qual è lo stato corrente, se stiamo parlando di execution facts;
3. quale architettura o capability è realmente attiva;
4. quale processo o protocollo definisce il comportamento;
5. quale implementazione o evidenza verificata conferma ciò che stiamo descrivendo.

Un'idea discussa, una proposta ancora aperta o un esperimento non promosso possono essere documentati come tali, ma non possono essere presentati come funzione corrente.

Questa distinzione protegge il lettore da una delle forme più pericolose di errore: **una frase formalmente chiara ma semanticamente prematura**.

---

# 44.5 Il Documentation Impact Check

Il cuore operativo di PROT-015 è il **Documentation Impact Check**.

Il check prende il delta materiale e lo passa attraverso le categorie documentali rilevanti. Per ognuna si deve arrivare a una risposta esplicita:

```text
IMPATTO?
  ├─ NO  → motivo dichiarato
  └─ YES → aggiornamento necessario
```

Le categorie comprendono la documentazione generale, l'eventuale documentazione specifica del contesto operativo, l'Automation & Flow Catalog e gli eventuali artefatti distributivi.

La forza del check non sta nella complessità. Sta nell'impedire che una categoria venga dimenticata perché nessuno l'ha considerata.

Un cambiamento può richiedere l'aggiornamento della Technical Reference ma non dello User Manual. Un altro può non cambiare affatto l'architettura, ma modificare un percorso operativo visibile all'utente. Un altro ancora può toccare un blocco automatico e quindi richiedere il riallineamento del catalogo dei flussi.

Il protocollo rende questa valutazione esplicita e tracciabile.

---

# 44.6 Master e projection: la distinzione più importante

Una delle idee centrali del protocollo è la separazione tra **master** e **projection**.

Il master è il contenuto autorevole da cui una release documentale viene derivata secondo il sistema documentale corrente.

Una projection è una rappresentazione destinata a un uso: può essere una pagina web, un PDF, un DOCX, un reader o un altro formato autorizzato.

Una metafora quotidiana aiuta.

Immaginiamo una ricetta ufficiale conservata in un archivio e tre copie della stessa ricetta: una stampata, una sul telefono e una appesa in cucina. Se la ricetta ufficiale cambia, le copie non diventano corrette solo perché esistono ancora. Devono essere rigenerate o aggiornate a partire dalla fonte corretta.

Nel WCM vale lo stesso principio:

```text
SOURCE / MASTER AUTOREVOLE
          ↓
     PROJECTION
          ↓
     DISTRIBUZIONE
```

La freccia non deve essere invertita per comodità. Una projection può aiutare a leggere e usare il sistema, ma non acquisisce authority soltanto perché è più visibile o più comoda.

---

# 44.7 Semplificare senza falsificare

Documenti diversi possono descrivere la stessa realtà con livelli di dettaglio diversi.

La Technical Reference può parlare di stati, path, componenti e write boundary. Una guida executive può evitare questi dettagli e spiegare invece perché esiste un controllo e quale rischio riduce. Un manuale utente può limitarsi a spiegare che cosa vede una persona e che cosa deve fare.

La semplificazione è quindi legittima.

Ciò che non è legittimo è eliminare informazioni che cambiano il significato sostanziale.

Se una capability è in `FIELD VALIDATION`, una guida non può trasformarla implicitamente in una garanzia universale. Se un'azione richiede authority umana, una semplificazione non può farla apparire completamente autonoma. Se una superficie è una projection, non può essere raccontata come source of truth.

PROT-015 applica quindi un principio editoriale forte:

> **Si può ridurre il dettaglio; non si può aumentare la certezza oltre ciò che le fonti consentono.**

---

# 44.8 Rendere visibili i blocchi reali del flusso

Un sistema complesso può essere descritto male anche quando tutte le singole frasi sono vere.

Succede quando più componenti con responsabilità diverse vengono compressi sotto un'unica etichetta, per esempio “automazione”.

Ma una raccolta meccanica di evidenze non è la stessa cosa di una revisione cognitiva. Un heartbeat non è l'intero workflow. Una projection non è la fonte. Un controllo di integrità non coincide con una correzione semantica. Un receipt di authority non equivale alla conclusione del lavoro.

Per questo il protocollo richiede che i flow block materiali possano essere descritti almeno attraverso alcuni elementi fondamentali:

- perché esistono;
- che cosa li attiva;
- quali input autorevoli usano;
- che ruolo svolgono;
- che cosa producono o modificano;
- quale authority possiedono e quale non possiedono;
- quando si fermano o falliscono;
- come il loro comportamento può essere osservato;
- quale maturity possiedono.

Lo scopo non è riempire documenti di dettagli tecnici. È evitare che componenti diversi vengano fusi in una descrizione che nasconde chi decide, chi esegue e chi controlla.

---

# 44.9 Versioning: cambiare un documento senza confondere la storia

PROT-015 distingue tre classi di variazione documentale.

Una modifica `PATCH` corregge forma, linguaggio o dettagli senza cambiare il significato sostanziale.

Una modifica `MINOR` introduce una nuova sezione, capability o variazione operativa compatibile con la struttura esistente.

Una modifica `MAJOR` rappresenta una riorganizzazione sostanziale o un cambiamento che rende superata la struttura precedente.

Questa classificazione non è un giudizio sulla qualità del documento. Serve a rendere visibile **quanto è cambiato il significato o la struttura rispetto alla versione precedente**.

Inoltre, i diversi set documentali possono avere versioni indipendenti. Il fatto che evolva una guida specifica non obbliga ogni altro documento ad assumere lo stesso numero di versione.

---

# 44.10 Il gate di pubblicazione

Avere un master aggiornato non significa che ogni artefatto distributivo sia automaticamente pronto.

Prima della distribuzione, PROT-015 richiede verifiche coerenti con il tipo di release.

Bisogna controllare che il master rifletta davvero l'ultimo delta materiale, che riferimenti e collegamenti principali siano corretti, che la terminologia non introduca contraddizioni e che la documentazione generale e quella più specifica restino compatibili.

Se il cambiamento riguarda un flow block, va verificato anche il relativo catalogo.

Se si distribuiscono formati impaginati, il controllo può includere anche la verifica del rendering e del layout.

La domanda finale del gate è semplice:

> **Questa release deriva davvero da una rappresentazione corrente e verificata della realtà che vuole descrivere?**

Se la risposta è no, la release non deve essere dichiarata `current`.

---

# 44.11 Publication evidence e provenance

Una release affidabile deve poter dire da dove proviene.

Per questo PROT-015 prevede che gli artefatti distributivi riportino almeno le informazioni necessarie a ricostruire la loro origine: titolo, versione, data, stato e provenance della fonte; quando applicabile, anche livello o contesto e stato delle verifiche di qualità.

Il punto non è burocratico.

Senza provenance, due documenti apparentemente identici possono non essere distinguibili. Non sappiamo quale derivi dalla fonte più recente, quale sia stato verificato o quale appartenga a un contesto diverso.

La provenance rende invece possibile rispondere a una domanda fondamentale:

> “Questa copia, esattamente, da quale stato autorevole è stata generata?”

---

# 44.12 Documentation drift: quando il documento resta indietro

Il protocollo definisce una regola anti-drift molto netta.

Se una feature o un flow è corrente ma la documentazione o il catalogo pertinente sono stale, esiste **DOCUMENTATION DRIFT**.

In quella condizione, il Documentation Continuity Loop non può essere considerato superato.

Questo non significa che ogni frase vecchia debba essere scoperta automaticamente. Alcuni segnali possono essere rilevati meccanicamente quando esistono versioni, marker o riferimenti confrontabili. Ma riscrivere correttamente una spiegazione richiede spesso comprensione semantica.

Il WCM distingue quindi due attività:

```text
RILEVARE UN DISALLINEAMENTO MISURABILE
            ≠
RISCRIVERE IL SIGNIFICATO CORRETTO
```

La prima può essere deterministica in molti casi. La seconda resta cognitiva quando richiede interpretazione.

---

# 44.13 Perché il Knowledge Steward non riscrive automaticamente i manuali

Il protocollo introduce un guardrail importante contro l'auto-repair eccessivo.

Correggere automaticamente un metadata rigidamente definito può essere sicuro, se la repair class è autorizzata e il risultato è deterministico.

Riscrivere una spiegazione tecnica, commerciale o operativa è un'altra cosa. Significa scegliere parole, priorità, limiti, sfumature e spesso interpretare il significato del cambiamento.

Per questo il Knowledge Steward non riceve authority generale per riscrivere automaticamente la prosa documentale.

Il principio è coerente con il confine più ampio tra determinismo e cognizione:

- ciò che è strutturale, confrontabile e univoco può essere controllato meccanicamente;
- ciò che richiede interpretazione non deve essere mascherato da auto-repair deterministico.

---

# 44.14 Relazione con il Documentation Continuity Loop

PROT-015 non sostituisce `PROC-010 — Documentation Continuity Loop`.

Il processo definisce il percorso di continuità documentale. Il protocollo impone gli standard trasversali che quel percorso deve rispettare.

La relazione può essere letta così:

```text
PROC-010
= COME percorriamo il lavoro di continuità documentale

PROT-015
= QUALI regole devono restare vere mentre lo facciamo
```

Il protocollo vincola quindi il processo, ma non ne prende il posto.

Questa distinzione riprende il principio già incontrato nel capitolo dedicato a Processo vs Protocollo: un processo organizza una trasformazione; un protocollo impone condizioni e regole che possono attraversare più attività.

---

# 44.15 Relazione con la closure dei WCM CHANGE

La documentazione non è un effetto collaterale facoltativo di un WCM CHANGE materiale.

Quando il Documentation Impact Check dichiara che una categoria è impattata, quell'impatto entra nel Change Impact Manifest governato dal percorso di propagazione e closure.

Se una categoria è stata dichiarata `YES` ma non è stata propagata correttamente, il cambiamento non può ottenere il `PROPAGATION PASS` richiesto per la closure.

In linguaggio semplice:

> **Non basta cambiare correttamente la realtà; bisogna chiudere anche le rappresentazioni che il cambiamento ha reso obsolete, quando il protocollo le dichiara impattate.**

Questa regola collega direttamente documentazione e governance del cambiamento.

---

# 44.16 Il flusso completo

Il protocollo può essere sintetizzato così:

```text
DELTA MATERIALE VALIDO
        ↓
RECUPERO FONTI AUTOREVOLI
        ↓
DOCUMENTATION IMPACT CHECK
        ↓
QUALI CATEGORIE SONO IMPATTATE?
   ├─ NO  → motivazione tracciata
   └─ YES → aggiornamento necessario
                 ↓
          MASTER AGGIORNATO
                 ↓
      COERENZA + VERSIONING
                 ↓
     RELEASE DISTRIBUTIVA SERVE?
        ├─ NO  → continuity verificata
        └─ YES
             ↓
        PUBLICATION VERIFICATION
             ↓
        PROVENANCE + QA PERTINENTE
             ↓
        RELEASE DISTRIBUIBILE
```

Se in un punto emerge drift, conflitto di source, dubbio sulla maturity o incoerenza tra livelli documentali, il flusso non deve fingere di essere concluso.

---

# 44.17 Gate e decision point

I decision point principali sono cinque.

**1. Il delta è materiale?**  
Se no, può non essere necessario attivare l'intero ciclo documentale. Se sì, l'impatto va valutato.

**2. Quali categorie documentali sono impattate?**  
Ogni `YES` genera un obbligo di propagazione; ogni `NO` deve avere una ragione.

**3. Le fonti sono abbastanza autorevoli e correnti?**  
Se no, non si inventa la spiegazione mancante.

**4. Il master è coerente con il delta?**  
Se no, la continuità documentale non è ancora raggiunta.

**5. La release può essere distribuita come current?**  
Solo dopo le verifiche pertinenti.

Questi gate evitano che “documentato”, “aggiornato” e “pubblicabile” vengano trattati come sinonimi.

---

# 44.18 Output del protocollo

A seconda del caso, PROT-015 può produrre o richiedere:

- un Documentation Impact Check compilato;
- l'aggiornamento di uno o più master;
- l'aggiornamento dell'Automation & Flow Block Catalog;
- una nuova versione documentale;
- artefatti distributivi con provenance;
- evidenza di verification o QA quando prevista;
- un'indicazione esplicita di documentation drift;
- elementi del Change Impact Manifest necessari alla closure di un WCM CHANGE.

L'output corretto non è quindi semplicemente “un documento nuovo”. È **una rappresentazione documentale riallineata, verificabile e coerente con la fonte che descrive**.

---

# 44.19 Failure mode principali

**Aggiornare una projection e dimenticare il master.**  
La copia visibile sembra corretta, ma la fonte documentale resta incoerente e la prossima rigenerazione può reintrodurre il vecchio contenuto.

**Trattare una projection come source of truth.**  
La comodità di una pagina o di un PDF viene confusa con authority.

**Saltare il Documentation Impact Check.**  
Una categoria impattata non viene mai considerata e resta stale.

**Documentare un'idea come capability corrente.**  
Concept o sperimentazioni vengono presentati senza qualificare il loro stato.

**Semplificare eliminando un limite importante.**  
Il documento diventa più leggibile ma meno vero.

**Fondere componenti con authority diverse sotto la parola “automazione”.**  
Il lettore non capisce più chi osserva, chi decide, chi scrive e chi autorizza.

**Dichiarare current una release derivata da master stale.**  
La distribuzione trasforma un disallineamento interno in informazione ufficialmente consumabile.

**Auto-repair semantico non autorizzato.**  
Un componente meccanico riscrive prosa che richiede interpretazione e finisce per creare una nuova regola implicita.

**Chiudere un WCM CHANGE con documentazione impattata ancora stale.**  
La modifica è tecnicamente avvenuta, ma la sua propagazione non è completa.

---

# 44.20 Relazioni con altri elementi WCM

PROT-015 è collegato in particolare a:

- `PROC-010 — Documentation Continuity Loop`, che il protocollo vincola;
- `PROC-012 — WCM Change Propagation & Closure`, per la propagazione degli impatti documentali;
- `PROT-019 — WCM Change Closure Standard`, per il Propagation Gate;
- `PROT-013 — Knowledge Synapse & Health Standard`, perché il drift documentale è una forma di knowledge drift human-facing;
- `PROT-007 — Decision Change & Impact Analysis`, quando un cambiamento decisionale modifica ciò che deve essere documentato;
- le decisioni `DEC-010` e `DEC-014`, che costituiscono l'authority della baseline corrente del protocollo.

Queste relazioni non trasformano PROT-015 in un processo universale di pubblicazione. Definiscono il suo ruolo come standard trasversale di coerenza documentale e publication discipline.

---

# 44.21 Maturity e limiti

La baseline corrente di PROT-015 è:

`ACTIVE / FIELD VALIDATION / PROJECT LAYER ENABLED`.

`ACTIVE` significa che il protocollo fa parte della baseline operativa corrente.

`FIELD VALIDATION` significa che il suo comportamento è in validazione attraverso l'uso reale e non deve essere presentato come standard universalmente dimostrato in ogni possibile organizzazione o dominio.

`PROJECT LAYER ENABLED` indica che lo standard contempla anche la documentazione specifica di contesti progettuali, mantenendola distinta dal livello generale.

Esistono inoltre limiti pratici importanti.

Non ogni incoerenza semantica è rilevabile automaticamente. Non ogni documento può essere rigenerato senza una revisione cognitiva. Una buona provenance non garantisce da sola una buona spiegazione. Una verifica strutturale non sostituisce il giudizio umano quando il contenuto deve essere comprensibile, proporzionato e fedele al significato.

PROT-015 riduce il rischio di documentation drift; non pretende di rendere la documentazione perfetta per definizione.

---

# 44.22 Regola finale da ricordare

La regola più importante del capitolo può essere riassunta così:

> **Una modifica non è documentata perché esiste una nuova pagina: è documentata quando le rappresentazioni impattate derivano dalla fonte corretta, sono coerenti con il delta e, se distribuite, sono state verificate.**

Il protocollo protegge il WCM da una forma di incoerenza facile da sottovalutare: **avere una realtà corrente e una memoria documentale che racconta ancora quella precedente**.

---

## Source map del capitolo

Fonte primaria:

- `wcm/process-book/protocols/PROT-015_DOCUMENTATION_IMPACT_AND_PUBLICATION_STANDARD.md` — `ACTIVE / FIELD VALIDATION / PROJECT LAYER ENABLED` — Authority `DEC-010 + DEC-014`.

Fonti collegate richiamate dalla baseline del protocollo:

- `PROC-010 — Documentation Continuity Loop`;
- `PROC-012 — WCM Change Propagation & Closure`;
- `PROT-019 — WCM Change Closure Standard`;
- `PROT-013 — Knowledge Synapse & Health Standard`;
- `PROT-007 — Decision Change & Impact Analysis`.

Il capitolo è una traduzione editoriale della baseline corrente: non introduce nuove regole WCM, non modifica processi o protocolli e non estende la maturity dichiarata.