# PRIMA DI NOI — Technical Reference

**Versione:** 0.2  
**Data:** 2026-08-24  
**Stato:** ACTIVE / LIVING PROJECTION / FIELD VALIDATION  
**Pubblico:** tecnici, editori con background tecnologico, production architect, partner AI/editorial tech  
**Authority:** DEC-014 + PRIMA DI NOI project authority; human-facing projection, non source of truth

---

# 1. Scopo

Questa Technical Reference descrive l'applicazione corrente del WCM al progetto editoriale **PRIMA DI NOI**, includendo le implementazioni esercitate fino al Capitolo 7: workflow session-independent, pre-Board Knowledge Assurance come internal dependency, delivery verificata, deterministic state/projector, heartbeat telemetry deterministica e safety sulle persistent mutation.

Per execution facts prevalgono `runtime/workflows/*.json` e `runtime/DERIVED_STATE.json`. Per canone e significato prevalgono Story Architecture, project authority, frozen manuscript, Source Register e fonti project-specific previste.

---

# 2. PRIMA DI NOI come sistema editoriale persistente

Il progetto non è una sequenza di prompt per generare capitoli.

```text
STEFANO — AUTHOR & CREATIVE DIRECTOR
            ↓ authority
WISE — COGNITIVE CORE / NARRATIVE ORCHESTRATION
            ↓
EDITORIAL ROLES + CHAPTER WORKFLOW
            ↓
PROJECT MEMORY + LIVING KNOWLEDGE
            ↓
KNOWLEDGE ASSURANCE / INTERNAL DEPENDENCIES
            ↓
CANDIDATE + BOARD REPORT + VERIFIED DELIVERY
            ↓
AUTHOR GATE
            ↓
POST-FREEZE RECONCILIATION
            ↓
DETERMINISTIC STATE / PROJECTOR
            ↓
MISSION CONTROL
```

Il WCM generale fornisce memoria, workflow continuity, assurance, authority transport, projection e learning; PRIMA DI NOI definisce i contratti narrativi/editoriali specifici.

---

# 3. Authority

Stefano mantiene authority finale su:

- canone;
- Story Architecture;
- personaggi e svolte materiali;
- reveal protetti;
- finale;
- voce autoriale;
- approval/freeze dei capitoli;
- pubblicazione.

Wise opera entro l'authority vigente. Un draft, una review o un Board Report non acquisiscono authority per il solo fatto di esistere.

---

# 4. Frozen baseline e live-state rule

La baseline corrente include Story Architecture V0.2, addendum SRC-028, Narrative Readiness, Opening Package e manoscritto frozen attraverso il Capitolo 6.

Il manuale **non hard-codifica il capitolo corrente** come regola permanente.

Per execution live:

```text
runtime/workflows/*.json
→ runtime/DERIVED_STATE.json
→ STATE.md execution block
→ Mission Control
```

Al 24 agosto 2026 il workflow canonico verificato è Chapter 7 V0.1 Editorial Gate in `WAITING_AUTHORITY`, ma questo dato è esempio/evidence, non contenuto normativo del manuale.

---

# 5. Editorial role architecture

Ruoli principali:

- Narrative Lead / Showrunner;
- PRIMA Writer;
- Canon & Continuity Editor;
- Research Agent;
- Character Agent;
- Thriller Editor;
- Style Guardian;
- Engagement Strategist;
- Independent Reviewer;
- Knowledge Operations;
- Knowledge Steward come funzione WCM trasversale.

La separazione maker/reviewer è parte del quality model: il Writer produce; review specialistiche vengono elaborate separatamente; l'Editorial Synthesis integra i risultati.

---

# 6. Chapter Workflow corrente

```text
WORKFLOW INITIALIZATION
→ PRODUCTION BRIEF / DEPENDENCY CHECK
→ RESEARCH JIT quando necessario
→ DRAFT
→ PROFESSIONAL REVIEWS
→ NARRATIVE MASS CONTROL
→ EDITORIAL SYNTHESIS / REVISION
→ CANDIDATE ASSEMBLY
→ NUMERIC MASS VALIDATION
→ BOARD REPORT
→ PRE-BOARD FRESH KNOWLEDGE TRUST GATE
→ WORD DELIVERY PACKAGE
→ DELIVERY VERIFICATION
→ BOARD GATE
→ AUTHOR DECISION
→ POST-FREEZE RECONCILIATION
→ FRESH KNOWLEDGE TRUST GATE
→ COMPLETION GATE
→ NEXT ELIGIBLE UNIT
```

Draft, reviews, mass control, synthesis e Candidate sono transizioni intermedie. Non sono stop discrezionali.

---

# 7. Run-until-real-stop

Authority: DEC-012 + PROT-009 + project invariant.

