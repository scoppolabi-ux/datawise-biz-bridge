import { Link } from 'react-router-dom';
import { ChevronRight, Wrench } from 'lucide-react';
import { useWcmSystemMaintenanceLog } from '@/hooks/useWcmSystemMaintenance';
import { maintenanceDateLabel } from './wcmSystemMaintenance';

const Stat = ({ label, value }: { label: string; value: string }) => (
  <span className="min-w-0">
    <span className="block text-[10px] font-semibold uppercase tracking-wider text-wcm-dim">
      {label}
    </span>
    <span className="block font-mono text-sm text-wcm-strong">{value}</span>
  </span>
);

/**
 * GLOBAL system plane entry point on Mission Control.
 * Distinct from project cards: this is the WCM system, not a project.
 */
const WcmSystemCard = () => {
  const { data, isLoading, isError } = useWcmSystemMaintenanceLog();
  const entries = data ?? [];
  const open = entries.filter((e) => (e.status ?? '') !== 'CLOSED').length;
  const last = entries[0]?.occurred_on ?? null;

  const show = (value: string) => (isLoading ? '…' : isError ? '—' : value);

  return (
    <Link
      to="/wcm/system"
      className="group block rounded-xl border border-dashed border-wcm-accent/40 bg-wcm-panel/40 p-4 transition-colors hover:border-wcm-accent hover:bg-wcm-surface/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-wcm-accent sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-wcm-accent">
            <Wrench className="h-3.5 w-3.5" />
            Piano globale di sistema
          </span>
          <h2 className="mt-1 text-base font-semibold tracking-tight text-wcm-strong">
            Sistema WCM
          </h2>
          <p className="mt-0.5 text-xs text-wcm-dim">Manutenzione e modifiche del metodo</p>
        </div>
        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-wcm-dim transition-colors group-hover:text-wcm-accent" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Voci registrate" value={show(String(entries.length))} />
        <Stat label="Non chiuse" value={show(String(open))} />
        <Stat label="Ultimo intervento" value={show(maintenanceDateLabel(last))} />
      </div>
    </Link>
  );
};

export default WcmSystemCard;
