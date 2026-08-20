ALTER TABLE public.wcm_project_knowledge_health
  ADD COLUMN IF NOT EXISTS steward_activity JSONB,
  ADD COLUMN IF NOT EXISTS steward_activity_history JSONB NOT NULL DEFAULT '[]'::jsonb;