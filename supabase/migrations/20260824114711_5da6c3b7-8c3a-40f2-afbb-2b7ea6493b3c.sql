ALTER TABLE public.wcm_method_change_gates
  ADD COLUMN IF NOT EXISTS revision integer NOT NULL DEFAULT 1;

ALTER TABLE public.wcm_method_change_gates
  DROP CONSTRAINT IF EXISTS wcm_method_change_gates_revision_check;
ALTER TABLE public.wcm_method_change_gates
  ADD CONSTRAINT wcm_method_change_gates_revision_check CHECK (revision >= 1);

CREATE TABLE IF NOT EXISTS public.wcm_method_command_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  command_id text NOT NULL UNIQUE,
  gate_id text NOT NULL,
  command_type text NOT NULL CHECK (command_type IN ('APPROVE_CHANGE_GATE','REQUEST_CHANGES','REJECT_CHANGE_GATE')),
  expected_gate_revision integer NOT NULL CHECK (expected_gate_revision >= 1),
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

GRANT SELECT ON public.wcm_method_command_requests TO authenticated;
GRANT ALL ON public.wcm_method_command_requests TO service_role;

ALTER TABLE public.wcm_method_command_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners and admins can read WCM method commands" ON public.wcm_method_command_requests;
CREATE POLICY "Owners and admins can read WCM method commands"
  ON public.wcm_method_command_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS wcm_method_command_requests_gate_idx
  ON public.wcm_method_command_requests (gate_id);
CREATE INDEX IF NOT EXISTS wcm_method_command_requests_status_idx
  ON public.wcm_method_command_requests (status, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS wcm_method_command_requests_active_uniq
  ON public.wcm_method_command_requests (gate_id)
  WHERE status IN ('SUBMITTED','CLAIMED','RECORDED');

DROP TRIGGER IF EXISTS update_wcm_method_command_requests_updated_at ON public.wcm_method_command_requests;
CREATE TRIGGER update_wcm_method_command_requests_updated_at
  BEFORE UPDATE ON public.wcm_method_command_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();