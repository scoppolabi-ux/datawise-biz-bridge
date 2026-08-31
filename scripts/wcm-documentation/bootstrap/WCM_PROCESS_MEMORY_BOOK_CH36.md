# Capitolo 36 — PROT-007 — Decision Change & Impact Analysis

**PARTE VII — Il Libro dei Protocolli WCM**  
**Stato:** FROZEN  
**Data:** 2026-08-30  
**Scope:** WCM generale, domain-agnostic

---

# 36.0 Cambiare una decisione senza cancellare ciò che ha prodotto

Cambiare idea è normale. In qualunque organizzazione, una decisione può diventare superata perché arrivano nuove informazioni, cambiano le condizioni oppure l'autorità competente sceglie una direzione diversa.

Il problema non è il cambiamento.

Il problema nasce quando una decisione viene trattata come una frase isolata che può essere semplicemente sostituita con un'altra.

Una decisione importante, infatti, tende a lasciare conseguenze: documenti vengono scritti, attività vengono avviate, requisiti vengono definiti, altre scelte vengono prese assumendo che quella decisione sia valida. Quando la decisione cambia, una parte di ciò che viene dopo può restare corretta, una parte può richiedere revisione e una parte può non avere più senso.

`PROT-007 — Decision Change & Impact Analysis` esiste per governare questo passaggio.

La sua idea centrale è semplice:

> **Una decisione materiale non si sovrascrive: si sostituisce preservando la storia e verificando ciò che dipendeva da essa.**

Nel linguaggio del WCM, cambiare una decisione significa modificare un nodo causale. Non basta quindi registrare il nuovo stato. Occorre capire, per quanto possibile, quali elementi conosciuti sono stati costruiti a valle della decisione precedente e che cosa il cambiamento comporta per loro.

---

# 36.1 Il problema che PROT-007 risolve

Immaginiamo una situazione molto comune.

Un'organizzazione decide che una certa consegna dovrà rispettare una determinata scadenza. Sulla base di quella scelta vengono pianificate attività, assegnate priorità e preparati materiali.

In seguito, l'autorità competente cambia la scadenza.

Se il sistema aggiorna soltanto la data e dimentica tutto il resto, la memoria appare pulita ma può essere falsa. Alcune attività potrebbero non essere più urgenti; altre potrebbero diventare inutili; un documento potrebbe contenere ancora la vecchia data; un piano successivo potrebbe continuare a dipendere dalla decisione precedente.

Il vero problema è quindi questo:

```text
NUOVA DECISIONE
      ↓
NON CAMBIA SOLO UNA FRASE
      ↓
PUÒ CAMBIARE CIÒ CHE È STATO COSTRUITO DOPO
```

PROT-007 impedisce che la memoria organizzativa nasconda questa causalità.

---

# 36.2 Prima domanda: è davvero una nuova decisione?

Non tutto ciò che viene detto modifica lo stato decisionale.

Una riflessione può esplorare una possibilità. Un'ipotesi può essere utile senza essere adottata. Una proposta può essere discussa e poi abbandonata. Una decisione, invece, cambia ciò che l'organizzazione considera operativo o autorevole.

Per questo PROT-007 parte da un gate di classificazione:

```text
RIFLESSIONE
IPOTESI
PROPOSTA
DECISIONE
FROZEN DECISION
```

La distinzione è fondamentale.

Se una frase viene scambiata troppo presto per decisione, il sistema può propagare un cambiamento che nessuno aveva realmente autorizzato. Se una decisione effettiva viene trattata come semplice commento, il sistema può continuare a operare sulla base precedente.

Il protocollo considera sostitutiva dello stato precedente soltanto una `DECISIONE`, una `FROZEN DECISION` o un equivalente esplicito proveniente dall'autorità competente.

In altre parole:

> **prima di analizzare l'impatto bisogna essere certi che esista davvero un nuovo stato decisionale autorizzato.**

---

# 36.3 Quando il protocollo si attiva

PROT-007 si applica quando un nuovo input rappresenta una modifica effettiva a una decisione materiale che può influenzare elementi successivi.

Il protocollo canonico cita, tra gli esempi, cambiamenti relativi a:

- scope;
- pricing o economics;
- roadmap;
- requisiti;
- architettura;
- identità o brand;
- governance;
- vincoli;
- decisioni già frozen;
- contenuti approvati che alimentano lavoro successivo.

Questa lista non significa che ogni modifica in queste aree abbia automaticamente lo stesso peso. Il punto è la **materialità**: il cambiamento deve essere abbastanza significativo da poter modificare il senso o la validità di ciò che dipendeva dalla decisione precedente.

