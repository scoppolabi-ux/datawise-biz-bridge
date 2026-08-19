import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  useWcmActivity,
  useWcmDocuments,
  useWcmProject,
  useWcmProjectNeeds,
  useWcmRoadmap,
} from '@/hooks/useWcmProjects';
import { STATUS_LABELS, statusClasses } from '@/components/wcm/wcmFormat';
import WcmOverviewTab from '@/components/wcm/WcmOverviewTab';
import WcmDocumentsTab from '@/components/wcm/WcmDocumentsTab';
import WcmBoardTab from '@/components/wcm/WcmBoardTab';
import WcmActivityTab from '@/components/wcm/WcmActivityTab';
import WcmRoadmapTab from '@/components/wcm/WcmRoadmapTab';
import WcmKnowledgeHealthTab from '@/components/wcm/WcmKnowledgeHealthTab';
import WcmBrandHeader from '@/components/wcm/WcmBrandHeader';
import {
  useWcmKnowledgeCheckpoints,
  useWcmKnowledgeHealth,
} from '@/hooks/useWcmKnowledgeHealth';

const TABS = ['overview', 'documents', 'board', 'activity', 'roadmap', 'knowledge'];


const WcmProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const tab = tabParam && TABS.includes(tabParam) ? tabParam : 'overview';
  const openDocumentId = searchParams.get('document');
  const selectedNeedId = searchParams.get('need');

  const setTab = (next: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', next);
    if (next !== 'documents') params.delete('document');
    if (next !== 'board') params.delete('need');
    setSearchParams(params, { replace: true });
  };

  const setOpenDocumentId = (documentId: string | null) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', 'documents');
    if (documentId) params.set('document', documentId);
    else params.delete('document');
    setSearchParams(params, { replace: true });
  };

  const projectQuery = useWcmProject(projectId);
  const documentsQuery = useWcmDocuments(projectId);
  const activityQuery = useWcmActivity(projectId);
  const roadmapQuery = useWcmRoadmap(projectId);
  const needsQuery = useWcmProjectNeeds(projectId);
  const knowledgeHealthQuery = useWcmKnowledgeHealth(projectId);
  const knowledgeCheckpointsQuery = useWcmKnowledgeCheckpoints(projectId);

  const project = projectQuery.data;
  const documents = documentsQuery.data ?? [];
  const isFetching =
    projectQuery.isFetching ||
    documentsQuery.isFetching ||
    activityQuery.isFetching ||
    roadmapQuery.isFetching ||
    needsQuery.isFetching ||
    knowledgeHealthQuery.isFetching;

  const refetchAll = () => {
    projectQuery.refetch();
    documentsQuery.refetch();
    activityQuery.refetch();
    roadmapQuery.refetch();
    needsQuery.refetch();
    knowledgeHealthQuery.refetch();
    knowledgeCheckpointsQuery.refetch();
  };


  const openDocument = (documentId: string) => setOpenDocumentId(documentId);

  return (
    <div className="wcm-grid min-h-screen">
      <Helmet>
        <title>
          {project ? `${project.project_name} · WCM Mission Control` : 'WCM Mission Control'}
        </title>
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
          <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
            {project?.project_name ?? projectId}
          </h1>
        }
        actions={
          <>
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
                className="inline-flex items-center gap-1.5 rounded-md border border-wcm-line-strong px-2.5 py-1 text-xs text-wcm-text transition-colors hover:border-wcm-accent hover:bg-wcm-surface"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                GitHub
              </a>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={refetchAll}
              className="border-wcm-line-strong bg-transparent text-wcm-text hover:border-wcm-accent hover:bg-wcm-surface hover:text-wcm-strong"
            >
              <RefreshCw className={cn('mr-2 h-3.5 w-3.5', isFetching && 'animate-spin')} />
              Aggiorna
            </Button>
          </>
        }
      >
        <p className="mt-0.5 truncate font-mono text-[11px] text-wcm-dim">{projectId}</p>
        {project?.short_description && (
          <p className="mt-1 text-xs leading-relaxed text-wcm-text">{project.short_description}</p>
        )}

      </WcmBrandHeader>


      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {projectQuery.isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-wcm-dim" />
          </div>
        )}

        {projectQuery.error && (
          <p className="rounded-lg border border-wcm-alert/30 bg-wcm-alert/10 p-4 text-sm text-wcm-alert-fg">
            Impossibile caricare il progetto.
          </p>
        )}

        {!projectQuery.isLoading && !project && (
          <p className="rounded-lg border border-wcm-line bg-wcm-surface/50 p-6 text-sm text-wcm-muted">
            Progetto non trovato nel read-model.
          </p>
        )}

        {project && (() => {
          const actualToRead = documents.filter((d) => d.requires_stefano).length;
          const declared = project.documents_to_read_count ?? 0;
          if (documentsQuery.isLoading || actualToRead === declared) return null;
          return (
            <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
              <span className="font-semibold">Disallineamento read-model.</span> Il conteggio dei
              documenti da leggere dichiarato dal progetto ({declared}) non coincide con i documenti
              effettivamente marcati da leggere ({actualToRead}). Vengono mostrati i documenti
              realmente presenti; il conteggio si allineerà alla prossima sincronizzazione.
            </p>
          );
        })()}

        {project && (

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-lg border border-wcm-line bg-wcm-surface/70 p-1">
              {[
                ['overview', 'Overview'],
                ['documents', 'Documents'],
                ['board', 'Board'],
                ['activity', 'Activity'],
                ['roadmap', 'Roadmap'],
                ['knowledge', 'Knowledge'],
              ].map(([value, label]) => (

                <TabsTrigger
                  key={value}
                  value={value}
                  className="rounded-md text-xs uppercase tracking-[0.12em] text-wcm-muted transition-colors data-[state=active]:border data-[state=active]:border-wcm-accent/40 data-[state=active]:bg-wcm-panel data-[state=active]:text-wcm-strong data-[state=active]:shadow-none sm:text-[13px]"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <WcmOverviewTab
                project={project}
                roadmap={roadmapQuery.data ?? []}
                knowledgeHealth={knowledgeHealthQuery.data}
              />
            </TabsContent>
            <TabsContent value="knowledge" className="mt-4">
              <WcmKnowledgeHealthTab
                health={knowledgeHealthQuery.data}
                checkpoints={knowledgeCheckpointsQuery.data ?? []}
                isLoading={knowledgeHealthQuery.isLoading}
                hasError={Boolean(knowledgeHealthQuery.error)}
              />
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <WcmDocumentsTab
                documents={documents}
                projectId={projectId!}
                openDocumentId={openDocumentId}
                onOpenDocument={setOpenDocumentId}
              />
            </TabsContent>
            <TabsContent value="board" className="mt-4">
              <WcmBoardTab
                project={project}
                documents={documents}
                needs={needsQuery.data ?? []}
                selectedNeedId={selectedNeedId}
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
