CREATE TABLE public.wcm_document_state_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  status text NOT NULL,
  canonical_state text,
  proposed_state text,
  mapping_status text NOT NULL DEFAULT 'ACTIVE',
  reason text,
  confidence text,
  decided_by uuid,
  decided_by_email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT wcm_document_state_mappings_mapping_status_check
    CHECK (mapping_status IN ('ACTIVE','PENDING')),
  CONSTRAINT wcm_document_state_mappings_canonical_state_check
    CHECK (canonical_state IS NULL OR canonical_state IN ('APPROVED_FROZEN','WAITING_AUTHORITY','WORKING','CLOSED','SUPERSEDED')),
  CONSTRAINT wcm_document_state_mappings_shape_check
    CHECK ((mapping_status = 'ACTIVE' AND canonical_state IS NOT NULL)
        OR (mapping_status = 'PENDING' AND proposed_state IS NOT NULL))
);

CREATE UNIQUE INDEX wcm_document_state_mappings_active_key
  ON public.wcm_document_state_mappings (category, status)
  WHERE mapping_status = 'ACTIVE';

GRANT SELECT, INSERT, UPDATE ON public.wcm_document_state_mappings TO authenticated;
GRANT ALL ON public.wcm_document_state_mappings TO service_role;

ALTER TABLE public.wcm_document_state_mappings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and admins can read WCM state mappings"
  ON public.wcm_document_state_mappings FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Owners and admins can insert WCM state mappings"
  ON public.wcm_document_state_mappings FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Owners and admins can update WCM state mappings"
  ON public.wcm_document_state_mappings FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_wcm_document_state_mappings_updated_at
  BEFORE UPDATE ON public.wcm_document_state_mappings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();