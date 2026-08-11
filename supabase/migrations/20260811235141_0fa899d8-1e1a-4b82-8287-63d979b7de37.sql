GRANT SELECT ON public.wcm_project_status TO anon;
CREATE POLICY "Public can read WCM status" ON public.wcm_project_status FOR SELECT TO anon, authenticated USING (true);