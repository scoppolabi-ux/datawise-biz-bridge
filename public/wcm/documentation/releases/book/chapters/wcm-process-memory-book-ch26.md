# Capitolo 26 — PROC-010 — Documentation Continuity Loop

**Parte VI — Il Libro dei Processi WCM**  
**Stato:** FROZEN  
**Data:** 2026-08-30  
**Scope:** WCM generale, domain-agnostic

---

# 26.0 Un sistema può essere corretto e raccontarsi male

Un'organizzazione può funzionare correttamente e avere comunque documentazione sbagliata.

Può aver cambiato un processo, introdotto un nuovo controllo, modificato una responsabilità o corretto un comportamento operativo, mentre i manuali continuano a descrivere il mondo precedente. In quel momento il problema non è soltanto editoriale: chi legge può prendere decisioni sulla base di una rappresentazione che non corrisponde più alla realtà.

`PROC-010 — Documentation Continuity Loop` nasce per evitare questo disallineamento.

La sua domanda fondamentale è:

> **dopo un cambiamento reale, quali documenti devono cambiare affinché la rappresentazione human-facing resti coerente con la baseline corrente?**

Il principio centrale è:

```text
BASELINE REALE
≠
DOCUMENTAZIONE AUTOMATICAMENTE CORRENTE
```

La documentazione deve essere mantenuta intenzionalmente.

Ma esiste un secondo principio altrettanto importante:

```text
DOCUMENTAZIONE
≠
SOURCE OF TRUTH
```

I manuali spiegano il sistema. Non acquisiscono authority sul sistema soltanto perché sono leggibili, completi o ben scritti.

---

# 26.1 Che cos'è PROC-010

PROC-010 governa la continuità della documentazione human-facing quando la baseline WCM o una sua applicazione materiale cambia.

Il processo non parte dalla domanda «quale documento possiamo aggiornare?», ma da una domanda più disciplinata:

> **quale delta è avvenuto e quali rappresentazioni ne sono realmente influenzate?**

Il loop canonico è:

```text
MATERIAL DELTA
     ↓
PROC-006 IMPACT SET
     ↓
DOCUMENTATION IMPACT CHECK
     ↓
FONTI AUTOREVOLI MINIME
     ↓
AGGIORNAMENTO MASTER / CATALOGO
     ↓
CONSISTENCY CHECK
     ↓
VERSION / DATE / STATUS / PROVENANCE
     ↓
RELEASE NECESSARIA?
  ├─ NO  → masters current
  └─ YES → derivati + QA + distribuzione
```

Il valore del processo non è quindi «produrre documenti». È mantenere coerente il livello documentale con ciò che il sistema è davvero.

---

# 26.2 Tre famiglie documentali

La baseline corrente distingue tre famiglie principali.

## General WCM Documentation

È la documentazione generale del metodo. Comprende, nella baseline corrente, tre prospettive fondamentali:

- Technical Reference;
- Executive / Client Guide;
- User Manual.

Le tre proiezioni descrivono lo stesso sistema a pubblici diversi.

## Project Documentation Sets

Quando un'applicazione del WCM possiede maturità e complessità sufficienti, può avere un proprio set documentale human-facing composto normalmente da:

- Project Technical Reference;
- Project Executive / Commercial Guide;
- Project User Manual;
- Project Documentation Index.

Il set specifico non sostituisce la documentazione generale WCM e non deve duplicarla integralmente quando basta un riferimento.

## Automation & Flow Block Catalog

La terza famiglia rende leggibili i blocchi che compongono i flussi reali:

- automazioni deterministiche;
- review cognitive;
- heartbeat;
- projector;
- assurance;
- command flow;
- human gate;
- altri blocchi operativi materiali.

Il catalogo serve soprattutto a impedire che componenti con authority differenti vengano compressi sotto la parola generica «automazione».

---

# 26.3 Perché servono prospettive diverse

Una documentazione unica può essere tecnicamente completa e praticamente inutilizzabile.

Un tecnico ha bisogno di sapere, per esempio:

- quali sono le source of truth;
- quali componenti scrivono stato;
- quale processo dipende da quale protocollo;
- dove esistono fallback;
- come si osserva una failure.

