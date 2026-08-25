# WCM — Technical Reference

**Versione:** 0.5  
**Data:** 2026-08-24  
**Stato:** ACTIVE / LIVING PROJECTION / FIELD VALIDATION  
**Pubblico:** stakeholder tecnico, developer, architect, partner AI/automation  
**Authority:** DEC-010 + DEC-014; human-facing projection, non source of truth

---

# 1. Scopo

Questa Technical Reference descrive la baseline WCM corrente includendo le evoluzioni operative validate tra il 23 e il 24 agosto 2026: workflow session-independent, state/projector deterministici, Knowledge Assurance event-driven, dipendenze interne di assurance, heartbeat telemetry deterministica, authority command per Method Change Gate e Persistent Mutation Safety.

La baseline autorevole resta distribuita tra Governance, Decisioni, Process Book, Architecture, Method KB, runtime di progetto, capability ed evidence. Questo documento la rende leggibile ma non la sostituisce.

---

# 2. Principio architetturale

WCM usa cognizione dove serve significato e determinismo dove la regola è nota.

```text
STEFANO / BOARD
      ↓ authority
WISE — COGNITIVE CORE
      ↓
PERSISTENT ORGANIZATIONAL MEMORY
      ↓
┌───────────────┬─────────────────┬────────────────┐
│ Operational   │ Immune          │ Learning       │
│ Loop          │ Loop            │ Loop           │
└───────┬───────┴────────┬────────┴───────┬────────┘
        ↓                ↓                ↓
 persistent         Knowledge       Method Experience
 workflows          Assurance       Memory
        ↓                ↓                ↓
 deterministic state / projectors / command consumers
        ↓
 Supabase read models
        ↓
 Mission Control
```

L'obiettivo non è rendere tutto autonomo, ma rendere ogni blocco **responsabile, osservabile e confinato**.

---

# 3. Dual Memory e runtime durevole

La Working Memory conserva il contesto vivo della sessione. La Persistent Organizational Memory conserva ciò che deve sopravvivere: authority, state, workflow, decisioni, knowledge, evidence, documenti e learning.

Per execution facts la gerarchia corrente è:

```text
AUTHORITY / CANON
→ projects/<project>/runtime/workflows/*.json
→ runtime/DERIVED_STATE.json
→ STATE.md execution view
→ runtime/projection/PROJECTOR_SOURCE.json
→ deterministic projector
→ Supabase read model
→ Mission Control
```

`STATE.md` non è execution master quando esiste runtime strutturato.

---

# 4. Session-Independent Workflow Execution

Authority: DEC-012 + PROT-009.

Un workflow materiale sopravvive alla singola sessione. Stati generali:

- `ACTIVE`;
- `INTERRUPTED_RESUMABLE`;
- `WAITING_AUTHORITY`;
- `BLOCKED`;
- `COMPLETED`;
- `CANCELLED`.

`ACTIVE` e `INTERRUPTED_RESUMABLE` hanno Resume Priority se la true stop non è stata raggiunta. `WAITING_AUTHORITY` è una stop condition intenzionale.

Prima di `COMPLETED` il Completion Gate verifica almeno output, checkpoint, true stop, state reconciliation, memory consolidation, current-facing consistency, assurance e next eligibility.

---

# 5. Deterministic Operational State Pipeline

Authority: DEC-013 + PROC-011 + PROT-016.

```text
runtime workflow
→ exact validation
→ DERIVED_STATE
→ STATE execution block
→ PROJECTOR_SOURCE
→ exact mapping / canonical fingerprint
→ OIDC transport
→ idempotent Supabase upsert
```

Invarianti:

- structured-before-text;
- enum esatti;
- stable logical IDs;
- deterministic replay;
- fail closed su unknown/conflict;
- single writer per progetto migrato;
- read model senza write-back semantico.

PRIMA DI NOI è la principale M3 field validation corrente.

---

# 6. Operational Heartbeat

Il project heartbeat è un **wake-up cognitivo**, non il workflow e non una seconda source of truth.

Il trigger contiene istruzioni stabili; il task corrente viene ricostruito da runtime, authority e Project Agent Start.

```text
WAKE
→ runtime / Derived State
→ Resume Priority
→ minimum context / Knowledge Trust Gate
→ next authorized transition
→ checkpoint
→ deterministic reconciliation
→ continue until real stop
```

La fine dell'heartbeat non è di per sé una stop condition.

---

# 7. Deterministic Heartbeat Telemetry

Evoluzione attiva dal 24 agosto 2026.

Il cognitive heartbeat non è più ordinary writer diretto di `HEARTBEAT_STATUS.json`. Emette una request immutabile project-scoped:

