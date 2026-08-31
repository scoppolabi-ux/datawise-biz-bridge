# Capitolo 38 — PROT-009 — Contiguous Workflow Execution

**PARTE VII — Il Libro dei Protocolli WCM**  
**Stato:** FROZEN  
**Data:** 2026-08-31  
**Scope:** WCM generale, domain-agnostic

---

# 38.0 Un lavoro non finisce perché finisce una sessione

Molti sistemi basati su conversazioni hanno un confine naturale: ricevono una richiesta, eseguono qualcosa, producono una risposta e si fermano. Per un'attività isolata questo può essere sufficiente. Per un workflow composto da più passaggi, invece, può diventare un problema.

Immaginiamo un lavoro già autorizzato che preveda quattro passaggi consecutivi e un gate finale. Se il sistema completa il primo passaggio e poi si ferma soltanto perché è terminata una sessione o un heartbeat, il workflow reale non è arrivato alla propria fermata: è stato semplicemente interrotto da un confine tecnico o conversazionale.

`PROT-009 — Contiguous Workflow Execution` esiste per evitare questa confusione.

La sua idea centrale è:

> **Il workflow definisce che cosa deve essere eseguito e dove ci si deve fermare; la sessione non può inventare una fermata intermedia.**

Il protocollo non decide quali siano le fasi di un progetto e non amplia l'autorità di chi esegue. Garantisce invece che un workflow già definito e autorizzato continui attraverso le transizioni contigue di tipo WCM RUN fino a una vera stop condition, e che possa essere ripreso correttamente se una sessione termina prima.

Tre invarianti sintetizzano il principio:

```text
FINE SESSIONE ≠ FINE WORKFLOW
LIMITE TECNICO REALE ≠ COMPLETED
AUTHORITY DEL WORKFLOW ≠ AUTHORITY DELLA SINGOLA SESSIONE
```

---

# 38.1 Il problema che PROT-009 risolve

Il rischio principale è la **terminazione prematura del workflow**.

Supponiamo che una procedura preveda:

```text
A → B → C → GATE
```

Se A è completato e B è già previsto, autorizzato e appartenente allo stesso workflow, fermarsi dopo A senza una ragione valida produce uno stato artificiale. Il sistema potrebbe poi sembrare inattivo o addirittura completo mentre il lavoro logico è ancora aperto.

C'è un secondo rischio: la perdita di continuità tra sessioni. Se ciò che è stato completato e ciò che viene dopo esistono soltanto nella conversazione corrente, una nuova sessione potrebbe ripartire da zero, ripetere azioni già eseguite oppure non sapere quale transizione debba venire dopo.

Infine c'è il rischio più grave: il **falso completamento**. Un limite tecnico, un output intermedio o una pausa non devono essere trasformati semanticamente in `COMPLETED`.

PROT-009 separa quindi tre cose che possono sembrare simili ma non lo sono:

- la fine di una risposta o di una sessione;
- un'interruzione tecnica reale;
- la conclusione logica del workflow.

Solo la terza consente di dichiarare il workflow completato, e soltanto quando il relativo Completion Gate lo permette.

---

# 38.2 Quando il protocollo si attiva

PROT-009 si applica quando esiste un **workflow materiale attivo e autorizzato** che può attraversare più transizioni.

Il trigger non è semplicemente “c'è altro lavoro da fare”. Deve esistere un workflow vigente che definisca almeno lo scope, l'autorità, la transizione corrente o successiva e la propria stop condition.

Prima del normale routing operativo, il bootstrap verifica inoltre se esiste un workflow:

- `ACTIVE` con true stop non ancora raggiunta; oppure
- `INTERRUPTED_RESUMABLE`.

In questi casi si applica la **Resume Priority**: prima di aprire nuovo lavoro dello stesso progetto, il sistema verifica se deve riprendere quello già iniziato.

Il protocollo non importa workflow da altri contesti e non inventa fasi mancanti. La governance specifica del lavoro resta l'autorità su fasi, dipendenze, acceptance criteria, gate, artefatti e stop condition.

---

# 38.3 Gli input necessari

Per continuare un workflow in modo affidabile non basta ricordare genericamente che “c'era qualcosa in corso”. Servono informazioni persistenti sufficienti a ricostruire lo stato esecutivo.