Un lettore executive ha una domanda diversa:

- quale problema viene risolto;
- quale valore è realmente supportato;
- quanto controllo resta umano;
- quali limiti bisogna conoscere;
- che cosa è operativo e che cosa è ancora in validazione.

Un utilizzatore vuole invece sapere:

- cosa significa uno stato;
- quando deve intervenire;
- quando deve attendere;
- quale azione è disponibile;
- quale comportamento deve evitare.

Le prospettive sono quindi diverse, ma non possono produrre verità diverse.

```text
PUBBLICI DIVERSI
→ LINGUAGGI DIVERSI
→ STESSA BASELINE
```

---

# 26.4 Il trigger: non ogni modifica richiede una riscrittura

PROC-010 viene attivato quando un delta materiale può avere impatto human-facing o flow-level.

Fra i trigger canonici rientrano:

- WCM CHANGE autorizzata e implementata prima della closure;
- WCM RUN che modifica comportamento utente, capability operativa, UI, maturità o modalità d'uso descritte;
- modifica materiale di governance, architecture, capability o Process Book;
- nascita, modifica o ritiro di un flow block documentato;
- promotion di un learning che modifica una baseline descritta;
- cambiamento materiale di un workflow documentato;
- onboarding o attivazione che richiede documentazione human-facing;
- richiesta esplicita di una release documentale.

Ma esiste anche un esito legittimo:

```text
NO IMPACT
```

Una correzione tecnica interna che non cambia il contratto visibile, il comportamento o il significato può non richiedere modifiche documentali.

Questo evita che il processo diventi una riscrittura rituale dopo qualsiasi commit.

---

# 26.5 Il Documentation Impact Check

Il cuore operativo di PROC-010 è il **Documentation Impact Check**.

Per ogni delta materiale il sistema deve dichiarare esplicitamente se esiste impatto sulle diverse categorie.

Una forma compatta è:

```text
GENERAL WCM
Technical Reference:       YES / NO — reason
Executive / Client Guide:  YES / NO — reason
User Manual:               YES / NO — reason

PROJECT DOCUMENTATION
Affected projects:         [...] / NONE
Project Technical:         YES / NO — reason
Project Commercial:        YES / NO — reason
Project User Manual:       YES / NO — reason

AUTOMATION / FLOW CATALOG
New/changed/retired block: YES / NO — reason

Release artifacts needed:  YES / NO — reason
```

L'importante non è soltanto la risposta `YES` o `NO`.

Conta la motivazione.

Un `NO` esplicito e motivato è informazione utile: dimostra che la categoria è stata valutata e non semplicemente dimenticata.

---

# 26.6 PROC-006 viene prima

PROC-010 non dovrebbe inventare autonomamente l'elenco degli impatti.

Quando il lavoro produce un delta materiale, `PROC-006 — Memory Consolidation & Consistency Loop` costruisce l'Impact Set e verifica quali superfici possono essere coinvolte.

PROC-010 usa quel risultato per concentrarsi sul livello documentale.

```text
DELTA
  ↓
PROC-006
  ↓
IMPACT SET
  ↓
PROC-010
  ↓
DOCUMENTATION IMPACT CHECK
```

La relazione è importante perché impedisce di trattare la documentazione come un'attività isolata alla fine del lavoro.

La continuity documentale è una parte della propagazione del cambiamento.

---

# 26.7 Source discipline: documentare non significa interpretare liberamente

Quando una categoria è `YES`, il processo recupera le **fonti autorevoli minime** necessarie.

Per la documentazione generale, le sorgenti possono includere, secondo il caso:

- governance e mandate;
- decisioni attive;
- architecture corrente;
- capability map;
- Process Book;
- Method KB;
- configurazioni di automazione;
- evidence necessaria a qualificare maturità o stato.

Per gli execution facts, lo stato runtime strutturato mantiene la propria precedenza nel suo perimetro.

La regola resta INDEX-FIRST:

```text
IMPACT IDENTIFICATO
      ↓
QUAL È LA FONTE PIÙ AUTOREVOLE?
      ↓
RECUPERA IL MINIMO SUFFICIENTE
      ↓
STOP WHEN SUFFICIENT
```

