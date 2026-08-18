-- Harden privileges: WCM read-model tables are intentionally public READ-ONLY.
-- Remove all write privileges from anon/authenticated; writer stays service_role (Projector edge function).
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.wcm_project_status FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.wcm_project_documents FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.wcm_project_activity FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.wcm_project_roadmap FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.wcm_project_needs FROM anon, authenticated;

GRANT SELECT ON public.wcm_project_status TO anon, authenticated;
GRANT SELECT ON public.wcm_project_documents TO anon, authenticated;
GRANT SELECT ON public.wcm_project_activity TO anon, authenticated;
GRANT SELECT ON public.wcm_project_roadmap TO anon, authenticated;
GRANT SELECT ON public.wcm_project_needs TO anon, authenticated;

GRANT ALL ON public.wcm_project_status TO service_role;
GRANT ALL ON public.wcm_project_documents TO service_role;
GRANT ALL ON public.wcm_project_activity TO service_role;
GRANT ALL ON public.wcm_project_roadmap TO service_role;
GRANT ALL ON public.wcm_project_needs TO service_role;

-- user_roles must never be reachable by anonymous visitors.
REVOKE ALL ON public.user_roles FROM anon;
REVOKE TRUNCATE, REFERENCES, TRIGGER ON public.user_roles FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;