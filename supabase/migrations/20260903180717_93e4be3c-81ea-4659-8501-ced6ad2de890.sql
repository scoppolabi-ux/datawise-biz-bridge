ALTER TABLE public.wcm_project_status
  ADD COLUMN IF NOT EXISTS writer_memory_processing_status text,
  ADD COLUMN IF NOT EXISTS writer_memory_review_status text,
  ADD COLUMN IF NOT EXISTS writer_memory_review_open_count integer;