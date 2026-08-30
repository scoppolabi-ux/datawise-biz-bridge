# Capitolo 25 — PROC-009 — WCM Learning Loop

**Parte VI — Il Libro dei Processi WCM**  
**Stato:** FROZEN  
**Data:** 2026-08-30  
**Scope:** WCM generale, domain-agnostic

---

# 25.0 Fare esperienza non significa automaticamente imparare

Un sistema può eseguire migliaia di attività e non diventare per questo migliore.

Può accumulare successi, errori, correzioni, esperimenti e failure senza riuscire a distinguere ciò che è stato soltanto un episodio locale da ciò che rivela qualcosa di utile sul metodo. All'estremo opposto, può trasformare troppo rapidamente ogni esperienza in una nuova regola e rendere la propria baseline instabile.

`PROC-009 — WCM Learning Loop` esiste per governare questo passaggio.

La sua domanda fondamentale è:

> **che cosa possiamo imparare dall'esperienza reale senza confondere evidenza, interpretazione, validazione e modifica del metodo?**

Il principio centrale è:

```text
ESPERIENZA
≠
LEARNING VALIDATO
≠
MODIFICA DELLA BASELINE
```

WCM conserva quindi una separazione netta fra ciò che accade, ciò che possiamo inferirne e ciò che siamo autorizzati a cambiare.

---

# 25.1 Che cos'è PROC-009

PROC-009 trasforma sistematicamente esperienza reale in **Method Experience Memory**.

Il processo raccoglie evidence, la sottopone a review cognitiva, collega fenomeni simili, crea o aggiorna Learning Record quando esiste una proposizione metodologica utile e, soltanto quando necessario, instrada un learning verso il processo di promotion della baseline.

Il loop canonico è:

```text
EXPERIENCE / RESULT / FAILURE
        ↓
DETERMINISTIC EVIDENCE CAPTURE
        ↓
LEARNING INBOX
        ↓
INDEX-FIRST COGNITIVE REVIEW
        ↓
EXISTING LEARNING MATCH?
  ├─ YES → add evidence / revise confidence-status
  └─ NO  → create CANDIDATE learning
        ↓
ENOUGH EVIDENCE?
  ├─ NO → OBSERVING
  └─ YES → VALIDATED / REJECTED
        ↓
METHOD BASELINE IMPACT?
  ├─ NO → consolidate memory
  └─ YES → PROC-004 → Impact Preview → explicit WCM_CHANGE_GATE
```

La caratteristica importante non è soltanto che WCM possa apprendere. È che **l'apprendimento possiede un lifecycle osservabile e separato dall'authority**.

---

# 25.2 La Method Experience Memory

La Method Experience Memory è la memoria persistente di ciò che WCM ha imparato sul proprio funzionamento.

Non è una terza memoria alternativa alla Dual Memory. È una porzione specializzata della Persistent Organizational Memory, organizzata per conservare:

- evidence event;
- Learning Record;
- confidence e generalizzabilità;
- evidence favorevole e contraria;
- failure e learning rifiutati;
- lineage di promotion;
- relazioni fra learning e baseline;
- eventuali Method Change Gate.

La baseline corrente usa `wcm/kb/learning/` come struttura canonica V1, con index, inbox, ledger, record, relationship ledger, health e gate strutturati.

Questa struttura impedisce che l'esperienza viva soltanto nella memoria conversazionale o venga dispersa in log non interpretabili.

---

# 25.3 Il primo passaggio: catturare evidence senza interpretarla

Il collector considera segnali come:

- conclusione o modifica materiale di un esperimento;
- root cause o failure fix significativa;
- cambio di stato di una capability;
- nuova decisione, processo, protocollo o architettura;
- supersession;
- repair o semantic escalation significativa;
- gate che produce evidenza generalizzabile;
- regressione o drift del metodo;
- risultato esplicitamente classificato come evidence per WCM.

Ma il collector non decide che cosa significhi l'evento.

Questa distinzione è essenziale:

```text
DETERMINISTIC EVIDENCE CAPTURE
= registra che qualcosa è accaduto

COGNITIVE REVIEW
= valuta che cosa possiamo impararne
```

Un evidence event `PENDING` significa quindi **evidenza da revisionare**, non learning candidato già formulato e nemmeno richiesta di authority.

---

# 25.4 Perché non nasce un learning per ogni evento

Un commit riuscito, una failure o un singolo risultato non sono automaticamente una nuova conoscenza metodologica.

La review deve distinguere almeno:

