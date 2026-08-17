import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  useWcmActivity,
  useWcmDocuments,
  useWcmProject,
  useWcmRoadmap,
} from '@/hooks/useWcmProjects';
import { STATUS_LABELS, statusClasses } from '@/components/wcm/wcmFormat';
import WcmOverviewTab from '@/components/wcm/WcmOverviewTab';
import WcmDocumentsTab from '@/components/wcm/WcmDocumentsTab';
import WcmBoardTab from '@/components/wcm/WcmBoardTab';
import WcmActivityTab from '@/components/wcm/WcmActivityTab';
import WcmRoadmapTab from '@/components/wcm/WcmRoadmapTab';

const WcmProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [tab, setTab] = useState('overview');
  const [openDocumentId, setOpenDocumentId] = useState<string | null>(null);

  const projectQuery = useWcmProject(projectId);
  const documentsQuery = useWcmDocuments(projectId);
  const activityQuery = useWcmActivity(projectId);
  const roadmapQuery = useWcmRoadmap(projectId);

  const project = projectQuery.data;
  const documents = documentsQuery.data ?? [];
  const isFetching =
    projectQuery.isFetching ||
    documentsQuery.isFetching ||
    activityQuery.isFetching ||
    roadmapQuery.isFetching;

  const refetchAll = () => {
    projectQuery.refetch();
    documentsQuery.refetch();
    activityQuery.refetch();
    roadmapQuery.refetch();
  };

  const openDocument = (documentId: string) => {
    setOpenDocumentId(documentId);
    setTab('documents');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Helmet>
        <title>{project ? `${project.project_name} · WCM` : 'WCM Mission Control'}</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>

      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0">
            <Link
              to="/wcm"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-slate-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Mission Control
            </Link>
            <h1 className="mt-1 truncate text-base font-semibold text-slate-100 sm:text-lg">
              {project?.project_name ?? projectId}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {project && (
              <span
                className={cn(
                  'rounded-md border px-2.5 py-1 text-xs font-medium',
                  statusClasses(project.status),
                )}
              >
                {STATUS_LABELS[project.status] ?? project.status}
              </span>
            )}
            {project?.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-300 transition-colors hover:bg-slate-900"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                GitHub
              </a>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={refetchAll}
              className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-900 hover:text-slate-100"
            >
              <RefreshCw className={cn('mr-2 h-3.5 w-3.5', isFetching && 'animate-spin')} />
              Aggiorna
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {projectQuery.isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
          </div>
        )}

        {projectQuery.error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            Impossibile caricare il progetto.
          </p>
        )}

        {!projectQuery.isLoading && !project && (
          <p className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 text-sm text-slate-400">
            Progetto non trovato nel read-model.
          </p>
        )}

        {project && (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-slate-900/60 p-1">
              {[
                ['overview', 'Overview'],
                ['documents', 'Documents'],
                ['board', 'Board'],
                ['activity', 'Activity'],
                ['roadmap', 'Roadmap'],
              ].map(([value, label]) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="text-xs text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100 sm:text-sm"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <WcmOverviewTab project={project} roadmap={roadmapQuery.data ?? []} />
            </TabsContent>
            <TabsContent value="documents" className="mt-4">
              <WcmDocumentsTab
                documents={documents}
                openDocumentId={openDocumentId}
                onOpenDocument={setOpenDocumentId}
              />
            </TabsContent>
            <TabsContent value="board" className="mt-4">
              <WcmBoardTab
                project={project}
                documents={documents}
                onOpenDocument={openDocument}
              />
            </TabsContent>
            <TabsContent value="activity" className="mt-4">
              <WcmActivityTab events={activityQuery.data ?? []} />
            </TabsContent>
            <TabsContent value="roadmap" className="mt-4">
              <WcmRoadmapTab
                items={roadmapQuery.data ?? []}
                documents={documents}
                onOpenDocument={openDocument}
              />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default WcmProjectDetail;
