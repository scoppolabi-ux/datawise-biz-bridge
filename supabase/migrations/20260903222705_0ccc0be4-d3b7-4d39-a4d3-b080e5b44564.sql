ALTER TABLE public.wcm_command_requests
  DROP CONSTRAINT IF EXISTS wcm_command_requests_command_type_check;

ALTER TABLE public.wcm_command_requests
  ADD CONSTRAINT wcm_command_requests_command_type_check
  CHECK (command_type IN ('APPROVE_FREEZE','REQUEST_CHANGES','APPROVE_WRITER_MEMORY_AUTHORITY_ITEM'));