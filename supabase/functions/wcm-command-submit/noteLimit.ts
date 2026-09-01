/**
 * Human Note guardrail for Mission Control commands (wcm-command-submit).
 *
 * Pure module shared between the Deno edge function (explicit .ts import)
 * and the vitest suite. Contract (unchanged semantics, limit raised from
 * 4000 to 12000 characters):
 * - REQUEST_CHANGES requires a non-empty note (code NOTE_REQUIRED);
 * - any non-empty note longer than MAX_COMMAND_NOTE_LENGTH is rejected with
 *   the exact error string 'note is too long' and no error code;
 * - APPROVE_FREEZE keeps an optional note, still subject to the same limit.
 */
export const MAX_COMMAND_NOTE_LENGTH = 12000

export type NoteValidationResult =
  | { ok: true }
  | { ok: false; error: string; code?: string }

export const validateCommandNote = (
  commandType: string,
  note: string | null,
): NoteValidationResult => {
  if (commandType === 'REQUEST_CHANGES' && !note) {
    return { ok: false, error: 'REQUEST_CHANGES requires a non-empty note', code: 'NOTE_REQUIRED' }
  }
  if (note && note.length > MAX_COMMAND_NOTE_LENGTH) {
    return { ok: false, error: 'note is too long' }
  }
  return { ok: true }
}