Un refuso, una correzione locale o una micro-variazione priva di impatto materiale non richiedono la versione pesante del protocollo.

---

# 36.4 Gli input necessari

Per analizzare correttamente un cambio di decisione servono almeno alcuni elementi concettuali.

## La nuova decisione candidata

Che cosa sta cambiando, esattamente?

## L'autorità

Chi ha il potere di trasformare quella proposta in decisione effettiva?

## La decisione precedente

Quale stato viene sostituito?

## Il lineage minimo

Qual è il legame tra vecchio e nuovo stato?

## Le dipendenze conosciute

Quali documenti, attività, requisiti, scelte o altri elementi fanno riferimento alla decisione precedente o ne dipendono in modo noto?

Questi input permettono di evitare due errori opposti: propagare troppo, inventando conseguenze che non esistono, oppure propagare troppo poco, ignorando dipendenze già note.

---

# 36.5 Il flusso completo

Il protocollo può essere letto come una sequenza di domande.

```text
NEW DECISION CANDIDATE
        ↓
È DAVVERO UNA DECISIONE + HA AUTHORITY?
        ↓
QUAL È LA DECISIONE PRECEDENTE?
        ↓
QUAL È IL LEGAME TRA LE DUE?
        ↓
COSA DIPENDE DALLA DECISIONE PRECEDENTE?
        ↓
QUAL È L'IMPATTO PREVEDIBILE?
        ↓
SERVE CONFERMA / ESCALATION?
   ├─ SÌ → Impact Preview → attendi authority
   └─ NO → propaga entro il mandato già valido
        ↓
OLD = SUPERSEDED
NEW = ACTIVE/FROZEN
        ↓
AGGIORNA GLI ELEMENTI AUTORIZZATI
        ↓
CONSISTENCY CHECK
```

Questo flusso non serve a rendere il cambiamento burocratico. Serve a impedire che il sistema perda il rapporto causa-effetto tra una decisione e ciò che è stato costruito sopra di essa.

---

# 36.6 Il lineage: la storia non viene cancellata

Quando una decisione cambia, la precedente non sparisce.

Il protocollo richiede di preservarla come stato storico e di collegarla alla nuova.

In forma tecnica minima, la decisione precedente può essere marcata come:

```yaml
STATUS: SUPERSEDED
SUPERSEDED_BY: <new decision id>
```

mentre la nuova registra il collegamento inverso:

```yaml
SUPERSEDES: <old decision id>
```

Per un lettore non tecnico, il significato è molto semplice.

Non si strappa la vecchia pagina dal registro. Si annota invece che quella decisione non è più corrente e si indica quale decisione l'ha sostituita.

Questo permette, in futuro, di capire perché un documento o un'attività esistessero in una certa forma in un determinato momento.

La storia non è un ingombro: è ciò che rende spiegabile l'evoluzione del sistema.

---

# 36.7 Impact Preview: vedere le conseguenze prima di propagare

Una volta identificata la decisione precedente e le dipendenze conosciute, il WCM costruisce un **Impact Preview**.

L'Impact Preview non è ancora la propagazione del cambiamento. È una rappresentazione delle conseguenze note o sospette prima che vengano applicate.

Per ogni elemento collegato, PROT-007 prevede quando possibile una classificazione:

- `UNCHANGED` — resta valido;
- `REVIEW_REQUIRED` — deve essere riesaminato;
- `UPDATE_REQUIRED` — richiede una modifica nota;
- `CANCEL/REVOKE` — non è più coerente con il nuovo stato;
- `SUPERSEDED` — viene sostituito;
- `UNKNOWN_IMPACT` — la dipendenza è plausibile, ma l'effetto non è determinabile con sufficiente confidenza.

Queste categorie rispondono a una domanda pratica:

> **che cosa sappiamo già dell'effetto della nuova decisione su ogni elemento rilevante?**

Il valore dell'Impact Preview sta proprio nel rendere visibile l'incertezza invece di nasconderla.

`UNKNOWN_IMPACT` non è un errore da cancellare. È l'ammissione corretta che un legame può esistere senza che il sistema abbia abbastanza evidenza per decidere autonomamente che cosa fare.

---

# 36.8 Quando il protocollo deve fermarsi per authority

Non tutti i cambiamenti possono essere propagati automaticamente anche quando la nuova decisione è chiara.

PROT-007 richiede che Wise mostri l'Impact Preview prima della propagazione quando ricorre almeno una condizione sensibile, per esempio:

