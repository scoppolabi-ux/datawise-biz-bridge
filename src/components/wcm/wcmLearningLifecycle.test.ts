import { describe, expect, it } from 'vitest';
import {
  evidenceStatusLabel,
  gateStatusLabel,
  isOpenGate,
  learningStatusLabel,
} from './wcmLearningLifecycle';

describe('evidence lifecycle labels (review pipeline, distinct from learning)', () => {
  it('maps every canonical evidence status semantically', () => {
    expect(evidenceStatusLabel('PENDING')).toBe('DA REVISIONARE');
    expect(evidenceStatusLabel('PENDING_REVIEW')).toBe('DA REVISIONARE');
    expect(evidenceStatusLabel('LINKED')).toBe('COLLEGATA');
    expect(evidenceStatusLabel('DUPLICATE')).toBe('DUPLICATA');
    expect(evidenceStatusLabel('NO_LEARNING')).toBe('NESSUN LEARNING');
    expect(evidenceStatusLabel('NEEDS_MORE_EVIDENCE')).toBe('SERVE PIÙ EVIDENZA');
  });

  it('is case/whitespace tolerant on the canonical value', () => {
    expect(evidenceStatusLabel(' duplicate ')).toBe('DUPLICATA');
  });

  it('passes unknown statuses through unchanged (fail closed, no invention)', () => {
    expect(evidenceStatusLabel('REVIEWED')).toBe('REVIEWED');
    expect(evidenceStatusLabel('SOME_FUTURE_STATUS')).toBe('SOME_FUTURE_STATUS');
  });

  it('labels a missing status as unknown', () => {
    expect(evidenceStatusLabel(null)).toBe('SCONOSCIUTO');
    expect(evidenceStatusLabel('')).toBe('SCONOSCIUTO');
  });
});

describe('learning lifecycle labels', () => {
  it('maps canonical learning statuses', () => {
    expect(learningStatusLabel('PROMOTED')).toBe('PROMOSSO');
    expect(learningStatusLabel('VALIDATED')).toBe('VALIDATO');
    expect(learningStatusLabel('CANDIDATE')).toBe('CANDIDATO');
    expect(learningStatusLabel('OBSERVING')).toBe('IN OSSERVAZIONE');
    expect(learningStatusLabel('REJECTED')).toBe('RESPINTO');
    expect(learningStatusLabel('SUPERSEDED')).toBe('SOSTITUITO');
  });

  it('supports the explicit WAITING_AUTHORITY state', () => {
    expect(learningStatusLabel('WAITING_AUTHORITY')).toBe('IN ATTESA DI AUTORITÀ');
  });

  it('does NOT turn VALIDATED into an authority state', () => {
    expect(learningStatusLabel('VALIDATED')).not.toBe('IN ATTESA DI AUTORITÀ');
  });

  it('passes unknown statuses through unchanged', () => {
    expect(learningStatusLabel('NEW_STATUS')).toBe('NEW_STATUS');
    expect(learningStatusLabel(null)).toBe('SCONOSCIUTO');
  });
});

describe('method change gate lifecycle labels', () => {
  it('maps exact gate statuses', () => {
    expect(gateStatusLabel('OPEN')).toBe('APERTO');
    expect(gateStatusLabel('APPROVED')).toBe('APPROVATO');
    expect(gateStatusLabel('REJECTED')).toBe('RESPINTO');
    expect(gateStatusLabel('EXECUTED')).toBe('ESEGUITO');
    expect(gateStatusLabel('CLOSED')).toBe('CHIUSO');
  });

  it('passes unknown statuses through unchanged', () => {
    expect(gateStatusLabel('WHATEVER')).toBe('WHATEVER');
    expect(gateStatusLabel(null)).toBe('SCONOSCIUTO');
  });
});

describe('isOpenGate', () => {
  it('is true only for an explicit OPEN gate', () => {
    expect(isOpenGate({ status: 'OPEN' })).toBe(true);
    expect(isOpenGate({ status: 'open' })).toBe(true);
  });

  it('is false for terminal or missing statuses', () => {
    expect(isOpenGate({ status: 'APPROVED' })).toBe(false);
    expect(isOpenGate({ status: 'EXECUTED' })).toBe(false);
    expect(isOpenGate({ status: 'CLOSED' })).toBe(false);
    expect(isOpenGate({ status: null })).toBe(false);
  });
});
