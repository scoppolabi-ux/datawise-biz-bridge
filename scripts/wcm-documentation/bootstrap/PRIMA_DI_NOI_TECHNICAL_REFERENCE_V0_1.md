# PRIMA DI NOI — Technical Reference

**Versione:** 0.1  
**Data:** 2026-08-23  
**Stato:** ACTIVE / LIVING PROJECTION / FIELD VALIDATION  
**Pubblico:** tecnici, editori con background tecnologico, production architect, partner AI/editorial tech  
**Authority:** DEC-014 + PRIMA DI NOI project authority; human-facing projection, non source of truth

---

# 1. Scopo

Questa Technical Reference descrive **come il WCM è applicato concretamente a PRIMA DI NOI**, progetto editoriale/thriller filosofico usato come principale field validation corrente del metodo.

Non sostituisce le fonti operative e narrative autorevoli. Per execution facts prevalgono runtime/Derived State; per canone e progetto prevalgono Story Architecture, project authority, frozen manuscript e fonti project-specific previste.

---

# 2. Il progetto come sistema editoriale AI-native

PRIMA DI NOI non viene trattato come una sequenza di prompt per generare capitoli.

È organizzato come un sistema editoriale persistente con:

- Author & Creative Director con authority finale;
- Wise come cognitive core / orchestratore;
- ruoli editoriali specialistici separati;
- Story Architecture e Narrative Readiness;
- persistent project memory;
- living ledgers narrativi;
- Chapter Workflow durevole;
- runtime checkpoint session-independent;
- Board / Author Gate;
- Knowledge Assurance;
- deterministic state reconciliation;
- deterministic Mission Control projection;
- method-learning evidence path.

```text
STEFANO — AUTHOR & CREATIVE DIRECTOR
                │
                ▼
          WISE — COGNITIVE CORE
                │
      ┌─────────┼──────────────────────────┐
      ▼         ▼                          ▼
EDITORIAL   PROJECT MEMORY            PROJECT RUNTIME
ROLES       + LIVING LEDGERS          + WORKFLOWS
      │         │                          │
      └─────────┼──────────────┬───────────┘
                ▼              ▼
          CHAPTER FLOW    KNOWLEDGE ASSURANCE
                │              │
                ▼              ▼
             BOARD GATE   HEALTH / REPAIR / ESCALATION
                │
                ▼
        DETERMINISTIC STATE/PROJECTOR
                │
                ▼
           MISSION CONTROL
```

---

# 3. Authority e governance

## Stefano — Author & Creative Director

Authority riservata su:

- canone;
- macrostruttura;
- personaggi materiali;
- svolte e reveal;
- finale;
- voce autoriale;
- gate editoriali;
- pubblicazione.

## Wise

Governa orchestrazione, sintesi cognitiva, routing e significato entro l'authority già concessa. Non approva in nome di Stefano.

## WCM RUN / WCM CHANGE

Nel ciclo editoriale, draft, review, Narrative Mass Control, sintesi, revision, Candidate assembly, Board Report e aggiornamenti coerenti sono normalmente WCM RUN se restano dentro Story Architecture/authority vigenti.

Deviazioni materiali da canone, frozen material, Story Architecture, workflow o authority sono WCM CHANGE e richiedono il gate applicabile.

---

# 4. Editorial role architecture

I ruoli sono blueprint professionali; l'executor può essere Wise o service autorizzato.

## Narrative Lead / Showrunner

Story architecture, causalità, reveal architecture, scene design, editorial synthesis, revision brief.

## PRIMA Writer

Prosa, dialoghi, POV, ritmo, atmosfera, subtext, continuità di voce. Scrive solo su unità eleggibile e usa brief + frozen manuscript precedente + living knowledge pertinente.

## Canon & Continuity Editor

Controlla timeline, eventi precedenti, character knowledge, reveal/holdback, entity/function introduction, payoff debt e synapses narrative.

## Research Agent

Plausibilità/scienza/AI/fact checking; separa FATTO / IPOTESI / CONTROVERSIA / INVENZIONE NARRATIVA.

## Character Agent

Motivazioni, ferite, desideri, archi, dialoghi e knowledge state.

## Thriller Editor

Suspense, escalation, pacing, gestione informazione, cliffhanger.

## Style Guardian

Identità linguistica, anti-cliché, anti-prosa generica/didascalica.

## Engagement Strategist

Curiosity architecture, memorabilità, word-of-mouth, senza deformare il canone.

## Independent Reviewer

Red-team, acceptance criteria, detection di assunzioni implicite.

