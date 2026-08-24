import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  MessageSquareWarning,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  hasActiveMethodCommand,
  METHOD_COMMAND_STATUS_LABELS,
  METHOD_COMMAND_TYPE_LABELS,
  methodCommandRequiresNote,
  useSubmitWcmMethodCommand,
  type WcmMethodCommandRequest,
  type WcmMethodCommandType,
} from '@/hooks/useWcmMethodCommands';
import type { WcmMethodChangeGate } from '@/hooks/useWcmMethodLearning';

const statusTone = (status: WcmMethodCommandRequest['status']) => {
  if (status === 'RECORDED') return 'border-wcm-line-strong bg-wcm-panel text-wcm-strong';
  if (status === 'STALE' || status === 'FAILED' || status === 'REJECTED') {
    return 'border-wcm-alert/40 bg-wcm-alert/10 text-wcm-alert-fg';
  }
  return 'border-wcm-line-strong bg-wcm-bg/60 text-wcm-text';
};

const MethodCommandState = ({ command }: { command: WcmMethodCommandRequest }) => (
  <div className={cn('rounded-lg border p-3 text-sm', statusTone(command.status))}>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.14em]">
        {command.command_type}
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
        {command.status} · {METHOD_COMMAND_STATUS_LABELS[command.status]}
      </span>
    </div>
    <p className="mt-1.5 text-xs text-wcm-dim">
      Richiesto da {command.requested_by_email} ({command.requested_by_role}) ·{' '}
      {new Date(command.created_at).toLocaleString('it-IT')} · revisione gate attesa:{' '}
      {command.expected_gate_revision}
    </p>
    {command.note && <p className="mt-2 leading-relaxed">{command.note}</p>}
    {command.status === 'STALE' && (
      <p className="mt-2 text-xs leading-relaxed">
        STALE = l’autorità NON è stata registrata e non ha avuto alcun effetto: il gate è
        cambiato prima dell’esecuzione. Serve una nuova decisione umana.
      </p>
    )}
    {command.status === 'RECORDED' && (
      <p className="mt-2 text-xs leading-relaxed text-wcm-muted">
        RECORDED = autorità registrata su GitHub; l’applicazione canonica al metodo può essere
        ancora in corso.
        {command.receipt_path ? ` Ricevuta: ${command.receipt_path}` : ''}
      </p>
    )}
    {command.failure_reason && (
      <p className="mt-2 text-xs leading-relaxed">Motivo: {command.failure_reason}</p>
    )}
  </div>
);

/**
 * GLOBAL Method Change Gate command surface.
 *
 * A click only RECORDS an authority command (SUBMITTED): it never promotes a
 * learning, never modifies the method baseline and never touches GitHub. The
 * WCM-LAB consumer workflow will claim and record the decision canonically.
 * Completely separate from the project Board Gate command surface.
 */
