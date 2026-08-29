# Capitolo 20 — PROC-004 — Evidence → Baseline Promotion

**Parte VI — Il Libro dei Processi WCM**  
**Stato:** FROZEN  
**Data:** 2026-08-29  
**Scope:** WCM generale, domain-agnostic

---

# 20.0 Quando un risultato smette di essere soltanto un risultato

Un sistema può accumulare moltissima esperienza senza imparare davvero nulla.

Un test riesce. Un altro fallisce. Una root cause viene trovata. Una capability prima soltanto ipotizzata viene esercitata con successo. Un workaround diventa ricorrente. Un errore rivela un confine architetturale che prima non era visibile.

Tutto questo produce **evidenza**. Ma l'evidenza, da sola, non modifica il metodo.

È qui che nasce il problema governato da `PROC-004 — Evidence → Baseline Promotion`:

> **come trasformare ciò che il sistema ha osservato in una possibile evoluzione della propria baseline senza confondere esperienza, apprendimento e autorità?**

La risposta WCM non è «ogni successo diventa una regola».

È il contrario:

```text
ESPERIENZA
   ↓
EVIDENZA
   ↓
VALUTAZIONE
   ↓
COSA CAMBIA DAVVERO?
   ↓
PROMOZIONE SELETTIVA
```

La parola decisiva è **selettiva**.

---

# 20.1 Che cos'è PROC-004

PROC-004 è il processo che valuta se un'evidenza significativa debba produrre un aggiornamento del patrimonio persistente WCM e, in caso affermativo, **dove** debba essere promossa.

Non è un processo che canonizza automaticamente le scoperte. È un processo di separazione tra livelli epistemici diversi:

```text
È SUCCESSO
≠
ABBIAMO CAPITO PERCHÉ
≠
È GENERALIZZABILE
≠
DEVE CAMBIARE LA BASELINE
≠
SIAMO AUTORIZZATI A CAMBIARELA
```

Queste cinque affermazioni possono coincidere, ma non devono essere fuse.

PROC-004 mantiene proprio questa distanza.

---

# 20.2 Il problema della conoscenza che resta intrappolata

Senza un processo di promozione, la conoscenza utile tende a rimanere dove è nata: in una conversazione; in un log; nel report di un esperimento; nella memoria di chi ha diagnosticato un problema; in una patch tecnica; in un documento di evidence; in una singola sessione operativa.

Il sistema può quindi aver già imparato qualcosa nella pratica, ma non averlo ancora reso disponibile alla propria memoria organizzativa.

Si crea una frattura:

```text
ESPERIENZA REALE
      ≠
BASELINE CONOSCIUTA DAL SISTEMA
```

Nel tempo questa frattura produce regressioni. Un agente futuro può ripetere un errore già compreso perché la lezione non è mai uscita dal luogo in cui era stata scoperta.

PROC-004 serve a impedire che la chiusura tecnica di un evento coincida con la perdita della sua conoscenza.

---

# 20.3 Il trigger: quando la valutazione diventa obbligatoria

La baseline corrente richiede la valutazione Evidence → Baseline Promotion quando si verifica almeno un evento significativo come: chiusura di un POC o esperimento con esito PASS, FAIL o SUPERSEDED; identificazione di una root cause significativa; emersione di un failure mode potenzialmente generalizzabile; validazione di un nuovo processo o protocollo; cambiamento dello stato reale di una capability; modifica di un pattern architetturale; decisione che cambia il modo in cui WCM opera.

Il trigger non significa `DEVI CAMBIARE IL WCM`. Significa `DEVI VALUTARE ESPLICITAMENTE SE E COSA CAMBIA`. Anche `NO_CHANGE` è quindi un risultato corretto.

---

# 20.4 Prima regola: preservare l'evidenza

Prima di chiedersi che cosa promuovere, WCM deve preservare ciò che è realmente accaduto. Un esperimento fallito non va riscritto per far sembrare lineare il percorso. Una soluzione successiva non cancella il tentativo precedente. Una nuova baseline non trasforma retroattivamente una vecchia ipotesi in una certezza.

La storia sperimentale ha valore perché conserva condizioni iniziali, risultato osservato, failure, root cause, correzione, limiti del test ed elementi non esercitati.

La promozione deve quindi essere **lossless rispetto alla provenance**:

```text
NUOVA CONOSCENZA
      ↑
EVIDENZA CHE LA SUPPORTA
      ↑
EVENTO / TEST / FAILURE ORIGINARIO
```

Il metodo può evolvere. La storia non deve essere riscritta.