Il project heartbeat continua attraverso transizioni contigue autorizzate fino a:

- `WAITING_AUTHORITY / BLOCKED_BOARD`;
- WCM CHANGE non autorizzato;
- blocker reale;
- Knowledge Trust Gate bloccante;
- runtime conflict;
- capability/technical failure realmente non aggirabile.

La fine della sessione, la produzione di un Draft o il completamento di una review non costituiscono di per sé true stop.

---

# 8. Runtime checkpoint model

Execution master:

`projects/prima-di-noi/runtime/workflows/*.json`

Ogni workflow registra almeno:

- `workflow_instance_id`;
- status;
- authority/scope;
- completed step IDs;
- last completed transition;
- next transition;
- true stop;
- resume status;
- internal dependencies;
- delivery/gate/completion state quando pertinenti.

La Derived State viene rigenerata deterministicamente e non reinterpretata dalla sessione successiva.

---

# 9. Internal dependency: fresh Knowledge Assurance

Il Chapter Workflow può dichiarare una dipendenza interna prima di un passaggio sensibile.

Esempio esercitato sul Capitolo 7:

```text
chapter-07-pre-board-fresh-knowledge
required_status = CONSUMED
consumer_transition = PRE_BOARD_KNOWLEDGE_TRUST_GATE
```

Flusso:

```text
Chapter Workflow richiede fresh assurance
→ reusable WCM Knowledge Assurance via workflow_call/event
→ check + provenance/ancestry
→ result materialized
→ internal dependency resolved/consumed
→ workflow valuta blocking/non-blocking
→ Board package può avanzare se sicuro
```

Questo evita di aprire un Need umano per una verifica meccanica che il sistema può eseguire autonomamente.

---

# 10. Knowledge Assurance corrente

Knowledge Assurance è event-driven con safety net ogni 6 ore.

Trigger rilevanti includono runtime, Derived State, State, Project Agent Start, Roadmap, Decisions, KB index, living ledgers, owner inputs e assurance contracts.

Output:

- Knowledge Health;
- eventuali Controlled Auto-Repair allowlisted;
- Steward Activity;
- internal dependency resolution;
- issue/escalation se necessario.

Un `DEGRADED` può essere non bloccante quando le issue residue non invalidano la transizione corrente. Il workflow del Capitolo 7 ha esercitato questa semantica con Knowledge Health 94 / blocking false.

---

# 11. Narrative Mass Control

Ogni package Chapter Board-ready deve includere valori numerici espliciti:

- Candidate word count;
- cumulative word count;
- media pertinente;
- final projection;
- target 85.000–100.000 parole;
- scostamento;
- verdict `ON TARGET / UNDER TARGET / OVER TARGET`;
- interpretazione editoriale;
- anti-padding check.

Il Board Report non è Board-ready se contiene soltanto un giudizio qualitativo senza metriche richieste.

---

# 12. Canon & Continuity / Living Knowledge

Living ledgers correnti:

- `RELATIONSHIP_LEDGER.md`;
- `REVEAL_KNOWLEDGE_LEDGER.md`;
- `ENTITY_EVENT_FACTION_LEDGER.md`;
- `PAYOFF_DEBT_LEDGER.md`.

La continuity di una Candidate deve usare il frozen manuscript precedente oltre a Story Architecture e ledgers. Deve controllare eventi già accaduti, character knowledge, reveal/holdback, entità/fazioni, seeds/payoff e debiti aperti.

---

# 13. Board package e delivery

Prima di aprire il Board Gate il workflow può richiedere:

- Candidate completa;
- Board Report completo;
- Numeric Mass Validation;
- fresh Knowledge Trust Gate;
- Word delivery package;
- delivery verificata secondo PROT-012.

Il Capitolo 7 ha esercitato il gate `BLOCKED_BOARD_AFTER_VERIFIED_DELIVERY`: il Need viene aperto soltanto dopo delivery verificata.

`APPROVE_FREEZE` deve puntare alla Candidate, non al Board Report.

---

# 14. Author Gate / Command Flow

Per il Chapter Board Gate corrente i command applicabili sono:

- `APPROVE_FREEZE`;
- `REQUEST_CHANGES`.

Mission Control raccoglie la decisione; il Command Executor valida/persistisce l'authority receipt; il Chapter Workflow consuma il receipt idempotentemente.

```text
COMMAND RECORDED
≠ FREEZE EFFECTS COMPLETED
≠ WORKFLOW COMPLETED
```

Il Capitolo successivo non è eleggibile finché gli effetti e il Completion Gate non sono chiusi.

---

# 15. Post-Freeze Reconciliation

Dopo `APPROVE_FREEZE`:

