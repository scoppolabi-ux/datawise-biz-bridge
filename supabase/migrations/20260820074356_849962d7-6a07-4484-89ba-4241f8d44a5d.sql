CREATE TABLE public.wcm_method_learning_health (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  system_id text NOT NULL UNIQUE DEFAULT 'wcm',
  checked_at timestamptz,
  health_status text NOT NULL DEFAULT 'UNKNOWN',
  method_integrity_score integer,
  score_method text,
  last_material_method_delta_sha text,
  last_material_method_delta_at timestamptz,
  components jsonb NOT NULL DEFAULT '{}'::jsonb,
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  issues jsonb NOT NULL DEFAULT '[]'::jsonb,
  source_path text,
  source_sha text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wcm_method_learning_health TO authenticated;
GRANT ALL ON public.wcm_method_learning_health TO service_role;
ALTER TABLE public.wcm_method_learning_health ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners and admins can read WCM method learning health"
ON public.wcm_method_learning_health FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_wcm_method_learning_health_updated_at BEFORE UPDATE ON public.wcm_method_learning_health FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.wcm_method_learning_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_id text NOT NULL UNIQUE,
  title text NOT NULL,
  status text,
  record_path text,
  origin_created_at timestamptz,
  last_reviewed_at timestamptz,
  confidence text,
  generalizability text,
  origin_refs jsonb NOT NULL DEFAULT '[]'::jsonb,
  promoted_to jsonb NOT NULL DEFAULT '[]'::jsonb,
  revisit_trigger text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wcm_method_learning_records TO authenticated;
GRANT ALL ON public.wcm_method_learning_records TO service_role;
ALTER TABLE public.wcm_method_learning_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners and admins can read WCM method learning records"
ON public.wcm_method_learning_records FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_wcm_method_learning_records_updated_at BEFORE UPDATE ON public.wcm_method_learning_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.wcm_method_learning_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL UNIQUE,
  detected_at timestamptz,
  source_sha text,
  source_committed_at timestamptz,
  source_type text,
  summary text,
  changed_paths jsonb NOT NULL DEFAULT '[]'::jsonb,
  review_status text,
  reviewed_at timestamptz,
  review_note text,
  linked_learning_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  repair_evidence_sha text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wcm_method_learning_evidence TO authenticated;
GRANT ALL ON public.wcm_method_learning_evidence TO service_role;
ALTER TABLE public.wcm_method_learning_evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners and admins can read WCM method learning evidence"
ON public.wcm_method_learning_evidence FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_wcm_method_learning_evidence_updated_at BEFORE UPDATE ON public.wcm_method_learning_evidence FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.wcm_method_learning_relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  relation_id text NOT NULL UNIQUE,
  source_node text,
  relation_type text,
  target_node text,
  status text,
  rationale text,
  evidence_refs jsonb NOT NULL DEFAULT '[]'::jsonb,
  last_verified_at timestamptz,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wcm_method_learning_relations TO authenticated;
GRANT ALL ON public.wcm_method_learning_relations TO service_role;
ALTER TABLE public.wcm_method_learning_relations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners and admins can read WCM method learning relations"
ON public.wcm_method_learning_relations FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_wcm_method_learning_relations_updated_at BEFORE UPDATE ON public.wcm_method_learning_relations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();