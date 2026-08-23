# WCM — Technical Reference

**Versione:** 0.4  
**Data:** 2026-08-23  
**Stato:** ACTIVE / LIVING PROJECTION / FIELD VALIDATION  
**Pubblico:** stakeholder tecnico, developer, architect, partner AI/automation  
**Authority:** DEC-010 + DEC-014; human-facing projection, non source of truth

---

# 1. Scopo

Questa Technical Reference descrive il Wise Centric Model end-to-end: architettura, memoria, governance, runtime, processi, assurance, learning, automazioni, Mission Control, Documentation System e applicazioni project-level.

La baseline autorevole resta distribuita tra Governance, Decisioni attive, Architecture, Process Book, Method KB, Capabilities, runtime di progetto ed evidence verificata.

```text
WCM SOURCE OF TRUTH
GitHub main / governance / decisions / runtime / architecture / process / KB
                              ↓
                    HUMAN-FACING PROJECTIONS
        Technical / Executive / User — general + project-level
```

---

# 2. Architettura logica

WCM è Wise-centric: un cognitive core governa significato, priorità, orchestrazione e interpretazione; routine meccaniche vengono rese deterministiche quando la regola è nota.

```text
                           STEFANO / BOARD
                     direction + reserved authority
                                  │
                                  ▼
                         WISE — COGNITIVE CORE
                        WHAT / WHY / meaning
                         │               │
                         ▼               ▼
                  WORKING MEMORY    PERSISTENT ORGANIZATIONAL MEMORY
                         │               │
                         └──── PROC-006 ─┘
                                 │
       ┌─────────────────────────┼─────────────────────────┐
       ▼                         ▼                         ▼
  OPERATIONAL LOOP          IMMUNE LOOP               LEARNING LOOP
 heartbeat/workflow     Knowledge Assurance       evidence + review
       │                         │                         │
       └──────────────┬──────────┴──────────┬─────────────┘
                      ▼                     ▼
            DETERMINISTIC STATE       DOCUMENTATION SYSTEM
                      │                     │
                      ▼                     ▼
             PROJECTOR / READ MODELS   GENERAL + PROJECT MANUALS
                      │                     │
                      ▼                     ▼
                   SUPABASE           DOCX / PDF / WEB
                      │
                      ▼
               MISSION CONTROL
```

Principio: usare cognizione dove serve significato; usare determinismo dove la regola è già nota.

---

# 3. Dual-Memory Cognitive Continuity

## Working Memory

Contesto vivo: conversazione, reasoning situazionale, intenzioni recenti, ipotesi e delta non ancora consolidati.

## Persistent Organizational Memory

GitHub main conserva in forma versionata:

- governance e capability;
- architettura;
- processi/protocolli;
- project state e roadmap;
- runtime workflow checkpoints;
- decisioni e authority receipts;
- KB, living ledgers e typed relations;
- output ed evidence;
- telemetry e health;
- Method Experience Memory;
- master Markdown della documentazione.

Il runtime strutturato è parte della memoria persistente ma ha precedence specifica per execution facts.

---

# 4. Agent-ready knowledge architecture

```text
WCM_AGENT_START
   ↓
RUNTIME CHECKPOINT / DERIVED STATE
   ↓
PROJECT_AGENT_START / STATE human view
   ↓
KNOWLEDGE TRUST GATE
   ↓
INDEX-FIRST + MINIMUM SOURCES
   ↓
STOP WHEN CONTEXT IS SUFFICIENT
```

`PROT-005` governa retrieval progressivo. Un repository ricco non viene trattato come prompt gigante.

Typed relations generali includono `DEPENDS_ON`, `DERIVED_FROM`, `IMPLEMENTS`, `CONSTRAINS`, `AFFECTS`, `SUPERSEDES`, `EVIDENCE_FOR`, `CONTRADICTS`, `RELATED_TO`; i progetti possono introdurre relazioni di dominio.

---

# 5. Governance — WCM RUN vs WCM CHANGE

## WCM RUN

Esegue lavoro già autorizzato senza modificare baseline, authority o significato. `PROT-009` richiede continuità attraverso transizioni contigue fino alla vera stop condition.

## WCM CHANGE

Modifica governance, metodo, architecture, authority, goal/scope, workflow rule, canon/frozen decision o altra baseline materiale.

```text
WCM CHANGE
→ evidence / bootstrap
→ Impact Preview
→ STOP
→ Stefano authority
→ implementation
→ PROC-006 + Assurance + Documentation Impact Check
```

Capacità tecnica ≠ authority.

---

# 6. Session-independent workflow execution

Authority: DEC-012.

