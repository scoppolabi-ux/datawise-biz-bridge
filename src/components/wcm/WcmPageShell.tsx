import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import WcmBrandHeader from './WcmBrandHeader';

/**
 * Shared shell for the aggregated Mission Control views
 * (/wcm/projects, /wcm/needs, /wcm/documents).
 */
const WcmPageShell = ({
  title,
  count,
  actions,
  children,
}: {
  title: string;
  count?: number;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="wcm-grid min-h-screen">
    <Helmet>
      <title>{title} · WCM Mission Control</title>
      <meta name="robots" content="noindex, nofollow, noarchive" />
    </Helmet>

    <WcmBrandHeader
      eyebrow={
        <Link
          to="/wcm"
          className="inline-flex items-center gap-1.5 text-wcm-accent transition-colors hover:text-wcm-strong"
        >
          <ArrowLeft className="h-3 w-3" />
          WCM Mission Control
        </Link>
      }
      title={
        <h1 className="flex items-baseline gap-2 text-base font-semibold tracking-tight sm:text-lg">
          {title}
          {typeof count === 'number' && (
            <span className="font-mono text-sm text-wcm-dim">{count}</span>
          )}
        </h1>
      }
      actions={actions}
    />

    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
  </div>
);

export default WcmPageShell;
