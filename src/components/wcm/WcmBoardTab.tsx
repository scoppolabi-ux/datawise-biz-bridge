import { AlertTriangle, FileText, Gavel, ScrollText } from 'lucide-react';
import type { WcmProjectDocument, WcmProjectStatus } from '@/hooks/useWcmProjects';

const Block = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6">
    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
      <Icon className="h-3.5 w-3.5" />
      {title}
    </div>
    <div className="mt-3 text-sm leading-relaxed text-slate-300">{children}</div>
  </section>
);

const WcmBoardTab = ({
  project,
  documents,
  onOpenDocument,
}: {
  project: WcmProjectStatus;
  documents: WcmProjectDocument[];
  onOpenDocument: (documentId: string) => void;
}) => {
  const toRead = documents.filter((d) => d.requires_stefano);

  if (!project.needs_stefano) {
    return (
      <p className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">
        Nessun Board Gate aperto: il progetto non richiede al momento una decisione di Stefano.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 sm:p-6">
        <div className="flex items-center gap-2 text-red-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <h2 className="text-sm font-bold uppercase tracking-[0.18em]">
            Needs Stefano — Board Package
          </h2>
        </div>
        {project.board_gate_action_requested && (
          <p className="mt-3 text-base font-medium leading-relaxed text-red-50">
            {project.board_gate_action_requested}
          </p>
        )}
        {project.board_gate_reason && (
          <p className="mt-3 text-sm leading-relaxed text-red-200/80">
            {project.board_gate_reason}
          </p>
        )}
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <h3 className="flex items-center justify-between border-b border-slate-800 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Documenti da leggere
          <span className="font-mono text-slate-600">{toRead.length}</span>
        </h3>
        {toRead.length === 0 ? (
          <p className="p-4 text-sm text-slate-400">
            Nessun documento marcato come da leggere nel read-model.
          </p>
        ) : (
          <ul>
            {toRead.map((doc) => (
              <li key={doc.id} className="border-b border-slate-800/70 last:border-0">
                <button
                  type="button"
                  onClick={() => onOpenDocument(doc.document_id)}
                  className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-slate-800/40"
                >
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-slate-100">{doc.title}</span>
                    <span className="mt-1 block truncate font-mono text-[11px] text-slate-500">
                      {[doc.category, doc.status, doc.version && `v${doc.version}`]
                        .filter(Boolean)
                        .join(' · ') || doc.document_id}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {project.board_verdict && (
        <Block icon={Gavel} title="Verdict / sintesi">
          {project.board_verdict}
        </Block>
      )}
      {project.board_narrative_mass && (
        <Block icon={ScrollText} title="Narrative Mass">
          {project.board_narrative_mass}
        </Block>
      )}
      {project.board_review_summary && (
        <Block icon={ScrollText} title="Review summary">
          {project.board_review_summary}
        </Block>
      )}

      <p className="px-1 text-xs text-slate-600">
        Mission Control è read-only: le decisioni di board restano su GitHub, source of truth.
      </p>
    </div>
  );
};

export default WcmBoardTab;
