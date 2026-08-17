
CREATE TABLE public.wcm_project_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  document_id text NOT NULL,
  title text NOT NULL,
  category text,
  status text,
  version text,
  source_path text,
  source_url text,
  source_sha text,
  content_markdown text,
  requires_stefano boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, document_id)
);
GRANT SELECT ON public.wcm_project_documents TO anon, authenticated;
GRANT ALL ON public.wcm_project_documents TO service_role;
ALTER TABLE public.wcm_project_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read WCM documents" ON public.wcm_project_documents FOR SELECT TO anon, authenticated USING (true);
CREATE TRIGGER update_wcm_project_documents_updated_at BEFORE UPDATE ON public.wcm_project_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.wcm_project_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  event_id text NOT NULL,
  occurred_at timestamptz,
  event_type text,
  title text NOT NULL,
  description text,
  source_path text,
  source_sha text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, event_id)
);
GRANT SELECT ON public.wcm_project_activity TO anon, authenticated;
GRANT ALL ON public.wcm_project_activity TO service_role;
ALTER TABLE public.wcm_project_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read WCM activity" ON public.wcm_project_activity FOR SELECT TO anon, authenticated USING (true);
CREATE TRIGGER update_wcm_project_activity_updated_at BEFORE UPDATE ON public.wcm_project_activity FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.wcm_project_roadmap (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  item_id text NOT NULL,
  label text NOT NULL,
  item_type text,
  status text,
  sequence integer NOT NULL DEFAULT 0,
  parent_id text,
  related_document_id text,
  source_path text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, item_id)
);
GRANT SELECT ON public.wcm_project_roadmap TO anon, authenticated;
GRANT ALL ON public.wcm_project_roadmap TO service_role;
ALTER TABLE public.wcm_project_roadmap ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read WCM roadmap" ON public.wcm_project_roadmap FOR SELECT TO anon, authenticated USING (true);
CREATE TRIGGER update_wcm_project_roadmap_updated_at BEFORE UPDATE ON public.wcm_project_roadmap FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.wcm_project_status
  ADD COLUMN IF NOT EXISTS board_verdict text,
  ADD COLUMN IF NOT EXISTS board_narrative_mass text,
  ADD COLUMN IF NOT EXISTS board_review_summary text,
  ADD COLUMN IF NOT EXISTS progress_summary text,
  ADD COLUMN IF NOT EXISTS documents_to_read_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS repo_url text;
