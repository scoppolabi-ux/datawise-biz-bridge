# Capitolo 15 — Esempi di routing domain-agnostic

**Stato:** FROZEN  
**Parte:** V — Da una richiesta alle regole applicabili  
**Scope:** WCM generale / domain-agnostic  
**Review:** Technical Review PASS / Human Comprehension Review PASS

---

## 15.0 Dalla teoria al movimento

Nei Capitoli 13 e 14 abbiamo costruito il percorso.

Abbiamo visto come una richiesta viene trasformata in un contesto operativo e come WCM individua processi, protocolli, guard, capability e stop condition applicabili.

Ora facciamo una cosa diversa.

Non aggiungiamo nuove regole.

Le usiamo.

Questo capitolo contiene esempi volutamente astratti. Non appartengono a un progetto reale e non descrivono un dominio specifico.

Servono a mostrare una proprietà fondamentale del WCM:

> **richieste molto diverse possono essere instradate attraverso la stessa architettura senza dover reinventare ogni volta il metodo.**

La forma che useremo è sempre la stessa:

```text
REQUEST
→ INTERPRETAZIONE
→ EXECUTION FACT / EVENT
→ PROCESS / PROTOCOL
→ GUARD
→ ACTION
→ STOP / CONTINUE
```

Quando esiste una route machine-readable corrente, useremo quella esatta.

Quando invece l'esempio richiede comprensione semantica prima di arrivare a un evento strutturato, distingueremo esplicitamente il reasoning dal mechanical enforcement.

---

## 15.1 Come leggere gli esempi

Ogni scenario contiene sette passaggi.

### 1. Request
La richiesta iniziale, espressa in linguaggio naturale o come attivazione operativa.

### 2. Interpretazione
Che cosa sembra essere richiesto e quale classe di lavoro è coinvolta.

### 3. Fact / Event
Il fatto strutturato che, se disponibile, rende il routing più deterministico.

### 4. Process / Protocol
Le fonti procedurali minime applicabili.

### 5. Guard
La condizione che impedisce una prosecuzione non autorizzata o semanticamente sbagliata.

### 6. Action
La transizione consentita dalla route.

### 7. Stop / Continue
La vera condizione che decide se il workflow continua o si ferma.

Questa struttura non pretende di sostituire ogni workflow WCM. È una lente pedagogica.

---

# 15.2 Scenario A — «Continua da dove eri rimasto»

## Request
> «Continua il lavoro.»

Da sola la frase è insufficiente. Non dice quale step ripetere, quale output produrre o dove fermarsi.

## Interpretazione
WCM verifica prima se esiste un workflow materiale incompleto.

```text
status = INTERRUPTED_RESUMABLE
next_transition = REVIEW
```

## Fact / Event
```text
WAKE_RESUME_REQUIRED
+
ON_WAKE
```

## Process / Protocol
```text
PROC-005
PROT-005
PROT-009
```

## Guard
- Resume Priority;
- non rieseguire gli step completati;
- verificare authority e scope;
- retrieval minimo autorevole;
- continuare solo fino alla vera stop condition.

## Action
```text
CONTINUE
```

## Stop / Continue
Se dopo `REVIEW` esiste una transizione successiva già autorizzata e non c'è true stop, continua. Se raggiunge `WAITING_AUTHORITY`, si ferma.

```text
FINE SESSIONE
≠
FINE WORKFLOW
```

---

# 15.3 Scenario B — «Lo strumento non mi restituisce tutto»

## Request
> «Recupera il contenuto completo e continua.»

Durante l'esecuzione lo strumento restituisce un output limitato.

## Interpretazione
Il primo fallimento non dimostra che la capability sia assente.

## Fact / Event
```text
TOOL_OUTPUT_LIMIT
+
ON_TOOL_FAILURE
```

## Process / Protocol
```text
PROT-011
PROT-003
PROT-009
```

## Guard
1. verificare la capability nella run corrente;
2. cercare una route diretta alternativa;
3. preservare la continuità del workflow;
4. delegare solo se la route lo consente e serve davvero.

## Action
```text
RESOLVE_CAPABILITY
```

Service policy: `SERVICE_OPTIONAL`.

## Stop / Continue
Se una modalità diretta alternativa recupera il contenuto, il workflow continua. Solo dopo evidence negativa sufficiente può emergere un vero technical stop.

```text
PRIMO ERRORE
≠
CAPABILITY GAP
```