const WcmMethodGateCommands = ({
  gate,
  commands,
}: {
  gate: WcmMethodChangeGate;
  commands: WcmMethodCommandRequest[];
}) => {
  const submit = useSubmitWcmMethodCommand();

  const [open, setOpen] = useState<WcmMethodCommandType | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [note, setNote] = useState('');

  const gateCommands = commands.filter((c) => c.gate_id === gate.gate_id);
  const latest = gateCommands[0] ?? null;
  const active = gateCommands.find((c) => hasActiveMethodCommand(c)) ?? null;

  // Projection-sync lock: the last command died STALE and the gate is still
  // sitting on the very same revision, so no new authority may be given yet.
  const syncLocked =
    latest?.status === 'STALE' && latest.expected_gate_revision === gate.revision;
  const commandsDisabled = Boolean(active) || syncLocked;

  const close = () => {
    setOpen(null);
    setStep(1);
    setNote('');
  };

  const confirm = async () => {
    if (!open) return;
    try {
      await submit.mutateAsync({
        gate_id: gate.gate_id,
        command_type: open,
        note: methodCommandRequiresNote(open) ? note.trim() : note.trim() || null,
      });
      toast({ title: 'Comando inviato', description: 'Stato: SUBMITTED' });
      close();
    } catch (e) {
      toast({
        title: 'Comando non inviato',
        description: e instanceof Error ? e.message : 'Errore sconosciuto',
      });
    }
  };

  return (
    <div className="mt-3 rounded-lg border border-wcm-line-strong bg-wcm-bg/40 p-3">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-wcm-muted">
        <ShieldCheck className="h-3.5 w-3.5" />
        Command Surface · Method Change Gate
      </div>

      <p className="mt-2 text-[11px] leading-relaxed text-wcm-dim">
        Un clic registra soltanto l’autorità autenticata (comando SUBMITTED): non promuove il
        learning e non modifica la baseline del metodo. L’esecuzione canonica avviene su GitHub,
        sorgente di verità.
      </p>

      {syncLocked && latest && (
        <div className="mt-3 rounded-lg border border-wcm-alert/50 bg-wcm-alert/10 p-3 text-sm text-wcm-alert-fg">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span className="break-words">Comando non registrato</span>
          </div>
          <p className="mt-2 leading-relaxed">
            Il gate è cambiato prima dell’esecuzione del comando. Mission Control deve
            sincronizzarsi con GitHub prima di una nuova decisione.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-wcm-alert-fg/90">
            Sincronizzazione in attesa · ultimo comando {latest.command_type} · {latest.status} ·{' '}
            {new Date(latest.created_at).toLocaleString('it-IT')}
          </p>
        </div>
      )}

      {latest && (
        <div className="mt-3">
          <MethodCommandState command={latest} />
        </div>
      )}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          size="sm"
          disabled={commandsDisabled}
          onClick={() => setOpen('APPROVE_CHANGE_GATE')}
          className="w-full sm:w-auto"
        >
          <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
          {METHOD_COMMAND_TYPE_LABELS.APPROVE_CHANGE_GATE}
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={commandsDisabled}
          onClick={() => setOpen('REQUEST_CHANGES')}
          className="w-full border-wcm-line-strong bg-transparent text-wcm-text hover:border-wcm-accent hover:bg-wcm-surface hover:text-wcm-strong sm:w-auto"
        >
          <MessageSquareWarning className="mr-2 h-3.5 w-3.5" />
          {METHOD_COMMAND_TYPE_LABELS.REQUEST_CHANGES}
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={commandsDisabled}
          onClick={() => setOpen('REJECT_CHANGE_GATE')}
          className="w-full border-wcm-alert/40 bg-transparent text-wcm-alert-fg hover:border-wcm-alert hover:bg-wcm-alert/10 sm:w-auto"
        >
          <XCircle className="mr-2 h-3.5 w-3.5" />
          {METHOD_COMMAND_TYPE_LABELS.REJECT_CHANGE_GATE}
        </Button>
      </div>

      {active && !syncLocked && (
        <p className="mt-2 text-xs text-wcm-dim">
          Un comando è già attivo per questo gate: nuovi comandi sono disabilitati finché non
          viene risolto. Il gate resta in «Needs Stefano» come pendente di sistema.
        </p>
      )}

      {syncLocked && (
        <p className="mt-2 text-xs text-wcm-dim">
          Nuovi comandi disabilitati finché il Projector non allinea Mission Control a una nuova
          revisione del gate. Nessun reinvio automatico: sarà necessario un nuovo clic umano.
        </p>
      )}

      <Dialog open={open !== null} onOpenChange={(v) => (v ? null : close())}>
        <DialogContent className="max-w-md border-wcm-line bg-wcm-surface text-wcm-text">
          <DialogHeader>
            <DialogTitle className="text-wcm-strong">
              {open ? METHOD_COMMAND_TYPE_LABELS[open] : ''}
            </DialogTitle>
            <DialogDescription className="text-wcm-dim">
              {gate.gate_id} · {gate.title} · revisione {gate.revision}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <div className="space-y-2">
              <label htmlFor="wcm-method-command-note" className="text-xs text-wcm-muted">
                Nota {open && methodCommandRequiresNote(open) ? '(obbligatoria)' : '(facoltativa)'}
              </label>
              <Textarea
                id="wcm-method-command-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="border-wcm-line-strong bg-wcm-bg text-wcm-strong"
              />
            </div>

            {step === 2 && (
              <p className="rounded-md border border-wcm-alert/40 bg-wcm-alert/10 p-3 text-xs leading-relaxed text-wcm-alert-fg">
                Conferma definitiva. Mission Control registra soltanto l’autorità autenticata sul
                gate alla revisione corrente ({gate.revision}): gli effetti sul metodo sono quelli{' '}
                <strong>previsti dal workflow</strong> WCM su GitHub e non sono garantiti da
                questa interfaccia.
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={close}
              className="border-wcm-line-strong bg-transparent text-wcm-text"
            >
              Annulla
            </Button>
            {step === 1 ? (
              <Button
                onClick={() => setStep(2)}
                disabled={Boolean(open && methodCommandRequiresNote(open) && note.trim().length === 0)}
              >
                Continua
              </Button>
            ) : (
              <Button onClick={confirm} disabled={submit.isPending}>
                {submit.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Conferma e invia
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WcmMethodGateCommands;