La documentazione non deve essere aggiornata leggendo indiscriminatamente tutto ciò che esiste.

E soprattutto non può trasformare una discussione, un concept aperto o un esperimento in una capability corrente soltanto perché il materiale è disponibile.

---

# 26.8 Technical Reference: precisione prima della semplificazione

Il Technical Reference può usare il linguaggio più specialistico.

Deve rendere visibili, quando pertinenti:

- architecture logica e fisica;
- data flow e persistence;
- source of truth, read model e projection;
- processi e protocolli;
- capability e routing;
- memory, assurance e learning architecture;
- automation topology;
- failure, recovery e observability;
- maturity reale dei componenti.

Una distinzione particolarmente importante è:

```text
IMPLEMENTATO
≠
VALIDATO
≠
FALLBACK
≠
FUTURO
```

Un documento tecnico che elimina queste differenze può essere elegante ma produce una rappresentazione falsa del sistema.

---

# 26.9 Executive / Client Guide: semplificare senza promettere troppo

La documentazione executive non deve copiare il Technical Reference in un linguaggio più leggero.

Deve rispondere a domande diverse:

- perché esiste questa capacità;
- quale problema affronta;
- quale valore è supportato dall'evidenza corrente;
- quale ruolo conserva l'essere umano;
- quali controlli esistono;
- quali limiti o maturity sono rilevanti.

La semplificazione è consentita.

La falsificazione no.

Una capability sperimentale non può diventare una garanzia commerciale soltanto perché la descrizione è rivolta a un pubblico non tecnico.

---

# 26.10 User Manual: descrivere soltanto ciò che l'utente può davvero fare

Lo User Manual è la proiezione più direttamente operativa.

Deve spiegare:

- percorsi realmente disponibili;
- significato di stati e badge;
- quando l'utente deve intervenire;
- quando deve attendere;
- quali automazioni stanno lavorando;
- quali azioni non devono essere duplicate;
- exception path che possono generare dubbi.

La UI può essere il riferimento pratico per l'esperienza corrente, ma non diventa per questo source of truth metodologica.

Se una schermata mostra un dato incompatibile con la baseline autorevole, il manuale non deve adattare la teoria alla schermata: deve emergere il drift.

---

# 26.11 Automation transparency

Un flow block materiale deve poter essere descritto attraverso un contratto leggibile.

La baseline prevede almeno:

```text
ID / NAME
LEVEL
TYPE
STATUS / MATURITY
WHY
TRIGGER / CADENCE
AUTHORITATIVE INPUTS
TRANSFORMATION / ROLE IN FLOW
OUTPUT / WRITE BOUNDARY
AUTHORITY / GUARDRAILS
STOP / FAILURE / RESUME
OBSERVABILITY
IMPLEMENTATION / EVIDENCE
```

Questa struttura serve a rispondere a una domanda semplice:

> **che cosa fa realmente questo blocco e fin dove arriva la sua authority?**

È importante perché due componenti possono apparire simili all'utente e avere responsabilità molto diverse.

Per esempio:

```text
EVIDENCE COLLECTOR
≠
COGNITIVE REVIEW
≠
HUMAN GATE
```

Fonderli in una sola descrizione rende opaco il sistema.

---

# 26.12 Cross-document consistency

Aggiornare ogni documento separatamente non basta.

Alla fine serve un controllo trasversale.

PROC-010 verifica almeno che:

1. nessun manuale contraddica governance, decisioni o architecture correnti;
2. la documentazione executive non presenti come consolidate capability non consolidate;
3. lo User Manual non descriva azioni inesistenti;
4. il Technical Reference distingua stato implementativo e maturity;
5. i termini principali mantengano lo stesso significato;
6. una documentazione specifica non ridefinisca arbitrariamente concetti WCM comuni;
7. il catalogo distingua blocchi globali e configurazioni specifiche;
8. deterministic automation, cognitive review e human gate restino distinti;
9. eventuali versioni distributive derivino dai master correnti.

Questa fase impedisce il fenomeno dei **documenti singolarmente plausibili ma collettivamente incompatibili**.

---

# 26.13 Il drift documentale

Quando il sistema cambia e la documentazione non cambia, nasce documentation drift.