---

# 15.4 Scenario C — «Non so se questo strumento può farlo»

## Request
> «Esegui questa operazione con gli strumenti disponibili.»

## Fact / Event
```text
CAPABILITY_UNVERIFIED
+
ON_TOOL_FAILURE
```

## Process / Protocol
```text
PROT-011
PROT-003
```

## Guard
> **No negative capability conclusion before current-run evidence check.**

## Action
```text
RESOLVE_CAPABILITY
```

## Stop / Continue
```text
DIRECT → continua
SERVICE_REQUIRED / OPTIONAL → usa il service solo nel perimetro autorizzato
CAPABILITY_GAP VERIFICATO → stop tecnico reale
```

---

# 15.5 Scenario D — «Lo stato non torna»

## Request
> «Dimmi qual è il prossimo passo.»

## Fact / Event
```text
UNKNOWN_OPERATIONAL_STATE
+
BEFORE_STOP
```

## Process / Protocol
```text
PROT-016
PROC-011
```

## Guard
```text
STRUCTURED-BEFORE-TEXT
+
NO FUZZY INFERENCE
```

## Action
```text
FAIL_CLOSED
```

Prima si applica la reconciliation deterministica prevista. Se produce uno stato valido, il routing può riprendere; altrimenti si ferma senza inventare il prossimo step.

---

# 15.6 Scenario E — «L'indice dice una cosa, la baseline un'altra»

## Fact / Event
```text
MEMORY_OR_INDEX_DRIFT
+
BEFORE_STOP
```

## Process / Protocol
```text
PROC-008
PROT-013
PROT-005
```

## Guard
- non usare acriticamente l'index stale;
- applicare Source Precedence;
- tentare reconciliation deterministica quando consentita;
- non delegare al repair meccanico un conflitto di significato.

## Action
```text
RECONCILE
```

Service policy: `SERVICE_OPTIONAL`.

---

# 15.7 Scenario F — «Hai modificato qualcosa di materiale: adesso cosa succede?»

## Fact / Event
```text
MATERIAL_DELTA
+
AFTER_MATERIAL_DELTA
```

## Process / Protocol
```text
PROC-006
PROC-011
```

## Guard
- consolidare soltanto il delta organizzativamente rilevante;
- non copiare indiscriminatamente la sessione;
- riconciliare lo stato derivato quando necessario;
- mantenere source-of-truth e projection separate.

## Action
```text
RECONCILE
```

---

# 15.8 Scenario G — «C'è una dipendenza interna che non è ancora pronta»

## Fact / Event
```text
INTERNAL_DEPENDENCY_PENDING
+
ON_WAKE
```

## Process / Protocol
```text
PROT-018
PROT-009
```

## Guard
```text
PENDING ≠ PROJECT BLOCKER
PENDING ≠ HUMAN AUTHORITY GATE
PENDING ≠ PERMISSION TO REPEAT COMPLETED WORK
```

## Action
```text
WAIT_INTERNAL_RESOLUTION
```

---

# 15.9 Scenario H — «La dipendenza è pronta»

## Fact / Event
```text
INTERNAL_DEPENDENCY_READY
+
ON_WAKE
```

## Process / Protocol
```text
PROT-018
PROT-009
```

## Guard
- verificare lineage;
- verificare evidence persistita;
- verificare che l'output corrisponda alla dependency dichiarata;
- non riaprire gli step precedenti.

## Action
```text
CONSUME_AND_CONTINUE
```

---

# 15.10 Scenario I — «Il pacchetto è pronto: fammi decidere»

## Fact / Event
```text
BOARD_GATE_READY
+
BEFORE_BOARD_GATE
```

## Process / Protocol
```text
PROT-010
PROT-009
```

## Guard
Il target di authority deve essere esatto; il sistema non può ampliare l'authority né scegliere al posto dell'owner.

## Action
```text
WAIT_AUTHORITY
```

Questa è una vera stop condition, non un errore.

---

# 15.11 Scenario L — «Cambia questa regola»

## Classification
```text
WCM CHANGE
```

## Guard
```text
PROPOSTA DI CAMBIAMENTO
≠
AUTHORITY A SCRIVERE IL CAMBIAMENTO
```

## Action
```text
PRODUCI IMPACT PREVIEW
→ STOP
```

Il sistema resta fermo finché l'owner non conferisce authority esplicita **dopo** la classificazione del WCM CHANGE e la presentazione dell'Impact Preview.

