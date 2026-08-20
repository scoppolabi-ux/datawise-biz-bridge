import { describe, expect, it } from 'vitest';
import {
  localizeEvidenceSummary,
  localizeLearningTitle,
  localizeRelationRationale,
  localizeReviewNote,
  localizeRevisitTrigger,
  localizeScoreMethod,
} from './wcmLearningI18n';

/** Canonical (English) values currently projected in the read model. */
const EVIDENCE = [
  {
    event_id: 'evt-ca5ccb58a9f3d0f9',
    summary: 'learning: add one-shot baseline propagation helper',
    review_note:
      'Implementation evidence already entailed by authorized DEC-009 bootstrap; no distinct methodological proposition emerged.',
  },
  {
    event_id: 'evt-f1fffca5d6564ced',
    summary: 'fix: preserve Learning alert source paths',
    review_note:
      'Local shell/Markdown rendering defect fixed. Useful implementation evidence, but no distinct WCM methodological proposition is justified yet; retain evidence and avoid overpromotion.',
  },
  {
    event_id: 'evt-remote-write-empty-health-20260820',
    summary:
      'Accidental empty replacement of METHOD_KNOWLEDGE_HEALTH.json followed by exact Git restoration',
    review_note:
      'This incident exposed a gap not explicitly covered by PROT-001: direct remote persistent writes can need payload/scope guards even without a local working-tree risk. One occurrence supports a CANDIDATE learning, not a protocol change.',
  },
  {
    event_id: 'evt-dba15634cbc20e81',
    summary: 'learning: add global Method Learning projector',
    review_note:
      'The global WCM Learning projector and production Mission Control V0.8 are a second direct application of WCM-LRN-003 Autonomy needs Observability. This strengthens the existing learning but does not justify a new learning or an additional method promotion by itself.',
  },
];

const RECORDS = [
  {
    learning_id: 'WCM-LRN-001',
    title: 'Persistence is not Knowledge Integrity',
    revisit_trigger: 'After assurance is exercised on two additional cross-domain WCM projects',
  },
  {
    learning_id: 'WCM-LRN-002',
    title: 'Detection alone is not an Immune Loop',
    revisit_trigger: 'After three real mechanical auto-repairs across more than one project',
  },
  {
    learning_id: 'WCM-LRN-003',
    title: 'Autonomy needs Observability',
    revisit_trigger:
      'After a third distinct WCM autonomous/assurance/learning capability is exposed or broader portfolio adoption provides cross-domain evidence',
  },
  {
    learning_id: 'WCM-LRN-004',
    title: 'Remote persistent writes need payload guards',
    revisit_trigger:
      'Second remote-write payload/scope incident, expanded autonomous write authority, or generic pre-write guard design',
  },
];

const RELATIONS = [
  'WCM-MREL-001',
  'WCM-MREL-002',
  'WCM-MREL-003',
  'WCM-MREL-004',
  'WCM-MREL-005',
  'WCM-MREL-006',
  'WCM-MREL-007',
  'WCM-MREL-008',
  'WCM-MREL-009',
  'WCM-MREL-010',
];

/** Heuristic: flags residual English prose (technical labels/IDs excluded). */
const looksEnglish = (value: string) =>
  /\b(the|and|not|with|from|needs|learning is|evidence already|incident exposed|strengthens|justify|repair|guards|but|only|after|second direct)\b/i.test(
    value,
  ) && !/[àèéìòùâ’]/.test(value);

describe('WCM Learning localization (presentation-only)', () => {
  it('localizes evidence evt-dba15634cbc20e81 summary and review note', () => {
    const e = EVIDENCE[3];
    const summary = localizeEvidenceSummary(e.summary, e.event_id)!;
    const note = localizeReviewNote(e.review_note, e.summary, e.event_id)!;
    expect(summary).toBe('Learning: aggiunto il projector globale del Method Learning');
    expect(note).toContain('L’autonomia richiede osservabilità');
    expect(note).not.toContain('This strengthens');
    expect(looksEnglish(summary)).toBe(false);
    expect(looksEnglish(note)).toBe(false);
  });

  it('localizes evidence even when review_note prose drifts (id-first)', () => {
    const note = localizeReviewNote(
      'Completely different English wording that never appeared before.',
      null,
      'evt-dba15634cbc20e81',
    )!;
    expect(note).toContain('projector globale');
  });

  it('falls back to normalized summary when event_id is unknown', () => {
    const note = localizeReviewNote(
      EVIDENCE[0].review_note,
      '  Learning: Add One-Shot Baseline Propagation Helper.  ',
      'evt-unknown',
    )!;
    expect(note).toContain('bootstrap autorizzato da DEC-009');
  });

  it('leaves unknown evidence untouched instead of inventing translations', () => {
    expect(localizeEvidenceSummary('brand new event', 'evt-zzz')).toBe('brand new event');
    expect(localizeReviewNote('brand new note', 'brand new event', 'evt-zzz')).toBe(
      'brand new note',
    );
  });

  it('renders every projected evidence event in Italian', () => {
    for (const e of EVIDENCE) {
      const summary = localizeEvidenceSummary(e.summary, e.event_id)!;
      const note = localizeReviewNote(e.review_note, e.summary, e.event_id)!;
      expect(looksEnglish(summary), `summary ${e.event_id}`).toBe(false);
      expect(looksEnglish(note), `note ${e.event_id}`).toBe(false);
    }
  });

  it('renders every projected learning record in Italian', () => {
    for (const r of RECORDS) {
      const title = localizeLearningTitle(r.learning_id, r.title);
      const trigger = localizeRevisitTrigger(r.revisit_trigger, r.learning_id)!;
      expect(looksEnglish(title), `title ${r.learning_id}`).toBe(false);
      expect(looksEnglish(trigger), `trigger ${r.learning_id}`).toBe(false);
    }
  });

  it('renders every projected relation rationale in Italian', () => {
    for (const id of RELATIONS) {
      const rationale = localizeRelationRationale(id, 'English rationale placeholder')!;
      expect(looksEnglish(rationale), `rationale ${id}`).toBe(false);
    }
  });

  it('localizes the score method prose', () => {
    const value = localizeScoreMethod(
      'mean of structural Method Experience Memory components; severity overrides score',
    )!;
    expect(value).toContain('media delle componenti strutturali');
  });
});
