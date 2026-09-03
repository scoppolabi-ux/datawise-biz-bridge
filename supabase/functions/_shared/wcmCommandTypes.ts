/**
 * Command vocabulary for the human authority surface.
 *
 * Mission Control only RECORDS authority: every command is durably queued in
 * `wcm_command_requests` and consumed by the GitHub Command Executor.
 */

export const WCM_COMMAND_TYPES = [
  'APPROVE_FREEZE',
  'REQUEST_CHANGES',
  'APPROVE_WRITER_MEMORY_AUTHORITY_ITEM',
] as const

export type WcmCommandType = (typeof WCM_COMMAND_TYPES)[number]

export const WRITER_MEMORY_AUTHORITY_NEED_TYPE = 'WRITER_MEMORY_AUTHORITY'

export const isWcmCommandType = (value: unknown): value is WcmCommandType =>
  (WCM_COMMAND_TYPES as readonly string[]).includes(String(value ?? ''))

export type CommandNeedValidationError = {
  error: string
  code: string
  status: number
}

export type CommandNeedValidationInput = {
  commandType: string
  needType: unknown
  targetDocumentId?: string | null
  targetVersion?: string | null
  note?: string | null
}

const upper = (v: unknown) => String(v ?? '').trim().toUpperCase()

/**
 * Need-scoped contract for the Writer Memory authority command.
 * Board commands keep their existing (separate) validation untouched.
 */
export function validateWriterMemoryAuthorityCommand(
  input: CommandNeedValidationInput,
): CommandNeedValidationError | null {
  if (input.commandType !== 'APPROVE_WRITER_MEMORY_AUTHORITY_ITEM') return null

  if (upper(input.needType) !== WRITER_MEMORY_AUTHORITY_NEED_TYPE) {
    return {
      code: 'NOT_A_WRITER_MEMORY_AUTHORITY',
      status: 409,
      error:
        'APPROVE_WRITER_MEMORY_AUTHORITY_ITEM richiede un Need aperto di tipo WRITER_MEMORY_AUTHORITY.',
    }
  }
  if (input.targetDocumentId || input.targetVersion) {
    return {
      code: 'TARGET_NOT_ALLOWED',
      status: 400,
      error:
        'APPROVE_WRITER_MEMORY_AUTHORITY_ITEM non ammette target_document_id o target_version: il Need è già l’oggetto dell’autorità.',
    }
  }
  return null
}

/** True when the Board-specific target/candidate rules must be applied. */
export const isBoardCommandType = (commandType: string) =>
  commandType === 'APPROVE_FREEZE' || commandType === 'REQUEST_CHANGES'
