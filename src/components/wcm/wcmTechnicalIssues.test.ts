import { describe, expect, it } from 'vitest';
import {
  closedIssues,
  issueDateLabel,
  issueStatusLabel,
  openIssues,
} from './wcmTechnicalIssues';
import type { WcmTechnicalIssue } from '@/hooks/useWcmTechnicalIssues';

const base: WcmTechnicalIssue = {
  id: '1',
  project_id: 'prima-di-noi',
  issue_id: 'WCM-ISSUE-20260828-AB12CD34EF',
  issue_type: 'TECHNICAL_CONSISTENCY',
  title: 'Workflow inconsistente',
  status: 'OPEN',
  blocking: true,
  detected_by: 'validator',
  detected_at: '2026-08-28T10:00:00Z',
  error_code: 'WF_STATE_MISMATCH',
  detail: 'detail',
  source_path: 'projects/prima-di-noi/runtime/workflows/a.json',
  source_sha: 'a'.repeat(40),
  opened_at: '2026-08-28T10:00:00Z',
  closed_at: null,
  closed_by: null,
  resolution_note: null,
  updated_at: '2026-08-28T10:00:00Z',
};

describe('wcmTechnicalIssues helpers', () => {
  it('maps statuses to Italian labels', () => {
    expect(issueStatusLabel('OPEN')).toBe('Aperto');
    expect(issueStatusLabel('CLOSED')).toBe('Chiuso');
    expect(issueStatusLabel('WEIRD')).toBe('Stato: WEIRD');
  });

  it('splits open and closed issues', () => {
    const closed = { ...base, id: '2', status: 'CLOSED' as const, closed_at: '2026-08-29T10:00:00Z' };
    expect(openIssues([base, closed])).toHaveLength(1);
    expect(closedIssues([base, closed])).toHaveLength(1);
  });

  it('formats dates and handles null/invalid input', () => {
    expect(issueDateLabel(null)).toBe('—');
    expect(issueDateLabel('not-a-date')).toBe('not-a-date');
    expect(issueDateLabel('2026-08-28T10:00:00Z')).toContain('2026');
  });
});
