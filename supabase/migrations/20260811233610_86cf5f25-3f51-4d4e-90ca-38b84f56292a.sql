CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'viewer');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Owners can manage roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'owner'))
WITH CHECK (public.has_role(auth.uid(), 'owner'));

CREATE TABLE public.wcm_project_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL UNIQUE,
  project_name text NOT NULL,
  status text NOT NULL,
  phase text,
  summary text,
  current_focus text,
  next_action text,
  needs_stefano boolean NOT NULL DEFAULT false,
  board_gate_reason text,
  board_gate_action_requested text,
  blocker text,
  heartbeat_cadence text,
  heartbeat_last_run_at timestamptz,
  heartbeat_last_outcome text,
  last_material_activity_at timestamptz,
  last_material_activity text,
  notes text,
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.wcm_project_status TO authenticated;
GRANT ALL ON public.wcm_project_status TO service_role;

ALTER TABLE public.wcm_project_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and admins can read WCM status"
ON public.wcm_project_status FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners can insert WCM status"
ON public.wcm_project_status FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owners can update WCM status"
ON public.wcm_project_status FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'owner'))
WITH CHECK (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owners can delete WCM status"
ON public.wcm_project_status FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'owner'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_wcm_project_status_updated_at
BEFORE UPDATE ON public.wcm_project_status
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();