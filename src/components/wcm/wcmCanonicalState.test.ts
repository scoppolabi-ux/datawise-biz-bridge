import { describe, expect, it } from 'vitest';
import {
  authorityAllowed,
  buildMappingIndex,
  governanceBadgeOf,
  isApprovedState,
  resolveCanonicalState,
  suggestCanonicalState,
  type WcmStateMapping,
} from './wcmCanonicalState';
import { bucketOf, isOpenBoardSupportingDocument, toReadSortRank } from './wcmFormat';

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
  {
    category: 'BOARD_CANDIDATE',
    status: 'BOARD_GATE_OPEN_CANDIDATE',
    canonical_state: 'WAITING_AUTHORITY',
    mapping_status: 'ACTIVE',
  },
  {
    category: 'BOARD_REPORT',
    status: 'BOARD_GATE_OPEN_SUPPORTING_MATERIAL',
    canonical_state: 'CLOSED',
    mapping_status: 'ACTIVE',
  },
  {
    category: 'MANUSCRIPT_INDEX',
    status: 'APPROVED_FROZEN_CURRENT',
    canonical_state: 'APPROVED_FROZEN',
    mapping_status: 'ACTIVE',
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
    expect(governanceBadgeOf({ distribution_ready: true }, state)).toBe('NONE');
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
    expect(governanceBadgeOf({ distribution_ready: true }, state)).toBe('UNCLASSIFIED');
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

  it('risolve l Extended Narrative Index approvato in APPROVED_FROZEN, mai working/unapproved', () => {
    const doc = { category: 'MANUSCRIPT_INDEX', status: 'APPROVED_FROZEN_CURRENT' };
    const state = resolveCanonicalState(doc, index);
    expect(state).toBe('APPROVED_FROZEN');
    expect(isApprovedState(state)).toBe(true);
    expect(governanceBadgeOf({ distribution_ready: true }, state)).toBe('NONE');
    expect(bucketOf({ requires_stefano: false, ...doc }, state)).not.toBe('UNCLASSIFIED');
  });
});

describe('canonical state suggestion', () => {
  it('suggests CLOSED for PROFESSIONAL_REVIEW | PROFESSIONAL_REVIEWS_COMPLETED without mapping it', () => {
    const doc = { category: 'PROFESSIONAL_REVIEW', status: 'PROFESSIONAL_REVIEWS_COMPLETED' };
    const suggestion = suggestCanonicalState(doc);
    expect(suggestion?.state).toBe('CLOSED');
    expect(suggestion?.reason).toMatch(/complet/i);
    // la proposta non deve mai classificare il documento
    expect(resolveCanonicalState(doc, index)).toBe('UNKNOWN');
    expect(authorityAllowed(resolveCanonicalState(doc, index))).toBe(false);
  });
});

describe('baseline runtime states del projector deterministico', () => {
  it('classifica BOARD_CANDIDATE | BOARD_GATE_OPEN_CANDIDATE come WAITING_AUTHORITY', () => {
    const doc = { category: 'BOARD_CANDIDATE', status: 'BOARD_GATE_OPEN_CANDIDATE' };
    const state = resolveCanonicalState(doc, index);
    expect(state).toBe('WAITING_AUTHORITY');
    expect(bucketOf({ requires_stefano: false, category: doc.category }, state)).not.toBe(
      'UNCLASSIFIED',
    );
    expect(authorityAllowed(state)).toBe(true);
  });

  it('mostra BOARD_REPORT | BOARD_GATE_OPEN_SUPPORTING_MATERIAL nel Board Package senza badge', () => {
    const doc = { category: 'BOARD_REPORT', status: 'BOARD_GATE_OPEN_SUPPORTING_MATERIAL' };
    const state = resolveCanonicalState(doc, index);
    expect(state).toBe('CLOSED');
    expect(governanceBadgeOf({ distribution_ready: true }, state)).toBe('NONE');
    expect(bucketOf({ requires_stefano: false, ...doc }, state)).toBe('TO_READ');
  });

  it('lascia i BOARD_REPORT storici/chiusi nel materiale di supporto', () => {
    const doc = { category: 'BOARD_REPORT', status: 'BOARD_GATE_CLOSED_SUPPORTING_MATERIAL' };
    const state = resolveCanonicalState(doc, index);
    expect(bucketOf({ requires_stefano: false, ...doc }, state)).not.toBe('TO_READ');
  });

  it('ordina la Candidate prima del Board Report nel blocco Board', () => {
    const candidate = {
      requires_stefano: true,
      category: 'BOARD_CANDIDATE',
      status: 'BOARD_GATE_OPEN_CANDIDATE',
    };
    const report = {
      requires_stefano: false,
      category: 'BOARD_REPORT',
      status: 'BOARD_GATE_OPEN_SUPPORTING_MATERIAL',
    };
    expect(isOpenBoardSupportingDocument(report)).toBe(true);
    expect(isOpenBoardSupportingDocument(candidate)).toBe(false);
    expect(toReadSortRank(candidate)).toBeLessThan(toReadSortRank(report));
  });
});
