ALTER TABLE public.wcm_method_change_gates
  ADD COLUMN IF NOT EXISTS decision_command_id text,
  ADD COLUMN IF NOT EXISTS decision_command_type text,
  ADD COLUMN IF NOT EXISTS decision_note text,
  ADD COLUMN IF NOT EXISTS authority_receipt_path text;