## Knowledge Operations

Mantiene indici, source register, living ledger e provenance project-specific.

## Knowledge Steward

Funzione WCM trasversale: verifica integrità della memoria, non governa il significato narrativo.

---

# 5. Story / manuscript governance

La produzione estesa della prosa è subordinata a struttura e readiness approvate.

```text
CANON + APPROVED SOURCES
→ STORY ARCHITECTURE
→ SPECIALIST REVIEWS
→ STEFANO GATE
→ NARRATIVE READINESS
→ CHAPTER WORKFLOW
```

Il semplice fatto che un testo esista non lo rende capitolo approvato.

`EXISTING TEXT ≠ APPROVED CHAPTER BOUNDARY`.

---

# 6. Persistent Project Memory

La project memory include:

- `PROJECT_AGENT_START.md`;
- `STATE.md`;
- `ROADMAP.md`;
- project decisions/source register;
- Story Architecture / Narrative Readiness;
- frozen manuscript;
- outputs/reviews;
- authority receipts;
- living ledgers;
- runtime workflows;
- Derived State;
- Projector Source;
- Knowledge Health/checkpoints;
- project documentation.

La chat non sostituisce questa memoria.

---

# 7. Living knowledge

Baseline corrente:

- `RELATIONSHIP_LEDGER.md`;
- `REVEAL_KNOWLEDGE_LEDGER.md`;
- `ENTITY_EVENT_FACTION_LEDGER.md`;
- `PAYOFF_DEBT_LEDGER.md`.

Questi ledger sono strumenti di lavoro vivi, non canoni indipendenti. Devono distinguere FACT / DECISION / HYPOTHESIS / OPEN.

Relazioni narrative utili includono `CONTINUES`, `MUST_REMEMBER`, `SEEDS`, `PAYOFF_OF`, `HOLDS_BACK`.

---

# 8. Runtime execution model

Execution master:

`projects/prima-di-noi/runtime/workflows/*.json`

Derived view:

`projects/prima-di-noi/runtime/DERIVED_STATE.json`

Human view:

`projects/prima-di-noi/STATE.md`

Mission Control structured source:

`projects/prima-di-noi/runtime/projection/PROJECTOR_SOURCE.json`

Precedence per execution:

```text
AUTHORITY / CANON
→ runtime/workflows/*.json
→ DERIVED_STATE.json
→ STATE.md execution view
→ PROJECTOR_SOURCE human/project facts
→ Supabase read models
→ Mission Control
```

Se STATE e runtime divergono, non si ricomincia il lavoro: runtime governa l'esecuzione e la vista viene riconciliata.

---

# 9. PRIMA DI NOI Chapter Workflow

```text
BRIEF / DEPENDENCY CHECK
        ↓
RESEARCH JIT
        ↓
WRITER / DRAFT
        ↓
PROFESSIONAL REVIEWS SEPARATE
        ↓
NARRATIVE MASS CONTROL
        ↓
EDITORIAL SYNTHESIS / REVISION BRIEF
        ↓
WRITER REVISION
        ↓
CANDIDATE ASSEMBLY
        ↓
EDITORIAL BOARD REPORT
        ↓
DELIVERY / MISSION CONTROL NEED
        ↓
BLOCKED_BOARD / WAITING AUTHORITY
        ↓
STEFANO DECISION
        ↓
POST-FREEZE RECONCILIATION
        ↓
KNOWLEDGE TRUST GATE
        ↓
COMPLETION GATE
        ↓
NEXT ELIGIBLE UNIT
```

Draft/review/revision/Candidate sono transizioni intermedie, non stop conditions autonome.

---

# 10. Contiguous execution

Il project heartbeat applica `PROT-009` e DEC-012.

Se dopo una transizione esiste una next transition autorizzata e non è emerso un vero gate/blocker, continua nello stesso ciclo.

True stop tipiche:

- `WAITING_AUTHORITY` / `BLOCKED_BOARD`;
- blocker reale;
- WCM CHANGE;
- Knowledge Trust Gate bloccante;
- runtime conflict;
- capability/technical failure realmente non aggirabile.

La fine ordinaria della sessione non è una stop condition.

---

# 11. Narrative Mass Control

Da SRC-020 ogni Board Report di capitolo deve includere metriche numeriche esplicite:

- word count della Candidate;
- cumulativo manoscritto approvato/candidato;
- media pertinente;
- proiezione finale;
- target 85.000–100.000 parole;
- scostamento;
- verdict `ON TARGET / UNDER TARGET / OVER TARGET`;
- interpretazione editoriale;
- conferma anti-padding.

