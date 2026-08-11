import { Helmet } from 'react-helmet-async';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWcmProjects } from '@/hooks/useWcmProjects';
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
  const { data: projects, isLoading, isFetching, error, refetch } = useWcmProjects(true);

  return (
    <Shell>
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-100">
              WCM Mission Control
            </h1>
            <p className="mt-1 text-xs text-slate-500">Stato operativo progetti</p>
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