Un workflow materiale è un oggetto durevole che sopravvive alla singola sessione.

```text
FINE SESSIONE ≠ FINE WORKFLOW
```

Execution master:

`projects/<project-id>/runtime/workflows/*.json`

Stati generali:

- `ACTIVE`;
- `INTERRUPTED_RESUMABLE`;
- `WAITING_AUTHORITY`;
- `BLOCKED`;
- `COMPLETED`;
- `CANCELLED`.

`ACTIVE` / `INTERRUPTED_RESUMABLE` senza true stop raggiunta hanno Resume Priority. `WAITING_AUTHORITY` è una true stop di governance.

Prima di `COMPLETED` si applica il Completion Gate: output, true stop, checkpoint, state reconciliation, consolidation, Impact Set, current-facing mirrors, assurance e next eligibility devono essere risolti.

---

# 7. Deterministic Operational State Pipeline

Authority: DEC-013 / PROC-011 / PROT-016.

```text
Authority / Canon
→ runtime/workflows/*.json                  execution master
→ runtime/DERIVED_STATE.json                deterministic machine view
→ STATE.md                                  derived human execution view
→ runtime/projection/PROJECTOR_SOURCE.json  structured human/project facts
→ deterministic projector
→ Supabase read models
→ Control Panel
```

## Structured-before-text

Se un fatto operativo esiste in campo strutturato, non viene ricostruito con regex, substring o interpretazione LLM.

## Stable identity

`document_id`, `need_id`, `item_id`, `event_id`, `workflow_instance_id` sono identità logiche stabili.

## Single writer

Un progetto `ACTIVE_DETERMINISTIC` viene proiettato dal Deterministic Projector. Il Projector cognitivo periodico lo salta e resta fallback per progetti non migrati.

## Failure boundary

Payload invalido → fail closed → nessuna scrittura parziale → correzione source/contract → replay deterministico.

---

# 8. Operational Loop

```text
WAKE / USER INPUT / EVENT
        ↓
BOOTSTRAP
        ↓
RUNTIME + AUTHORITY + TRUST GATE
        ↓
NEXT USEFUL TRANSITION
        ↓
DIRECT / DELEGATED EXECUTION
        ↓
CHECKPOINT UPDATE
        ↓
DETERMINISTIC RECONCILIATION
        ↓
PROC-006 / ASSURANCE
        ↓
TRUE STOP?
  ├─ NO → CONTINUE
  └─ YES → REPORT / WAIT / COMPLETE
```

Heartbeat è wake-up, non workflow. Il trigger non deve contenere fotografie dinamiche stale.

---

# 9. Knowledge Integrity / Immune Loop

Authority: DEC-007, DEC-008, PROC-008, PROT-013.

```text
MATERIAL DELTA
→ PROC-006
→ DETERMINISTIC KNOWLEDGE PRE-CHECK
→ anomaly?
   ├─ NO → telemetry
   └─ YES
       → allowlisted + deterministic?
          ├─ YES → controlled auto-repair → post-check
          └─ NO  → NO WRITE → Wise / human gate
```

Knowledge Steward governa memoria meccanica; Wise governa significato.

`last_knowledge_check_at < last_material_delta_at` impedisce una rappresentazione `HEALTHY` corrente.

---

# 10. Learning Loop / Method Experience Memory

Authority: DEC-009, PROC-009, PROT-014.

La pipeline separa evidence capture e interpretazione cognitiva:

```text
DETERMINISTIC EVIDENCE COLLECTOR
→ LEARNING INBOX
→ METHOD HEALTH
→ WISE LEARNING REVIEW
→ LINKED / NO_LEARNING / DUPLICATE / NEEDS_MORE_EVIDENCE
→ Candidate / observing / validated / rejected
→ PROC-004
→ Change Gate se promozione materiale
```

`VALIDATED ≠ PROMOTED`.

---

# 11. Mission Control

Mission Control è Human Governance & Observability Interface.

```text
GITHUB MAIN
  ├─ project structured sources → Deterministic Projector
  ├─ non-migrated project sources → legacy projector path
  └─ method learning → Method Learning Projector
                    ↓
               SUPABASE READ MODELS
                    ↓
          AUTHENTICATED MISSION CONTROL
```

Supabase è read-model store, non source of truth.

Superfici correnti includono portfolio, Needs, Documents, Board, Activity, Roadmap, Knowledge Health, Steward Activity, Execution Health, WCM Learning e Documentation Center.

---

# 12. Documentation System — general + project layer

Authority: DEC-010 + DEC-014, PROC-010, PROT-015.

## General WCM set

1. Technical Reference;
2. Executive / Client Guide;
3. User Manual.