La metrica controlla la massa complessiva e non impone quote rigide per capitolo.

---

# 12. Canon & Continuity Gate

Per un capitolo continuity-sensitive, il controllo usa almeno:

```text
CANDIDATE N
+
FROZEN MANUSCRIPT THROUGH N-1
+
REVEAL / KNOWLEDGE LEDGER
+
ENTITY / EVENT / FACTION LEDGER
+
RELATIONSHIP LEDGER
+
PAYOFF / CONTINUITY DEBT LEDGER
```

Check obbligatori:

- previous-event recall;
- character knowledge;
- entity/function introduction;
- reveal/holdback;
- payoff debt opened/closed;
- synapse consistency.

---

# 13. Reader / Technical / AI Guardrails

Guardrail project-specific includono:

- `MISTERO ≠ OPACITÀ PROLUNGATA`;
- technical accessibility in italiano quando naturale;
- AI deve risultare leggibile come fulcro narrativo senza anticipare reveal protetti;
- niente buzzword dump;
- dialoghi umani, non solo Q&A tecnico;
- tecnologia per funzione narrativa, non esposizione manualistica.

---

# 14. Automation & Flow Blocks — project map

Dettaglio canonico human-facing: `wcm/documentation/AUTOMATION_FLOW_BLOCK_CATALOG.md`.

| ID | Blocco | Tipo | Ruolo in PRIMA DI NOI |
|---|---|---|---|
| `FB-PDN-001` | PRIMA DI NOI Heartbeat | cognitive scheduled | wake-up e prosecuzione del workflow |
| `FB-PDN-002` | Chapter Workflow | cognitive + persistent + human-gated | produzione/review/gate capitolo |
| `FB-PDN-003` | Narrative Mass Control | hybrid | controllo dimensione/proiezione editoriale |
| `FB-PDN-004` | Canon & Continuity / Living Knowledge | cognitive check + memory | continuity/reveal/payoff integrity |
| `FB-PDN-005` | PRIMA DI NOI Knowledge Assurance | deterministic | health/repair/escalation della memoria |
| `FB-PDN-006` | Deterministic State + Projector | deterministic event-driven | runtime → Mission Control |
| `FB-PDN-007` | Board / Author Gate | human-gated | authority autoriale sul capitolo |
| `FB-PDN-008` | Post-Freeze Reconciliation | cognitive + deterministic + assurance | assorbe il freeze e chiude davvero il workflow |
| `FB-PDN-009` | Method Learning Evidence | evidence bridge | esperienza progetto → WCM Learning |

Blocchi WCM generali applicati: Command Executor, Method Learning Projector, Documentation Continuity e Documentation Release.

---

# 15. FB-PDN-001 — PRIMA DI NOI Heartbeat

**Cadenza:** hourly, Europe/Rome.  
**Tipo:** cognitive scheduled.

## Perché esiste

Riattivare Wise periodicamente senza hard-codificare il lavoro dinamico nel trigger.

## Legge

- WCM entry point;
- runtime workflows;
- Derived State;
- Project Agent Start;
- State human view;
- project KB index-first;
- authority receipts;
- Knowledge Health;
- project governance/roles.

## Fa

- Resume Priority;
- identifica next transition;
- esegue WCM RUN contigue;
- aggiorna checkpoint dopo delta materiali;
- aggiorna Projector Source se cambia ciò che Mission Control deve mostrare;
- applica consolidation/assurance;
- aggiorna heartbeat telemetry.

## Non fa

- non inventa nuovo canone;
- non supera Board Gate;
- non scrive direttamente Supabase;
- non usa il timeout/sessione come falso completion.

---

# 16. FB-PDN-002 — Chapter Workflow

**Perché esiste:** separare produzione, verifica, sintesi e authority.

Il Writer non valuta da solo il proprio testo; le review sono distinte prima della sintesi editoriale.

Il workflow checkpoint conserva:

- workflow instance;
- authority/scope;
- completed steps;
- last completed step;
- next transition;
- true stop;
- resume_required;
- completion gate state.

---

# 17. FB-PDN-003 — Narrative Mass Control

Combina metriche calcolabili e interpretazione editoriale. Serve a impedire due errori opposti:

- esecuzione troppo compressa rispetto al progetto di romanzo;
- allungamento artificiale per raggiungere una quota.

Il Board Report non è Board-ready se manca il set numerico richiesto.

---

# 18. FB-PDN-004 — Canon & Continuity / Living Knowledge

È il boundary tra nuova prosa e memoria narrativa precedente.

