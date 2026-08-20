/**
 * Presentation-only localization layer for WCM Learning (V0.8).
 *
 * Canonical values in GitHub / Supabase are NEVER modified. Localization is
 * keyed FIRST on stable identifiers (learning_id, event_id, relation_id) and
 * only falls back to normalized text matching. Unknown values pass through
 * untouched (no invented translations).
 */

/** Lowercase, collapse whitespace, strip trailing punctuation — for fallback keys only. */
const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[\s\u00a0]+/g, ' ')
    .replace(/[’']/g, "'")
    .trim()
    .replace(/[.;:]+$/, '');

const byNormalized = (map: Record<string, string>) => {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(map)) out[normalizeText(k)] = v;
  return out;
};

/* ---------------------------------------------------------------- learning */

const LEARNING_TITLES: Record<string, string> = {
  'WCM-LRN-001': 'La persistenza non equivale all’integrità della conoscenza',
  'WCM-LRN-002': 'La sola rilevazione non costituisce un ciclo immunitario',
  'WCM-LRN-003': 'L’autonomia richiede osservabilità',
  'WCM-LRN-004': 'Le scritture persistenti remote richiedono protezioni sul payload',
};

const REVISIT_TRIGGERS_BY_ID: Record<string, string> = {
  'WCM-LRN-001':
    'Dopo che l’assurance sarà stata esercitata su altri due progetti WCM appartenenti a domini differenti',
  'WCM-LRN-002':
    'Dopo tre auto-riparazioni meccaniche reali distribuite su più di un progetto',
  'WCM-LRN-003':
    'Quando verrà resa osservabile una terza capability WCM distinta di autonomia, assurance o learning, oppure quando una più ampia adozione nel portfolio produrrà evidenze cross-domain',
  'WCM-LRN-004':
    'Al secondo incidente di scrittura remota relativo a payload o perimetro, all’ampliamento dell’autorità di scrittura autonoma oppure alla progettazione di una protezione generica pre-scrittura',
};

const REVISIT_TRIGGERS_BY_TEXT = byNormalized({
  'After assurance is exercised on two additional cross-domain WCM projects':
    REVISIT_TRIGGERS_BY_ID['WCM-LRN-001'],
  'After three real mechanical auto-repairs across more than one project':
    REVISIT_TRIGGERS_BY_ID['WCM-LRN-002'],
  'After a third distinct WCM autonomous/assurance/learning capability is exposed or broader portfolio adoption provides cross-domain evidence':
    REVISIT_TRIGGERS_BY_ID['WCM-LRN-003'],
  'Second remote-write payload/scope incident, expanded autonomous write authority, or generic pre-write guard design':
    REVISIT_TRIGGERS_BY_ID['WCM-LRN-004'],
});

/* ------------------------------------------------------------------ health */

const SCORE_METHODS = byNormalized({
  'mean of structural Method Experience Memory components; severity overrides score':
    'media delle componenti strutturali della Method Experience Memory; la severità prevale sul punteggio',
});

const COMPONENT_KEYS: Record<string, string> = {
  record_integrity: 'Integrità dei learning record',
  index_coverage: 'Copertura dell’indice',
  relationship_validity: 'Validità delle relazioni',
  promotion_lineage: 'Tracciabilità delle promozioni',
  orphan_learning_control: 'Controllo dei learning orfani',
  review_freshness: 'Freschezza delle revisioni',
};

/* ---------------------------------------------------------------- evidence */

type EvidenceCopy = { summary: string; note: string };

/** Keyed on stable canonical event_id (primary key of localization). */
const EVIDENCE_BY_ID: Record<string, EvidenceCopy> = {
  'evt-ca5ccb58a9f3d0f9': {
    summary: 'Learning: aggiunto un helper one-shot per la propagazione della baseline',
    note: 'Evidenza di implementazione già ricompresa nel bootstrap autorizzato da DEC-009; non è emersa una proposizione metodologica distinta.',
  },
  'evt-f1fffca5d6564ced': {
    summary: 'Correzione: preservati i percorsi sorgente degli alert di Learning',
    note: 'Corretto un difetto locale di rendering shell/Markdown. Evidenza utile di implementazione, ma non è ancora giustificata una proposizione metodologica WCM distinta; l’evidenza viene conservata evitando sovra-promozioni.',
  },
  'evt-remote-write-empty-health-20260820': {
    summary:
      'Sostituzione accidentale con contenuto vuoto di METHOD_KNOWLEDGE_HEALTH.json, seguita dal ripristino esatto tramite Git',
    note: 'L’incidente ha evidenziato un gap non coperto esplicitamente da PROT-001: le scritture persistenti remote dirette possono richiedere protezioni su payload e perimetro anche in assenza di rischio sul working tree locale. Un singolo caso sostiene un learning CANDIDATE, non una modifica di protocollo.',
  },
  'evt-dba15634cbc20e81': {
    summary: 'Learning: aggiunto il projector globale del Method Learning',
    note: 'Il projector globale WCM Learning e Mission Control V0.8 in produzione rappresentano una seconda applicazione diretta di WCM-LRN-003, «L’autonomia richiede osservabilità». Questo rafforza il learning esistente, ma da solo non giustifica un nuovo learning né un’ulteriore promozione del metodo.',
  },
};

/** Fallback: normalized canonical summary → localized summary/note. */
const EVIDENCE_BY_SUMMARY: Record<string, EvidenceCopy> = (() => {
  const out: Record<string, EvidenceCopy> = {};
  const canonicalSummaries: Record<string, string> = {
    'evt-ca5ccb58a9f3d0f9': 'learning: add one-shot baseline propagation helper',
    'evt-f1fffca5d6564ced': 'fix: preserve Learning alert source paths',
    'evt-remote-write-empty-health-20260820':
      'Accidental empty replacement of METHOD_KNOWLEDGE_HEALTH.json followed by exact Git restoration',
    'evt-dba15634cbc20e81': 'learning: add global Method Learning projector',
  };
  for (const [id, summary] of Object.entries(canonicalSummaries)) {
    out[normalizeText(summary)] = EVIDENCE_BY_ID[id];
  }
  return out;
})();

const evidenceCopy = (
  eventId: string | null | undefined,
  summary: string | null | undefined,
): EvidenceCopy | null => {
  if (eventId && EVIDENCE_BY_ID[eventId.trim()]) return EVIDENCE_BY_ID[eventId.trim()];
  if (summary && EVIDENCE_BY_SUMMARY[normalizeText(summary)]) {
    return EVIDENCE_BY_SUMMARY[normalizeText(summary)];
  }
  return null;
};

/* --------------------------------------------------------------- relations */

const RELATION_RATIONALES: Record<string, string> = {
  'WCM-MREL-001':
    'L’audit del Capitolo 6 ha mostrato che una persistenza ricca non garantisce, da sola, la coerenza globale della memoria.',
  'WCM-MREL-002':
    'Il learning spiega la motivazione empirica alla base della baseline di Knowledge Integrity.',
  'WCM-MREL-003':
    'Un’assurance limitata alla sola rilevazione ha evidenziato la necessità di un’auto-riparazione deterministica e circoscritta.',
  'WCM-MREL-004':
    'Il learning richiede riparazioni deterministiche allowlisted e un semantic firewall.',
  'WCM-MREL-005':
    'L’owner aveva bisogno di osservare cosa facessero realmente i cicli autonomi del Knowledge Steward, non soltanto il risultato finale di salute.',
  'WCM-MREL-006':
    'DEC-009 attiva il concetto di apprendimento organizzativo continuo come capability WCM governata.',
  'WCM-MREL-007':
    'I learning validati usano PROC-004 per la promozione selettiva verso la baseline.',
  'WCM-MREL-008':
    'La review dei learning deve restare index-first e limitata al contesto necessario.',
  'WCM-MREL-009':
    'Il candidato potrebbe estendere il confine di sicurezza dalle operazioni Git/worktree locali alle interfacce di scrittura persistente remota diretta, ma un solo incidente non è sufficiente per modificare il protocollo.',
  'WCM-MREL-010':
    'Una seconda capability WCM autonoma/cognitiva viene resa direttamente osservabile senza ampliare l’autorità semantica o di promozione.',
};

/* ------------------------------------------------------------------ public */

export const localizeLearningTitle = (learningId: string, title: string) =>
  LEARNING_TITLES[learningId?.trim()] ?? title;

export const localizeRevisitTrigger = (
  value: string | null | undefined,
  learningId?: string | null,
) => {
  if (learningId && REVISIT_TRIGGERS_BY_ID[learningId.trim()]) {
    return REVISIT_TRIGGERS_BY_ID[learningId.trim()];
  }
  if (value && REVISIT_TRIGGERS_BY_TEXT[normalizeText(value)]) {
    return REVISIT_TRIGGERS_BY_TEXT[normalizeText(value)];
  }
  return value ?? null;
};

export const localizeScoreMethod = (value: string | null | undefined) =>
  (value && SCORE_METHODS[normalizeText(value)]) || value || null;

export const localizeComponentKey = (key: string) => COMPONENT_KEYS[key] ?? key;

export const localizeEvidenceSummary = (
  value: string | null | undefined,
  eventId?: string | null,
) => evidenceCopy(eventId, value)?.summary ?? value ?? null;

export const localizeReviewNote = (
  note: string | null | undefined,
  summary?: string | null,
  eventId?: string | null,
) => {
  const copy = evidenceCopy(eventId, summary);
  if (copy && note) return copy.note;
  return note ?? null;
};

export const localizeRelationRationale = (
  relationId: string | null | undefined,
  rationale: string | null | undefined,
) => (relationId && RELATION_RATIONALES[relationId.trim()]) || rationale || null;
