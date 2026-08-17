import { Link } from 'react-router-dom';

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
}) => (
  <header className="sticky top-0 z-20 border-b border-wcm-line bg-wcm-bg/95 backdrop-blur">
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <Link
          to="/wcm"
          aria-label="WCM Mission Control — DataWisePartners"
          className="wcm-logo-plate shrink-0 rounded-md px-2.5 py-2 transition-colors hover:border-wcm-accent"
        >
          <img src={LOGO_SRC} alt="DataWisePartners" className="h-7 w-auto sm:h-8" />
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
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
    <div className="wcm-rule" />
  </header>
);

export default WcmBrandHeader;
