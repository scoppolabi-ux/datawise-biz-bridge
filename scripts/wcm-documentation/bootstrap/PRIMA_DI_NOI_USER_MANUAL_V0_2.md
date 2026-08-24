# PRIMA DI NOI — Manuale Utente

**Versione:** 0.2  
**Data:** 2026-08-24  
**Stato:** ACTIVE / LIVING PROJECTION / FIELD VALIDATION  
**Pubblico:** Author & Creative Director e utenti autorizzati, anche senza background tecnico  
**Authority:** DEC-014 + PRIMA DI NOI project authority; human-facing projection, non source of truth

---

# 1. Che cosa devi sapere prima di usare PRIMA DI NOI nel WCM

Per governare PRIMA DI NOI non devi sapere che cosa sia un file JSON, un projector o una GitHub Action.

Il concetto importante è più semplice:

> **Il romanzo non viene gestito come una lunga chat con l'AI. Viene gestito come un progetto editoriale che conserva memoria, stato, decisioni, controlli e versioni anche quando una conversazione finisce.**

Il tuo ruolo non è seguire ogni passaggio tecnico. È sapere:

- dove siamo nel lavoro;
- che cosa WCM sta facendo da solo;
- quando il sistema sta soltanto controllando o sincronizzando;
- quando invece è arrivato un punto in cui serve una tua decisione autoriale.

---

# 2. Il tuo ruolo: autore, non supervisore di ogni operazione

In PRIMA DI NOI tu sei **Author & Creative Director**.

WCM può organizzare il lavoro, produrre materiale, eseguire review, controllare continuità, preparare documenti e mantenere la memoria.

Ma le decisioni che definiscono il libro restano tue.

In particolare, rimangono sotto la tua authority:

- canone;
- svolte narrative materiali;
- personaggi e loro funzione;
- reveal importanti;
- finale;
- voce e direzione autoriale;
- approvazione/freeze dei capitoli;
- pubblicazione.

La logica è quindi:

```text
WCM PREPARA E PORTA AVANTI IL LAVORO
                ↓
ARRIVA AL PUNTO IN CUI SERVE UNA SCELTA
                ↓
              TU DECIDI
                ↓
WCM APPLICA LA DECISIONE E CONTINUA
```

---

# 3. Dove guardare

Il punto di ingresso è la pagina del progetto in Mission Control:

`/wcm/prima-di-noi`

Qui puoi trovare, in base alla sezione:

- Overview;
- Needs / Board;
- Documents;
- Activity;
- Roadmap;
- Knowledge;
- Execution Health;
- Steward Activity.

Non devi usare tutte le sezioni ogni volta. Nella pratica, per capire cosa devi fare, parti da **Needs** e **Execution Health**.

---

# 4. La domanda più importante: “Serve qualcosa da me?”

Se compare un Need relativo a PRIMA DI NOI, significa che WCM è arrivato a un punto in cui **non è autorizzato a continuare senza di te**.

Un esempio tipico è il Board Gate di un capitolo.

Il sistema ha già:

- prodotto la Candidate;
- eseguito le review;
- controllato la massa narrativa;
- preparato il Board Report;
- verificato la conoscenza necessaria;
- preparato/consegnato i documenti previsti.

A quel punto può chiederti:

> “Approvi e congeli questa Candidate oppure vuoi modifiche?”

Quello è il momento in cui devi intervenire.

Se invece non compare un Need, non significa che il progetto sia fermo: può semplicemente avere lavoro autorizzato da fare senza la tua presenza.

---

# 5. Come leggere Execution Health senza conoscere il backend

## `ACTIVE`

**Il lavoro è in corso oppure esistono ancora passaggi autorizzati da eseguire.**

Non devi dare nuovamente l'ordine.

## `INTERRUPTED_RESUMABLE`

**Il lavoro si è interrotto per un motivo tecnico, ma non è perso.**

WCM ha un checkpoint e deve riprendere da lì. Non ricominciare manualmente il capitolo.

## `WAITING_AUTHORITY`

**Il sistema è arrivato correttamente a una decisione che spetta a te.**

Non è un errore e non è “bloccato male”. È il comportamento desiderato.

## `BLOCKED`

C'è un ostacolo reale. Il dettaglio deve spiegare se è tecnico, narrativo, informativo o di authority.

## `COMPLETED`

Il workflow è stato realmente chiuso, compresi gli aggiornamenti necessari dopo l'output principale.

---

# 6. Il ciclo di un capitolo spiegato come se fosse una redazione

Un capitolo non passa direttamente da “idea” ad “approvato”.

Puoi immaginare il processo come il lavoro di una redazione:

