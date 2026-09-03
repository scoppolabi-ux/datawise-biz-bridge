import { describe, expect, it } from 'vitest';
import {
  isBoardCommandType,
  isWcmCommandType,
  validateWriterMemoryAuthorityCommand,
  WCM_COMMAND_TYPES,
} from './wcmCommandTypes.ts';

describe('command vocabulary', () => {
  it('include il nuovo command type Writer Memory senza rimuovere i Board command', () => {
    expect(WCM_COMMAND_TYPES).toEqual([
      'APPROVE_FREEZE',
      'REQUEST_CHANGES',
      'APPROVE_WRITER_MEMORY_AUTHORITY_ITEM',
    ]);
    expect(isWcmCommandType('APPROVE_WRITER_MEMORY_AUTHORITY_ITEM')).toBe(true);
    expect(isWcmCommandType('APPROVE_WRITER_MEMORY')).toBe(false);
  });

  it('classifica correttamente i command type Board', () => {
    expect(isBoardCommandType('APPROVE_FREEZE')).toBe(true);
    expect(isBoardCommandType('REQUEST_CHANGES')).toBe(true);
    expect(isBoardCommandType('APPROVE_WRITER_MEMORY_AUTHORITY_ITEM')).toBe(false);
  });
});

describe('validateWriterMemoryAuthorityCommand', () => {
  it('accetta un need WRITER_MEMORY_AUTHORITY senza target e senza nota', () => {
    expect(
      validateWriterMemoryAuthorityCommand({
        commandType: 'APPROVE_WRITER_MEMORY_AUTHORITY_ITEM',
        needType: 'WRITER_MEMORY_AUTHORITY',
      }),
    ).toBeNull();
  });

  it('rifiuta il command type su un need di tipo diverso', () => {
    const result = validateWriterMemoryAuthorityCommand({
      commandType: 'APPROVE_WRITER_MEMORY_AUTHORITY_ITEM',
      needType: 'BOARD_GATE',
    });
    expect(result?.code).toBe('NOT_A_WRITER_MEMORY_AUTHORITY');
    expect(result?.status).toBe(409);
  });

  it('rifiuta target_document_id e target_version', () => {
    expect(
      validateWriterMemoryAuthorityCommand({
        commandType: 'APPROVE_WRITER_MEMORY_AUTHORITY_ITEM',
        needType: 'WRITER_MEMORY_AUTHORITY',
        targetDocumentId: 'DOC-1',
      })?.code,
    ).toBe('TARGET_NOT_ALLOWED');
    expect(
      validateWriterMemoryAuthorityCommand({
        commandType: 'APPROVE_WRITER_MEMORY_AUTHORITY_ITEM',
        needType: 'WRITER_MEMORY_AUTHORITY',
        targetVersion: 'v1',
      })?.code,
    ).toBe('TARGET_NOT_ALLOWED');
  });

  it('non interferisce con i comandi Board (regressione)', () => {
    expect(
      validateWriterMemoryAuthorityCommand({
        commandType: 'APPROVE_FREEZE',
        needType: 'BOARD_GATE',
        targetDocumentId: 'DOC-1',
        targetVersion: 'v1',
      }),
    ).toBeNull();
    expect(
      validateWriterMemoryAuthorityCommand({
        commandType: 'REQUEST_CHANGES',
        needType: 'BOARD_GATE',
        note: 'motivo',
      }),
    ).toBeNull();
  });
});