## Project Documentation Set

Per un progetto maturo/operativo:

1. Project Technical Reference;
2. Project Executive / Commercial Guide;
3. Project User Manual;
4. Project Documentation Index.

Prima field validation: PRIMA DI NOI.

## Automation transparency

Ogni flow block materiale deve poter essere spiegato tramite:

`WHY → TRIGGER → INPUT → DOES → WRITES → CAN/CANNOT → STOP/FAIL → OBSERVABLE`.

Il catalogo corrente è `wcm/documentation/AUTOMATION_FLOW_BLOCK_CATALOG.md`.

## Documentation Center

```text
Documentazione
├─ WCM
│  ├─ Technical
│  ├─ Executive
│  └─ User
└─ Projects
   └─ PRIMA DI NOI
      ├─ Technical
      ├─ Executive / Editorial Partner
      └─ User
```

Markdown GitHub main è master. DOCX/PDF/web sono release derivate con source SHA e QA.

---

# 13. Capability model

Capability classificate: `DIRETTA`, `DELEGABILE`, `NON DISPONIBILE`, `DA VALIDARE`.

```text
AUTHORIZED ACTION
→ capability evidence if needed
→ direct available?
   ├─ yes → DIRECT
   └─ no  → minimum required service
```

`PROT-003 Direct Before Delegate`; `PROT-011` impedisce capability gap inventati.

Paperclip può essere execution service quando serve capacità locale/cognitiva non diretta, ma non è baseline per state reconciliation, fingerprint, projector transport o Supabase upsert deterministici.

---

# 14. Automation & Flow Blocks — catalogo tecnico sintetico

La descrizione completa è nel Catalog. Questa appendice garantisce che tutti i blocchi correnti siano visibili dal manuale tecnico.

| ID | Blocco | Tipo | Stato | Funzione |
|---|---|---|---|---|
| `FB-WCM-001` | WCM Mission Control Projector | Cognitive scheduled | ACTIVE router / FALLBACK writer | projection per non-migrati; skip deterministici |
| `FB-WCM-002` | WCM Deterministic State | Deterministic + event-driven | ACTIVE | runtime → Derived State → STATE execution view |
| `FB-WCM-003` | Deterministic Runtime Projector | Deterministic + event-driven | ACTIVE | structured sources → Supabase |
| `FB-WCM-004` | WCM Command Executor | Deterministic + human-gated | ACTIVE | authenticated command → durable authority receipt |
| `FB-WCM-005` | Knowledge Assurance / Steward | Deterministic + scheduled/event | ACTIVE | health → bounded repair → re-check |
| `FB-WCM-006` | Learning Evidence Collector / Method Health | Deterministic + scheduled/event | ACTIVE | evidence capture, inbox, health |
| `FB-WCM-007` | WCM Learning Review | Cognitive scheduled | ACTIVE | interpreta pending evidence; no auto-promotion |
| `FB-WCM-008` | Method Learning Projector | Deterministic + scheduled/event | ACTIVE | method memory → Mission Control Learning |
| `FB-WCM-009` | Legacy Projector Dispatch | Event-driven | FALLBACK / LEGACY | durable legacy projection transport |
| `FB-WCM-010` | Documentation Continuity | Cognitive/on-demand | ACTIVE | doc impact, masters, consistency |
| `FB-WCM-011` | Documentation Release & Distribution | Derived/on-demand | ACTIVE | Markdown → snapshot/DOCX/PDF/web |
| `FB-WCM-012` | WCM Change Gate | Human-gated | ACTIVE | Impact Preview → authority → change |
| `FB-WCM-013` | Board / Authority Command Flow | Human + deterministic transport | ACTIVE | owner decision → receipt → workflow consumption |

---

# 15. Detailed flow block notes

## 15.1 WCM Mission Control Projector

Hourly cognitive wake-up. Per progetto controlla la migration ownership. Se il progetto è deterministic-owned non costruisce una seconda projection e non scrive Supabase; per non-migrati applica il contratto legacy con pre-flight e durable dispatch.

## 15.2 Deterministic State

GitHub Action event-driven su runtime. Esegue test, genera `DERIVED_STATE.json`, rende execution block in STATE, verifica replay e committa soltanto delta derivati.

## 15.3 Deterministic Runtime Projector

GitHub Action event-driven su Derived State, workflow, heartbeat telemetry, structured source e Knowledge Health. Valida references/boundaries, genera payload canonico/fingerprint e usa OIDC per idempotent upsert.

## 15.4 Command Executor

Poll/dispatch meccanico ogni 5 minuti. Preleva command autenticato, valida exact envelope contro GitHub main e limita vocabulary/scope. Receipt persistente non equivale a effects completed.

