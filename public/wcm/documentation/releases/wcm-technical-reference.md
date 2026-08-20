# WCM — Technical Reference

**Versione:** 0.2  
**Data:** 2026-08-20  
**Stato:** ACTIVE / LIVING PROJECTION / FIELD VALIDATION  
**Pubblico:** stakeholder tecnico, developer, architect, partner AI/automation  
**Authority:** human-facing projection governata da `DEC-010`; la source of truth resta la baseline WCM

---

## 1. Scopo e principio di authority

Questa Technical Reference fornisce una vista tecnica end-to-end del **Wise Centric Model (WCM)**: architettura, memoria, governance, processi, capability, assurance, learning, execution, Mission Control e Documentation System.

Non è una nuova fonte normativa. In caso di conflitto prevalgono le fonti WCM autorevoli secondo source precedence: Governance, Decisioni attive, Living Architecture, Process Book, Method KB, Capabilities, Project State ed evidence verificate.

```text
WCM SOURCE OF TRUTH
GitHub main / governance / decisions / architecture / process / KB
                         ↓
                HUMAN-FACING PROJECTIONS
        Technical Reference / Client Guide / User Manual
```

---

## 2. Modello architetturale

WCM è un modello operativo **Wise-centric**. Un cognitive core governa significato, priorità e orchestrazione; la capacità esecutiva viene allocata solo quando serve.

```text
                           STEFANO / BOARD
                     direction + reserved authority
                                  │
                                  ▼
                         WISE — COGNITIVE CORE
                       WHAT / WHY / orchestration
                          │                  │
                          ▼                  ▼
                  WORKING MEMORY      PERSISTENT ORGANIZATIONAL MEMORY
                  live context        GitHub main / state / KB / decisions
                          │                  ▲
                          └──── PROC-006 ────┘
                  consolidation + impact set
                                             │
        ┌─────────────────────┬──────────────┼──────────────┬────────────────────┐
        ▼                     ▼              ▼              ▼                    ▼
 KNOWLEDGE NAVIGATION   KNOWLEDGE ASSURANCE  METHOD         DOCUMENTATION      CONTROL
 index-first + synapse  deterministic-first EXPERIENCE     PROJECTIONS         PLANE
        │                     │              MEMORY              │                │
        │                     │              │ PROC-009          │ PROC-010       │
        └──────────────┬──────┴──────────────┴──────────────┬───┘                │
                       ▼                                     ▼                    ▼
             MISSION CONTROL PROJECTORS              HUMAN-FACING MASTERS   DURABLE DISPATCH
                       │                                     │                    │
                       ▼                                     ▼                    ▼
                   SUPABASE                            DOCX / PDF RELEASES   EXECUTION PLANE
                       │                                                          │
                       ▼                                                          ▼
             AUTHENTICATED MISSION CONTROL                                      RESULT
```

Principio organizzativo:

> minimizzare le entità cognitive permanenti e massimizzare capacità dinamicamente allocabile.

Wise governa `WHAT / WHY / meaning / orchestration`; service e strumenti governano il `HOW` entro mandato e capability disponibili.

---

## 3. Dual-Memory Cognitive Continuity

WCM usa due memorie complementari.

### Working Memory

Contiene contesto vivo, conversazione, ragionamento situazionale, intenti recenti, ipotesi e delta non ancora consolidati.

### Persistent Organizational Memory

GitHub `main` conserva in forma versionata:

- governance e capability;
- architettura;
- processi e protocolli;
- stato progetto e roadmap;
- decisioni e authority receipts;
- KB, living ledgers e typed relations;
- output ed evidence;
- telemetry e health;
- Method Experience Memory;
- master Markdown del Documentation System.

La Method Experience Memory e i manuali sono regioni/proiezioni della memoria persistente, non memorie indipendenti con authority superiore.

---

## 4. Agent-ready knowledge architecture

WCM non tratta il repository come un prompt gigante.

```text
WCM_AGENT_START
   ↓
PROJECT_AGENT_START / STATE / METHOD KB INDEX
   ↓
KNOWLEDGE TRUST GATE
   ↓
typed relations + fonti minime necessarie
   ↓
STOP WHEN CONTEXT IS SUFFICIENT
```

`PROT-005` governa il retrieval index-first. Se entry point, state o relazioni mostrano drift, il sistema non continua su una base non affidabile: passa a Knowledge Assurance.

Typed relations principali:

`DEPENDS_ON`, `DERIVED_FROM`, `IMPLEMENTS`, `CONSTRAINS`, `AFFECTS`, `SUPERSEDES`, `SUPERSEDED_BY`, `EVIDENCE_FOR`, `CONTRADICTS`, `RELATED_TO`.