### 1. Production Brief

Prima di scrivere, WCM stabilisce che cosa deve fare il capitolo: continuità, funzione narrativa, dipendenze e vincoli.

### 2. Draft

Il Writer produce la prima versione estesa.

### 3. Professional Reviews

Il testo viene guardato da punti di vista differenti: continuity, personaggi, thriller/pacing, stile, research, engagement e altri ruoli pertinenti.

### 4. Narrative Mass Control

WCM controlla se il capitolo e il romanzo complessivo stanno mantenendo la massa narrativa prevista.

### 5. Editorial Synthesis / Revision

Le review vengono sintetizzate e il testo viene migliorato.

### 6. Candidate

Nasce la versione che può essere sottoposta a te.

### 7. Board Report

WCM prepara un documento separato che ti aiuta a capire che cosa è stato controllato, quali problemi sono stati trovati e perché la Candidate è considerata pronta.

### 8. Fresh Knowledge Trust Gate

Prima di chiederti di approvare, il sistema può verificare che la memoria utilizzata sia abbastanza fresca e coerente.

### 9. Delivery

I documenti previsti vengono preparati e la consegna viene verificata.

### 10. Board / Author Gate

A questo punto il sistema si ferma e aspetta la tua decisione.

---

# 7. Perché WCM non dovrebbe fermarsi dopo la bozza

Una delle lezioni importanti emerse durante il progetto è che produrre un Draft **non significa aver finito il lavoro autorizzato**.

Se review, mass control, sintesi e Candidate sono già parte dello stesso workflow e non esiste un vero problema, WCM deve continuare.

La regola è:

> **fermarsi al vero gate, non al primo output interessante.**

Questo evita di trasformarti nel pulsante “continua” di ogni singolo passaggio.

---

# 8. Candidate e Board Report: non confonderli

Quando arrivi a un Board Gate normalmente hai due oggetti diversi.

## Candidate

È il **testo del capitolo che può diventare frozen**.

## Board Report

È il **documento che ti aiuta a decidere**: contiene review, valutazioni, metriche, rischi e conclusioni editoriali.

Quindi:

> **approvi/freeze la Candidate, non il Board Report.**

Il Board Report è supporting material.

Questa distinzione è codificata anche tecnicamente per evitare che un comando di approval punti al documento sbagliato.

---

# 9. Narrative Mass Control: perché esiste

Durante lo sviluppo del romanzo ci siamo accorti di un rischio concreto: l'AI può produrre capitoli formalmente buoni ma sempre troppo compressi.

Se il fenomeno continua, un romanzo pensato per avere una certa ampiezza può ritrovarsi molto più corto del previsto.

Per questo il Board Report deve contenere numeri reali, non soltanto un giudizio generico.

Deve rendere visibili almeno:

- parole della Candidate;
- parole cumulative;
- media corrente;
- proiezione finale;
- target 85.000–100.000 parole;
- scostamento rispetto al target;
- verdict `ON TARGET`, `UNDER TARGET` o `OVER TARGET`;
- interpretazione editoriale;
- controllo anti-padding.

**Anti-padding** significa che WCM non deve aggiungere testo inutile solo per raggiungere una quota.

---

# 10. Continuità: il sistema deve ricordare ciò che il lettore ha davvero visto

Una Story Architecture da sola non basta.

Durante la scrittura possono emergere dettagli, azioni e relazioni che devono essere ricordati nei capitoli successivi.

Per questo PRIMA DI NOI mantiene living ledgers dedicati a:

- relazioni;
- cosa sa o crede ogni personaggio;
- reveal e informazioni da trattenere;
- entità, eventi e fazioni;
- semi e payoff;
- debiti narrativi ancora aperti.

Il controllo deve confrontare la nuova Candidate con **il manoscritto frozen precedente**, non soltanto con una traccia astratta.

Serve a evitare errori del tipo:

- un personaggio ricorda qualcosa che non è mai accaduto;
- qualcuno conosce un'informazione che non ha ancora ricevuto;
- un reveal viene anticipato;
- un nuovo elemento duplica inconsapevolmente un elemento già esistente;
- un payoff compare senza essere stato seminato.

---

# 11. Knowledge Health: non giudica se il capitolo è bello

Quando vedi `Knowledge Health`, non pensare a una valutazione letteraria.

Non significa “questo capitolo vale 94 su 100”.

Misura invece **quanto è affidabile e coerente la memoria organizzativa che WCM sta usando**.

## `HEALTHY`

I controlli previsti non stanno rilevando problemi importanti e il check è recente.

## `DEGRADED`

Esistono problemi o debiti, ma non necessariamente riguardano ciò che stiamo facendo adesso.