- la decisione precedente è `FROZEN` o governance-sensitive;
- gli impatti economici, legali o commerciali possono essere materiali;
- esiste un `UNKNOWN_IMPACT` significativo;
- il cambiamento annulla lavoro già completato o autorizzato;
- la propagazione richiede una nuova decisione Board.

In questi casi il protocollo non attribuisce al sistema una nuova authority.

La sequenza è:

```text
CAMBIO MATERIALE
      ↓
IMPACT PREVIEW
      ↓
AUTHORITY NECESSARIA
      ↓
STOP FINO ALLA DECISIONE COMPETENTE
```

Negli altri casi, se l'authority è già chiara, il mandato comprende il cambiamento e gli impatti sono determinabili, la propagazione può avvenire entro quel mandato.

Questa distinzione impedisce di confondere capacità di analisi con diritto di decidere.

---

# 36.9 Un esempio pedagogico

Immaginiamo un'organizzazione che abbia deciso di consegnare un documento in una certa lingua.

Dopo qualche giorno, l'autorità competente decide che la consegna dovrà avvenire in due lingue.

La nuova decisione non implica necessariamente che tutto il lavoro già fatto sia da rifare.

L'Impact Preview potrebbe mostrare, in termini puramente pedagogici:

```text
DOCUMENTO PRINCIPALE → UPDATE_REQUIRED
STRUTTURA DEI CONTENUTI → UNCHANGED
PIANO DI REVISIONE → REVIEW_REQUIRED
VERSIONE MONOLINGUA GIÀ APPROVATA → SUPERSEDED
TEMPO DI CONSEGNA → UNKNOWN_IMPACT
```

L'esempio non introduce una nuova regola WCM. Serve a mostrare che una decisione può produrre impatti diversi su elementi diversi.

Il protocollo non assume che “tutto cambia” né che “basta cambiare una riga”. Analizza ciò che è noto e rende visibile ciò che non lo è.

---

# 36.10 Dependency discipline: non inventare legami causali

Un sistema che cerca tutti gli impatti possibili può cadere facilmente nell'eccesso opposto: vedere dipendenze ovunque.

PROT-007 lo vieta.

Le dipendenze devono derivare da fonti sufficientemente supportate, come:

- collegamenti espliciti già registrati;
- documenti, task o requisiti che citano la decisione;
- inferenze ad alta confidenza, dichiarate come tali;
- escalation quando il legame o l'impatto non sono determinabili.

Il principio è importante perché l'Impact Analysis non deve diventare una macchina di supposizioni.

Il WCM deve essere capace di dire sia:

> “questo elemento dipende dalla decisione”

sia:

> “potrebbe dipendere, ma non ho evidenza sufficiente per trattarlo come fatto”.

---

# 36.11 La propagazione controllata

Dopo il gate di authority, gli elementi autorizzati possono essere aggiornati.

La propagazione non significa necessariamente modificare tutto ciò che è stato identificato.

La classificazione dell'impatto determina la natura del passo successivo:

```text
UNCHANGED       → nessuna modifica necessaria
REVIEW_REQUIRED → riesame prima di decidere
UPDATE_REQUIRED → modifica autorizzata
CANCEL/REVOKE   → chiusura o revoca secondo authority
SUPERSEDED      → sostituzione preservando lineage
UNKNOWN_IMPACT  → nessuna decisione silenziosa
```

Questa disciplina permette di mantenere separati tre concetti che spesso vengono confusi:

1. **sapere che qualcosa è coinvolto**;
2. **sapere quale impatto ha**;
3. **avere authority per modificarlo**.

La conoscenza dell'impatto non crea automaticamente il diritto di scrivere o approvare il cambiamento.

---

# 36.12 Output: che cosa deve essere vero alla fine

Il cambio è consolidato quando:

- la nuova decisione ha authority e status chiari;
- la decisione precedente è preservata e collegata;
- gli elementi impattati noti sono stati classificati;
- le modifiche autorizzate sono state propagate;
- gli impatti non risolti restano visibili;
- la memoria persistente non contiene una contraddizione silenziosa fra vecchio e nuovo stato.

L'output reale non è quindi “nuova decisione salvata”.

È una **transizione decisionale spiegabile**, in cui si può ricostruire:

- da quale stato si partiva;
- quale decisione lo ha sostituito;
- quali conseguenze erano note;
- quali sono state applicate;
- quali sono rimaste aperte.

---

# 36.13 Failure mode

PROT-007 previene soprattutto failure semantiche, spesso invisibili al momento in cui vengono create.

## Sovrascrittura della decisione precedente

