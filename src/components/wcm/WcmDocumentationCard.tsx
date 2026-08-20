import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';
import { useWcmDocumentationManifest } from '@/hooks/useWcmDocumentation';

const Stat = ({ label, value }: { label: string; value: string }) => (
  <span className="min-w-0">
    <span className="block text-[10px] font-semibold uppercase tracking-wider text-wcm-dim">
      {label}
    </span>
    <span className="block font-mono text-sm text-wcm-strong">{value}</span>
  </span>
);

/**
 * GLOBAL documentation plane entry point on Mission Control.
 * Read-only, visually distinct from project cards.
 */
const WcmDocumentationCard = () => {
  const { data: manifest, isLoading, isError } = useWcmDocumentationManifest();
  const documents = manifest?.documents ?? [];
  const passed = documents.filter((d) => d.qa_status === 'BUILD_PASS').length;

  const releaseDate = manifest?.generated_at
    ? new Date(manifest.generated_at).toLocaleDateString('it-IT')
    : '—';

  return (
    <Link
      to="/wcm/documentation"
      className="group block rounded-xl border border-dashed border-wcm-accent/40 bg-wcm-panel/40 p-4 transition-colors hover:border-wcm-accent hover:bg-wcm-surface/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-wcm-accent sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-wcm-accent">
            <BookOpen className="h-3.5 w-3.5" />
            Piano globale della documentazione
          </span>
          <h2 className="mt-1 text-base font-semibold tracking-tight text-wcm-strong">
            Documentazione WCM
          </h2>
          <p className="mt-0.5 text-xs text-wcm-dim">
            Master correnti consultabili e scaricabili in Word e PDF
          </p>
        </div>
        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-wcm-dim transition-colors group-hover:text-wcm-accent" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat
          label="Documenti"
          value={isLoading ? '…' : isError ? '—' : String(documents.length)}
        />
        <Stat label="Release QA" value={isLoading ? '…' : isError ? '—' : `${passed}/${documents.length}`} />
        <Stat label="Ultima release" value={isLoading ? '…' : releaseDate} />
      </div>

      {isError && (
        <p className="mt-3 text-xs text-wcm-muted">
          Nessuna release pubblicata: la pipeline di rilascio non ha ancora generato gli artefatti.
        </p>
      )}
    </Link>
  );
};

export default WcmDocumentationCard;
