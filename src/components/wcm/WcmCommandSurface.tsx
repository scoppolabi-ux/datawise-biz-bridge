import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, MessageSquareWarning, ShieldCheck } from 'lucide-react';
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
  ACTIVE_COMMAND_STATUSES,
  COMMAND_STATUS_LABELS,
  useSubmitWcmCommand,
  useWcmProjectCommands,
  type WcmCommandRequest,
} from '@/hooks/useWcmCommands';
import { useWcmProject, type WcmProjectDocument, type WcmProjectNeed } from '@/hooks/useWcmProjects';

type CommandType = 'APPROVE_FREEZE' | 'REQUEST_CHANGES';

const statusTone = (status: WcmCommandRequest['status']) => {
  if (status === 'RECORDED') return 'border-wcm-line-strong bg-wcm-panel text-wcm-strong';
  if (status === 'STALE' || status === 'FAILED' || status === 'REJECTED') {
    return 'border-wcm-alert/40 bg-wcm-alert/10 text-wcm-alert-fg';
  }
  return 'border-wcm-line-strong bg-wcm-bg/60 text-wcm-text';
};

const CommandState = ({ command }: { command: WcmCommandRequest }) => (
  <div className={cn('rounded-lg border p-3 text-sm', statusTone(command.status))}>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.14em]">
        {command.command_type}
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
        {command.status} · {COMMAND_STATUS_LABELS[command.status]}
      </span>
    </div>
    <p className="mt-1.5 text-xs text-wcm-dim">
      Richiesto da {command.requested_by_email} ({command.requested_by_role}) ·{' '}
      {new Date(command.created_at).toLocaleString('it-IT')}
    </p>
    {command.target_document_id && (
      <p className="mt-1 truncate font-mono text-[11px] text-wcm-dim">
        {command.target_document_id}
        {command.target_version ? ` · v${command.target_version}` : ''}
      </p>
    )}
    {command.note && <p className="mt-2 leading-relaxed">{command.note}</p>}
    {command.status === 'STALE' && (
      <p className="mt-2 text-xs leading-relaxed">
        STALE = l’autorità NON è stata registrata e non ha avuto alcun effetto: nessuna
        approvazione, nessun freeze, nessuna ricevuta.
      </p>
    )}
    {command.status === 'RECORDED' && (
      <p className="mt-2 text-xs leading-relaxed text-wcm-muted">
        RECORDED = autorità registrata su GitHub; l’esecuzione WCM può essere ancora in corso.
        {command.receipt_path ? ` Ricevuta: ${command.receipt_path}` : ''}
      </p>
    )}
    {command.failure_reason && (
      <p className="mt-2 text-xs leading-relaxed">Motivo: {command.failure_reason}</p>
    )}
  </div>
);

/**
 * Human Command Surface, restricted to open Board Gate needs.
 * The browser only records authority: it never mutates the read-model
 * and never writes GitHub.
 */
