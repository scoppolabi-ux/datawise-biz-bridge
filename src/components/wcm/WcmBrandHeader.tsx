import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useWcmSession } from './WcmAuthGate';

const LOGO_SRC = '/lovable-uploads/1eabf32b-5b7b-4f4f-a577-b132f69da638.png';

/**
 * DataWisePartners console header.
 * The brand logo sits on a light contrast plate so the original asset
 * stays legible on the dark console background without being altered.
 */
const WcmBrandHeader = ({
  eyebrow,
  title,
  actions,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  const auth = useWcmSession();

  return (
  <header className="sticky top-0 z-20 border-b border-wcm-line bg-wcm-bg/95 backdrop-blur">
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <Link
          to="/wcm"
          aria-label="WCM Mission Control — DataWisePartners"
          className="wcm-logo-plate shrink-0 rounded-md px-3 py-2.5 transition-colors hover:border-wcm-accent"
        >
          {/* The source asset is a white mark on a large transparent square:
              the wrapper crops it to the mark's bounding box, unaltered. */}
          <span className="relative block h-[30px] w-[105px] overflow-hidden">
            <img
              src={LOGO_SRC}
              alt="DataWisePartners"
              className="absolute max-w-none"
              style={{ width: 132, left: -13.5, top: -50.4 }}
            />
          </span>
        </Link>
        <div className="min-w-0">
          {eyebrow && (
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-wcm-accent">
              {eyebrow}
            </div>
          )}
          <div className="truncate text-base font-semibold tracking-tight text-wcm-strong sm:text-lg">
            {title}
          </div>
          {children}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {actions}
        {auth?.user && (
          <div className="flex min-w-0 items-center gap-2 rounded-md border border-wcm-line-strong px-2.5 py-1">
            <span className="min-w-0 truncate text-[11px] text-wcm-dim">
              {auth.user.email}
              {auth.role ? ` · ${auth.role}` : ''}
            </span>
            <button
              type="button"
              onClick={() => auth.signOut()}
              title="Esci"
              className="shrink-0 text-wcm-dim transition-colors hover:text-wcm-accent"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="sr-only">Esci</span>
            </button>
          </div>
        )}
      </div>
    </div>
    <div className="wcm-rule" />
  </header>
  );
};

export default WcmBrandHeader;
