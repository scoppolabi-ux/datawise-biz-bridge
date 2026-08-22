import { describe, expect, it } from 'vitest';
import {
  authorityAllowed,
  buildMappingIndex,
  governanceBadgeOf,
  isApprovedState,
  resolveCanonicalState,
  type WcmStateMapping,
} from './wcmCanonicalState';
import { bucketOf } from './wcmFormat';

const mappings: WcmStateMapping[] = [
  {
    category: 'MANUSCRIPT_APPROVED',
    status: 'APPROVED_FROZEN_CURRENT',
    canonical_state: 'APPROVED_FROZEN',
    mapping_status: 'ACTIVE',
  },
  {
    category: 'BOARD_REPORT',
    status: 'BOARD_GATE_CLOSED_SUPPORTING_MATERIAL',
    canonical_state: 'CLOSED',
    mapping_status: 'ACTIVE',
  },
  {
    category: 'FUTURE_THING',
    status: 'SOMETHING',
    canonical_state: null,
    proposed_state: 'ARCHIVED_REFERENCE',
    mapping_status: 'PENDING',
  },
] as WcmStateMapping[];

const index = buildMappingIndex(mappings);

describe('canonical state resolution', () => {
  it('resolves an active mapping', () => {
    expect(
      resolveCanonicalState(
        { category: 'MANUSCRIPT_APPROVED', status: 'APPROVED_FROZEN_CURRENT' },
        index,
      ),
    ).toBe('APPROVED_FROZEN');
  });

  it('maps the board report case to CLOSED, not unapproved', () => {
    const doc = { category: 'BOARD_REPORT', status: 'BOARD_GATE_CLOSED_SUPPORTING_MATERIAL' };
    const state = resolveCanonicalState(doc, index);
    expect(state).toBe('CLOSED');
    expect(governanceBadgeOf({ requires_stefano: false }, state)).toBe('NONE');
  });

  it('never derives a canonical state from a PENDING proposal', () => {
    expect(resolveCanonicalState({ category: 'FUTURE_THING', status: 'SOMETHING' }, index)).toBe(
      'UNKNOWN',
    );
  });

  it('flags unmapped pairs and blocks authority', () => {
    const state = resolveCanonicalState({ category: 'NEW_CAT', status: 'NEW_STATUS' }, index);
    expect(state).toBe('UNKNOWN');
    expect(authorityAllowed(state)).toBe(false);
    expect(governanceBadgeOf({ requires_stefano: false }, state)).toBe('UNCLASSIFIED');
    expect(bucketOf({ requires_stefano: false, category: 'NEW_CAT' }, state)).toBe('UNCLASSIFIED');
  });

  it('keeps requires_stefano authoritative for the reading queue', () => {
    const state = resolveCanonicalState(
      { category: 'MANUSCRIPT_APPROVED', status: 'APPROVED_FROZEN_CURRENT' },
      index,
    );
    expect(bucketOf({ requires_stefano: true, category: 'MANUSCRIPT_APPROVED' }, state)).toBe(
      'TO_READ',
    );
    expect(isApprovedState(state)).toBe(true);
  });
});
