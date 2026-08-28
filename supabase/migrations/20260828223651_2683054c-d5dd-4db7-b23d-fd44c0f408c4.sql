CREATE TABLE public.wcm_project_technical_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  issue_id text NOT NULL,
  issue_type text NOT NULL,
  title text NOT NULL,
  status text NOT NULL CHECK (status IN ('OPEN','CLOSED')),
  blocking boolean NOT NULL DEFAULT true,
  detected_by text NOT NULL,
  detected_at timestamptz NOT NULL,
  error_code text NOT NULL,
  detail text NOT NULL,
  source_path text NOT NULL,
  source_sha text NOT NULL,
  opened_at timestamptz NOT NULL,
  closed_at timestamptz NULL,
  closed_by text NULL,
  resolution_note text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, issue_id)
);

GRANT SELECT ON public.wcm_project_technical_issues TO authenticated;
GRANT ALL ON public.wcm_project_technical_issues TO service_role;

ALTER TABLE public.wcm_project_technical_issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read technical issues"
ON public.wcm_project_technical_issues
FOR SELECT TO authenticated
USING (true);

CREATE TRIGGER update_wcm_project_technical_issues_updated_at
BEFORE UPDATE ON public.wcm_project_technical_issues
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_wcm_project_technical_issues_status
ON public.wcm_project_technical_issues (status, detected_at DESC);