## 15.5 Knowledge Assurance

Manuale + ogni 6 ore + push sui path sensibili. Pre-check, bounded auto-repair allowlisted, checkpoint metrics, post-check, activity record, telemetry commit e issue reconciliation.

## 15.6 Learning System collector

Daily/event-driven. Cattura evidence deterministica e aggiorna Method Health. Non inferisce né promuove learning.

## 15.7 Learning Review

Daily cognitive review. Legge soltanto pending evidence e fonti minime; classifica, collega o crea Candidate quando giustificato. Se emerge WCM CHANGE produce Impact Preview e stop.

## 15.8 Method Learning Projector

Event/daily projector dei quattro file strutturati Method Experience Memory verso read-model Mission Control.

## 15.9 Legacy Projector Dispatch

Issue-driven fallback. Resta disponibile per progetti non migrati; è vietata concorrenza col deterministic writer.

## 15.10 Documentation Continuity / Release

Ogni delta rilevante esegue impact check general + project + automation catalog. DOCX/PDF release richiede master current, provenance e visual QA.

---

# 16. Project bootstrap

`PROC-007`:

```text
PROJECT INTENT
→ CLASSIFICATION
→ ADMISSION PREVIEW
→ BOARD ADMISSION
→ OWNER SOURCE INTAKE
→ MEMORY FOUNDATION
→ GOAL + STATE + ROADMAP + GOVERNANCE
→ PROJECT_AGENT_START + runtime
→ READINESS REVIEW
→ BOARD ACTIVATION
→ WCM RUN
```

Con DEC-014, quando la complessità/maturità lo giustifica, il bootstrap/activation impact deve anche valutare il Project Documentation Set.

---

# 17. Project-level application: PRIMA DI NOI

PRIMA DI NOI è la principale field validation corrente. Applica:

- cognitive hourly project heartbeat;
- persistent Chapter Workflow;
- professional role/review separation;
- Narrative Mass Control;
- living knowledge / continuity ledgers;
- Board/Author Gate;
- durable command receipt;
- post-freeze reconciliation;
- Knowledge Assurance;
- deterministic state;
- deterministic Mission Control projection;
- evidence path verso WCM Learning.

I dettagli sono nei manuali `projects/prima-di-noi/documentation/`.

---

# 18. Failure / recovery model

- technical interruption → `INTERRUPTED_RESUMABLE`, not fake completion;
- invalid structured state → fail closed;
- projection invalid → no partial write;
- semantic ambiguity → cognitive/human escalation;
- mechanical allowlisted memory drift → Knowledge Steward repair + re-check;
- stale documentation → Documentation Drift / PROC-010 not PASS;
- repeated command → idempotency prevents double execution;
- session change → resume same authorized workflow.

---

# 19. Maturità e limiti

WCM è **FIELD VALIDATION**.

Operativo e field-validated in parti significative su PRIMA DI NOI non significa universalmente scale-ready.

Restano fuori dalla baseline salvo nuova evidence/decisione:

- semantic auto-repair generico;
- graph database obbligatorio;
- LLM polling continuo come mechanical control plane;
- gerarchie agentiche profonde di default;
- schema universale identico per ogni dominio;
- command vocabulary arbitrariamente esteso;
- claim di generalizzazione cross-project non ancora dimostrata.

---

# 20. Riferimenti

- `WCM_AGENT_START.md`
- `wcm/GOVERNANCE.md`
- `wcm/WISE_MANDATE.md`
- `wcm/CAPABILITIES.md`
- `wcm/architecture/WCM_LIVING_ARCHITECTURE.md`
- `wcm/architecture/DETERMINISTIC_STATE_PIPELINE.md`
- `wcm/architecture/MISSION_CONTROL.md`
- `wcm/process-book/PROCESS_REGISTER.md`
- `wcm/process-book/processes/PROC-010_DOCUMENTATION_CONTINUITY_LOOP.md`
- `wcm/process-book/protocols/PROT-015_DOCUMENTATION_IMPACT_AND_PUBLICATION_STANDARD.md`
- `wcm/documentation/AUTOMATION_FLOW_BLOCK_CATALOG.md`
- `DEC-007`, `DEC-008`, `DEC-009`, `DEC-010`, `DEC-011`, `DEC-012`, `DEC-013`, `DEC-014`

---

# Principio finale

WCM non cerca di rendere tutto cognitivo né tutto deterministico. Cerca di mettere **significato, automazione, memoria e authority nel posto giusto**, mantenendo visibile come ogni blocco contribuisce al flusso complessivo.
