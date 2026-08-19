CREATE TABLE public.wcm_project_knowledge_health (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL UNIQUE,
  health_status text NOT NULL DEFAULT 'UNKNOWN',
  knowledge_integrity_score integer,
  score_method text,
  checked_at timestamptz,
  last_reconciliation_at timestamptz,
  last_material_delta_at timestamptz,
  components jsonb NOT NULL DEFAULT '{}'::jsonb,
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  issues jsonb NOT NULL DEFAULT '[]'::jsonb,
  checkpoint jsonb,
  source_path text,
  source_sha text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.wcm_project_knowledge_health TO authenticated;
GRANT ALL ON public.wcm_project_knowledge_health TO service_role;

ALTER TABLE public.wcm_project_knowledge_health ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and admins can read WCM knowledge health"
ON public.wcm_project_knowledge_health
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_wcm_project_knowledge_health_updated_at
BEFORE UPDATE ON public.wcm_project_knowledge_health
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.wcm_project_knowledge_checkpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  checkpoint_id text NOT NULL,
  label text NOT NULL,
  occurred_at timestamptz,
  health_status text,
  knowledge_integrity_score integer,
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  note text,
  source_path text,
  source_sha text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, checkpoint_id)
);

GRANT SELECT ON public.wcm_project_knowledge_checkpoints TO authenticated;
GRANT ALL ON public.wcm_project_knowledge_checkpoints TO service_role;

ALTER TABLE public.wcm_project_knowledge_checkpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and admins can read WCM knowledge checkpoints"
ON public.wcm_project_knowledge_checkpoints
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_wcm_project_knowledge_checkpoints_updated_at
BEFORE UPDATE ON public.wcm_project_knowledge_checkpoints
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_wcm_knowledge_checkpoints_project ON public.wcm_project_knowledge_checkpoints (project_id, occurred_at DESC);