Il controllo non può essere sostituito dalla sola Story Architecture: per eventi realmente vissuti/scritti deve usare anche frozen manuscript e ledger correnti.

---

# 19. FB-PDN-005 — Knowledge Assurance

Applica il WCM Immune Loop al progetto.

Trigger automatici includono push su state/runtime/current-facing/knowledge e schedule generale del WCM Knowledge Assurance.

Output:

- Knowledge Health;
- eventuali repair allowlisted;
- Steward Activity;
- alert/escalation.

Effetto sul lavoro:

- `STALE/CRITICAL` rilevante può bloccare lavoro knowledge-sensitive;
- `DEGRADED` è valutato rispetto alla transizione concreta.

---

# 20. FB-PDN-006 — Deterministic State + Projector

```text
runtime/workflows
→ deterministic state
→ DERIVED_STATE
→ STATE execution block
→ PROJECTOR_SOURCE + health + heartbeat telemetry
→ deterministic projector
→ Supabase
→ Mission Control
```

Il progetto è field validation della single-writer projection deterministica. Il legacy cognitive projector non deve diventare writer concorrente.

---

# 21. FB-PDN-007 — Board / Author Gate

Il Chapter package arriva a Candidate + Board Report.

Stefano può approvare/freezare o richiedere modifiche tramite il command flow autorizzato.

`APPROVE_FREEZE` deve avere come target la Candidate congelabile; il Board Report è supporting material.

---

# 22. FB-PDN-008 — Post-Freeze Reconciliation

Il freeze non chiude immediatamente il ciclo.

Dopo authority valida:

```text
freeze effects
→ absorb/update living ledgers
→ indices/current-facing mirrors
→ runtime/state reconciliation
→ Knowledge Trust Gate
→ Completion Gate
→ workflow COMPLETED
```

Questo evita un capitolo narrativamente approvato ma organizzativamente non consolidato.

---

# 23. FB-PDN-009 — Method Learning Evidence

Failure mode e capability evidence del progetto possono entrare nella Method Experience Memory.

Separazione:

```text
PRIMA DI NOI EVENT
→ deterministic evidence collector
→ WCM Learning Inbox
→ WCM Learning Review
→ possible Candidate learning
→ possible WCM Change Gate
```

PRIMA DI NOI non cambia il metodo automaticamente.

---

# 24. Mission Control application

Mission Control può mostrare per PRIMA DI NOI:

- overview/stato/focus;
- Needs;
- Board;
- Documents;
- Activity;
- Roadmap;
- Execution Health;
- Knowledge Health;
- Steward Activity.

La UI non sostituisce runtime/canon. È una projection human-facing.

---

# 25. Failure and recovery

- session interruption → resume from checkpoint;
- runtime/state drift → runtime wins + deterministic reconciliation;
- invalid projector payload → fail closed, no partial write;
- semantic continuity conflict → no automatic repair, escalation;
- authority missing → Board/Need stop;
- duplicated command → idempotency;
- post-freeze inconsistency → workflow not completed until reconciliation.

---

# 26. Maturità

PRIMA DI NOI è **ACTIVE / FIELD VALIDATION** come progetto reale e come prima applicazione complessa della stack WCM corrente.

Il fatto che un pattern funzioni qui non lo rende automaticamente universale. Le componenti project-specific, in particolare Chapter Workflow, Editorial Governance e living ledger narrativi, non vanno importate in altri progetti senza nuova progettazione.

---

# 27. Riferimenti principali

- `projects/prima-di-noi/PROJECT_AGENT_START.md`
- `projects/prima-di-noi/STATE.md`
- `projects/prima-di-noi/organization/EDITORIAL_GOVERNANCE.md`
- `projects/prima-di-noi/organization/ROLE_BLUEPRINTS.md`
- `projects/prima-di-noi/kb/index.md`
- `projects/prima-di-noi/kb/SOURCE_REGISTER.md`
- `projects/prima-di-noi/kb/living/`
- `projects/prima-di-noi/runtime/workflows/`
- `projects/prima-di-noi/runtime/DERIVED_STATE.json`
- `projects/prima-di-noi/runtime/projection/PROJECTOR_SOURCE.json`
- `wcm/documentation/AUTOMATION_FLOW_BLOCK_CATALOG.md`
- DEC-012 / DEC-013 / DEC-014

---

# Principio finale

PRIMA DI NOI usa l'AI non come un singolo autore automatico, ma come **organizzazione editoriale governata**, con memoria, ruoli, check, gate, automazioni e authority separati e osservabili.