const WcmCommandSurface = ({
  need,
  documents,
}: {
  need: WcmProjectNeed;
  documents: WcmProjectDocument[];
}) => {
  const { data: commands } = useWcmProjectCommands(need.project_id);
  const { data: project } = useWcmProject(need.project_id);
  const submit = useSubmitWcmCommand();
  const { index: stateIndex } = useCanonicalStateIndex();

  const [open, setOpen] = useState<CommandType | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [note, setNote] = useState('');

  const needCommands = (commands ?? []).filter((c) => c.need_id === need.need_id);
  const latest = needCommands[0] ?? null;
  const active = needCommands.find((c) => ACTIVE_COMMAND_STATUSES.includes(c.status)) ?? null;

  // Projection-sync lock: the last command died STALE and the read-model is
  // still sitting on the very same baseline, so no new authority may be given.
  const currentStateSha = project?.source_state_sha ?? null;
  const syncLocked =
    latest?.status === 'STALE' &&
    Boolean(latest.expected_state_sha) &&
    (!currentStateSha || currentStateSha === latest.expected_state_sha);
  const commandsDisabled = Boolean(active) || syncLocked;

  const relatedDocs = useMemo(() => {
    const ids = new Set<string>([
      ...(need.related_document_ids ?? []),
      ...(need.target_document_id ? [need.target_document_id] : []),
    ]);
    return documents.filter((d) => ids.has(d.document_id));
  }, [documents, need]);

  // INVARIANT: APPROVE_FREEZE acts on the freezable Candidate only.
  // A BOARD_REPORT is readable/related, never the authority target.
  const candidateDocs = useMemo(
    () => relatedDocs.filter((d) => String(d.category ?? '').toUpperCase() === 'BOARD_CANDIDATE'),
    [relatedDocs],
  );
  const approveTarget = candidateDocs.length === 1 ? candidateDocs[0] : null;

  // REQUEST_CHANGES keeps the historical, looser target resolution.
  const changesTarget = useMemo(() => {
    const targetId = need.target_document_id ?? need.related_document_ids?.[0] ?? null;
    if (!targetId) return null;
    return documents.find((d) => d.document_id === targetId) ?? null;
  }, [documents, need]);

  const targetDoc = open === 'APPROVE_FREEZE' ? approveTarget : changesTarget;

  // Un target con stato non classificato blocca SOLO l'autorità su quell'oggetto.
  const approveTargetState = approveTarget
    ? resolveCanonicalState(approveTarget, stateIndex)
    : null;
  const changesTargetState = changesTarget
    ? resolveCanonicalState(changesTarget, stateIndex)
    : null;
  const approveBlockedByState = approveTargetState === 'UNKNOWN';
  const changesBlockedByState = changesTargetState === 'UNKNOWN';

  // Authority recorded on an incoherent (non-Candidate) target while the need
  // is still open: the decision exists, WCM application is blocked.
  const coherenceBlock = useMemo(() => {
    const recorded = needCommands.find(
      (c) => c.status === 'RECORDED' && c.command_type === 'APPROVE_FREEZE',
    );
    if (!recorded) return null;
    const doc = recorded.target_document_id
      ? documents.find((d) => d.document_id === recorded.target_document_id)
      : null;
    const isCandidate = String(doc?.category ?? '').toUpperCase() === 'BOARD_CANDIDATE';
    return isCandidate ? null : recorded;
  }, [documents, needCommands]);

  const isBoardGate = String(need.need_type ?? '').toUpperCase() === 'BOARD_GATE';
  if (!isBoardGate) return null;


  const close = () => {
    setOpen(null);
    setStep(1);
    setNote('');
  };

  const confirm = async () => {
    if (!open) return;
    try {
      await submit.mutateAsync({
        project_id: need.project_id,
        need_id: need.need_id,
        command_type: open,
        target_document_id: targetDoc?.document_id ?? null,
        target_version: targetDoc?.version ?? null,
        note: open === 'REQUEST_CHANGES' ? note.trim() : note.trim() || null,
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
    <div className="mt-4 rounded-lg border border-wcm-line-strong bg-wcm-bg/40 p-3 sm:p-4">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-wcm-muted">
        <ShieldCheck className="h-3.5 w-3.5" />
        Command Surface · Board Gate
      </div>

      {syncLocked && latest && (
        <div className="mt-3 rounded-lg border border-wcm-alert/50 bg-wcm-alert/10 p-3 text-sm text-wcm-alert-fg">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span className="break-words">Approvazione non registrata</span>
          </div>
          <p className="mt-2 leading-relaxed">
            Lo stato del progetto è cambiato prima dell’esecuzione del comando. Mission Control
            deve sincronizzarsi con GitHub prima di una nuova decisione.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-wcm-alert-fg/90">
            Sincronizzazione in attesa · ultimo comando {latest.command_type} · {latest.status} ·{' '}
            {new Date(latest.created_at).toLocaleString('it-IT')}
          </p>
          {latest.expected_state_sha && (
            <p className="mt-1 break-all font-mono text-[11px] opacity-80">
              baseline attesa: {latest.expected_state_sha}
            </p>
          )}
        </div>
      )}

      {coherenceBlock && (
        <div className="mt-3 rounded-lg border border-wcm-alert/50 bg-wcm-alert/10 p-3 text-sm text-wcm-alert-fg">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span className="break-words">Autorità registrata · Blocco di coerenza</span>
          </div>
          <p className="mt-2 leading-relaxed">
            La decisione umana è stata registrata su GitHub, ma l’applicazione WCM è bloccata:
            il target del comando non è una Candidate congelabile (category=BOARD_CANDIDATE).
            Il Need resta aperto finché il target non viene corretto a monte.
          </p>
          {coherenceBlock.target_document_id && (
            <p className="mt-1 break-all font-mono text-[11px] opacity-80">
              target registrato: {coherenceBlock.target_document_id}
            </p>
          )}
        </div>
      )}

      {latest && (
        <div className="mt-3">
          <CommandState command={latest} />
        </div>
      )}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Button
          size="sm"
          disabled={commandsDisabled || !approveTarget}
          onClick={() => setOpen('APPROVE_FREEZE')}
          className="w-full sm:w-auto"
        >
          <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
          Approva + Freeze
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={commandsDisabled}
          onClick={() => setOpen('REQUEST_CHANGES')}
          className="w-full border-wcm-line-strong bg-transparent text-wcm-text hover:border-wcm-accent hover:bg-wcm-surface hover:text-wcm-strong sm:w-auto"
        >
          <MessageSquareWarning className="mr-2 h-3.5 w-3.5" />
          Richiedi modifiche
        </Button>
      </div>

      {!approveTarget && (
        <p className="mt-2 text-xs text-wcm-dim">
          {candidateDocs.length === 0
            ? 'Approva + Freeze non disponibile: nessun documento Candidate (BOARD_CANDIDATE) collegato a questo Need. Un Board Report non può essere il target dell’autorità.'
            : 'Approva + Freeze non disponibile: più documenti Candidate collegati a questo Need, target non univoco.'}
        </p>
      )}


      {syncLocked && (
        <p className="mt-2 text-xs text-wcm-dim">
          Nuovi comandi disabilitati finché il Projector non allinea Mission Control a una nuova
          baseline. Nessun reinvio automatico: sarà necessario un nuovo clic umano.
        </p>
      )}

      {active && !syncLocked && (
        <p className="mt-2 text-xs text-wcm-dim">
          Un comando è già attivo per questo need: nuovi comandi contrastanti sono disabilitati
          finché non viene risolto.
        </p>
      )}

      <Dialog open={open !== null} onOpenChange={(v) => (v ? null : close())}>
        <DialogContent className="max-w-md border-wcm-line bg-wcm-surface text-wcm-text">
          <DialogHeader>
            <DialogTitle className="text-wcm-strong">
              {open === 'APPROVE_FREEZE' ? 'Approva + Freeze' : 'Richiedi modifiche'}
            </DialogTitle>
            <DialogDescription className="text-wcm-dim">
              {need.project_id} · {need.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            {targetDoc && (
              <p className="rounded-md border border-wcm-line bg-wcm-bg/50 p-2.5">
                <span className="block font-medium text-wcm-strong">{targetDoc.title}</span>
                <span className="mt-0.5 block font-mono text-[11px] text-wcm-dim">
                  {targetDoc.document_id}
                  {targetDoc.version ? ` · v${targetDoc.version}` : ''}
                </span>
              </p>
            )}

            {open === 'REQUEST_CHANGES' ? (
              <div className="space-y-2">
                <label htmlFor="wcm-command-note" className="text-xs text-wcm-muted">
                  Nota richiesta (obbligatoria)
                </label>
                <Textarea
                  id="wcm-command-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  className="border-wcm-line-strong bg-wcm-bg text-wcm-strong"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label htmlFor="wcm-command-note-opt" className="text-xs text-wcm-muted">
                  Nota (facoltativa)
                </label>
                <Textarea
                  id="wcm-command-note-opt"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="border-wcm-line-strong bg-wcm-bg text-wcm-strong"
                />
              </div>
            )}

            {step === 2 && (
              <p className="rounded-md border border-wcm-alert/40 bg-wcm-alert/10 p-3 text-xs leading-relaxed text-wcm-alert-fg">
                Conferma definitiva. Mission Control registra soltanto l’autorità autenticata: gli
                effetti su documenti e stato sono quelli <strong>previsti dal workflow</strong> WCM
                su GitHub e non sono garantiti da questa interfaccia.
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
                disabled={open === 'REQUEST_CHANGES' && note.trim().length === 0}
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

export default WcmCommandSurface;
