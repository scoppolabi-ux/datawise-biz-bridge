# Capitolo 31 — PROT-002 — Result Acceptance & Closure

**PARTE VII — Il Libro dei Protocolli WCM**  
**Stato:** FROZEN  
**Data:** 2026-08-30  
**Scope:** WCM generale, domain-agnostic

---

# 31.0 Dire “fatto” non basta

In qualsiasi organizzazione esiste un momento delicato: qualcuno conclude un'attività e dichiara che il lavoro è terminato.

La dichiarazione può essere perfettamente corretta. Ma, da sola, non è ancora una prova.

`PROT-002 — Result Acceptance & Closure` governa proprio questo passaggio nel WCM: impedisce che un Service Job venga considerato concluso sulla base dell'intenzione di chi lo ha eseguito, di un messaggio di successo o della semplice presenza di un output non verificato.

La sua regola fondamentale è breve:

> `DONE` richiede evidenza verificabile.

Per un lettore non tecnico, il significato è semplice: **prima di chiudere un lavoro bisogna poter dimostrare che il risultato richiesto esiste davvero, che soddisfa ciò che era stato concordato e che non ha oltrepassato i confini autorizzati.**

---

# 31.1 Il problema che PROT-002 risolve

Immaginiamo un esempio pedagogico e astratto.

Una persona riceve l'incarico di preparare un documento con tre sezioni obbligatorie e di salvarlo in una determinata posizione. Dopo un po' comunica: “Completato”.

Quella frase può corrispondere a situazioni molto diverse:

- il documento esiste, contiene tutte e tre le sezioni ed è nel posto corretto;
- il documento esiste ma manca una sezione;
- il documento è corretto ma è stato salvato altrove;
- è stata prodotta soltanto una bozza;
- il lavoro è quasi completo, ma resta un problema noto;
- il sistema che ha eseguito il compito ha semplicemente emesso un messaggio di successo.

Se tutte queste situazioni venissero trattate come equivalenti, lo stato `DONE` perderebbe significato.

PROT-002 esiste per conservare il valore informativo della chiusura: **un lavoro concluso deve essere distinguibile da un lavoro dichiarato concluso.**

---

# 31.2 Quando si attiva

Il protocollo si applica nella **chiusura di un Service Job**.

Il trigger è quindi il momento in cui il lavoro sta per passare allo stato `DONE`.

Non è un controllo generico su qualsiasi attività umana e non stabilisce da solo come debba essere eseguito il lavoro. Interviene nel punto specifico in cui il risultato deve essere accettato e la run può essere chiusa.

In termini semplici:

```text
LAVORO ESEGUITO
      ↓
RICHIESTA DI CHIUSURA
      ↓
PROT-002
      ↓
EVIDENZE SUFFICIENTI?
   /          \
 SÌ            NO
 ↓              ↓
DONE       NON CHIUDERE COME DONE
```

---

# 31.3 Gli input del gate di chiusura

Per verificare una chiusura servono elementi concreti. PROT-002 richiede di guardare almeno ciò che è applicabile al Service Job corrente.

Gli input principali sono:

- gli **acceptance criteria**, cioè le condizioni che definiscono quando il risultato può essere accettato;
- gli output attesi;
- i path autorizzati, cioè le aree in cui era consentito produrre modifiche;
- branch e destinazione di eventuali commit o push, quando Git è coinvolto;
- test ed evidenze significative;
- eventuali limiti, problemi residui o criteri non soddisfatti.

Il protocollo non richiede che ogni Service Job abbia la stessa forma. Richiede invece che, qualunque sia la forma del lavoro, la chiusura venga confrontata con **i criteri realmente applicabili a quel lavoro**.

---

# 31.4 Primo gate: gli acceptance criteria sono soddisfatti?

Un acceptance criterion è una condizione osservabile che permette di dire se una parte del risultato è accettabile.

Per esempio, in un caso astratto:

- “il file esiste” è un criterio;
- “contiene le tre sezioni previste” è un altro criterio;
- “si trova nella destinazione concordata” è un altro ancora.

PROT-002 richiede di verificare tutti gli acceptance criteria applicabili prima di impostare `STATUS: DONE`.

Questo evita una distorsione comune: considerare sufficiente aver svolto una parte importante del lavoro, anche quando una condizione necessaria manca ancora.

La logica è:

```text
QUASI COMPLETO
≠
COMPLETO
```

Un risultato parziale può essere utile, avanzato o vicino alla conclusione. Ma non deve essere trasformato semanticamente in successo completo.

---

# 31.5 Secondo gate: l'output esiste davvero ed è quello previsto?

La presenza di un messaggio come “file creato” o “operazione completata” non sostituisce il controllo dell'output.

PROT-002 richiede di verificare **esistenza e contenuto** degli output previsti.

Questa distinzione è importante. Un artefatto può esistere ma essere vuoto, incompleto, non aggiornato o diverso da ciò che era richiesto.

Quando la source of truth è direttamente accessibile, il WCM preferisce la verifica dello stato reale rispetto alla sola dichiarazione del servizio che ha eseguito il compito.

In linguaggio semplice:

```text
“HO CREATO IL RISULTATO”
          ≠
“IL RISULTATO È STATO VERIFICATO”
```

La verifica indipendente non implica sfiducia verso chi ha lavorato. Serve a separare due funzioni diverse: **esecuzione** e **accettazione del risultato**.

---

# 31.6 Terzo gate: il risultato è rimasto dentro lo scope autorizzato?

Un lavoro può produrre l'output corretto e, nello stesso tempo, modificare elementi che non avrebbe dovuto toccare.

Per questo PROT-002 non controlla soltanto “che cosa è stato prodotto”, ma anche **dove e entro quali confini è stato prodotto**.

Prima della chiusura occorre verificare che le modifiche siano rimaste nei path autorizzati. Quando sono presenti commit o push, vanno controllati anche branch e destinazione.

Questo passaggio protegge una distinzione fondamentale:

> **risultato corretto ≠ esecuzione automaticamente conforme allo scope.**

Un esito utile non sana retroattivamente una violazione dei confini autorizzati.

---

# 31.7 Le evidenze: abbastanza per capire senza ricostruire tutto

La closure non deve costringere chi arriva dopo a ricostruire l'intera run per capire se il lavoro era davvero concluso.

PROT-002 definisce quindi una chiusura minima capace di rendere leggibili almeno questi elementi:

- che cosa è stato fatto;
- dove si trova il risultato;
- come è stato verificato;
- quali acceptance criteria sono passati o falliti;
- quali problemi residui esistono, se ce ne sono;
- se sono emersi capability gap o impatti sulla knowledge base;
- quale prossimo passo è raccomandato, quando necessario.

Non si tratta di produrre documentazione per accumulo. Lo scopo è lasciare una **traccia di accettazione** sufficiente a rendere la chiusura comprensibile e verificabile anche successivamente.

---

# 31.8 Il decision point: accettare o non accettare

Il gate di chiusura porta a due famiglie di esito.

### Esito A — evidenze coerenti con la chiusura

Se gli acceptance criteria applicabili sono soddisfatti, gli output esistono e sono coerenti, lo scope è rispettato e non rimangono limiti incompatibili con la chiusura, il Service Job può essere accettato come `DONE`.

### Esito B — evidenze insufficienti o risultato parziale

Se manca una verifica necessaria, un criterio fallisce, un output non corrisponde a quanto previsto oppure esiste un limite che impedisce la chiusura completa, PROT-002 vieta di presentare il lavoro come successo completo.

L'esito deve rappresentare lo stato reale, dichiarando esplicitamente ciò che manca o ciò che non è stato soddisfatto.

Questo è uno dei punti più importanti del protocollo: **la closure non serve a produrre una conclusione rassicurante; serve a rappresentare correttamente la conclusione reale.**

---

# 31.9 La verifica indipendente

Il protocollo attribuisce particolare valore alla verifica diretta quando Wise dispone di accesso alla source of truth.

Il flusso canonico può essere letto così:

```text
SERVICE DICHIARA DONE
        ↓
VERIFICA DIRETTA DI OUTPUT / STATO REALE
        ↓
COERENTE CON LA DICHIARAZIONE?
       /       \
     SÌ         NO
     ↓           ↓
  ACCETTA    INDAGA / ESCALATION
```

Questa verifica non crea una seconda esecuzione del lavoro. È un controllo di accettazione.

La differenza è analoga a quella tra consegnare un pacco e verificare che nel pacco ci sia effettivamente ciò che era stato ordinato. La consegna è un evento; l'accettazione è un giudizio fondato su evidenze.