---

# 20.5 Evidence non significa canon

Questo è uno dei confini più importanti dell'intero WCM. Un'evidenza può essere vera e tuttavia insufficiente per diventare regola generale.

Un test può dimostrare che una capability funziona in una configurazione precisa senza dimostrare portabilità production, sicurezza production, scalabilità multi-project, affidabilità continuativa, comportamento in domini diversi o validità di capability non esercitate.

Per questo PROC-004 contiene una regola anti-overpromotion:

```text
CIÒ CHE È STATO PROVATO
PUÒ ESSERE PROMOSSO

CIÒ CHE NON È STATO PROVATO
NON DEVE ESSERE AGGIUNTO PER INFERENZA
```

La promozione deve essere proporzionata all'evidenza.

---

# 20.6 La matrice di impatto

Dopo aver chiuso e preservato l'evidenza, PROC-004 chiede di attraversare una matrice di impatto. L'obiettivo è evitare una domanda troppo vaga come «Dobbiamo aggiornare qualcosa?» e scomporla per patrimonio.

| Patrimonio | Domanda operativa |
|---|---|
| POC / Evidence | Esito, root cause e prove sono documentati? |
| Telemetry | Esistono dati runtime o consumi significativi da preservare? |
| Service Job / Project State | Lo stato operativo riflette l'esito reale? |
| Method KB | È emersa conoscenza generalizzabile? |
| Process Book | È cambiato il modo corretto di eseguire un'attività? |
| Protocols | È emerso un gate o un'invariante obbligatoria? |
| Playbooks | Esiste una risposta ricorrente a un'anomalia? |
| Living Architecture | È cambiato il disegno corrente o lo stato di una componente? |
| Capabilities | È cambiato lo stato della capacità? |
| Indici / Entry Point | La nuova conoscenza è raggiungibile? |

Per ogni area: `UPDATE_REQUIRED`, `NO_CHANGE`, `PENDING_MORE_EVIDENCE`, `NOT_APPLICABLE`.

---

# 20.7 UPDATE_REQUIRED non equivale ancora a WRITE

`UPDATE_REQUIRED` significa che la valutazione ha identificato un delta da propagare. Prima della mutazione persistente devono ancora essere rispettati authority, scope, source precedence, eventuale Change Gate, safety della write e verifica post-write.

```text
IMPATTO IDENTIFICATO
≠
AUTHORITY OTTENUTA
```

---

# 20.8 Il rapporto con il WCM Learning Loop

Nella baseline corrente PROC-004 non è isolato. Normalmente riceve a monte il risultato di `PROC-009 — WCM Learning Loop`.

```text
ESPERIENZA / RISULTATO / FAILURE
        ↓
EVIDENCE CAPTURE
        ↓
LEARNING REVIEW
        ↓
LEARNING VALIDATED?
        ↓
METHOD BASELINE IMPACT?
        ↓
PROC-004
```

`PROC-009` governa la trasformazione dell'esperienza in un learning con uno stato epistemico. PROC-004 governa la domanda successiva: **quel learning deve modificare qualche patrimonio autorevole del WCM?** Un learning `VALIDATED` non è automaticamente `PROMOTED`.

---

# 20.9 Il bivio fondamentale: representation oppure method change

Alcuni aggiornamenti possono essere rappresentativi o di continuità: rendono raggiungibile, coerente o leggibile una conoscenza già autorizzata senza cambiare il comportamento del metodo. Altri sono materiali: cambiano un processo; introducono o modificano un protocollo; alterano governance o authority; cambiano un'invariante; modificano architettura o baseline metodologica. Il secondo caso è un **WCM CHANGE**.

```text
LEARNING / EVIDENCE
       ↓
PROC-004
       ↓
METHOD BASELINE IMPACT = MATERIAL?
   ├─ NO  → continuità / consolidamento secondo authority esistente
   └─ YES → IMPACT PREVIEW
              ↓
         WCM_CHANGE_GATE
              ↓
         OWNER AUTHORITY
```

PROC-004 può arrivare fino al gate. Non può auto-consumarlo.

---

# 20.10 L'Impact Preview

Quando la valutazione conclude che l'impatto metodologico è materiale, la baseline richiede un **Impact Preview** persistente e leggibile. Il suo scopo è rendere esplicito, prima della modifica: che cosa si propone di cambiare; quali target sono coinvolti; perché l'evidenza lo giustifica; quali rischi esistono; quali guardrail devono essere rispettati; quale decisione è richiesta all'authority owner.

