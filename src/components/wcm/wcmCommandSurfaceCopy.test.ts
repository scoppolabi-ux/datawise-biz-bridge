import { describe, expect, it } from 'vitest';
import {
  REQUEST_CHANGES_BUTTON_LABEL,
  REQUEST_CHANGES_DIALOG_TITLE,
  REQUEST_CHANGES_NOTE_LABEL,
  requestChangesConfirmationText,
} from './wcmCommandSurfaceCopy';

describe('WCM Command Surface copy for REQUEST_CHANGES', () => {
  it('presents the action as "Rifiuta + Riscrivi" in button and dialog title', () => {
    expect(REQUEST_CHANGES_BUTTON_LABEL).toBe('Rifiuta + Riscrivi');
    expect(REQUEST_CHANGES_DIALOG_TITLE).toBe('Rifiuta + Riscrivi');
  });

  it('uses the required rejection/rewrite note label', () => {
    expect(REQUEST_CHANGES_NOTE_LABEL).toBe(
      'Motivo del rifiuto / istruzione di riscrittura (obbligatorio)',
    );
  });

  it('explains that the current Candidate is rejected and WCM applies the workflow rejection_transition', () => {
    const text = requestChangesConfirmationText();
    expect(text).toContain('Candidate corrente viene rifiutata');
    expect(text).toContain('rejection_transition');
    expect(text).toContain('Mission Control registra soltanto');
    expect(text).toContain('esecuzione canonica avviene su GitHub');
  });
});
