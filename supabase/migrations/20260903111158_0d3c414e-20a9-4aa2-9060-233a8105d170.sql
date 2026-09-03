CREATE TABLE public.wcm_project_writer_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  memory_id text NOT NULL,
  scope text NOT NULL,
  category text,
  guidance text NOT NULL,
  origin_type text,
  origin_ref text,
  origin_context text,
  status text NOT NULL,
  source_path text,
  source_sha text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT wcm_project_writer_memory_unique UNIQUE (project_id, memory_id)
);

GRANT SELECT ON public.wcm_project_writer_memory TO authenticated;
GRANT ALL ON public.wcm_project_writer_memory TO service_role;

ALTER TABLE public.wcm_project_writer_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner and admin can read writer memory"
ON public.wcm_project_writer_memory
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_wcm_project_writer_memory_updated_at
BEFORE UPDATE ON public.wcm_project_writer_memory
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_wcm_project_writer_memory_project ON public.wcm_project_writer_memory (project_id, sort_order);