import { ExternalLink, Loader2, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import WcmPageShell from '@/components/wcm/WcmPageShell';
import {
  maintenanceDateLabel,
  maintenanceStatusLabel,
  maintenanceStatusTone,
  manifestLink,
} from '@/components/wcm/wcmSystemMaintenance';
import { useWcmSystemMaintenanceLog } from '@/hooks/useWcmSystemMaintenance';

const TONE_CLASSES: Record<string, string> = {
  open: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  ready: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  closed: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  failed: 'border-wcm-alert/40 bg-wcm-alert/10 text-wcm-alert-fg',
  unknown: 'border-wcm-line-strong bg-wcm-panel/60 text-wcm-text',
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="min-w-0">
    <span className="block text-[10px] font-semibold uppercase tracking-wider text-wcm-dim">
      {label}
    </span>
    <span className="mt-0.5 block break-words text-xs text-wcm-text">{children}</span>
  </div>
);

/**
 * "Sistema WCM" — global maintenance plane. Read-only projection of
 * `wcm/runtime/WCM_MAINTENANCE_LOG.json`; unrelated to Project Activity.
 */
const WcmSystemPage = () => {
  const { data, isLoading, error } = useWcmSystemMaintenanceLog();
  const entries = data ?? [];

  return (
    <WcmPageShell title="Sistema WCM" count={entries.length}>
      <section>
        <header className="mb-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-wcm-strong">
            <Wrench className="h-4 w-4 text-wcm-accent" />
            Registro manutenzione
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-wcm-muted">
            Manutenzione e modifiche del metodo WCM, in ordine dal più recente. La fonte
            autorevole resta GitHub: questa vista è di sola lettura.
          </p>
        </header>

        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-wcm-dim" />
          </div>
        )}

        {error && (
          <p className="rounded-lg border border-wcm-alert/30 bg-wcm-alert/10 p-4 text-sm text-wcm-alert-fg">
            Impossibile caricare il registro di manutenzione.
          </p>
        )}

        {!isLoading && !error && entries.length === 0 && (
          <p className="rounded-lg border border-wcm-line bg-wcm-surface/50 p-6 text-sm text-wcm-muted">
            Nessuna voce di manutenzione registrata.
          </p>
        )}

        <ul className="space-y-3">
          {entries.map((entry) => {
            const link = manifestLink(entry.manifest_path);
            return (
              <li
                key={entry.id}
                className="rounded-xl border border-wcm-line bg-wcm-surface/60 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] text-wcm-dim">
                      {maintenanceDateLabel(entry.occurred_on)}
                      {entry.event_type && <span className="ml-2">{entry.event_type}</span>}
                    </p>
                    <h3 className="mt-0.5 break-words text-sm font-semibold leading-snug text-wcm-strong">
                      {entry.title}
                    </h3>
                  </div>
                  <span
                    title={entry.status ?? undefined}
                    className={cn(
                      'shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-medium',
                      TONE_CLASSES[maintenanceStatusTone(entry.status)],
                    )}
                  >
                    {maintenanceStatusLabel(entry.status)}
                  </span>
                </div>

                {entry.description && (
                  <p className="mt-2 text-xs leading-relaxed text-wcm-muted">{entry.description}</p>
                )}

                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Field label="Change ID">
                    <span className="font-mono text-[11px]">{entry.event_id}</span>
                  </Field>
                  <Field label="Stato">
                    <span className="font-mono text-[11px]">{entry.status ?? '—'}</span>
                  </Field>
                  <Field label="Autorità">{entry.authority ?? '—'}</Field>
                  <Field label="Esito / chiusura">
                    {maintenanceStatusLabel(entry.status)}
                  </Field>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {entry.technical_label && (
                    <span className="rounded-md border border-wcm-line-strong bg-wcm-bg/50 px-2 py-0.5 font-mono text-[11px] text-wcm-text">
                      {entry.technical_label}
                    </span>
                  )}
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-wcm-accent hover:text-wcm-strong"
                    >
                      Dettagli / Manifest
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-wcm-dim">Manifest non disponibile</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </WcmPageShell>
  );
};

export default WcmSystemPage;
