INSERT INTO public.wcm_document_state_mappings (category, status, canonical_state, proposed_state, mapping_status, reason, confidence)
SELECT
  'MANUSCRIPT_INDEX',
  'APPROVED_FROZEN_CURRENT',
  'APPROVED_FROZEN',
  NULL,
  'ACTIVE',
  'Stato canonico approved/frozen/current del Manuscript Index (Extended Narrative Index): documento approvato e congelato, nessuna semantica working/unapproved.',
  'HIGH'
WHERE NOT EXISTS (
  SELECT 1
  FROM public.wcm_document_state_mappings
  WHERE category = 'MANUSCRIPT_INDEX'
    AND status = 'APPROVED_FROZEN_CURRENT'
    AND canonical_state = 'APPROVED_FROZEN'
    AND mapping_status = 'ACTIVE'
);