```text
apply freeze
→ absorb/update living ledgers
→ reconcile indexes/current-facing mirrors
→ update runtime checkpoint
→ deterministic state reconciliation
→ fresh Knowledge Trust Gate
→ Completion Gate
→ workflow COMPLETED
→ next unit eligible
```

Serve a evitare che un testo sia narrativamente approved ma che la memoria organizzativa rimanga nello stato precedente.

---

# 16. Deterministic State + Projector

```text
runtime/workflows
→ deterministic_state.py
→ DERIVED_STATE.json
→ STATE execution block
→ PROJECTOR_SOURCE + Knowledge Health + heartbeat liveness
→ deterministic project_projection.py
→ OIDC / idempotent Supabase upsert
→ Mission Control
```

PRIMA DI NOI è `ACTIVE_DETERMINISTIC`: il cognitive Mission Control Projector generale non deve diventare un secondo writer concorrente.

---

# 17. Heartbeat Telemetry Materialization

Il PRIMA DI NOI Heartbeat rimane cognitivo, ma non aggiorna direttamente il file mutable di liveness come ordinary writer.

```text
heartbeat concludes with canonical outcome
→ immutable telemetry request
→ deterministic materializer
→ monotonic/stale validation
→ HEARTBEAT_STATUS
→ telemetry result
```

Questa separazione protegge il progetto da una confusione importante:

```text
HEARTBEAT RECENCY = LIVENESS
WORKFLOW / DERIVED STATE = EXECUTION
```

Un heartbeat recente non rende automaticamente eleggibile un capitolo o chiude un gate.

---

# 18. Persistent Mutation Safety nel progetto

Le mutazioni persistenti WCM applicate al progetto sono soggette a PROT-017 quando pertinenti: exact target, schema/payload, expected state/SHA/revision, writer ownership, idempotency e post-write verification.

Questo riguarda in particolare runtime/shared state, authority, file remoti sostitutivi e writer automatici.

Un recovery riuscito non cancella la failure come evidence.

---

# 19. WCM Learning bridge

Eventi del progetto possono produrre evidence per il metodo WCM:

```text
PRIMA DI NOI event/failure/capability
→ deterministic collector
→ Learning Inbox
→ WCM Learning Review
→ learning relation/candidate
→ Change Gate se materiale
→ controlled promotion
```

Il progetto non ha authority per modificare da solo il metodo.

Tra i learning già derivati dalla field experience del progetto figura `WCM-LRN-005` sulla necessità di durable execution state.

---

# 20. Automation / Flow Blocks

Project-specific:

- `FB-PDN-001` PRIMA DI NOI Heartbeat;
- `FB-PDN-002` Chapter Workflow;
- `FB-PDN-003` Narrative Mass Control;
- `FB-PDN-004` Canon & Continuity / Living Knowledge;
- `FB-PDN-005` Knowledge Assurance;
- `FB-PDN-006` Deterministic State + Projector;
- `FB-PDN-007` Board / Author Gate;
- `FB-PDN-008` Post-Freeze Reconciliation;
- `FB-PDN-009` Method Learning Evidence;
- `FB-PDN-010` Pre-Board Fresh Assurance Dependency;
- `FB-PDN-011` Verified Board Delivery.

General blocks applicati includono Heartbeat Telemetry Materializer, Command Executor, PROT-017 safety guard, Learning System/Review e Documentation Continuity.

Dettaglio: `wcm/documentation/AUTOMATION_FLOW_BLOCK_CATALOG_V1_1.md`.

---

# 21. Example snapshot — 2026-08-24

Evidence corrente, non regola statica:

```text
Chapter 7 V0.1 Editorial Gate
status = WAITING_AUTHORITY
last = BOARD_GATE_OPENED
next = BOARD_DECISION
true stop = BLOCKED_BOARD_AFTER_VERIFIED_DELIVERY
```

Il workflow ha già completato Draft, reviews, mass control, Candidate, Board Report, fresh Knowledge Trust Gate, DOCX package e verified delivery. Chapter 8 non deve partire prima dell'authority sul Chapter 7 gate.

Questo snapshot dimostra il principio: un heartbeat può continuare a essere vivo mentre il workflow rimane correttamente fermo su authority.

---

# 22. Maturità

PRIMA DI NOI è la principale field validation del WCM, non prova universale di ogni workflow editoriale.

Sono field-validated sul progetto: session-independent chapter workflows, deterministic state/projector, Board command path, verified delivery, living knowledge, Knowledge Assurance e internal dependencies, heartbeat telemetry separation, learning evidence path.

Generalizzazione a più titoli/editori resta da validare.

---

# Principio finale

PRIMA DI NOI usa WCM per far avanzare un progetto editoriale reale mantenendo separate **creazione, verifica, memoria, automazione e authority autoriale**.