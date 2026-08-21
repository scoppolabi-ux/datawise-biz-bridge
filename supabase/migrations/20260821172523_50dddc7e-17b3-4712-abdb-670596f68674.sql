CREATE TABLE public.wcm_project_execution_workflows (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id text NOT NULL,
  workflow_instance_id text NOT NULL,
  workflow text NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE',
  authority_refs jsonb NOT NULL DEFAULT '[]'::jsonb,
  scope text,
  last_completed_transition text,
  next_transition text,
  true_stop_condition text NOT NULL,
  started_at timestamp with time zone,
  last_checkpoint_at timestamp with time zone,
  resume_required boolean NOT NULL DEFAULT false,
  interruption_type text,
  interruption_reason text,
  interruption_evidence jsonb NOT NULL DEFAULT '[]'::jsonb,
  completed_step_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  completion_gate jsonb,
  source_path text,
  source_sha text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT wcm_project_execution_workflows_unique UNIQUE (project_id, workflow_instance_id),
  CONSTRAINT wcm_project_execution_workflows_status_check CHECK (status IN ('ACTIVE','INTERRUPTED_RESUMABLE','WAITING_AUTHORITY','BLOCKED','COMPLETED','CANCELLED'))
);

GRANT SELECT ON public.wcm_project_execution_workflows TO authenticated;
GRANT ALL ON public.wcm_project_execution_workflows TO service_role;

ALTER TABLE public.wcm_project_execution_workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and admins can read WCM execution workflows"
ON public.wcm_project_execution_workflows
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_wcm_project_execution_workflows_updated_at
BEFORE UPDATE ON public.wcm_project_execution_workflows
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_wcm_execution_workflows_project ON public.wcm_project_execution_workflows (project_id);