La regola canonica è:

```text
FEATURE / FLOW CURRENT
+
DOCUMENTATION OR CATALOG STALE
=
DOCUMENTATION DRIFT
```

In presenza di drift, PROC-010 non può essere dichiarato `PASS`.

Alcuni segnali possono essere rilevati meccanicamente quando esistono versioni, marker o riferimenti confrontabili.

La riscrittura semantica, però, non viene affidata automaticamente a un repair engine generalista.

Un sistema può rilevare che due versioni non coincidono senza essere autorizzato a decidere autonomamente quale significato debba avere il nuovo testo.

---

# 26.14 Quando la documentazione deve fermarsi

Esiste un confine oltre il quale PROC-010 non può procedere.

Se per aggiornare un documento è necessario decidere:

- che cosa significhi davvero una nuova regola;
- quale interpretazione di governance debba prevalere;
- se una capability debba essere considerata canonica;
- se un conflitto semantico debba essere risolto in un modo o nell'altro;

allora il problema non è più documentale.

```text
DISCREPANZA DOCUMENTALE
      ↓
SEMANTICAMENTE DETERMINABILE DAL CANON?
  ├─ YES → aggiorna la proiezione
  └─ NO  → STOP / gate appropriato
```

La prosa non può creare authority.

---

# 26.15 Versioning e provenance

I master documentali possiedono un versioning proprio.

La baseline distingue:

- `PATCH` — correzione formale o linguistica senza cambio di significato;
- `MINOR` — nuova sezione, capability o cambiamento operativo compatibile;
- `MAJOR` — riorganizzazione sostanziale o cambiamento che rende superata la struttura precedente.

Il versioning documentale non sostituisce quello del metodo.

Una documentazione può passare da una versione alla successiva perché cambia la rappresentazione necessaria, senza che il WCM acquisisca automaticamente una nuova versione metodologica.

La provenance deve inoltre permettere di ricostruire da quali fonti è derivato il documento corrente.

---

# 26.16 Master e artefatti distributivi

La baseline documentale distingue il master dai formati di distribuzione.

```text
MASTER MARKDOWN
      ↓
DOCX / PDF / WEB / ALTRI DERIVATI
```

Un artefatto distributivo non deve diventare una source concorrente.

Se il master cambia, un vecchio PDF può essere perfettamente leggibile e contemporaneamente stale.

Quando una release è richiesta, la baseline prevede verifiche di coerenza e, per i formati impaginati, controllo del rendering.

Nel perimetro operativo temporaneo di questa fase editoriale, i nuovi capitoli del libro vengono chiusi e persistiti in GitHub senza eseguire publication o generare nuovi artefatti distributivi. Questo limita l'esecuzione della run corrente; non modifica la definizione canonica di PROC-010.

---

# 26.17 PROC-010 e WCM CHANGE closure

Per una WCM CHANGE materiale, la documentazione non è un'attività opzionale lasciata alla fine.

PROC-010 produce un input necessario alla chiusura governata da `PROC-012 — WCM Change Propagation & Closure`.

```text
WCM CHANGE IMPLEMENTATA
      ↓
DOCUMENTATION IMPACT CHECK
      ↓
YES PROPAGATI?
      ↓
PROC-010 PASS
      ↓
PROC-012 PROPAGATION GATE
```

Se una categoria documentale dichiarata `YES` non è stata aggiornata, il change non può essere considerato completamente propagato.

Questo rende esplicita una distinzione importante:

```text
CODICE / PROCESSO MODIFICATO
≠
CAMBIAMENTO CHIUSO
```

---

# 26.18 Chiusura del processo

PROC-010 è `PASS` quando:

- il Documentation Impact Check è esplicito;
- ogni categoria `YES` è stata aggiornata;
- le categorie `NO` sono motivate quando necessario;
- general documentation e documentazione specifica restano coerenti;
- il catalogo riflette i flow block materiali coinvolti;
- nessun conflitto semantico resta nascosto;
- eventuali release richieste derivano dai master correnti e hanno superato le verifiche previste.

Non è necessario che ogni run produca una release.

È necessario che la documentazione corrente non racconti una realtà diversa da quella autorevole.

