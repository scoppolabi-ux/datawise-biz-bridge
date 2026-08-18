ALTER TABLE public.wcm_project_status
  ADD COLUMN IF NOT EXISTS source_state_sha text,
  ADD COLUMN IF NOT EXISTS semantic_fingerprint text;

-- 1. Private read-model: remove anonymous access
DROP POLICY IF EXISTS "Public can read WCM status" ON public.wcm_project_status;
DROP POLICY IF EXISTS "Public can read WCM documents" ON public.wcm_project_documents;
DROP POLICY IF EXISTS "Public can read WCM needs" ON public.wcm_project_needs;
DROP POLICY IF EXISTS "Public can read WCM activity" ON public.wcm_project_activity;
DROP POLICY IF EXISTS "Public can read WCM roadmap" ON public.wcm_project_roadmap;

REVOKE ALL ON public.wcm_project_status FROM anon;
REVOKE ALL ON public.wcm_project_documents FROM anon;
REVOKE ALL ON public.wcm_project_needs FROM anon;
REVOKE ALL ON public.wcm_project_activity FROM anon;
REVOKE ALL ON public.wcm_project_roadmap FROM anon;

GRANT SELECT ON public.wcm_project_status TO authenticated;
GRANT SELECT ON public.wcm_project_documents TO authenticated;
GRANT SELECT ON public.wcm_project_needs TO authenticated;
GRANT SELECT ON public.wcm_project_activity TO authenticated;
GRANT SELECT ON public.wcm_project_roadmap TO authenticated;

GRANT ALL ON public.wcm_project_status TO service_role;
GRANT ALL ON public.wcm_project_documents TO service_role;
GRANT ALL ON public.wcm_project_needs TO service_role;
GRANT ALL ON public.wcm_project_activity TO service_role;
GRANT ALL ON public.wcm_project_roadmap TO service_role;

DROP POLICY IF EXISTS "Owners and admins can read WCM documents" ON public.wcm_project_documents;
CREATE POLICY "Owners and admins can read WCM documents"
  ON public.wcm_project_documents FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Owners and admins can read WCM needs" ON public.wcm_project_needs;
CREATE POLICY "Owners and admins can read WCM needs"
  ON public.wcm_project_needs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Owners and admins can read WCM activity" ON public.wcm_project_activity;
CREATE POLICY "Owners and admins can read WCM activity"
  ON public.wcm_project_activity FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Owners and admins can read WCM roadmap" ON public.wcm_project_roadmap;
CREATE POLICY "Owners and admins can read WCM roadmap"
  ON public.wcm_project_roadmap FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'admin'));

-- 2. Command queue
CREATE TABLE IF NOT EXISTS public.wcm_command_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  command_id text NOT NULL UNIQUE,
  project_id text NOT NULL,
  need_id text NOT NULL,
  command_type text NOT NULL CHECK (command_type IN ('APPROVE_FREEZE','REQUEST_CHANGES')),
  target_document_id text,
  target_version text,
  expected_state_sha text NOT NULL,
  expected_need_fingerprint text NOT NULL,
  requested_by_user_id uuid NOT NULL,
  requested_by_email text NOT NULL,
  requested_by_role text NOT NULL,
  note text,
  status text NOT NULL DEFAULT 'SUBMITTED'
    CHECK (status IN ('SUBMITTED','CLAIMED','RECORDED','STALE','REJECTED','FAILED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  claimed_at timestamptz,
  recorded_at timestamptz,
  receipt_path text,
  receipt_sha text,
  failure_reason text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.wcm_command_requests TO authenticated;
GRANT ALL ON public.wcm_command_requests TO service_role;

ALTER TABLE public.wcm_command_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners and admins can read WCM commands" ON public.wcm_command_requests;
CREATE POLICY "Owners and admins can read WCM commands"
  ON public.wcm_command_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS wcm_command_requests_project_need_idx
  ON public.wcm_command_requests (project_id, need_id);
CREATE INDEX IF NOT EXISTS wcm_command_requests_status_idx
  ON public.wcm_command_requests (status, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS wcm_command_requests_active_uniq
  ON public.wcm_command_requests (project_id, need_id)
  WHERE status IN ('SUBMITTED','CLAIMED','RECORDED');

DROP TRIGGER IF EXISTS update_wcm_command_requests_updated_at ON public.wcm_command_requests;
CREATE TRIGGER update_wcm_command_requests_updated_at
  BEFORE UPDATE ON public.wcm_command_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();