Gli input essenziali sono:

- l'identità stabile dell'istanza di workflow;
- il contesto o progetto a cui appartiene;
- lo stato corrente;
- i riferimenti di authority;
- lo scope autorizzato;
- l'ultima transizione completata;
- la prossima transizione;
- la vera stop condition;
- gli step già completati;
- l'eventuale causa di interruzione;
- lo stato del Completion Gate.

Nella baseline corrente questi elementi vengono rappresentati in un checkpoint durevole del workflow. Il checkpoint è l'execution master: conserva ciò che serve per sapere dove l'esecuzione si trova e da dove deve riprendere.

Una vista umana dello stato può sintetizzare la situazione, ma non sostituisce il checkpoint esecutivo.

---

# 38.4 Il checkpoint: il segnalibro dell'esecuzione

Un modo semplice per comprendere il checkpoint è pensare a un segnalibro che non indica soltanto la pagina raggiunta, ma anche quale passo è stato davvero completato e quale viene dopo.

Il protocollo richiede che il checkpoint venga aggiornato **dopo ogni transizione materiale completata**, non soltanto quando si prevede una pausa.

Esempio pedagogico:

```text
TRANSIZIONE A COMPLETATA
        ↓
CHECKPOINT: LAST=A / NEXT=B
        ↓
INTERRUZIONE IMPREVISTA
        ↓
NUOVA SESSIONE
        ↓
LEGGE NEXT=B
        ↓
RIPRENDE DA B
```

Questo evita che il sistema debba ricostruire il passato a memoria.

Serve anche a proteggere dall'errore opposto: ripetere ciò che è già stato fatto. Uno step registrato tra quelli completati non deve essere rieseguito salvo una riapertura esplicita che lo renda nuovamente eleggibile.

Il checkpoint rende quindi la continuità una proprietà persistente del workflow, non una speranza affidata alla memoria della sessione.

---

# 38.5 Il flusso della Contiguous RUN

Quando una transizione termina, PROT-009 impone una verifica prima dell'uscita:

```text
ESISTE UNA NEXT TRANSITION?
        ↓ sì
È GIÀ AUTORIZZATA?
        ↓ sì
È WCM RUN?
        ↓ sì
APPARTIENE ALLO STESSO WORKFLOW?
        ↓ sì
ESISTE UNA STOP CONDITION QUI?
      ↓ no
   CONTINUE
```

La logica è importante perché impedisce di confondere “ho prodotto un risultato” con “il workflow è arrivato al punto in cui deve fermarsi”.

Se, per esempio, un workflow prevede preparazione, verifica e consolidamento prima di un gate, la produzione del primo artefatto non autorizza automaticamente l'uscita. Se i passaggi successivi sono già autorizzati e non esiste una stop condition, l'esecuzione continua.

Questo non significa eseguire indefinitamente. Significa rispettare il confine stabilito dal workflow invece di sostituirlo con il confine accidentale della sessione.

---

# 38.6 Le vere stop condition

La continuità non elimina i gate. Al contrario, funziona perché distingue con precisione una pausa arbitraria da una fermata legittima.

La baseline canonica riconosce come stop condition, tra le altre:

1. un gate o uno stop esplicitamente previsto dal workflow;
2. una decisione riservata all'owner, al Board o ad altra authority competente;
3. una prossima transizione classificata `WCM CHANGE` senza l'authority necessaria;
4. un blocker reale;
5. una capability necessaria realmente non disponibile o un capability gap verificato;
6. un errore tecnico che impedisce di proseguire in sicurezza;
7. un limite tecnico reale del runtime o della sessione;
8. un'azione sensibile o irreversibile soggetta a escalation.

Non sono invece stop condition, da sole:

- la produzione di un output intermedio;
- il trascorrere di un heartbeat;
- la normale fine di una risposta;
- il fatto che una singola attività materiale sia terminata.

Questa distinzione è uno dei punti più importanti del protocollo.

---

# 38.7 Interruzione tecnica non significa completamento

Può accadere che il workflow debba continuare ma uno strumento non funzioni, il runtime raggiunga un limite reale o una capability indispensabile non sia disponibile.