---

# 26.19 Failure mode principali

PROC-010 fallisce o degrada quando:

- i manuali vengono trattati come source of truth;
- ogni modifica tecnica forza una riscrittura anche senza impatto reale;
- un `NO IMPACT` non viene valutato ma semplicemente assunto;
- una capability sperimentale viene descritta come consolidata;
- la UI viene usata per sovrascrivere la baseline;
- Technical, Executive e User documentation raccontano sistemi incompatibili;
- automation, cognition e human authority vengono fuse in una sola descrizione;
- una versione distributiva stale viene presentata come current;
- un repair automatico riscrive prosa semantica senza authority;
- la documentazione risolve implicitamente un conflitto di significato;
- una WCM CHANGE viene dichiarata chiusa senza propagare gli impatti documentali dichiarati.

Il failure mode più insidioso è una documentazione molto leggibile, ma non più vera.

---

# 26.20 Relazioni con gli altri processi

PROC-010 è collegato in modo diretto a più componenti del WCM.

## PROC-006 — Memory Consolidation & Consistency Loop

Produce l'Impact Set che permette di capire quali superfici documentali possono essere coinvolte.

## PROT-015 — Documentation Impact & Publication Standard

Definisce lo standard che vincola Impact Check, source discipline, projection discipline, versioning e publication.

## PROC-012 — WCM Change Propagation & Closure

Consuma l'esito documentale nella closure dei cambiamenti materiali.

La catena può essere letta così:

```text
PROC-006
   ↓
CHE COSA È STATO IMPATTATO?

PROC-010 + PROT-015
   ↓
COME DEVE ESSERE RIALLINEATA LA DOCUMENTAZIONE?

PROC-012
   ↓
IL CAMBIAMENTO È STATO PROPAGATO ABBASTANZA DA POTER ESSERE CHIUSO?
```

---

# 26.21 Maturity

La baseline corrente classifica PROC-010 come:

```text
ACTIVE
FIELD VALIDATION
PROJECT LAYER ENABLED
```

Questo significa che il processo è parte della baseline operativa corrente e include il livello di documentazione specifica, mentre la sua maturità continua a essere verificata sul campo.

Non significa che ogni tipo di organizzazione, progetto o superficie documentale sia già stato validato universalmente.

La forza del processo, nella maturity corrente, sta soprattutto nella disciplina che impone:

- il delta precede la riscrittura;
- l'impatto viene dichiarato;
- le fonti autorevoli precedono la prosa;
- pubblici diversi possono avere proiezioni diverse ma non verità incompatibili;
- la documentazione non acquisisce authority;
- una discrepanza semantica non viene nascosta dietro una revisione editoriale.

---

# 26.22 In sintesi

PROC-010 impedisce che il WCM evolva più velocemente della capacità di spiegare ciò che è diventato.

Il loop può essere riassunto così:

```text
CAMBIA QUALCOSA DI MATERIALE
        ↓
QUALI DOCUMENTI SONO IMPATTATI?
        ↓
QUALI FONTI AUTOREVOLI SERVONO?
        ↓
AGGIORNA LE PROIEZIONI NECESSARIE
        ↓
VERIFICA LA COERENZA TRASVERSALE
        ↓
RELEASE SOLO SE NECESSARIA
```

Il risultato desiderato non è avere più documenti.

È poter leggere la documentazione corrente e ottenere una rappresentazione fedele, comprensibile e qualificata della baseline reale.

---

## Source Map

Fonti canoniche principali usate per il Technical Truth Pass:

- `wcm/process-book/processes/PROC-010_DOCUMENTATION_CONTINUITY_LOOP.md`;
- `wcm/process-book/protocols/PROT-015_DOCUMENTATION_IMPACT_AND_PUBLICATION_STANDARD.md`;
- `WCM_AGENT_START.md` per source precedence, authority e discipline INDEX-FIRST.

## Maturity qualifier

Il capitolo descrive la baseline corrente di `PROC-010` e `PROT-015`. Lo stato `ACTIVE / FIELD VALIDATION / PROJECT LAYER ENABLED` non implica field validation universale, né autorizza a inferire capability o procedure non presenti nelle fonti canoniche.