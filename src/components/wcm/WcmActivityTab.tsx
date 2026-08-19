import type { WcmProjectActivity } from '@/hooks/useWcmProjects';
import { formatDateTime, relativeTime } from './wcmFormat';

const WcmActivityTab = ({ events }: { events: WcmProjectActivity[] }) => {
  if (events.length === 0) {
    return (
      <p className="rounded-xl border border-wcm-line bg-wcm-surface/60 p-6 text-sm text-wcm-muted">
        Nessun evento materiale registrato finora nello storico del progetto.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="rounded-lg border border-wcm-line bg-wcm-surface/40 p-3 text-xs leading-relaxed text-wcm-muted">
        Storico cumulativo: gli eventi restano registrati in modo permanente e non vengono rimossi
        dalle sincronizzazioni successive. Ordinamento dal più recente al più remoto.
      </p>
      <ol className="relative space-y-4 border-l border-wcm-line pl-6">

      {events.map((event) => (
        <li key={event.id} className="relative">
          <span className="absolute -left-[27px] top-2 h-2.5 w-2.5 rounded-full border-2 border-wcm-bg bg-wcm-accent" />
          <div className="rounded-xl border border-wcm-line bg-wcm-surface/60 p-4">
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-wcm-dim">
              <span>{formatDateTime(event.occurred_at)}</span>
              {relativeTime(event.occurred_at) && <span>· {relativeTime(event.occurred_at)}</span>}
              {event.event_type && (
                <span className="rounded border border-wcm-line-strong bg-wcm-panel/60 px-1.5 py-0.5 font-mono text-[10px] text-wcm-text">
                  {event.event_type}
                </span>
              )}
            </div>
            <h3 className="mt-2 text-sm font-medium text-wcm-strong">{event.title}</h3>
            {event.description && (
              <p className="mt-1 text-sm leading-relaxed text-wcm-muted">{event.description}</p>
            )}
            {event.source_path && (
              <p className="mt-2 truncate font-mono text-[11px] text-wcm-dim">
                {event.source_path}
                {event.source_sha ? ` @ ${event.source_sha.slice(0, 10)}` : ''}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
};

export default WcmActivityTab;