In questo caso il protocollo non pretende che l'esecuzione continui a ogni costo. Pretende però che lo stato racconti la verità.

Quando possibile, l'interruzione viene rappresentata come:

```text
STATUS = INTERRUPTED_RESUMABLE
resume_required = true
```

insieme all'ultimo step completato, alla prossima transizione, alla causa e all'evidenza disponibile.

La differenza è sostanziale:

```text
NON POSSO CONTINUARE ADESSO
≠
IL WORKFLOW È COMPLETO
```

Se l'interruzione è improvvisa e non è possibile aggiornare il checkpoint, quello precedente resta comunque utile: mostra che il workflow era ancora attivo e che la true stop condition non era stata raggiunta.

---

# 38.8 Resume Priority: riprendere prima di ricominciare

All'avvio di una nuova sessione il sistema non dovrebbe chiedersi soltanto “che cosa mi viene chiesto ora?”. Deve prima verificare se esiste un workflow incompleto che ha diritto di precedenza.

La sequenza è:

```text
WORKFLOW ACTIVE O INTERRUPTED_RESUMABLE?
        ↓ sì
RESUME PRIORITY
        ↓
VERIFICA AUTHORITY
        ↓
VERIFICA CHECKPOINT E IDEMPOTENZA
        ↓
RIPRENDI DA next_transition
```

L'authority valida resta associata allo stesso workflow e allo stesso scope anche quando cambia la sessione. Il semplice cambio di sessione non richiede una nuova approvazione.

La Resume Priority non è però assoluta. Può essere superata da sospensione esplicita, cancellazione, cambio di priorità autorizzato, blocker o gate reale.

Il principio da preservare è che un confine tecnico non deve trasformare un workflow unico in una serie di lavori scollegati.

---

# 38.9 Il Completion Gate

Arrivare all'ultima attività prevista non basta automaticamente a dichiarare `COMPLETED`.

Prima della chiusura, PROT-009 richiede un Completion Gate che verifichi, quando applicabili:

- output previsti completati;
- true stop condition raggiunta;
- checkpoint aggiornato;
- delta materiali consolidati;
- Impact Set propagato;
- viste correnti coerenti;
- assurance corrente oppure stato non-green dichiarato esplicitamente;
- next eligibility risolta.

In forma compatta:

```text
REQUISITI DI CHIUSURA SODDISFATTI
        ↓
closure_allowed = true
        ↓
COMPLETED CONSENTITO
```

Se manca un requisito obbligatorio:

```text
closure_allowed = false
COMPLETED = VIETATO
```

Il Completion Gate serve a impedire una forma insidiosa di errore: chiudere il workflow perché l'attività principale sembra finita mentre memoria, mirror, stato o conseguenze note sono ancora incoerenti.

---

# 38.10 Authority: continuità non significa libertà d'azione

PROT-009 non conferisce nuova authority.

Può continuare automaticamente soltanto attraverso transizioni che siano contemporaneamente:

- previste dal workflow vigente;
- già autorizzate;
- classificabili come `WCM RUN`;
- comprese nello scope persistito;
- non bloccate da una stop condition.

Se la prossima transizione modifica governance, authority, scope, canone, materiale frozen o altra decisione materiale, non è più una semplice prosecuzione. Si applica `WCM CHANGE` e, se manca l'autorità necessaria, il workflow si ferma in attesa dell'authority competente.

Questo è il confine che impedisce alla continuità operativa di diventare espansione autonoma del mandato.

---

# 38.11 Un esempio pedagogico

Consideriamo un workflow astratto per preparare una consegna:

```text
RACCOGLI INPUT
→ PREPARA BOZZA
→ VERIFICA CRITERI
→ CONSOLIDA STATO
→ GATE UMANO
```

L'esempio è soltanto pedagogico e non introduce una nuova regola WCM.

Se `RACCOGLI INPUT` e `PREPARA BOZZA` sono già autorizzati nello stesso workflow, non esiste un gate tra loro e gli strumenti necessari funzionano, la fine della prima attività non è una ragione valida per fermarsi.

Se invece, dopo `VERIFICA CRITERI`, il workflow prevede esplicitamente un `GATE UMANO`, quello è un vero punto di arresto.