---

# 31.10 Output del protocollo

L'output di PROT-002 è una **closure affidabile** del Service Job.

Quando il gate passa, la chiusura rende disponibile uno stato `DONE` sostenuto da evidenze verificabili e da una sintesi sufficiente a comprendere il risultato.

Quando il gate non passa, l'output corretto non è un `DONE` artificiale, ma una rappresentazione esplicita dei criteri mancanti, dei limiti o dei problemi residui.

Il protocollo non stabilisce qui una tassonomia universale di tutti i possibili stati intermedi. Stabilisce un confine preciso: **ciò che non soddisfa il gate di chiusura non deve essere rappresentato come successo completo.**

---

# 31.11 Failure mode

PROT-002 protegge il WCM da diversi errori di chiusura.

I principali failure mode sono:

- accettare come prova la sola affermazione del runtime o del servizio;
- dichiarare `DONE` senza verificare gli acceptance criteria;
- controllare che un output esista senza verificarne il contenuto;
- ignorare modifiche prodotte fuori dai path autorizzati;
- non verificare branch o destinazione quando il lavoro comprende commit o push;
- non registrare test o evidenze significative;
- nascondere limiti o criteri falliti dietro una formula di successo;
- trasformare un risultato parziale in completamento pieno;
- lasciare una closure così povera da obbligare un auditor successivo a ricostruire tutta la run.

Il failure mode più profondo è confondere **la dichiarazione di completamento** con **l'evidenza di completamento**.

---

# 31.12 Relazioni con il resto del WCM

PROT-002 opera nel punto terminale del Service Job Lifecycle: non sostituisce il processo che governa l'esecuzione e non decide autonomamente quali siano gli acceptance criteria del lavoro.

Interagisce con altri elementi WCM quando questi sono pertinenti alla run. Per esempio, la verifica dei path e dei branch si collega ai vincoli di sicurezza Git; eventuali capability gap o impatti sulla knowledge base devono essere resi visibili nella closure quando emergono.

La relazione importante è funzionale: altri processi e protocolli possono definire **come** il lavoro viene svolto e quali vincoli deve rispettare; PROT-002 verifica che, al momento di chiuderlo, ciò che viene dichiarato corrisponda a ciò che può essere dimostrato.

---

# 31.13 Maturity e limiti

La baseline canonica classifica PROT-002 come **VALIDATED**.

Il protocollo riporta evidenze di applicazione in prove operative nelle quali stato, output e commit sono stati controllati separatamente dalla dichiarazione del servizio. Queste evidenze sostengono la baseline corrente nel perimetro in cui sono state raccolte.

`VALIDATED` non significa però che ogni possibile tipo di Service Job, ogni piattaforma o ogni scenario organizzativo sia stato universalmente validato.

PROT-002 ha inoltre limiti chiari:

- non inventa gli acceptance criteria;
- non sostituisce l'authority che li ha definiti;
- non garantisce la qualità assoluta di un risultato oltre i criteri verificabili applicabili;
- non trasforma una prova tecnica in approvazione organizzativa quando quest'ultima è richiesta da altre regole WCM.

Il suo compito è più preciso: rendere la dichiarazione `DONE` dipendente da evidenze verificabili.

---

# 31.14 Source map

Fonte canonica primaria utilizzata per il Technical Truth Pass:

- `wcm/process-book/protocols/PROT-002_RESULT_ACCEPTANCE_CLOSURE.md`.

Fonti di governance/editoriali utilizzate per mapping, bootstrap e continuità:

- `WCM_AGENT_START.md`;
- `wcm/documentation/process-memory-book/BOOK_INDEX.md`;
- `wcm/documentation/process-memory-book/BOOK_STATUS.md`;
- ultimo capitolo FROZEN realmente presente e relative review.

Il capitolo non estende il protocollo oltre quanto sostenuto dalla baseline canonica e usa esempi esclusivamente pedagogici e domain-agnostic.

---

# 31.15 La regola da ricordare

Se di questo capitolo dovesse restare una sola idea, è questa:

> **un lavoro non è concluso perché qualcuno dice che lo è: è concluso quando il risultato richiesto può essere verificato rispetto ai criteri che ne definiscono l'accettazione.**

PROT-002 protegge il significato di `DONE`: prima si osservano risultato, criteri, scope ed evidenze; solo dopo si chiude.