- osservazione specifica del contesto di origine;
- failure locale;
- candidate learning generalizzabile;
- conferma o smentita di un learning esistente;
- evidence già coperta dalla baseline.

Per questo `NO_LEARNING` e `DUPLICATE` sono esiti validi della review.

Il sistema non viene premiato perché produce molti learning. Viene premiato, concettualmente, quando conserva **pochi learning utili, tracciabili e proporzionati all'evidenza**.

Un anti-pattern esplicito è creare un learning per ogni commit o scandire continuamente l'intera repository con un LLM alla ricerca di qualcosa da imparare.

---

# 25.5 INDEX-FIRST anche nell'apprendimento

La review cognitiva non parte rileggendo tutta la storia del metodo.

Apre prima l'indice della Method Experience Memory, poi gli evidence event `PENDING`, quindi soltanto i Learning Record semanticamente pertinenti.

```text
LEARNING INDEX
      ↓
PENDING EVIDENCE
      ↓
RELATED LEARNING?
      ↓
FONTI MINIME NECESSARIE
      ↓
STOP WHEN SUFFICIENT
```

Questo applica al learning lo stesso principio di navigazione visto nei capitoli precedenti: la quantità di memoria disponibile non giustifica il full-context permanente.

La review può raggruppare eventi duplicati o appartenenti allo stesso fenomeno, ma il clustering semantico resta una funzione cognitiva, non una verità deterministica.

---

# 25.6 Il Learning Record

Quando esiste una proposizione metodologica utile, PROC-009 può creare o aggiornare un Learning Record.

Il record minimo conserva almeno:

```text
learning_id
title
status
created_at
last_reviewed_at
promoted_at
origin
observation
learning_statement
scope
confidence
generalizability
evidence
contradicting_evidence
promoted_to
revisit_trigger
```

L'ID è stabile e non riutilizzabile.

La presenza di `contradicting_evidence` è particolarmente importante: una memoria di apprendimento affidabile non deve raccogliere soltanto conferme.

Anche `revisit_trigger` impedisce che un learning rimanga indefinitamente in uno stato provvisorio senza una condizione che ne provochi una nuova valutazione.

---

# 25.7 Gli stati del learning

La baseline V1 ammette:

```text
CANDIDATE
OBSERVING
VALIDATED
REJECTED
SUPERSEDED
PROMOTED
```

Una traiettoria tipica è:

```text
CANDIDATE → OBSERVING → VALIDATED → PROMOTED
                    └→ REJECTED
VALIDATED/PROMOTED → SUPERSEDED
```

Questa sequenza non è una macchina che promuove automaticamente ogni learning nel tempo.

`OBSERVING` indica che serve altra evidenza. `REJECTED` conserva una lezione falsificata. `SUPERSEDED` preserva lineage quando una formulazione viene superata. `VALIDATED` indica che l'evidenza sostiene sufficientemente la proposizione nel perimetro dichiarato.

Ma:

```text
VALIDATED
≠
PROMOTED
```

E soprattutto:

```text
VALIDATED
≠
WAITING_AUTHORITY AUTOMATICO
```

---

# 25.8 Confidence e generalizzabilità sono due cose diverse

PROC-009 usa valori qualitativi `LOW / MEDIUM / HIGH` per due dimensioni distinte.

**Confidence** risponde alla domanda:

> quanto l'evidenza sostiene questa proposizione?

**Generalizability** risponde invece:

> quanto è ragionevole estenderla oltre il caso o il perimetro da cui nasce?

Un learning può avere evidence molto convincente in uno scope ristretto e avere comunque bassa generalizzabilità.

Il numero degli eventi non produce automaticamente `HIGH`.

Dieci osservazioni fortemente correlate possono valere meno di poche osservazioni indipendenti e ben comprese. La valutazione resta cognitiva e deve essere qualificata, non trasformata in una formula universale non prevista dalla baseline.

---

# 25.9 Failure memory: imparare significa anche ricordare ciò che non ha funzionato

`REJECTED` e `SUPERSEDED` non vengono cancellati.

Questa scelta evita un problema ricorrente nei sistemi senza memoria metodologica: riscoprire ciclicamente idee già falsificate o ripetere tentativi che la storia aveva già mostrato essere inadeguati.

La failure memory non serve a vietare per sempre un approccio. Serve a rendere disponibile il contesto della precedente falsificazione, così che un nuovo tentativo possa distinguere fra vera novità e semplice ripetizione.

In questo senso, dimenticare un errore può essere costoso quanto dimenticare un successo.

