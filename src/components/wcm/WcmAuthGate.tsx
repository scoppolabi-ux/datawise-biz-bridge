import { createContext, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWcmAuth, type WcmAuthState } from '@/hooks/useWcmAuth';
import WcmLogin from './WcmLogin';
import WcmSetPassword from './WcmSetPassword';

const WcmAuthContext = createContext<WcmAuthState | null>(null);

export const useWcmSession = () => useContext(WcmAuthContext);

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="wcm-grid flex min-h-screen items-center justify-center px-4">
    <Helmet>
      <title>WCM Mission Control · DataWisePartners</title>
      <meta name="robots" content="noindex, nofollow, noarchive" />
    </Helmet>
    {children}
  </div>
);

/**
 * Route guard for every /wcm route. Unauthenticated visitors never see
 * read-model content; RLS enforces the same boundary server-side.
 * The requested URL is preserved because the gate renders in place.
 */
const WcmAuthGate = ({ children }: { children: React.ReactNode }) => {
  const auth = useWcmAuth();
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    const hash = window.location.hash ?? '';
    if (hash.includes('type=recovery') || hash.includes('type=invite')) setRecovery(true);
  }, []);

  if (auth.loading || (auth.session && !auth.roleChecked)) {
    return (
      <Frame>
        <Loader2 className="h-6 w-6 animate-spin text-wcm-dim" />
      </Frame>
    );
  }

  if (!auth.session) {
    return (
      <>
        <Helmet>
          <title>Accesso · WCM Mission Control</title>
          <meta name="robots" content="noindex, nofollow, noarchive" />
        </Helmet>
        <WcmLogin />
      </>
    );
  }

  if (recovery) {
    return (
      <WcmSetPassword
        onDone={() => {
          setRecovery(false);
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }}
      />
    );
  }

  if (!auth.isAuthorized) {
    return (
      <Frame>
        <div className="w-full max-w-md rounded-xl border border-wcm-alert/40 bg-wcm-alert/10 p-6 text-center">
          <ShieldAlert className="mx-auto h-6 w-6 text-wcm-alert-fg" />
          <h1 className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-wcm-alert-fg">
            Accesso non autorizzato
          </h1>
          <p className="mt-2 text-sm text-wcm-muted">
            L’account {auth.user?.email} non ha un ruolo owner o admin su Mission Control.
          </p>
          <Button variant="outline" className="mt-5" onClick={() => auth.signOut()}>
            Esci
          </Button>
        </div>
      </Frame>
    );
  }

  return <WcmAuthContext.Provider value={auth}>{children}</WcmAuthContext.Provider>;
};

export default WcmAuthGate;