Se durante `PREPARA BOZZA` uno strumento indispensabile fallisce, il workflow non viene dichiarato completo: resta riprendibile dalla transizione corretta.

Se una nuova sessione si apre dopo la verifica, il checkpoint impedisce di rifare la raccolta degli input e indirizza l'esecuzione verso il passo successivo.

---

# 38.12 Failure mode principali

## Premature Workflow Termination

Il sistema termina dopo un passaggio anche se esiste una next transition autorizzata e nessuna stop condition.

Effetto: il workflow resta logicamente aperto ma operativamente abbandonato.

## Session Boundary Loss

La sessione cambia e il sistema perde il punto di ripresa.

Effetto: duplicazioni, omissioni o ricostruzioni incerte.

## Duplicate Execution

Uno step già completato viene rieseguito perché il checkpoint non viene rispettato.

Effetto: doppie azioni, output duplicati o mutazioni ripetute.

## False Completion

Un limite tecnico o un risultato parziale viene registrato come completamento.

Effetto: lo stato persistente dichiara una realtà che non esiste.

## Partial Propagation Closure

L'attività principale è conclusa, ma gli elementi correnti che devono rifletterne l'esito sono ancora incoerenti.

Effetto: il workflow appare chiuso mentre il sistema conserva rappresentazioni incompatibili.

## Authority Creep

La regola di continuità viene interpretata come permesso di attraversare una transizione non autorizzata.

Effetto: il sistema supera il proprio mandato. PROT-009 lo vieta esplicitamente.

---

# 38.13 Relazioni con gli altri elementi WCM

PROT-009 opera insieme ad altri elementi della baseline.

`WCM_AGENT_START.md` applica Resume Priority durante il bootstrap e richiama la continuità fino alla true stop condition.

Il checkpoint durevole rappresenta lo stato dell'esecuzione e alimenta la riconciliazione deterministica dello stato corrente.

`PROC-006` interviene sul consolidamento dei delta materiali; `PROC-008` e `PROT-013` partecipano quando è necessaria assurance sulla memoria e sulle relazioni; il Completion Gate usa queste verifiche quando applicabili.

`PROT-011` protegge dalle false dichiarazioni di capability gap prima che un presunto limite diventi una ragione di arresto.

La governance specifica del workflow resta comunque superiore nel definire che cosa debba accadere e dove siano i gate reali.

---

# 38.14 Maturity e limiti

La fonte canonica qualifica PROT-009 come:

**VALIDATED BY GOVERNANCE / SESSION-INDEPENDENT BASELINE ACTIVE / FIELD VALIDATION IN PROGRESS**.

Questo significa che la regola è parte della baseline vigente e che il modello di continuità tra sessioni è attivo, ma non autorizza a sostenere che ogni possibile workflow, runtime o scenario operativo sia stato universalmente validato sul campo.

Il protocollo ha inoltre un limite intenzionale: non stabilisce il contenuto dei workflow. Se un workflow è ambiguo, privo di authority o non definisce una next transition affidabile, PROT-009 non inventa ciò che manca.

La continuità può essere deterministica soltanto quanto lo consente lo stato persistito su cui si appoggia.

---

# 38.15 Source map

Fonti usate per il Technical Truth Pass:

- `WCM_AGENT_START.md` — bootstrap, Resume Priority, WCM RUN/WCM CHANGE, pre-exit e source precedence;
- `wcm/documentation/process-memory-book/BOOK_INDEX.md` — mapping editoriale CH38;
- `wcm/process-book/protocols/PROT-009_CONTIGUOUS_WORKFLOW_EXECUTION.md` — fonte canonica primaria del protocollo.

Nessuna regola nuova è introdotta dal capitolo. Gli esempi sono pedagogici e domain-agnostic.

---

# 38.16 La regola da ricordare

PROT-009 può essere ricordato con una frase:

> **Non fermare un workflow perché finisce la sessione; fermalo dove il workflow prevede davvero di fermarsi.**

E, se un limite tecnico interrompe l'esecuzione:

> **conserva il punto di ripresa e non chiamare “completo” ciò che è soltanto interrotto.**
