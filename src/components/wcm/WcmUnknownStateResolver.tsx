import { useState } from 'react';
import { HelpCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useCanonicalState, useSubmitStateDecision } from '@/hooks/useWcmStateMappings';
import {
  CANONICAL_EFFECTS,
  CANONICAL_LABELS,
  CANONICAL_STATES,
  suggestCanonicalState,
  type CanonicalState,
} from './wcmCanonicalState';

type Doc = { category: string | null; status: string | null; title?: string };

/**
 * Resolver mostrato SOLO quando la coppia category+status non è mappata.
 * L'euristica produce una proposta; l'applicazione richiede una scelta di Stefano.
 * Una proposta di nuovo stato resta PENDING e non crea alcuna categoria canonica.
 */
const WcmUnknownStateResolver = ({ doc }: { doc: Doc }) => {
  const state = useCanonicalState(doc);
  const submit = useSubmitStateDecision();
  const suggestion = suggestCanonicalState(doc);

  const [choice, setChoice] = useState<CanonicalState | ''>(suggestion?.state ?? '');
  const [proposal, setProposal] = useState('');
  const [note, setNote] = useState('');

  if (state !== 'UNKNOWN') return null;

  const apply = async (kind: 'MAP' | 'PROPOSE') => {
    try {
      if (kind === 'MAP') {
        if (!choice) return;
        await submit.mutateAsync({
          kind: 'MAP',
          category: doc.category,
          status: doc.status,
          canonical_state: choice,
          reason: note.trim() || suggestion?.reason || 'Decisione manuale di Stefano.',
          confidence: choice === suggestion?.state ? (suggestion?.confidence ?? null) : 'HUMAN',
        });
        toast({
          title: 'Mapping registrato',
          description: `${doc.category ?? '—'} | ${doc.status ?? '—'} → ${choice}`,
        });
      } else {
        if (!proposal.trim()) return;
        await submit.mutateAsync({
          kind: 'PROPOSE',
          category: doc.category,
          status: doc.status,
          proposed_state: proposal,
          reason: note.trim() || 'Proposta di nuovo stato canonico.',
        });
        toast({
          title: 'Proposta registrata (PENDING)',
          description: 'Nessuno stato canonico è stato creato: serve approvazione esplicita.',
        });
      }
    } catch (e) {
      toast({
        title: 'Decisione non registrata',
        description: e instanceof Error ? e.message : 'Errore sconosciuto',
      });
    }
  };

  return (
    <div className="mt-3 rounded-lg border border-wcm-line-strong bg-wcm-bg/40 p-3 text-sm sm:p-4">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-wcm-muted">
        <HelpCircle className="h-3.5 w-3.5" />
        Stato da classificare
      </div>

      <p className="mt-2 font-mono text-[11px] text-wcm-dim">
        category: {doc.category ?? '—'} · status: {doc.status ?? '—'}
      </p>
      <p className="mt-2 leading-relaxed text-wcm-text">
        Questa coppia non è mappata a nessuno stato canonico. Le azioni di autorità su questo
        oggetto sono bloccate; il resto di Mission Control resta operativo.
      </p>

      {suggestion && (
        <div className="mt-3 rounded-md border border-wcm-line bg-wcm-surface/60 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-wcm-dim">
            Proposta · confidenza {suggestion.confidence}
          </p>
          <p className="mt-1 font-medium text-wcm-strong">
            {suggestion.state} — {CANONICAL_LABELS[suggestion.state]}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-wcm-muted">{suggestion.reason}</p>
          <p className="mt-1 text-xs leading-relaxed text-wcm-muted">
            Effetto: {CANONICAL_EFFECTS[suggestion.state]}
          </p>
        </div>
      )}

      <div className="mt-3 space-y-2">
        <label htmlFor="wcm-state-choice" className="text-xs text-wcm-muted">
          Stato canonico da applicare
        </label>
        <select
          id="wcm-state-choice"
          value={choice}
          onChange={(e) => setChoice(e.target.value as CanonicalState | '')}
          className="w-full rounded-md border border-wcm-line-strong bg-wcm-bg px-2 py-2 text-sm text-wcm-strong"
        >
          <option value="">— seleziona —</option>
          {CANONICAL_STATES.map((s) => (
            <option key={s} value={s}>
              {s} — {CANONICAL_LABELS[s]}
            </option>
          ))}
        </select>
        {choice && (
          <p className="text-xs leading-relaxed text-wcm-muted">
            Effetto: {CANONICAL_EFFECTS[choice]}
          </p>
        )}

        <label htmlFor="wcm-state-note" className="block text-xs text-wcm-muted">
          Motivo (facoltativo)
        </label>
        <Textarea
          id="wcm-state-note"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border-wcm-line-strong bg-wcm-bg text-wcm-strong"
        />

        <Button
          size="sm"
          disabled={!choice || submit.isPending}
          onClick={() => apply('MAP')}
          className="w-full sm:w-auto"
        >
          {submit.isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
          {choice && choice === suggestion?.state ? 'Conferma proposta' : 'Applica stato scelto'}
        </Button>
      </div>

      <div className="mt-4 border-t border-wcm-line pt-3">
        <label htmlFor="wcm-state-proposal" className="text-xs text-wcm-muted">
          Proponi un nuovo stato canonico (resta PENDING, non viene attivato)
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Input
            id="wcm-state-proposal"
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            placeholder="ES. ARCHIVED_REFERENCE"
            className="border-wcm-line-strong bg-wcm-bg text-wcm-strong"
          />
          <Button
            size="sm"
            variant="outline"
            disabled={!proposal.trim() || submit.isPending}
            onClick={() => apply('PROPOSE')}
            className="border-wcm-line-strong bg-transparent text-wcm-text hover:border-wcm-accent hover:bg-wcm-surface hover:text-wcm-strong sm:w-auto"
          >
            Invia proposta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WcmUnknownStateResolver;