L'Impact Preview non è la modifica. È la rappresentazione della modifica proposta prima che essa esista.

```text
COMPRENDERE IL CHANGE
≠
AUTORIZZARE IL CHANGE
```

---

# 20.11 Il WCM_CHANGE_GATE strutturato

La baseline corrente richiede che un impatto metodologico materiale non resti soltanto espresso in prosa. PROC-004 deve produrre anche un oggetto strutturato `WCM_CHANGE_GATE` nel ledger previsto dal Learning System. Il gate deve rendere persistenti almeno identità logica del change, learning di origine, stato del gate, authority richiesta, riferimenti alle procedure applicabili e Impact Preview associato. La richiesta di authority esiste quando il gate strutturato esiste ed è `OPEN`. Il sistema non deve inventarla dal contesto.

---

# 20.12 Il confine dell'autorità

PROC-004 lavora vicino al punto in cui un sistema potrebbe iniziare a modificare se stesso. WCM introduce qui un confine netto: il Cognitive Core può interpretare evidence, proporre learning, valutare impatto, costruire Impact Preview e aprire il gate previsto; l'Authority Owner può autorizzare o non autorizzare il cambio materiale. La qualità dell'analisi non conferisce authority.

---

# 20.13 Dopo l'autorità: propagare non basta

Supponiamo che il Change Gate riceva authority valida. Anche a questo punto la promotion non è ancora completa. La modifica deve essere propagata ai target previsti e verificata. La baseline integra qui `PROT-017 — Persistent Mutation Safety`.

```text
EXACT TARGET + SCOPE
        ↓
PAYLOAD / SCHEMA GUARD
        ↓
EXPECTED VERSION / STATE
        ↓
WRITER OWNERSHIP / SERIALIZATION
        ↓
IDEMPOTENT WRITE
        ↓
POST-WRITE VERIFICATION
```

Un'API che risponde «success» non prova che il nuovo stato persistente sia semanticamente corretto. La promotion viene accettata soltanto dopo la verifica dell'effetto reale.

---

# 20.14 Perché il post-write verification è parte della conoscenza

Se un Learning Record viene marcato `PROMOTED` ma uno dei target autorevoli non è stato realmente aggiornato, la memoria organizzativa dichiara una cosa falsa. Questo è knowledge drift generato dal processo stesso. Perciò il completamento di PROC-004 richiede coerenza tra authority, target dichiarati, stato realmente persistito, indici e lineage, stato del learning e stato del Change Gate quando presente.

---

# 20.15 SUPERSEDED non significa cancellato

Quando una nuova evidenza rende obsoleto un pattern precedente, WCM non dovrebbe semplicemente eliminarlo dalla storia. La baseline prevede la marcatura esplicita `SUPERSEDED`: sappiamo che esisteva, perché è stato sostituito e da cosa. Questo preserva lineage, comprensione delle failure e possibilità di audit.

---

# 20.16 Capability: possibile non significa validata

Una capability può essere concepibile, autorizzata, disponibile, esercitata, validata nel perimetro realmente testato. Se un test dimostra che una capability prima soltanto possibile è ora disponibile, la promozione corretta può essere `POSSIBILE → DISPONIBILE`, non necessariamente `POSSIBILE → VALIDATA UNIVERSALMENTE`.

---

# 20.17 Un esempio domain-agnostic

Immaginiamo un sistema che deve sostituire un documento persistente remoto. Durante un test emerge una failure: una write tecnicamente valida sostituisce un contenuto più ampio del previsto. Il recovery riesce grazie alla storia versionata. Il learning potenziale è: una persistent mutation remota richiede guard prima della write; il rollback non sostituisce la prevention.

Se la risposta finale implica un nuovo protocollo obbligatorio, il percorso è:

```text
EVIDENCE
→ LEARNING VALIDATED
→ PROC-004
→ IMPACT PREVIEW
→ WCM_CHANGE_GATE
→ AUTHORITY
→ PROPAGATION
→ POST-WRITE VERIFICATION
→ PROMOTED
```

Questo esempio mostra la funzione centrale del processo: **trasformare esperienza in metodo senza permettere all'esperienza di auto-legiferare**.

---

# 20.18 Failure mode di PROC-004

I failure mode principali includono: Knowledge trapped in evidence; Overpromotion; History rewrite; Silent method change; Partial propagation; Promotion before verification; Index invisibility; Capability inflation. PROC-004 esiste per rendere questi errori visibili e governabili.

---

# 20.19 Output minimo

Alla fine del processo deve essere possibile rispondere in modo tracciabile a sei domande:

```text
COSA ABBIAMO IMPARATO?
COSA È CAMBIATO NEL DISEGNO?
COSA È DIVENTATO PROCESSO O PROTOCOLLO?
COSA RESTA SPERIMENTALE?
COSA È STATO SUPERSEDED?
DOVE SI TROVA LA NUOVA SOURCE OF TRUTH?
```

---

# 20.20 Relazioni con gli altri processi

PROC-004 occupa una posizione di cerniera. A monte riceve soprattutto evidence da esperimenti, failure e risultati; learning classificati da PROC-009; cambiamenti di capability o architettura. A valle può attivare o richiedere Memory Consolidation; Documentation Continuity; Knowledge Integrity Assurance; Persistent Mutation Safety; WCM Change Propagation & Closure quando esiste un change materiale autorizzato.

```text
ESPERIENZA
   ↓
PROC-009 — COSA ABBIAMO IMPARATO?
   ↓
PROC-004 — COSA DEVE ENTRARE NELLA BASELINE?
   ↓
AUTHORITY SE NECESSARIA
   ↓
PROPAGAZIONE + VERIFICA
   ↓
MEMORIA ORGANIZZATIVA COERENTE
```

---

# 20.21 Che cosa è deterministico e che cosa è cognitivo

Richiedono giudizio cognitivo: interpretare il significato dell'evidenza; valutare generalizzabilità; distinguere pattern locale da principio metodologico; costruire l'Impact Preview; individuare semanticamente gli impatti possibili.

Possono essere resi strutturati o deterministici: identità dei gate; stati lifecycle; exact target; expected SHA/version; registrazione della provenance; idempotenza delle write; post-write verification meccanica; proiezione del gate verso le superfici operative.

Resta invece fuori da entrambe le categorie l'authority owner: `VALUTARE ≠ AUTORIZZARE`.

---

# 20.22 Maturità corrente

PROC-004 è classificato nella baseline come **VALIDATED BY GOVERNANCE**. Questo significa che il processo è parte del metodo corrente e governa la valutazione Evidence → Baseline Promotion. Non significa che ogni possibile dominio, scala o configurazione sia stata validata sul campo. La maturità di WCM viene protetta rappresentando correttamente ciò che resta da verificare.

---

# 20.23 Il significato sistemico

Un sistema che non modifica mai la propria baseline non capitalizza l'esperienza. Un sistema che modifica automaticamente la propria baseline dopo ogni esperienza diventa instabile e può trasformare rumore locale in regola generale. WCM cerca una terza via:

```text
ESPERIENZA
→ MEMORIA
→ VALUTAZIONE
→ EVIDENZA PROPORZIONATA
→ AUTHORITY QUANDO SERVE
→ PROPAGAZIONE VERIFICATA
```

Il risultato è un sistema che **sa distinguere il fatto di aver osservato qualcosa dal diritto di trasformarlo in regola**.

---

# 20.24 In sintesi

`PROC-004 — Evidence → Baseline Promotion` impedisce due errori opposti: l'esperienza resta nei log e il sistema non impara; oppure ogni esperienza diventa regola e il sistema deriva.

```text
EVIDENCE
→ PRESERVA PROVENANCE
→ IMPACT MATRIX
→ PROMOZIONE SELETTIVA
→ ANTI-OVERPROMOTION
→ CHANGE GATE SE MATERIALE
→ AUTHORITY
→ SAFE PERSISTENT MUTATION
→ POST-WRITE VERIFICATION
→ SOURCE OF TRUTH RAGGIUNGIBILE
```

> **imparare non significa cambiare automaticamente. Significa sapere che cosa l'evidenza autorizza a concludere, che cosa propone di cambiare e chi possiede l'autorità per renderlo baseline.**

Nel prossimo capitolo vedremo `PROC-005 — Agent-Ready Context Bootstrap`: il processo con cui un agente ricostruisce il contesto minimo sufficiente per operare correttamente senza dover caricare indiscriminatamente l'intera memoria organizzativa.

---

## Source Map

- `wcm/process-book/processes/PROC-004_EVIDENCE_TO_BASELINE_PROMOTION.md` — processo canonico;
- `wcm/process-book/processes/PROC-009_WCM_LEARNING_LOOP.md` — relazione evidence → learning → promotion;
- `wcm/process-book/protocols/PROT-017_PERSISTENT_MUTATION_SAFETY.md` — guard per persistent mutation e post-write verification;
- `WCM_AGENT_START.md` — authority, WCM RUN / WCM CHANGE e baseline di bootstrap.