I domini possono aggiungere relazioni specifiche. La baseline resta Markdown/Git-first; un graph database dedicato non è baseline.

---

## 5. Governance: WCM RUN e WCM CHANGE

### WCM RUN

Esegue una transizione già prevista da authority, roadmap, processo o workflow senza modificare regole, significato o perimetro autorizzato.

Esempi: draft/review/report previsti, aggiornamento fedele dello state, release documentale derivata da un master corrente, candidate learning gestito entro DEC-009.

`PROT-009` richiede di proseguire attraverso transizioni contigue autorizzate fino alla prima vera stop condition.

### WCM CHANGE

Modifica almeno una baseline materiale: governance, goal/scope, authority, workflow rule, architettura, canone/frozen decision, significato di stato o altra decisione con impatto downstream.

```text
WCM CHANGE
→ bootstrap / evidence
→ Impact Preview
→ STOP
→ explicit Stefano authority
→ controlled propagation
```

Una disponibilità tecnica non conferisce authority.

---

## 6. Capability model ed execution

Le capability sono classificate come `DIRETTA`, `DELEGABILE`, `NON DISPONIBILE`, `DA VALIDARE`.

```text
AZIONE
  ↓
AUTORIZZATA?
  ↓ sì
CAPABILITY EVIDENCE CHECK se necessaria
  ↓
WISE PUÒ FARLA DIRETTAMENTE?
  ├─ SÌ → DIRECT EXECUTION
  └─ NO → MINIMUM REQUIRED SERVICE
```

`PROT-003 Direct Before Delegate` impedisce deleghe inutili. `PROT-011` richiede evidenza corrente prima di dichiarare un capability gap.

Quando serve execution esterna, il Service Job è il contratto operativo e il WCM Service Lead/Codex esegue il `HOW` entro scope e authority definiti.

---

## 7. Operational Loop

```text
WAKE / USER INPUT / EVENT
        ↓
BOOTSTRAP MINIMO
        ↓
STATE + AUTHORITY
        ↓
NEXT USEFUL ACTION
        ↓
DIRECT OR DELEGATED EXECUTION
        ↓
RESULT / EVIDENCE
        ↓
MEMORY CONSOLIDATION
        ↺
```

Il control plane deve evitare polling LLM inutile quando non esiste lavoro eleggibile. Heartbeat e sentinel sono strumenti distinti dalla cognizione stessa.

---

## 8. Knowledge Integrity / Immune Loop

Autorità: `DEC-007`, `DEC-008`, `PROC-008`, `PROT-013`.

Una memoria persistente può essere ricca ma incoerente: indici stale, mirror non propagati, relazioni rotte, ledger non aggiornati o drift tra authority e rappresentazione.

Principio:

> Wise governa il significato. Knowledge Steward governa la memoria.

```text
MATERIAL DELTA
   ↓
PROC-006 CONSOLIDATION + IMPACT SET
   ↓
DETERMINISTIC KNOWLEDGE CHECK
   ├─ GREEN → telemetry / checkpoint
   └─ ANOMALY
        ↓
      CLASSIFY
        ├─ allowlisted + deterministic → repair → re-check
        └─ semantic / ambiguous → NO WRITE → Wise / gate
```

V1 abilita solo repair class esplicite. Non esiste auto-riparazione semantica generica.

Health invariant:

```text
last_knowledge_check_at < last_material_delta_at
→ HEALTHY non valido
→ STALE / CHECK REQUIRED
```

---

## 9. Learning Loop / Method Experience Memory

Autorità: `DEC-009`, `PROC-009`, `PROT-014`.

```text
EXPERIENCE
   ↓
DETERMINISTIC EVIDENCE COLLECTOR
   ↓
LEARNING INBOX
   ↓ daily / on-demand
WISE LEARNING REVIEW — index-first
   ↓
CANDIDATE / OBSERVING / VALIDATED / REJECTED
   ↓
PROC-004 PROMOTION ANALYSIS
   ↓
WCM CHANGE GATE se materiale
   ↓
PROMOTED BASELINE
```

Strutture: `LEARNING_INBOX.json`, `LEARNING_LEDGER.json`, Learning Records, `METHOD_RELATIONSHIP_LEDGER.json`, `METHOD_KNOWLEDGE_HEALTH.json`.

`VALIDATED ≠ PROMOTED`: il learning non è authority automatica per cambiare il metodo.

---

## 10. Mission Control

Mission Control è la Human Governance & Observability Interface del WCM.

### Projection path

```text
GITHUB MAIN
  ├─ project sources → Projector
  └─ method learning → Method Learning Projector
              ↓
        SUPABASE READ MODELS
              ↓
    AUTHENTICATED MISSION CONTROL
```