Un `DEGRADED` può quindi essere **non bloccante**.

## `STALE`

Il check è diventato vecchio rispetto a una modifica successiva e va rifatto.

## `CRITICAL`

Esiste un problema incompatibile con un passaggio knowledge-sensitive sicuro.

---

# 12. Il controllo della memoria può essere parte automatica del Chapter Workflow

Questa è una delle implementazioni più importanti aggiunte recentemente.

Prima di arrivare al Board Gate, il Chapter Workflow può dichiarare:

> **“Ho bisogno di un Knowledge Assurance fresh prima di considerare questo package sicuro.”**

Non viene creato un Need per te. È una **dipendenza interna** del processo.

Il sistema esegue il controllo, registra il risultato e decide — secondo regole e boundary già definiti — se il risultato consente di proseguire.

Sul Capitolo 7 questo è già avvenuto realmente.

Il check era `DEGRADED 94`, ma le anomalie residue non riguardavano la Candidate né il Board Gate corrente. Per questo il risultato è stato classificato `blocking=false` e il workflow ha potuto continuare fino alla tua decisione.

Questo esempio è utile perché mostra una cosa importante:

> **un controllo non deve essere perfetto in assoluto; deve essere affidabile rispetto alla decisione che stiamo per prendere.**

---

# 13. Knowledge Assurance: cosa fa da solo

Knowledge Assurance oggi può partire:

- quando cambiano parti rilevanti del progetto;
- quando un workflow lo richiama come dipendenza interna;
- periodicamente, con una safety net ogni sei ore.

Il processo semplificato è:

```text
CONTROLLA LA MEMORIA
→ TROVA UN'ANOMALIA?
   ├─ NO → registra il risultato
   └─ SÌ
       → la riparazione è meccanica e già autorizzata?
          ├─ SÌ → ripara → ricontrolla
          └─ NO → non inventa → escalation
```

Non può decidere chi deve essere Luca, chi ha sparato, quando deve essere rivelata ORIGINE o quale finale scegliere.

Queste sono questioni di significato narrativo e authority.

---

# 14. Heartbeat: che cosa succede ogni ora

Il PRIMA DI NOI Heartbeat è una sveglia cognitiva periodica.

Non contiene hard-coded “scrivi il prossimo capitolo”.

Quando si attiva, Wise deve:

1. leggere il workflow persistente;
2. capire se esiste un lavoro da riprendere;
3. verificare authority e contesto minimo;
4. continuare dal prossimo passaggio corretto;
5. aggiornare i checkpoint quando avviene qualcosa di materiale;
6. fermarsi solo quando incontra una vera stop condition.

Quindi non devi inviare ogni ora una nuova istruzione.

---

# 15. Un heartbeat recente non significa che il libro sia avanzato

Questa distinzione è stata recentemente resa più robusta.

Il sistema separa:

- **liveness** — il worker si è attivato;
- **execution** — il workflow è passato a un nuovo stato.

Immagina che il Capitolo 7 sia `WAITING_AUTHORITY`.

Alle 18:00 parte l'heartbeat. Wise controlla lo stato e vede che serve ancora la tua decisione. Non può fare altro e si ferma correttamente.

Mission Control potrà mostrare un heartbeat recentissimo, ma il Capitolo 7 resterà `WAITING_AUTHORITY`.

Non c'è contraddizione.

La telemetria viene ora registrata con un materializzatore deterministico separato, proprio per evitare che “è vivo” venga confuso con “è avanzato”.

---

# 16. Che cosa significa approvare un capitolo

Quando scegli `APPROVE_FREEZE`, stai conferendo authority sul **documento Candidate indicato dal gate**.

Dopo il click possono esserci alcuni secondi/minuti in cui la decisione è registrata ma WCM sta ancora applicando gli effetti.

Quindi:

```text
TU APPROVI
→ AUTHORITY VIENE REGISTRATA
→ IL WORKFLOW CONSUMA LA DECISIONE
→ APPLICA IL FREEZE
→ AGGIORNA LA MEMORIA
→ RICONCILIA LO STATO
→ COMPLETA I CONTROLLI
```

Se vedi Pending, non approvare di nuovo automaticamente.

---

# 17. Perché dopo il freeze WCM deve ancora lavorare

Freeze non significa “chiudi tutto immediatamente”.

Il capitolo approvato ha introdotto nuovi fatti nel romanzo. Questi fatti devono essere assorbiti dal sistema.

La **Post-Freeze Reconciliation** serve proprio a questo:

