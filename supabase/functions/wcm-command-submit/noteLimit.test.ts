import { describe, expect, it } from 'vitest';
import { MAX_COMMAND_NOTE_LENGTH, validateCommandNote } from './noteLimit';

describe('validateCommandNote (wcm-command-submit)', () => {
  it('accetta una nota REQUEST_CHANGES di 4001 caratteri (limite alzato da 4000 a 12000)', () => {
    const result = validateCommandNote('REQUEST_CHANGES', 'x'.repeat(4001));
    expect(result.ok).toBe(true);
  });

  it('accetta una nota esattamente di 12000 caratteri', () => {
    const result = validateCommandNote('REQUEST_CHANGES', 'x'.repeat(MAX_COMMAND_NOTE_LENGTH));
    expect(result.ok).toBe(true);
  });

  it('rifiuta una nota di 12001 caratteri con errore "note is too long"', () => {
    const result = validateCommandNote(
      'REQUEST_CHANGES',
      'x'.repeat(MAX_COMMAND_NOTE_LENGTH + 1),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('note is too long');
      expect(result.code).toBeUndefined();
    }
  });

  it('mantiene il contratto: REQUEST_CHANGES richiede una nota non vuota', () => {
    const result = validateCommandNote('REQUEST_CHANGES', null);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('REQUEST_CHANGES requires a non-empty note');
      expect(result.code).toBe('NOTE_REQUIRED');
    }
    expect(validateCommandNote('REQUEST_CHANGES', '').ok).toBe(false);
  });

  it('mantiene il contratto: APPROVE_FREEZE ha nota facoltativa, sempre entro il limite', () => {
    expect(validateCommandNote('APPROVE_FREEZE', null).ok).toBe(true);
    expect(validateCommandNote('APPROVE_FREEZE', 'x'.repeat(MAX_COMMAND_NOTE_LENGTH)).ok).toBe(
      true,
    );
    expect(validateCommandNote('APPROVE_FREEZE', 'x'.repeat(MAX_COMMAND_NOTE_LENGTH + 1)).ok).toBe(
      false,
    );
  });
});