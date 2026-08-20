/**
 * Presentation-only localization layer for WCM Learning (V0.8).
 *
 * Canonical values in GitHub / Supabase are NEVER modified. This module maps
 * known canonical English strings (keyed by stable IDs where available) to
 * Italian display strings. Unknown values are returned untouched.
 */

const LEARNING_TITLES: Record<string, string> = {
  'WCM-LRN-001': 'La persistenza non equivale all’integrità della conoscenza',
  'WCM-LRN-002': 'La sola rilevazione non costituisce un ciclo immunitario',
  'WCM-LRN-003': 'L’autonomia richiede osservabilità',
  'WCM-LRN-004': 'Le scritture persistenti remote richiedono protezioni sul payload',
};

const REVISIT_TRIGGERS: Record<string, string> = {
  'After assurance is exercised on two additional cross-domain WCM projects':
    'Dopo che l’assurance sarà stata esercitata su altri due progetti WCM appartenenti a domini differenti',
  'After three real mechanical auto-repairs across more than one project':
    'Dopo tre auto-riparazioni meccaniche reali distribuite su più di un progetto',
  'After a third distinct WCM autonomous/assurance/learning capability is exposed or broader portfolio adoption provides cross-domain evidence':
    'Quando verrà resa osservabile una terza capability WCM distinta di autonomia, assurance o learning, oppure quando una più ampia adozione nel portfolio produrrà evidenze cross-domain',
  'Second remote-write payload/scope incident, expanded autonomous write authority, or generic pre-write guard design':
    'Al secondo incidente di scrittura remota relativo a payload o perimetro, all’ampliamento dell’autorità di scrittura autonoma oppure alla progettazione di una protezione generica pre-scrittura',
};

const SCORE_METHODS: Record<string, string> = {
  'mean of structural Method Experience Memory components; severity overrides score':
    'media delle componenti strutturali della Method Experience Memory; la severità prevale sul punteggio',
};

const COMPONENT_KEYS: Record<string, string> = {
  record_integrity: 'Integrità dei learning record',
  index_coverage: 'Copertura dell’indice',
  relationship_validity: 'Validità delle relazioni',
  promotion_lineage: 'Tracciabilità delle promozioni',
  orphan_learning_control: 'Controllo dei learning orfani',
  review_freshness: 'Freschezza delle revisioni',
};

const EVIDENCE_SUMMARIES: Record<string, string> = {
  'learning: add one-shot baseline propagation helper':
    'Learning: aggiunto un helper one-shot per la propagazione della baseline',
  'fix: preserve Learning alert source paths':
    'Correzione: preservati i percorsi sorgente degli alert di Learning',
  'Accidental empty replacement of METHOD_KNOWLEDGE_HEALTH.json followed by exact Git restoration':
    'Sostituzione accidentale con contenuto vuoto di METHOD_KNOWLEDGE_HEALTH.json, seguita dal ripristino esatto tramite Git',
  'learning: add global Method Learning projector':
    'Learning: aggiunto il projector globale del Method Learning',
};

const REVIEW_NOTES: Record<string, string> = {
  'Implementation evidence already covered by the DEC-009 authorized bootstrap; no distinct methodological proposition emerged.':
    'Evidenza di implementazione già ricompresa nel bootstrap autorizzato da DEC-009; non è emersa una proposizione metodologica distinta.',
  'Fixed a local shell/Markdown rendering defect. Useful implementation evidence, but not sufficient to justify a new WCM methodological proposition; evidence retained without over-promotion.':
    'Corretto un difetto locale di rendering shell/Markdown. Evidenza utile di implementazione, ma non sufficiente a giustificare una nuova proposizione metodologica WCM; l’evidenza viene conservata senza sovra-promozione.',
  'The incident exposed a gap not explicitly covered by PROT-001: direct remote persistent writes may need payload and scope guards even without local working tree risk. A single case supports a CANDIDATE learning, not a protocol change.':
    'L’incidente ha evidenziato un gap non coperto esplicitamente da PROT-001: le scritture persistenti remote dirette possono richiedere protezioni su payload e perimetro anche in assenza di rischio sul working tree locale. Un singolo caso sostiene un learning CANDIDATE, non una modifica di protocollo.',
  'The global WCM Learning projector and Mission Control V0.8 in production represent a second direct application of WCM-LRN-003, "Autonomy needs Observability". They reinforce the existing learning, but alone do not justify a new learning nor a further method promotion.':
    'Il projector globale WCM Learning e Mission Control V0.8 in produzione rappresentano una seconda applicazione diretta di WCM-LRN-003, ‘L’autonomia richiede osservabilità’. Rafforzano il learning esistente, ma da soli non giustificano un nuovo learning né un’ulteriore promozione del metodo.',
};

/** Keyed by evidence event index-independent stable event summary → note fallback. */
const REVIEW_NOTES_BY_SUMMARY: Record<string, string> = {
  'learning: add one-shot baseline propagation helper':
    'Evidenza di implementazione già ricompresa nel bootstrap autorizzato da DEC-009; non è emersa una proposizione metodologica distinta.',
  'fix: preserve Learning alert source paths':
    'Corretto un difetto locale di rendering shell/Markdown. Evidenza utile di implementazione, ma non sufficiente a giustificare una nuova proposizione metodologica WCM; l’evidenza viene conservata senza sovra-promozione.',
  'Accidental empty replacement of METHOD_KNOWLEDGE_HEALTH.json followed by exact Git restoration':
    'L’incidente ha evidenziato un gap non coperto esplicitamente da PROT-001: le scritture persistenti remote dirette possono richiedere protezioni su payload e perimetro anche in assenza di rischio sul working tree locale. Un singolo caso sostiene un learning CANDIDATE, non una modifica di protocollo.',
  'learning: add global Method Learning projector':
    'Il projector globale WCM Learning e Mission Control V0.8 in produzione rappresentano una seconda applicazione diretta di WCM-LRN-003, ‘L’autonomia richiede osservabilità’. Rafforzano il learning esistente, ma da soli non giustificano un nuovo learning né un’ulteriore promozione del metodo.',
};

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

const pick = (
  map: Record<string, string>,
  key: string | null | undefined,
  fallback: string | null | undefined,
) => {
  if (key && map[key.trim()]) return map[key.trim()];
  return fallback ?? null;
};

export const localizeLearningTitle = (learningId: string, title: string) =>
  LEARNING_TITLES[learningId] ?? title;

export const localizeRevisitTrigger = (value: string | null | undefined) =>
  pick(REVISIT_TRIGGERS, value, value);

export const localizeScoreMethod = (value: string | null | undefined) =>
  pick(SCORE_METHODS, value, value);

export const localizeComponentKey = (key: string) => COMPONENT_KEYS[key] ?? key;

export const localizeEvidenceSummary = (value: string | null | undefined) =>
  pick(EVIDENCE_SUMMARIES, value, value);

export const localizeReviewNote = (
  note: string | null | undefined,
  summary?: string | null,
) => {
  const direct = note ? REVIEW_NOTES[note.trim()] : undefined;
  if (direct) return direct;
  if (note && summary && REVIEW_NOTES_BY_SUMMARY[summary.trim()]) {
    return REVIEW_NOTES_BY_SUMMARY[summary.trim()];
  }
  return note ?? null;
};

export const localizeRelationRationale = (
  relationId: string | null | undefined,
  rationale: string | null | undefined,
) => (relationId && RELATION_RATIONALES[relationId]) || rationale || null;
