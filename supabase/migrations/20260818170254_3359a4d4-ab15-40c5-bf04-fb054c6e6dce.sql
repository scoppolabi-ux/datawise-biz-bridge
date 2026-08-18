CREATE TABLE public.wcm_project_needs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  need_id text NOT NULL,
  title text NOT NULL,
  need_type text,
  status text,
  reason text,
  action_requested text,
  related_document_ids text[] NOT NULL DEFAULT '{}',
  target_tab text,
  target_document_id text,
  sort_order integer NOT NULL DEFAULT 0,
  source_path text,
  source_sha text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, need_id)
);

GRANT SELECT ON public.wcm_project_needs TO anon;
GRANT SELECT ON public.wcm_project_needs TO authenticated;
GRANT ALL ON public.wcm_project_needs TO service_role;

ALTER TABLE public.wcm_project_needs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read WCM needs"
ON public.wcm_project_needs
FOR SELECT
TO anon, authenticated
USING (true);

CREATE INDEX wcm_project_needs_project_id_idx ON public.wcm_project_needs (project_id);
CREATE INDEX wcm_project_needs_open_idx ON public.wcm_project_needs (status, sort_order);

CREATE TRIGGER update_wcm_project_needs_updated_at
BEFORE UPDATE ON public.wcm_project_needs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();