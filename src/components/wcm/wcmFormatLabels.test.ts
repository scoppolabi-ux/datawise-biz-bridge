import { describe, expect, it } from 'vitest';
import {
  heartbeatOutcomeDisplay,
  isCompactPhase,
  projectStatusLabel,
  statusClasses,
} from './wcmFormat';

describe('project status labels', () => {
  it('mappa esattamente active_resume_required', () => {
    expect(projectStatusLabel('active_resume_required')).toBe('Ripresa necessaria');
    expect(projectStatusLabel(' ACTIVE_RESUME_REQUIRED ')).toBe('Ripresa necessaria');
  });

  it('usa il tono alert coerente con RESUME_REQUIRED', () => {
    expect(statusClasses('active_resume_required')).toBe(statusClasses('blocked'));
  });

  it('mantiene il fallback raw per enum sconosciuti', () => {
    expect(projectStatusLabel('some_new_state')).toBe('some_new_state');
  });
});

describe('heartbeat outcome display', () => {
  it('mappa gli outcome canonici brevi', () => {
    expect(heartbeatOutcomeDisplay('ok')?.label).toBe('Esito conforme');
    expect(heartbeatOutcomeDisplay('resume_required')?.label).toBe('Ripresa necessaria');
    expect(heartbeatOutcomeDisplay('blocked_board')?.label).toBe('Stop governato · Board');
    expect(heartbeatOutcomeDisplay('no_work')?.known).toBe(true);
  });

  it('non deduce significato da sottostringhe', () => {
    const display = heartbeatOutcomeDisplay(
      'chapter_7_v0_1_narrative_mass_control_completed_editorial_synthesis_revision_resume_required',
    );
    expect(display?.known).toBe(false);
    expect(display?.label).toBe('Esito non riconosciuto');
    expect(display?.raw).toContain('chapter_7');
  });

  it('ritorna null per valori vuoti', () => {
    expect(heartbeatOutcomeDisplay(null)).toBeNull();
    expect(heartbeatOutcomeDisplay('   ')).toBeNull();
  });
});

describe('phase compattezza', () => {
  it('accetta phase brevi e scarta enum lunghi', () => {
    expect(isCompactPhase('PHASE_5')).toBe(true);
    expect(isCompactPhase('CHAPTER_7_V0_1_EDITORIAL_SYNTHESIS_REVISION_RESUME')).toBe(false);
    expect(isCompactPhase(null)).toBe(false);
  });
});
