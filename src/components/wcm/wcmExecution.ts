import type {
  WcmExecutionWorkflow,
  WcmExecutionWorkflowStatus,
} from '@/hooks/useWcmExecutionWorkflows';

/**
 * DEC-012 — presentazione di Execution Health.
 * Osservazione pura: nessun comando, nessuna interpretazione locale del
 * Completion Gate oltre ai dati proiettati.
 *
 * TASSONOMIA: Execution Health è un piano distinto da Project, Knowledge e
 * Governance Health. Non modifica score o issue di Knowledge.
 */
export type WcmExecutionSignalKey =
  | 'RESUME_REQUIRED'
  | 'BLOCKED'
  | 'WAITING_AUTHORITY'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'UNKNOWN';

export type WcmExecutionTone = 'alert' | 'warn' | 'accent' | 'neutral' | 'done';

export type WcmExecutionSignal = {
  key: WcmExecutionSignalKey;
  /** Priorità visiva: più alto = più urgente. */
  priority: number;
  label: string;
  explanation: string;
  tone: WcmExecutionTone;
};

const SIGNALS: Record<WcmExecutionSignalKey, WcmExecutionSignal> = {
  RESUME_REQUIRED: {
    key: 'RESUME_REQUIRED',
    priority: 40,
    label: 'RIPRESA RICHIESTA',
    explanation:
      'Il workflow non è concluso. Riprenderà al prossimo trigger operativo disponibile.',
    tone: 'alert',
  },
  BLOCKED: {
    key: 'BLOCKED',
    priority: 30,
    label: 'BLOCCATO',
    explanation: 'Il workflow è bloccato e non può proseguire senza rimozione dell’ostacolo.',
    tone: 'warn',
  },
  WAITING_AUTHORITY: {
    key: 'WAITING_AUTHORITY',
    priority: 20,
    label: 'IN ATTESA DI AUTORITÀ',
    explanation:
      'Condizione reale di arresto prevista dal metodo: il workflow attende una decisione di autorità. Non è un errore.',
    tone: 'accent',
  },
  ACTIVE: {
    key: 'ACTIVE',
    priority: 10,
    label: 'IN ESECUZIONE',
    explanation: 'Il workflow è in esecuzione e la condizione reale di arresto non è raggiunta.',
    tone: 'accent',
  },
  COMPLETED: {
    key: 'COMPLETED',
    priority: 0,
    label: 'COMPLETATO',
    explanation: 'Storico chiuso: il workflow risulta completato nella proiezione.',
    tone: 'done',
  },
  CANCELLED: {
    key: 'CANCELLED',
    priority: 0,
    label: 'ANNULLATO',
    explanation: 'Storico chiuso: il workflow risulta annullato nella proiezione.',
    tone: 'neutral',
  },
  UNKNOWN: {
    key: 'UNKNOWN',
    priority: 5,
    label: 'NON PROIETTATO',
    explanation: 'Stato non riconosciuto nella proiezione.',
    tone: 'neutral',
  },
};

export const normalizeExecutionStatus = (
  status: string | null | undefined,
): WcmExecutionWorkflowStatus | 'UNKNOWN' => {
  const value = (status ?? '').trim().toUpperCase().replace(/[\s-]+/g, '_');
  switch (value) {
    case 'ACTIVE':
    case 'INTERRUPTED_RESUMABLE':
    case 'WAITING_AUTHORITY':
    case 'BLOCKED':
    case 'COMPLETED':
    case 'CANCELLED':
      return value;
    default:
      return 'UNKNOWN';
  }
};

export const EXECUTION_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'In esecuzione',
  INTERRUPTED_RESUMABLE: 'Interrotto · riprendibile',
  WAITING_AUTHORITY: 'In attesa di autorità',
  BLOCKED: 'Bloccato',
  COMPLETED: 'Completato',
  CANCELLED: 'Annullato',
  UNKNOWN: 'Non riconosciuto',
};

/** Segnale sintetico di un singolo workflow. */
export const executionSignalOf = (workflow: {
  status: string;
  resume_required: boolean;
}): WcmExecutionSignal => {
  const status = normalizeExecutionStatus(workflow.status);
  if (status === 'COMPLETED') return SIGNALS.COMPLETED;
  if (status === 'CANCELLED') return SIGNALS.CANCELLED;
  if (status === 'INTERRUPTED_RESUMABLE' || workflow.resume_required) {
    return SIGNALS.RESUME_REQUIRED;
  }
  if (status === 'BLOCKED') return SIGNALS.BLOCKED;
  if (status === 'WAITING_AUTHORITY') return SIGNALS.WAITING_AUTHORITY;
  if (status === 'ACTIVE') return SIGNALS.ACTIVE;
  return SIGNALS.UNKNOWN;
};

export const isOpenExecutionWorkflow = (workflow: { status: string }) => {
  const status = normalizeExecutionStatus(workflow.status);
  return status !== 'COMPLETED' && status !== 'CANCELLED';
};

/**
 * Segnale compatto di portfolio/overview: il workflow aperto più urgente.
 * Ritorna null quando non esiste alcun workflow attivo/interrotto/waiting.
 */
export const portfolioExecutionSignal = (
  workflows: { status: string; resume_required: boolean; workflow: string }[] | undefined,
): (WcmExecutionSignal & { workflow: string; openCount: number }) | null => {
  const open = (workflows ?? []).filter(isOpenExecutionWorkflow);
  if (open.length === 0) return null;
  let best: { signal: WcmExecutionSignal; workflow: string } | null = null;
  for (const item of open) {
    const signal = executionSignalOf(item);
    if (!best || signal.priority > best.signal.priority) {
      best = { signal, workflow: item.workflow };
    }
  }
  if (!best) return null;
  return { ...best.signal, workflow: best.workflow, openCount: open.length };
};

export const executionToneClasses = (tone: WcmExecutionTone) => {
  switch (tone) {
    case 'alert':
      return 'bg-wcm-alert/15 text-wcm-alert-fg border-wcm-alert/30';
    case 'warn':
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    case 'accent':
      return 'bg-wcm-accent/15 text-wcm-accent border-wcm-accent/30';
    case 'done':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    default:
      return 'bg-wcm-dim/15 text-wcm-text border-wcm-line-strong';
  }
};

/** Lista di stringhe leggibile da un campo jsonb proiettato. */
export const asStringList = (value: unknown): string[] => {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item : JSON.stringify(item)))
      .filter((item) => item.trim() !== '');
  }
  if (typeof value === 'string') return value.trim() === '' ? [] : [value.trim()];
  return [JSON.stringify(value)];
};

/** Ordina i workflow: prima gli aperti più urgenti, poi lo storico chiuso. */
export const sortExecutionWorkflows = (workflows: WcmExecutionWorkflow[]) =>
  [...workflows].sort((a, b) => {
    const openDelta = Number(isOpenExecutionWorkflow(b)) - Number(isOpenExecutionWorkflow(a));
    if (openDelta !== 0) return openDelta;
    const priorityDelta = executionSignalOf(b).priority - executionSignalOf(a).priority;
    if (priorityDelta !== 0) return priorityDelta;
    return a.sort_order - b.sort_order;
  });
