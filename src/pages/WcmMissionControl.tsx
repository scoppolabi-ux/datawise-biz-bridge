import { Helmet } from 'react-helmet-async';
import { Loader2, LogOut, RefreshCw, ShieldAlert } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useWcmAuth } from '@/hooks/useWcmAuth';
import { useWcmProjects } from '@/hooks/useWcmProjects';
import WcmLogin from '@/components/wcm/WcmLogin';
import WcmProjectCard from '@/components/wcm/WcmProjectCard';

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-slate-950">
    <Helmet>
      <title>WCM Mission Control</title>
      <meta name="robots" content="noindex, nofollow, noarchive" />
    </Helmet>
    {children}
  </div>
);

const WcmMissionControl = () => {
  const { loading, user, isAuthorized, roleChecked } = useWcmAuth();
  const { data: projects, isLoading, isFetching, error, refetch } = useWcmProjects(isAuthorized);

  if (loading || (user && !roleChecked)) {
    return (
      <Shell>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
        </div>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <WcmLogin />
      </Shell>
    );
  }

  if (!isAuthorized) {
    return (
      <Shell>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <ShieldAlert className="h-8 w-8 text-amber-400" />
          <p className="max-w-sm text-sm text-slate-300">
            Il tuo account non è autorizzato ad accedere al Mission Control.
          </p>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>
            Esci
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-100">
              WCM Mission Control
            </h1>
            <p className="mt-1 text-xs text-slate-500">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-900 hover:text-slate-100"
            >
              <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
              Aggiorna
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => supabase.auth.signOut()}
              className="text-slate-400 hover:bg-slate-900 hover:text-slate-100"
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Esci
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
          </div>
        )}

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            Impossibile caricare lo stato dei progetti.
          </p>
        )}

        {projects && projects.length === 0 && (
          <p className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 text-sm text-slate-400">
            Nessun progetto WCM registrato.
          </p>
        )}

        <div className="space-y-6">
          {projects?.map((project) => (
            <WcmProjectCard key={project.id} project={project} />
          ))}
        </div>
      </main>
    </Shell>
  );
};

export default WcmMissionControl;