```text
CAPITOLO APPROVATO
→ frozen manuscript
→ living ledgers aggiornati
→ indici/current-facing view riallineati
→ runtime/state aggiornati
→ fresh Knowledge Trust Gate
→ Completion Gate
→ capitolo successivo eleggibile
```

È il modo con cui WCM evita che il testo approvato dica una cosa mentre la memoria del progetto continua a ricordare quella precedente.

---

# 18. Quando può partire il capitolo successivo

Non appena premi Approva? **Non necessariamente.**

Il capitolo successivo diventa normalmente eleggibile solo dopo che il workflow precedente ha completato gli effetti obbligatori di chiusura.

Questo evita un problema pericoloso: iniziare a scrivere il Capitolo 8 mentre la memoria non ha ancora assorbito ciò che hai appena approvato nel Capitolo 7.

---

# 19. Delivery: “prodotto” non significa “consegnato”

PRIMA DI NOI utilizza anche un controllo di delivery.

Nel workflow del Capitolo 7, Candidate e Board Report sono stati preparati come file Word e la consegna email è stata verificata prima di aprire il Board Gate.

Questo significa che WCM distingue:

1. documento generato;
2. package pronto;
3. invio effettuato;
4. invio verificato;
5. gate aperto.

Un tentativo di email ambiguo non viene automaticamente considerato consegna riuscita.

---

# 20. Le scritture importanti vengono protette

Durante la costruzione del WCM abbiamo osservato che una scrittura remota può essere tecnicamente accettata ma comunque sbagliata.

Per questo oggi esiste `PROT-017 Persistent Mutation Safety`.

Dal tuo punto di vista significa che, prima di modificare elementi persistenti sensibili, il sistema deve controllare cose come:

- sto scrivendo esattamente nel posto giusto?
- la versione che sto modificando è ancora quella corrente?
- il payload è completo e valido?
- esiste già un altro writer?
- se riprovo, rischio di duplicare l'effetto?
- dopo la write, il contenuto registrato è davvero quello atteso?

Non devi eseguire tu questi controlli. È una protezione del sistema.

---

# 21. Che cosa vedi in Activity e Roadmap

**Activity** racconta ciò che è successo.

**Roadmap** mostra il percorso previsto.

**Execution Health** dice dove siamo realmente nel workflow.

Esempio:

- Roadmap: dopo il Capitolo 7 viene il Capitolo 8;
- Activity: il Chapter 7 package è stato prodotto e consegnato;
- Execution: `WAITING_AUTHORITY`;
- Need: devi decidere sul Chapter 7.

La conclusione corretta è: **non siamo ancora al Capitolo 8**.

---

# 22. WCM Learning: il romanzo può insegnare qualcosa al metodo

PRIMA DI NOI è anche la principale field validation attuale del WCM.

Quando accade un problema interessante, il sistema può raccoglierlo come evidence metodologica.

Per esempio, proprio il lavoro sui capitoli ha contribuito a dimostrare che la continuità del workflow richiede uno stato di esecuzione durevole. Questa esperienza è diventata `WCM-LRN-005`, poi promossa nella baseline.

Ma attenzione:

> **il romanzo non cambia automaticamente il WCM.**

Il percorso è evidence → review → learning → eventuale Change Gate → authority → promotion.

---

# 23. Il Learning Review non revisiona il romanzo

`WCM Learning Review` è una procedura del metodo WCM.

Non decide se un dialogo è bello o se Miriam deve fare una certa scelta.

La sua domanda è diversa:

> “Ciò che è successo in questo progetto ci insegna qualcosa che dovrebbe migliorare il modo in cui WCM lavora anche in futuro?”

Quindi Learning Review e Editorial Review sono due funzioni completamente diverse.

---

# 24. Esempio reale: dove si trovava il Capitolo 7 il 24 agosto 2026

Questa sezione è un **esempio datato**, non la definizione permanente dello stato del progetto.

Al momento della verifica documentale:

- Chapter 7 V0.1 era arrivato al Board Gate;
- Draft, review, Narrative Mass Control, Candidate e Board Report erano completati;
- il fresh Knowledge Trust Gate era stato consumato;
- il package Word era stato prodotto;
- la delivery era stata verificata;
- lo stato era `WAITING_AUTHORITY`;
- la next transition era `BOARD_DECISION`;
- Chapter 8 non era ancora eleggibile.

Questo esempio mostra bene il funzionamento del sistema: **WCM può fare moltissimo autonomamente, ma quando arriva alla tua decisione deve realmente fermarsi.**

Per sapere dove siamo oggi, usa sempre Execution Health/Mission Control, non questa fotografia storica.

---

# 25. Le principali automazioni di PRIMA DI NOI spiegate senza gergo

## PRIMA DI NOI Heartbeat