Supabase è read-model store, non source of truth.

### Baseline composita corrente

- V0.6: Knowledge Health + authenticated governance;
- V0.7: Knowledge Steward Activity;
- V0.8: global WCM Learning;
- V0.9: global WCM Documentation Center.

Mission Control espone portfolio, Needs Stefano, documenti, Board, Activity, Roadmap, Knowledge Health, Steward Activity, Learning e Documentazione WCM.

Il command vocabulary resta vincolato ai command già autorizzati dalla governance; V0.9 non amplia authority.

---

## 11. Documentation System e Documentation Center V0.9

Autorità: `DEC-010` + `DEC-011`, processo `PROC-010`, standard `PROT-015`.

I tre master human-facing sono:

1. **Technical Reference** — come è costruito WCM;
2. **Executive / Client Guide** — cos'è, perché serve e quale valore offre;
3. **User Manual** — come si usa.

Ogni delta pertinente esegue un Documentation Impact Check:

```text
Technical Reference affected?   YES / NO
Executive Client Guide affected? YES / NO
User Manual affected?           YES / NO
```

V0.9 introduce la superficie globale `/wcm/documentation` e la pipeline di release:

```text
MARKDOWN MASTER — GitHub main
        ↓
DOCUMENTATION RELEASE RUN
        ↓
SNAPSHOT + DOCX + PDF
        ↓
QA + RELEASE MANIFEST
        ↓
MISSION CONTROL DOCUMENTATION CENTER
```

Il manifest conserva versione, source path, source SHA, timestamp release, path degli artefatti e stato QA.

Guardrail:

- consultazione e download sono read-only;
- `download ≠ approval ≠ authority`;
- una release senza source SHA non è dichiarabile corrente;
- un formato mancante non produce un pulsante fittizio;
- il browser non genera DOCX/PDF al click;
- master e release devono essere riconducibili alla stessa provenance.

---

## 12. Project bootstrap

L'ingresso di un progetto è governato da `PROC-007 Project Bootstrap & Admission`.

```text
PROJECT INTENT
→ CLASSIFICATION
→ ADMISSION PREVIEW
→ BOARD ADMISSION GATE
→ OWNER SOURCE INTAKE
→ WORKSPACE + KNOWLEDGE FOUNDATION
→ PROJECT MEMORY BASELINE
→ GOAL + STATE + ROADMAP + GOVERNANCE
→ PROJECT_AGENT_START
→ KNOWLEDGE ASSURANCE CONTRACT se necessario
→ READINESS REVIEW
→ BOARD ACTIVATION GATE
→ WCM RUN
```

Il metodo è domain-agnostic: workflow e living ledger specifici non vengono importati automaticamente da un progetto a un altro.

---

## 13. Stato di maturità e limiti

WCM è in **FIELD VALIDATION**. Diverse capability sono operative, ma il metodo non viene descritto come infallibile o scale-ready per qualsiasi contesto.

Restano fuori dalla baseline, finché l'evidenza non ne dimostra la necessità:

- graph database dedicato;
- semantic auto-repair autonomo;
- LLM polling continuo per assurance;
- Quality & Governance Auditor permanente;
- gerarchie agentiche profonde di default;
- schema universale di ledger per tutti i domini;
- command vocabulary Mission Control esteso senza Change Gate.

Il progetto **PRIMA DI NOI** è la principale field validation corrente per memory integrity, continuity, assurance, learning e governance.

---

## 14. Riferimenti principali

- `WCM_AGENT_START.md`
- `wcm/GOVERNANCE.md`
- `wcm/WISE_MANDATE.md`
- `wcm/CAPABILITIES.md`
- `wcm/architecture/WCM_LIVING_ARCHITECTURE.md`
- `wcm/architecture/ARCHITECTURE_INDEX.md`
- `wcm/architecture/MISSION_CONTROL.md`
- `wcm/architecture/MISSION_CONTROL_WCM_LEARNING_V0_8.md`
- `wcm/architecture/MISSION_CONTROL_DOCUMENTATION_CENTER_V0_9.md`
- `wcm/process-book/PROCESS_REGISTER.md`
- `wcm/kb/index.md`
- `wcm/documentation/DOCUMENTATION_INDEX.md`
- `DEC-007`, `DEC-008`, `DEC-009`, `DEC-010`, `DEC-011`

---

## Principio finale

> WCM combina cognizione context-aware, memoria organizzativa persistente, esecuzione governata, assurance deterministica, apprendimento dall'esperienza e osservabilità umana. La qualità del sistema dipende non solo da ciò che sa fare, ma dalla capacità di mantenere coerenti stato, authority, memoria e documentazione mentre evolve.
