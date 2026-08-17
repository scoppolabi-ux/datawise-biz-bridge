import type { WcmProjectActivity } from '@/hooks/useWcmProjects';
import { formatDateTime, relativeTime } from './wcmFormat';

const WcmActivityTab = ({ events }: { events: WcmProjectActivity[] }) => {
  if (events.length === 0) {
    return (
      <p className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">
        Nessun evento materiale registrato.
      </p>
    );
  }

  return (
    <ol className="relative space-y-4 border-l border-slate-800 pl-6">
      {events.map((event) => (
        <li key={event.id} className="relative">
          <span className="absolute -left-[27px] top-2 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-slate-600" />
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span>{formatDateTime(event.occurred_at)}</span>
              {relativeTime(event.occurred_at) && <span>· {relativeTime(event.occurred_at)}</span>}
              {event.event_type && (
                <span className="rounded border border-slate-700 bg-slate-800/60 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
                  {event.event_type}
                </span>
              )}
            </div>
            <h3 className="mt-2 text-sm font-medium text-slate-100">{event.title}</h3>
            {event.description && (
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{event.description}</p>
            )}
            {event.source_path && (
              <p className="mt-2 truncate font-mono text-[11px] text-slate-600">
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
