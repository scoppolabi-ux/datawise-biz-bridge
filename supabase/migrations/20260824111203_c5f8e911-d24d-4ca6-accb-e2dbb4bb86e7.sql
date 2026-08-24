ALTER TABLE public.wcm_method_learning_records
  ADD COLUMN IF NOT EXISTS promoted_at timestamp with time zone;

CREATE TABLE IF NOT EXISTS public.wcm_method_change_gates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gate_id text NOT NULL UNIQUE,
  gate_type text NOT NULL DEFAULT 'WCM_CHANGE_GATE',
  learning_id text,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'OPEN',
  authority_required text,
  procedure_refs jsonb NOT NULL DEFAULT '[]'::jsonb,
  impact_preview_refs jsonb NOT NULL DEFAULT '[]'::jsonb,
  opened_at timestamp with time zone,
  decided_at timestamp with time zone,
  decided_by text,
  source_path text,
  source_sha text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.wcm_method_change_gates TO authenticated;
GRANT ALL ON public.wcm_method_change_gates TO service_role;

ALTER TABLE public.wcm_method_change_gates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and admins can read WCM method change gates"
  ON public.wcm_method_change_gates
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_wcm_method_change_gates_updated_at
  BEFORE UPDATE ON public.wcm_method_change_gates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();