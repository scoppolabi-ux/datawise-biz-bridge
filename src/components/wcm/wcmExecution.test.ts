import { describe, expect, it } from 'vitest';
import {
  asStringList,
  executionSignalOf,
  isOpenExecutionWorkflow,
  normalizeExecutionStatus,
  portfolioExecutionSignal,
} from './wcmExecution';

const wf = (status: string, resume_required = false, workflow = 'WF') => ({
  status,
  resume_required,
  workflow,
});

describe('DEC-012 · mapping stato → segnale', () => {
  it('normalizza varianti di case/hyphen', () => {
    expect(normalizeExecutionStatus('interrupted-resumable')).toBe('INTERRUPTED_RESUMABLE');
    expect(normalizeExecutionStatus(' waiting authority ')).toBe('WAITING_AUTHORITY');
    expect(normalizeExecutionStatus('boh')).toBe('UNKNOWN');
    expect(normalizeExecutionStatus(null)).toBe('UNKNOWN');
  });

  it('INTERRUPTED_RESUMABLE produce RIPRESA NECESSARIA', () => {
    const signal = executionSignalOf(wf('INTERRUPTED_RESUMABLE'));
    expect(signal.key).toBe('RESUME_REQUIRED');
    expect(signal.label).toBe('RIPRESA NECESSARIA');
    expect(signal.explanation).toContain('prossimo trigger operativo');
  });

  it('resume_required=true su ACTIVE produce RIPRESA NECESSARIA', () => {
    expect(executionSignalOf(wf('ACTIVE', true)).key).toBe('RESUME_REQUIRED');
  });

  it('WAITING_AUTHORITY è una stop condition, non un errore', () => {
    const signal = executionSignalOf(wf('WAITING_AUTHORITY'));
    expect(signal.label).toBe('IN ATTESA DI AUTORITÀ');
    expect(signal.explanation).toContain('Non è un errore');
  });

  it('COMPLETED e CANCELLED sono storico chiuso', () => {
    expect(executionSignalOf(wf('COMPLETED')).key).toBe('COMPLETED');
    expect(isOpenExecutionWorkflow(wf('COMPLETED'))).toBe(false);
    expect(isOpenExecutionWorkflow(wf('CANCELLED'))).toBe(false);
    expect(isOpenExecutionWorkflow(wf('ACTIVE'))).toBe(true);
  });

  it('un workflow COMPLETED con resume_required resta storico chiuso', () => {
    expect(executionSignalOf(wf('COMPLETED', true)).key).toBe('COMPLETED');
  });
});

describe('DEC-012 · priorità di portfolio', () => {
  it('RIPRESA NECESSARIA > BLOCKED > IN ATTESA DI AUTORITÀ > ACTIVE', () => {
    const p = (s: string, r = false) => executionSignalOf(wf(s, r)).priority;
    expect(p('INTERRUPTED_RESUMABLE')).toBeGreaterThan(p('BLOCKED'));
    expect(p('BLOCKED')).toBeGreaterThan(p('WAITING_AUTHORITY'));
    expect(p('WAITING_AUTHORITY')).toBeGreaterThan(p('ACTIVE'));
  });

  it('sceglie il workflow aperto più urgente e conta gli aperti', () => {
    const signal = portfolioExecutionSignal([
      wf('ACTIVE', false, 'A'),
      wf('WAITING_AUTHORITY', false, 'B'),
      wf('INTERRUPTED_RESUMABLE', false, 'C'),
      wf('COMPLETED', false, 'D'),
    ]);
    expect(signal?.key).toBe('RESUME_REQUIRED');
    expect(signal?.workflow).toBe('C');
    expect(signal?.openCount).toBe(3);
  });

  it('nessun segnale se non ci sono workflow aperti', () => {
    expect(portfolioExecutionSignal([])).toBeNull();
    expect(portfolioExecutionSignal(undefined)).toBeNull();
    expect(portfolioExecutionSignal([wf('COMPLETED')])).toBeNull();
  });
});

describe('DEC-012 · lettura campi jsonb', () => {
  it('normalizza array, stringa e null', () => {
    expect(asStringList(['AUTH-1', 'AUTH-2'])).toEqual(['AUTH-1', 'AUTH-2']);
    expect(asStringList('AUTH-1')).toEqual(['AUTH-1']);
    expect(asStringList(null)).toEqual([]);
    expect(asStringList('')).toEqual([]);
  });
});