```text
Cognitive heartbeat
→ runtime/telemetry-requests/<request_id>.json
→ wcm/runtime/heartbeat_telemetry.py
→ exact schema + project boundary + monotonic check
→ HEARTBEAT_STATUS.json
→ runtime/telemetry-results/<request_id>.json
```

Implementazione cloud:

- `.github/workflows/wcm-heartbeat-telemetry.yml`;
- `wcm/runtime/heartbeat_telemetry.py`.

Boundary fondamentale:

- heartbeat timestamp = **liveness**;
- workflow/Derived State = **execution**;
- nuova telemetria non implica nuova phase, activity, authority o decisione.

Una failure di sola telemetria resta un problema di observability salvo evidenza contraria.

---

# 8. Knowledge Assurance / Immune Loop

Authority: DEC-007, DEC-008, PROC-008, PROT-013.

La pipeline corrente è event-driven con safety net schedulata ogni 6 ore.

Trigger principali:

- push su runtime/state/current-facing/knowledge paths rilevanti;
- `workflow_call` da workflow che richiedono un fresh Knowledge Trust Gate;
- manual dispatch;
- schedule `17 */6 * * *`.

Flusso:

```text
fresh pre-check
→ classify anomaly
→ allowlisted + deterministic?
   ├─ YES → Controlled Auto-Repair
   └─ NO  → NO WRITE / escalation
→ post-check
→ Knowledge Health
→ resolve eligible internal dependency
→ activity / issue reconciliation
```

## Internal dependency contract

Un workflow può dichiarare una dipendenza interna, per esempio:

> prima del Board Gate è richiesto un Knowledge Assurance fresh.

Knowledge Assurance può soddisfarla deterministicamente quando il risultato e la Git ancestry sono validi. Questo evita di trasformare una verifica interna in un Need umano.

PRIMA DI NOI Chapter 7 ha già esercitato questo pattern.

---

# 9. Persistent Mutation Safety — PROT-017

`PROT-017` è ACTIVE e deriva dalla promotion di `WCM-LRN-004`.

Si applica alle write persistenti che possono modificare canon, runtime, authority, configuration, shared read/write model, command state o file remoti.

```text
INTENT / AUTHORITY
→ EXACT TARGET + SCOPE
→ PAYLOAD / SCHEMA GUARD
→ EXPECTED VERSION / STATE
→ WRITER OWNERSHIP / SERIALIZATION
→ IDEMPOTENT WRITE
→ POST-WRITE VERIFICATION
→ EFFECT ACCEPTED
```

Guard principali:

1. exact target/scope;
2. payload/schema validation;
3. expected SHA/revision/fingerprint/state;
4. single writer o serialization;
5. stable identity/idempotency;
6. post-write verification;
7. authority boundary preservation;
8. recovery evidence.

Principio: **recovery non sostituisce prevention**.

---

# 10. Authority commands di progetto

`PROT-010` governa il channel Mission Control → durable authority receipt → workflow consumption.

Per i Chapter Board Gate di PRIMA DI NOI il command vocabulary corrente include `APPROVE_FREEZE` e `REQUEST_CHANGES` secondo il contratto applicabile.

Il receipt registra authority; il workflow deve ancora consumarlo e completare gli effetti. Quindi:

```text
COMMAND RECORDED ≠ WORKFLOW EFFECTS COMPLETED
```

Retry e replay devono essere idempotenti.

---

# 11. Method Change Gate Authority Command

Il WCM Learning System possiede ora un circuito deterministico end-to-end per registrare la decisione owner su un `WCM_CHANGE_GATE`.

```text
OPEN GATE
→ Mission Control command
→ SUBMITTED
→ CLAIMED
→ exact gate_id + expected revision + OPEN check
→ immutable authority receipt
→ gate decision persisted
→ RECORDED
→ Method Learning Projector
→ Mission Control
```

Vocabolario command:

- `APPROVE_CHANGE_GATE`;
- `REQUEST_CHANGES`;
- `REJECT_CHANGE_GATE`.

Distinzione obbligatoria:

```text
AUTHORITY_APPROVED ≠ EXECUTED ≠ PROMOTED
```

Il clic registra authority, non modifica direttamente la baseline. La modifica della baseline e la promotion sono passaggi successivi e verificati.

La concorrenza è governata da `revision`: gate non OPEN o revisione stale → command `STALE`, nessun authority effect.

---

# 12. WCM Learning System

Authority: DEC-009 + PROC-009 + PROT-014.

Pipeline:

```text
material event
→ deterministic evidence collector
→ Learning Inbox / Method Health
→ cognitive WCM Learning Review
→ linked / no-learning / candidate / more evidence
→ validation
→ PROC-004
→ WCM Change Gate se materiale
→ controlled baseline promotion
```

