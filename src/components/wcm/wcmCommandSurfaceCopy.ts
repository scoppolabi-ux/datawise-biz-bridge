/**
 * Human-facing copy for the WCM Command Surface.
 * These labels are intentionally decoupled from the technical command_type
 * values sent to the backend (APPROVE_FREEZE / REQUEST_CHANGES).
 */

export const REQUEST_CHANGES_BUTTON_LABEL = 'Rifiuta + Riscrivi';
export const REQUEST_CHANGES_DIALOG_TITLE = 'Rifiuta + Riscrivi';
export const REQUEST_CHANGES_NOTE_LABEL =
  'Motivo del rifiuto / istruzione di riscrittura (obbligatorio)';

export const requestChangesConfirmationText = () =>
  'La Candidate corrente viene rifiutata; WCM applicherà la rejection_transition dichiarata dal workflow per creare la nuova revisione. Mission Control registra soltanto l’autorità autenticata: l’esecuzione canonica avviene su GitHub.';
