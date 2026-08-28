CREATE TABLE IF NOT EXISTS public.wcm_system_maintenance_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id text NOT NULL UNIQUE,
  occurred_on date,
  event_type text,
  title text NOT NULL,
  description text,
  technical_label text,
  status text,
  authority text,
  manifest_path text,
  scope text NOT NULL DEFAULT 'WCM_SYSTEM',
  schema_version text,
  language_policy text,
  source_path text,
  source_sha text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.wcm_system_maintenance_log TO authenticated;
GRANT ALL ON public.wcm_system_maintenance_log TO service_role;

ALTER TABLE public.wcm_system_maintenance_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners and admins can read WCM system maintenance log" ON public.wcm_system_maintenance_log;
CREATE POLICY "Owners and admins can read WCM system maintenance log"
ON public.wcm_system_maintenance_log
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

DROP TRIGGER IF EXISTS update_wcm_system_maintenance_log_updated_at ON public.wcm_system_maintenance_log;
CREATE TRIGGER update_wcm_system_maintenance_log_updated_at
BEFORE UPDATE ON public.wcm_system_maintenance_log
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();