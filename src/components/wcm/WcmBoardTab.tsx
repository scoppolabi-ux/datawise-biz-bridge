import { AlertTriangle, FileText, Gavel, ScrollText } from 'lucide-react';
import { cn } from '@/lib/utils';
import WcmCommandSurface from './WcmCommandSurface';
import { isOpenNeed } from '@/hooks/useWcmProjects';
import type {
  WcmProjectDocument,
  WcmProjectNeed,
  WcmProjectStatus,
} from '@/hooks/useWcmProjects';

const Block = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-xl border border-wcm-line bg-wcm-surface/60 p-4 sm:p-6">
    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-wcm-muted">
      <Icon className="h-3.5 w-3.5" />
      {title}
    </div>
    <div className="mt-3 text-sm leading-relaxed text-wcm-text">{children}</div>
  </section>
);

const NeedCard = ({
  need,
  documents,
  onOpenDocument,
  focused,
}: {
  need: WcmProjectNeed;
  documents: WcmProjectDocument[];
  onOpenDocument: (documentId: string) => void;
  focused?: boolean;
}) => {
  const related = (need.related_document_ids ?? [])
    .map((id) => documents.find((d) => d.document_id === id))
    .filter(Boolean) as WcmProjectDocument[];

  return (
    <section
      className={cn(
        'rounded-xl border p-4 sm:p-6',
        focused
          ? 'border-wcm-alert/50 bg-wcm-alert/15'
          : 'border-wcm-line bg-wcm-surface/60',
      )}
    >
      {focused && (
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-wcm-alert-fg">
          Need selezionato
        </p>
      )}
      <div className="mt-1 flex flex-wrap items-center gap-2">
        {need.need_type && (
          <span className="rounded-md border border-wcm-line-strong bg-wcm-bg/50 px-2 py-0.5 font-mono text-[11px] text-wcm-text">
            {need.need_type}
          </span>
        )}
        {need.status && (
          <span className="rounded-md border border-wcm-line-strong bg-wcm-bg/50 px-2 py-0.5 font-mono text-[11px] text-wcm-text">
            {need.status}
          </span>
        )}
      </div>
      <h3 className="mt-2 text-base font-semibold text-wcm-strong">{need.title}</h3>
      {need.action_requested && (
        <p className="mt-2 text-sm leading-relaxed text-wcm-alert-fg">{need.action_requested}</p>
      )}
      {need.reason && (
        <p className="mt-1.5 text-sm leading-relaxed text-wcm-muted">{need.reason}</p>
      )}
      <WcmCommandSurface need={need} documents={documents} />
      {related.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {related.map((doc) => (
            <li key={doc.id}>
              <button
                type="button"
                onClick={() => onOpenDocument(doc.document_id)}
                className="flex w-full items-start gap-2 rounded-lg border border-wcm-line bg-wcm-bg/40 p-2.5 text-left transition-colors hover:border-wcm-accent/50"
              >
                <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-wcm-dim" />
                <span className="min-w-0 text-sm text-wcm-text">{doc.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

const WcmBoardTab = ({
  project,
  documents,
  needs = [],
  selectedNeedId,
  onOpenDocument,
}: {
  project: WcmProjectStatus;
  documents: WcmProjectDocument[];
  needs?: WcmProjectNeed[];
  selectedNeedId?: string | null;
  onOpenDocument: (documentId: string) => void;
}) => {
  const toRead = documents.filter((d) => d.requires_stefano);
  const openNeeds = needs.filter(isOpenNeed);
  const selectedNeed = selectedNeedId
    ? openNeeds.find((n) => n.need_id === selectedNeedId) ?? null
    : null;
  const otherNeeds = openNeeds.filter((n) => n.need_id !== selectedNeed?.need_id);

  if (!project.needs_stefano && openNeeds.length === 0) {
    return (
      <p className="rounded-xl border border-wcm-line bg-wcm-surface/60 p-6 text-sm text-wcm-muted">
        Nessun Board Gate aperto: il progetto non richiede al momento una decisione di Stefano.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {selectedNeed && (
        <NeedCard
          need={selectedNeed}
          documents={documents}
          onOpenDocument={onOpenDocument}
          focused
        />
      )}
      {otherNeeds.map((need) => (
        <NeedCard
          key={need.id}
          need={need}
          documents={documents}
          onOpenDocument={onOpenDocument}
        />
      ))}

      <section className="rounded-xl border border-wcm-alert/30 bg-wcm-alert/10 p-4 sm:p-6">
        <div className="flex items-center gap-2 text-wcm-alert-fg">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <h2 className="text-sm font-bold uppercase tracking-[0.18em]">
            Needs Stefano — Board Package
          </h2>
        </div>
        {project.board_gate_action_requested && (
          <p className="mt-3 text-base font-medium leading-relaxed text-wcm-strong">
            {project.board_gate_action_requested}
          </p>
        )}
        {project.board_gate_reason && (
          <p className="mt-3 text-sm leading-relaxed text-wcm-alert-fg/80">
            {project.board_gate_reason}
          </p>
        )}
      </section>

      <section className="overflow-hidden rounded-xl border border-wcm-line bg-wcm-surface/60">
        <h3 className="flex items-center justify-between border-b border-wcm-line px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-wcm-muted">
          Documenti da leggere
          <span className="font-mono text-wcm-dim">{toRead.length}</span>
        </h3>
        {toRead.length === 0 ? (
          <p className="p-4 text-sm text-wcm-muted">
            Nessun documento marcato come da leggere nel read-model.
          </p>
        ) : (
          <ul>
            {toRead.map((doc) => (
              <li key={doc.id} className="border-b border-wcm-line/70 last:border-0">
                <button
                  type="button"
                  onClick={() => onOpenDocument(doc.document_id)}
                  className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-wcm-panel/40"
                >
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-wcm-dim" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-wcm-strong">{doc.title}</span>
                    <span className="mt-1 block truncate font-mono text-[11px] text-wcm-dim">
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
        <Block icon={ScrollText} title="Sintesi della review">
          {project.board_review_summary}
        </Block>
      )}

      <p className="px-1 text-xs text-wcm-dim">
        Mission Control è read-only: le decisioni di board restano su GitHub, source of truth.
      </p>
    </div>
  );
};

export default WcmBoardTab;