La vecchia decisione viene cancellata o riscritta. La memoria mostra soltanto il presente e perde la capacità di spiegare il passato.

## Proposta scambiata per decisione

Un'idea ancora in discussione viene propagata come se avesse authority. Il sistema modifica elementi senza che esista una decisione valida.

## Decisione valida non propagata

La nuova decisione viene registrata, ma documenti e attività continuano a riflettere quella precedente.

## Propagazione indiscriminata

Tutto ciò che sembra collegato viene modificato senza distinguere tra `UNCHANGED`, `REVIEW_REQUIRED` e `UPDATE_REQUIRED`.

## Impatto ignoto risolto a intuito

Un `UNKNOWN_IMPACT` viene trasformato silenziosamente in una decisione. L'incertezza sparisce dal registro ma non dalla realtà.

## Dipendenze inventate

Il sistema assume legami causali non supportati e produce una catena di modifiche inutili o scorrette.

## Authority implicita

Il sistema conclude che, avendo compreso gli impatti, può anche approvare la propagazione. PROT-007 mantiene invece separate cognition e authority.

---

# 36.14 Relazioni con altri elementi WCM

PROT-007 non opera isolatamente.

## Con la Dual Memory

La Working Memory può contenere la nuova intenzione o il nuovo contesto, ma ciò che deve sopravvivere richiede consolidamento nella Persistent Organizational Memory con status e lineage chiari.

## Con PROC-006 — Memory Consolidation Loop

Dopo un delta materiale, la memoria persistente deve essere riallineata in modo coerente. PROT-007 aiuta a determinare quali elementi fanno parte dell'Impact Set decisionale.

## Con PROC-005 — Agent-Ready Context Bootstrap

Quando un agente riprende il lavoro deve poter distinguere la decisione corrente da quella superseded senza dover ricostruire tutto dalla conversazione.

## Con la disciplina dei nodi e delle relazioni

La decisione è trattata come nodo causale: i collegamenti espliciti e il lineage permettono di vedere che cosa viene sostituito e quali elementi possono esserne influenzati.

Queste relazioni non aggiungono nuove regole. Rendono visibile come il protocollo si inserisce nella baseline WCM corrente.

---

# 36.15 Maturity e limiti

La baseline canonica di PROT-007 è:

**VALIDATED BY GOVERNANCE / FIELD VALIDATION PENDING**.

Questo significa che il protocollo è una regola governata del WCM corrente, ma non deve essere presentato come universalmente dimostrato in ogni possibile organizzazione, dominio o scala operativa.

Restano limiti importanti.

Il protocollo può classificare bene soltanto gli impatti per i quali esiste conoscenza sufficiente. Se le dipendenze non sono state registrate o sono semanticamente ambigue, il sistema deve rendere visibile l'incertezza invece di simulare completezza.

Inoltre, l'Impact Analysis non sostituisce l'autorità umana o organizzativa. Può rendere migliori le decisioni mostrando conseguenze e lineage; non acquisisce per questo il potere di approvare cambiamenti che richiedono un gate superiore.

---

# 36.16 Source Map

Il Technical Truth Pass di questo capitolo è ancorato principalmente a:

- `wcm/process-book/protocols/PROT-007_DECISION_CHANGE_IMPACT_ANALYSIS.md` — fonte canonica primaria;
- `WCM_AGENT_START.md` — authority model, RUN/CHANGE discipline e source precedence correnti;
- `wcm/documentation/process-memory-book/BOOK_INDEX.md` — mapping editoriale CH36 ↔ PROT-007;
- relazioni dichiarate dalla fonte canonica: `CONCEPT-009 Decision Lineage & Causal Impact`, `CONCEPT-008 Dual-Memory Cognitive Continuity`, `PROC-006 Memory Consolidation Loop`, `PROC-005 Agent-Ready Context Bootstrap`.

Le fonti collegate sono usate soltanto per chiarire il contesto necessario. Il capitolo non modifica processi, protocolli, governance, architecture o Method KB e non introduce nuove regole WCM sotto forma di prosa editoriale.

---

# 36.17 La regola da ricordare

Se dovessimo conservare una sola idea di PROT-007, sarebbe questa:

> **Quando cambia una decisione materiale, non cancellare il passato e non propagare alla cieca: preserva il lineage, guarda ciò che dipendeva dalla decisione e rendi visibile ciò che sai, ciò che deve cambiare e ciò che ancora non sai.**

Una buona memoria organizzativa non ricorda soltanto qual è la decisione di oggi.

Ricorda anche **come ci si è arrivati e che cosa quella decisione ha cambiato**.