---

# 15.12 Scenario M — «Aggiorna questo testo» senza cambiare il metodo

## Classification
```text
WCM RUN
```

Una correzione puramente formale non è automaticamente un WCM CHANGE. È il significato materiale, non il semplice fatto di scrivere, a determinare la classificazione.

---

# 15.13 Scenario N — «La UI dice che è tutto completato»

La domanda riguarda un execution fact. La UI è una presentation surface.

```text
AUTHORITY / CANON
→ runtime workflow checkpoint
→ derived state
→ human view
→ projection
→ UI
```

Guard: `PRESENTATION ≠ EXECUTION MASTER`.

---

# 15.14 Scenario O — «Leggi tutto per essere sicuro»

## Process / Protocol
```text
PROC-005
PROT-005
```

## Guard
Context Sufficiency Gate + Stop When Sufficient.

```text
ENTRY POINT
→ INDEX
→ FONTI MINIME AUTOREVOLI
→ STOP WHEN SUFFICIENT
```

---

# 15.15 Scenario P — «Due fonti autorevoli dicono cose incompatibili»

Prima di dichiarare conflitto reale, verifica scope, status, recency nel contesto corretto, supersession, source-of-truth vs projection e precedence specifica del tipo di fatto.

Se il conflitto resta materiale:

```text
NO SILENT CONFLICT RESOLUTION
→ FAIL CLOSED / ESCALATE
```

---

# 15.16 Cosa cambia tra gli scenari

```text
1. QUAL È LA RICHIESTA?
2. QUAL È IL FATTO OPERATIVO RILEVANTE?
3. ESISTE UNO STATO STRUTTURATO?
4. QUAL È LA SOURCE PRECEDENCE?
5. È RUN O CHANGE?
6. QUALE PROCESSO GOVERNA IL FLUSSO?
7. QUALE PROTOCOLLO IMPONE LE GUARD?
8. ESISTE UNA ROUTE EXACT-MATCH?
9. QUALE CAPABILITY SERVE?
10. QUAL È LA TRUE STOP?
```

---

# 15.17 Domain-agnostic non significa context-free

Il contenuto del dominio cambia; la grammatica organizzativa può restare simile.

---

# 15.18 Determinismo: dove arriva davvero

Determinismo dove il significato è già stato formalizzato; reasoning controllato dove il significato deve ancora essere scoperto.

---

# 15.19 La tabella mentale

| Situazione | Route primaria | Guard chiave | Esito |
|---|---|---|---|
| workflow interrotto | Resume Priority | no duplicate work | CONTINUE |
| tool output limit | Capability Evidence | first failure ≠ gap | RESOLVE_CAPABILITY |
| stato operativo ambiguo | Deterministic State | no fuzzy inference | FAIL_CLOSED / reconcile |
| knowledge/index drift | Knowledge Assurance | source precedence | RECONCILE |
| material delta | Consolidation + State Reconciliation | persist only material delta | RECONCILE |
| dependency interna pending | Internal Dependency | pending ≠ project blocker | WAIT_INTERNAL_RESOLUTION |
| dependency interna ready | Internal Dependency | verify lineage | CONSUME_AND_CONTINUE |
| Board Gate pronto | Authority Command + Workflow | exact authority target | WAIT_AUTHORITY |
| modifica della baseline | Change Gate | no write before explicit authority | IMPACT PREVIEW + STOP |
| edit non semantico | normal RUN | material meaning unchanged | EDIT + VERIFY |

Questa tabella è una sintesi pedagogica, non un nuovo registry.

---

# 15.20 Cosa abbiamo ottenuto

Con il Capitolo 15 si chiude il percorso iniziato nel Capitolo 9 e si prepara il Capitolo 16 — Come leggere un processo WCM.

# Source Map

Fonti principali: `WCM_AGENT_START.md`, `wcm/GOVERNANCE.md`, `wcm/runtime/protocol-routing/ROUTING_SOURCE.json`, `PROTOCOL_ROUTING_REGISTRY.json`, PROC-005/006/008/011, PROT-003/005/009/010/011/013/016/018.

## Maturity note

Gli esempi descrivono la baseline WCM corrente e le route strutturate effettivamente presenti nel routing source al momento della stesura. Sono esempi pedagogici domain-agnostic, non dimostrazioni di validità universale. La field validation complessiva del modello continua.