Sveglia periodicamente Wise e gli fa controllare se c'è lavoro autorizzato da continuare.

**Tu devi fare qualcosa?** No, salvo che emerga un Need.

## Chapter Workflow

Organizza il lavoro di un capitolo dalla preparazione fino al gate e alla chiusura post-freeze.

**Tu devi fare qualcosa?** Solo ai gate riservati all'autore.

## Narrative Mass Control

Controlla che il romanzo non si stia comprimendo o gonfiando artificialmente.

**Tu devi fare qualcosa?** Normalmente no; leggi le conclusioni nel Board Report.

## Knowledge Assurance

Controlla che la memoria usata dal progetto sia coerente e fresca.

**Tu devi fare qualcosa?** Soltanto se emerge una decisione semantica o un problema bloccante che richiede authority.

## Pre-Board Fresh Assurance

Il workflow richiede automaticamente un check aggiornato prima del gate.

**Tu devi fare qualcosa?** No.

## Deterministic State

Tiene allineato il punto esatto in cui si trova il workflow.

**Tu devi fare qualcosa?** No.

## Deterministic Projector

Porta i dati strutturati nel Mission Control.

**Tu devi fare qualcosa?** No.

## Heartbeat Telemetry Materializer

Registra quando il worker si è attivato senza confondere il dato con la progressione editoriale.

**Tu devi fare qualcosa?** No.

## Command Executor

Trasporta la tua decisione dal Control Panel alla memoria persistente in modo verificabile.

**Tu devi fare qualcosa?** Emettere la decisione una volta; non ripeterla se è Pending.

## Verified Delivery

Controlla che il package previsto sia stato realmente consegnato.

**Tu devi fare qualcosa?** Normalmente no.

## Post-Freeze Reconciliation

Assorbe nella memoria ciò che hai appena approvato.

**Tu devi fare qualcosa?** No, salvo escalation.

## WCM Learning Collector / Review

Trasforma l'esperienza del progetto in evidence e possibili miglioramenti del metodo.

**Tu devi fare qualcosa?** Solo se nasce un WCM Change Gate.

---

# 26. Cosa fare quando…

## …vedo `WAITING_AUTHORITY`

Apri Need/Candidate/Board Report e decidi. Il sistema è fermo correttamente.

## …vedo `INTERRUPTED_RESUMABLE`

Non ricominciare. WCM deve riprendere dal checkpoint.

## …vedo `DEGRADED 94`

Non interpretarlo come “il libro vale 94”. Apri il dettaglio e verifica se il problema riguarda il passaggio corrente.

## …vedo un heartbeat recente ma il capitolo è ancora fermo

Può essere corretto: il worker è vivo, ma non ha authority per oltrepassare il gate.

## …ho approvato e vedo Pending

Non premere di nuovo. WCM sta probabilmente applicando gli effetti post-decisione.

## …il Board Report dice soltanto “siamo sotto target”

Il package non è completo: devono esserci i dati numerici del Narrative Mass Control.

## …il Control Panel sembra indietro

Non cambiare la storia o reinviare un comando per far coincidere la UI. Si verifica la projection rispetto al runtime.

## …un capitolo è Candidate

È proposto, non frozen.

## …un capitolo è Frozen

È parte della baseline narrativa e il lavoro successivo deve rispettarlo.

---

# 27. Cosa non devi fare

Non è necessario:

- ricordare in quale chat hai preso una decisione;
- spiegare ogni ora al heartbeat cosa fare;
- ripetere passaggi che il runtime dice già completati;
- approvare due volte perché il sistema è Pending;
- controllare manualmente ogni sincronizzazione;
- interpretare Knowledge Health come giudizio letterario;
- modificare il canone per correggere una dashboard stale;
- leggere i file tecnici per capire se il progetto aspetta te.

---

# 28. Dove trovare i manuali

Nel Documentation Center:

```text
Documentazione
→ Progetti
→ PRIMA DI NOI
```

Trovi:

- Technical Reference;
- Executive / Editorial Partner Guide;
- User Manual.

Il reader dispone di indice cliccabile. Le versioni Word/PDF vengono distribuite quando generate e sottoposte al QA previsto.

---

# 29. La regola finale

Il modo migliore di usare PRIMA DI NOI nel WCM non è chiedersi continuamente:

> “Che cosa devo dire adesso all'AI?”

È chiedersi:

> **“WCM ha ancora lavoro autorizzato da fare oppure è arrivato davvero a una decisione che spetta a me?”**

Se può continuare, deve continuare. Se sta controllando o sincronizzando, normalmente non devi intervenire. Se arriva al gate, allora la decisione torna a te.