Il collector non interpreta; la review non può auto-approvare il Change Gate; la promotion deve rispettare PROT-017 per le persistent mutation.

Learning promossi correnti includono `WCM-LRN-001` … `WCM-LRN-005`; `WCM-LRN-004` ha prodotto PROT-017.

---

# 13. Mission Control e Projectors

Mission Control è Human Governance & Observability Interface.

Projectors correnti:

- Deterministic Runtime Projector per progetti `ACTIVE_DETERMINISTIC`;
- WCM Mission Control Projector come portfolio router/fallback per non migrati;
- Method Learning Projector per Method Experience Memory.

Regola single-writer: il Projector cognitivo non deve competere con il deterministic writer di un progetto migrato.

---

# 14. Documentation System

Authority: DEC-010 + DEC-014, PROC-010, PROT-015.

Due livelli:

```text
WCM GENERAL
├─ Technical Reference
├─ Executive / Client Guide
└─ User Manual

PROJECT
├─ Technical Reference
├─ Executive / Commercial Guide
└─ User Manual
```

Ogni delta rilevante deve classificare impatto su general docs, project docs, Automation Catalog e release artefacts.

I manuali sono proiezioni. Markdown GitHub è master; DOCX/PDF/web sono derivati con source SHA e QA.

---

# 15. Automation & Flow Block Map corrente

Riferimento completo: `AUTOMATION_FLOW_BLOCK_CATALOG_V1_1.md`.

Blocchi generali principali:

- Mission Control cognitive projector/router;
- Deterministic State;
- Deterministic Runtime Projector;
- Project Command Executor;
- Knowledge Assurance / Steward;
- Learning Evidence Collector;
- WCM Learning Review;
- Method Learning Projector;
- Legacy Projector Dispatch;
- Documentation Continuity;
- Documentation Release;
- WCM Change Gate;
- Board / Authority Command Flow;
- **Heartbeat Telemetry Materializer**;
- **Method Change Gate Authority Consumer**;
- **Persistent Mutation Safety Guard**.

---

# 16. PRIMA DI NOI come field validation

Il progetto applica concretamente:

- hourly cognitive heartbeat;
- persistent Chapter Workflow;
- professional review separation;
- Narrative Mass Control;
- living knowledge;
- pre-Board internal Knowledge Assurance dependency;
- Board/Author Gate;
- verified delivery;
- durable authority receipt;
- Post-Freeze Reconciliation;
- deterministic heartbeat telemetry;
- deterministic state/projector;
- Method Learning evidence path;
- PROT-017 sulle persistent mutation WCM applicabili.

I manuali project-specific sono in `projects/prima-di-noi/documentation/`.

---

# 17. Failure / recovery model

- session boundary → non completion;
- technical interruption → `INTERRUPTED_RESUMABLE`;
- invalid runtime/payload → fail closed;
- stale expected version → reload/replay, non force-write;
- duplicate command → idempotent replay;
- semantic ambiguity → Wise/human escalation;
- mechanical allowlisted drift → controlled repair + re-check;
- telemetry failure → observability-local unless proven otherwise;
- stale documentation → Documentation Drift, no PASS.

---

# 18. Maturità

WCM resta **FIELD VALIDATION**.

Sono operativi e field-validated in misura significativa su PRIMA DI NOI: durable workflows, deterministic state/projector, authority command path, Knowledge Assurance, Learning System, heartbeat telemetry e documentation layer.

Non sono automaticamente provati: scale multi-project, universal workflow schema, generic semantic auto-repair, arbitrary authority vocabulary, deep multi-agent hierarchy o piena productizzazione enterprise.

---

# 19. Riferimenti correnti

- `WCM_AGENT_START.md`
- `wcm/HEARTBEAT_PROTOCOL.md`
- `wcm/process-book/PROCESS_REGISTER.md`
- `wcm/process-book/protocols/PROT-017_PERSISTENT_MUTATION_SAFETY.md`
- `wcm/kb/learning/METHOD_CHANGE_GATE_AUTHORITY_COMMAND_CONTRACT.md`
- `wcm/documentation/WCM_HEARTBEAT_TELEMETRY_DETERMINISTIC_PERSISTENCE_V0_1.md`
- `wcm/documentation/AUTOMATION_FLOW_BLOCK_CATALOG_V1_1.md`
- `projects/prima-di-noi/runtime/DERIVED_STATE.json`
- `projects/prima-di-noi/PROJECT_AGENT_START.md`

---

# Principio finale

WCM cerca di rendere **deterministico ciò che non ha bisogno di interpretazione, cognitivo ciò che richiede significato e umano ciò che richiede authority**.