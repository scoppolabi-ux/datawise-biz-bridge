import { describe, expect, it } from 'vitest';
import {
  commandSurfaceLabels,
  commandSurfaceMode,
  WRITER_MEMORY_AUTHORITY_COMMAND,
} from './wcmCommandSurfaceMode';

describe('commandSurfaceMode', () => {
  it('mantiene invariata la superficie Board Gate', () => {
    expect(commandSurfaceMode({ need_type: 'BOARD_GATE' })).toBe('BOARD_GATE');
    expect(commandSurfaceLabels('BOARD_GATE')).toEqual({
      surface: 'Command Surface · Board Gate',
      approve: 'Approva + Freeze',
    });
  });

  it('espone la superficie Writer Memory Authority con un solo comando "Approva"', () => {
    expect(commandSurfaceMode({ need_type: 'writer_memory_authority' })).toBe(
      'WRITER_MEMORY_AUTHORITY',
    );
    expect(commandSurfaceLabels('WRITER_MEMORY_AUTHORITY').approve).toBe('Approva');
    expect(WRITER_MEMORY_AUTHORITY_COMMAND).toBe('APPROVE_WRITER_MEMORY_AUTHORITY_ITEM');
  });

  it('non espone alcuna superficie per gli altri need', () => {
    expect(commandSurfaceMode({ need_type: 'STATE_CLASSIFICATION' })).toBeNull();
    expect(commandSurfaceMode({})).toBeNull();
  });
});