---

# 25.10 Quando un learning incontra la baseline

La parte più delicata arriva quando un learning `VALIDATED` sembra avere impatto sul metodo WCM.

PROC-009 non modifica direttamente la baseline.

Passa a `PROC-004 — Evidence → Baseline Promotion`.

```text
VALIDATED LEARNING
      ↓
PROC-004
      ↓
METHOD BASELINE IMPACT?
  ├─ NO → consolidazione / eventuale promotion representation-only
  └─ YES → Impact Preview
              ↓
        WCM_CHANGE_GATE ESPLICITO
              ↓
        authority owner
              ↓
        propagate + verify
              ↓
           PROMOTED
```

Questo confine protegge la governance: **l'evidenza può suggerire un cambiamento, ma non conferisce authority per applicarlo**.

Un learning con confidence `HIGH` non può auto-promuoversi.

---

# 25.11 Il Method Change Gate è un oggetto separato

La richiesta di authority esiste soltanto quando è presente un `WCM_CHANGE_GATE` strutturato e `OPEN` nella source dedicata.

Non deve essere dedotta dal fatto che un learning sia `VALIDATED`, importante o convincente.

Questa separazione consente al sistema di mantenere contemporaneamente due verità:

```text
ABBIAMO ABBASTANZA EVIDENZA PER CONSIDERARE VALIDO IL LEARNING
```

e

```text
NON SIAMO ANCORA AUTORIZZATI A CAMBIARE LA BASELINE
```

Il read model o una UI possono rappresentare il gate, ma non possono approvare o promuovere autonomamente il cambiamento.

---

# 25.12 `promoted_at`: il tempo semantico non è il tempo tecnico

Quando un learning diventa `PROMOTED`, il sistema registra `promoted_at`.

Questo timestamp rappresenta **quando la promotion è diventata valida secondo governance**.

Non può essere ricavato automaticamente da:

- ultimo aggiornamento del database;
- timestamp della UI;
- momento della projection;
- ultima revisione del record.

La distinzione mostra un principio più generale: nei sistemi governati, il momento in cui un dato viene tecnicamente scritto non coincide necessariamente con il momento in cui un fatto diventa semanticamente valido.

---

# 25.13 Deterministico, cognitivo, authority

PROC-009 separa esplicitamente tre responsabilità.

| Area | Responsabilità |
|---|---|
| Deterministica | evidence collection, stable ID, persistence, exact status mapping, gate persistence, timestamp semantici, projection, health mechanics |
| Cognitiva | interpretazione evidence, clustering semantico, formulazione learning, confidence/generalizability, Impact Preview |
| Authority owner | decisione sulle modifiche materiali della baseline |

Questa separazione impedisce due errori opposti.

Il primo sarebbe affidare a un LLM attività meccaniche che possono essere rese ripetibili.

Il secondo sarebbe trattare come meccanica una decisione che richiede comprensione del significato.

La componente cognitiva può proporre. Non può auto-consumare il gate.

---

# 25.14 Method Knowledge Health

Anche la memoria dell'apprendimento deve essere verificabile.

La baseline considera almeno:

- integrità dei record;
- copertura dell'indice;
- validità delle relazioni;
- lineage di promotion;
- freshness della review;
- controllo dei learning orfani;
- età delle evidence `PENDING`.

Gli stati di health restano `HEALTHY / DEGRADED / STALE / CRITICAL / UNKNOWN`.

Questa health non misura se il metodo sia “buono” in assoluto. Misura se **la memoria di ciò che il metodo sostiene di avere imparato è coerente, raggiungibile e corrente**.

Se evidence `PENDING` supera la finestra di review dichiarata, oppure un delta materiale non è ancora coperto dal controllo, `HEALTHY` non è consentito.

---

# 25.15 Cadenza e proporzionalità

La baseline V1 prevede evidence collection event-driven sui push materiali con una run giornaliera, review cognitiva giornaliera e review straordinaria quando eventi rilevanti la giustificano.

La promotion, invece, non segue il calendario.

```text
PROMOTION
= quando l'evidenza e la governance lo giustificano
≠
quando arriva una scadenza temporale
```

Questa differenza evita che il learning loop diventi una macchina burocratica obbligata a produrre novità a ogni ciclo.

`NO_NEW_LEARNING` è un risultato perfettamente valido.

---

# 25.16 Failure mode principali

PROC-009 può degradarsi quando:

- ogni evento viene trasformato in learning;
- i learning restano `CANDIDATE` o `OBSERVING` senza revisit trigger;
- failure e rejected learning vengono eliminati;
- confidence viene dedotta meccanicamente dal numero di eventi;
- un caso ristretto viene presentato come regola universale;
- `VALIDATED` viene interpretato come authority implicita;
- la promotion modifica la baseline senza PROC-004 e Change Gate applicabile;
- la provenance dell'evidence viene persa;
- si creano relazioni soltanto per aumentare la densità del grafo;
- la review usa full-repository scanning quando INDEX-FIRST è sufficiente.

Il failure mode più grave è la confusione fra **apprendere qualcosa** e **avere authority per cambiare il sistema**.

---

# 25.17 Output

Gli output canonici del processo includono:

```text
wcm/kb/learning/LEARNING_INBOX.json
wcm/kb/learning/LEARNING_LEDGER.json
wcm/kb/learning/METHOD_CHANGE_GATES.json
wcm/kb/learning/impact-previews/*.md
wcm/kb/learning/records/*.md
wcm/kb/learning/METHOD_RELATIONSHIP_LEDGER.json
wcm/kb/learning/METHOD_KNOWLEDGE_HEALTH.json
```

Non tutti vengono necessariamente modificati in ogni run.

Se la review conclude `NO_NEW_LEARNING`, non esiste alcun obbligo di inventare un Learning Record.

---

# 25.18 Relazioni con gli altri processi e protocolli

PROC-009 lavora soprattutto con:

- `PROC-004 — Evidence → Baseline Promotion`, quando un learning validato può incidere sulla baseline;
- `PROC-006 — Memory Consolidation & Consistency Loop`, per consolidare i delta della memoria;
- `PROT-005 — Index-First Progressive Retrieval`, per la review selettiva;
- `PROT-013 — Knowledge Synapse & Health Standard`, per relazioni e health;
- `PROT-014 — Method Experience Memory Standard`, che definisce struttura e lifecycle della memoria di apprendimento.

La relazione più importante può essere sintetizzata così:

```text
PROC-009
= COSA ABBIAMO IMPARATO?

PROC-004
= QUESTO LEARNING PUÒ DIVENTARE BASELINE, E CON QUALE AUTHORITY?

PROC-006
= IL DELTA È STATO CONSOLIDATO COERENTEMENTE?
```

---

# 25.19 Maturity

Il processo canonico è classificato:

**VALIDATED BY GOVERNANCE / FIELD VALIDATION IN PROGRESS**.

Questa formulazione va letta letteralmente.

Significa che il processo possiede una baseline governata e viene utilizzato nel WCM corrente. Non significa che la sua efficacia sia stata dimostrata universalmente in ogni dominio, organizzazione, scala o configurazione tecnologica.

La Method Experience Memory stessa è in `ACTIVE / FIELD VALIDATION`.

---

# 25.20 La lezione del processo

Il valore di un sistema che apprende non dipende da quante nuove regole riesce a produrre.

Dipende dalla capacità di conservare una catena leggibile:

```text
QUALCOSA È ACCADUTO
        ↓
ABBIAMO REGISTRATO L'EVIDENZA
        ↓
ABBIAMO INTERPRETATO IL FENOMENO
        ↓
ABBIAMO FORMULATO O AGGIORNATO UN LEARNING
        ↓
ABBIAMO VALUTATO EVIDENZA, CONFINI E CONTRADDIZIONI
        ↓
SE SERVE CAMBIARE IL METODO, ABBIAMO CHIESTO L'AUTHORITY
        ↓
SOLO DOPO PROPAGAZIONE VERIFICATA IL LEARNING È PROMOTED
```

È questa separazione a rendere il learning compatibile con una governance rigorosa.

WCM non prova a eliminare la componente cognitiva dell'apprendimento. Prova a **circondarla di memoria, provenance, stati, gate e verifiche sufficienti perché l'esperienza non diventi né rumore né regola per inerzia**.

---

## Source Map

Fonti canoniche minime utilizzate per il Technical Truth Pass:

- `wcm/process-book/processes/PROC-009_WCM_LEARNING_LOOP.md`;
- `wcm/process-book/protocols/PROT-014_METHOD_EXPERIENCE_MEMORY_STANDARD.md`;
- `wcm/kb/learning/index.md` per verificare struttura/stato corrente della Method Experience Memory senza estendere il retrieval oltre il necessario.

**Figura nuova:** NOT REQUIRED. Il lifecycle testuale del processo è già sufficientemente leggibile e una nuova figura non aggiungerebbe informazione sostanziale.