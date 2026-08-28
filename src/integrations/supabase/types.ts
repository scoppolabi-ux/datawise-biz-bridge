export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wcm_command_requests: {
        Row: {
          claimed_at: string | null
          command_id: string
          command_type: string
          created_at: string
          expected_need_fingerprint: string
          expected_state_sha: string
          failure_reason: string | null
          id: string
          need_id: string
          note: string | null
          project_id: string
          receipt_path: string | null
          receipt_sha: string | null
          recorded_at: string | null
          requested_by_email: string
          requested_by_role: string
          requested_by_user_id: string
          status: string
          target_document_id: string | null
          target_version: string | null
          updated_at: string
        }
        Insert: {
          claimed_at?: string | null
          command_id: string
          command_type: string
          created_at?: string
          expected_need_fingerprint: string
          expected_state_sha: string
          failure_reason?: string | null
          id?: string
          need_id: string
          note?: string | null
          project_id: string
          receipt_path?: string | null
          receipt_sha?: string | null
          recorded_at?: string | null
          requested_by_email: string
          requested_by_role: string
          requested_by_user_id: string
          status?: string
          target_document_id?: string | null
          target_version?: string | null
          updated_at?: string
        }
        Update: {
          claimed_at?: string | null
          command_id?: string
          command_type?: string
          created_at?: string
          expected_need_fingerprint?: string
          expected_state_sha?: string
          failure_reason?: string | null
          id?: string
          need_id?: string
          note?: string | null
          project_id?: string
          receipt_path?: string | null
          receipt_sha?: string | null
          recorded_at?: string | null
          requested_by_email?: string
          requested_by_role?: string
          requested_by_user_id?: string
          status?: string
          target_document_id?: string | null
          target_version?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      wcm_document_state_mappings: {
        Row: {
          canonical_state: string | null
          category: string
          confidence: string | null
          created_at: string
          decided_by: string | null
          decided_by_email: string | null
          id: string
          mapping_status: string
          proposed_state: string | null
          reason: string | null
          status: string
          updated_at: string
        }
        Insert: {
          canonical_state?: string | null
          category: string
          confidence?: string | null
          created_at?: string
          decided_by?: string | null
          decided_by_email?: string | null
          id?: string
          mapping_status?: string
          proposed_state?: string | null
          reason?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          canonical_state?: string | null
          category?: string
          confidence?: string | null
          created_at?: string
          decided_by?: string | null
          decided_by_email?: string | null
          id?: string
          mapping_status?: string
          proposed_state?: string | null
          reason?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      wcm_method_change_gates: {
        Row: {
          authority_receipt_path: string | null
          authority_required: string | null
          created_at: string
          decided_at: string | null
          decided_by: string | null
          decision_command_id: string | null
          decision_command_type: string | null
          decision_note: string | null
          gate_id: string
          gate_type: string
          id: string
          impact_preview_refs: Json
          learning_id: string | null
          opened_at: string | null
          procedure_refs: Json
          revision: number
          sort_order: number
          source_path: string | null
          source_sha: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          authority_receipt_path?: string | null
          authority_required?: string | null
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_command_id?: string | null
          decision_command_type?: string | null
          decision_note?: string | null
          gate_id: string
          gate_type?: string
          id?: string
          impact_preview_refs?: Json
          learning_id?: string | null
          opened_at?: string | null
          procedure_refs?: Json
          revision?: number
          sort_order?: number
          source_path?: string | null
          source_sha?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          authority_receipt_path?: string | null
          authority_required?: string | null
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_command_id?: string | null
          decision_command_type?: string | null
          decision_note?: string | null
          gate_id?: string
          gate_type?: string
          id?: string
          impact_preview_refs?: Json
          learning_id?: string | null
          opened_at?: string | null
          procedure_refs?: Json
          revision?: number
          sort_order?: number
          source_path?: string | null
          source_sha?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      wcm_method_command_requests: {
        Row: {
          claimed_at: string | null
          command_id: string
          command_type: string
          created_at: string
          expected_gate_revision: number
          failure_reason: string | null
          gate_id: string
          id: string
          note: string | null
          receipt_path: string | null
          receipt_sha: string | null
          recorded_at: string | null
          requested_by_email: string
          requested_by_role: string
          requested_by_user_id: string
          status: string
          updated_at: string
        }
        Insert: {
          claimed_at?: string | null
          command_id: string
          command_type: string
          created_at?: string
          expected_gate_revision: number
          failure_reason?: string | null
          gate_id: string
          id?: string
          note?: string | null
          receipt_path?: string | null
          receipt_sha?: string | null
          recorded_at?: string | null
          requested_by_email: string
          requested_by_role: string
          requested_by_user_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          claimed_at?: string | null
          command_id?: string
          command_type?: string
          created_at?: string
          expected_gate_revision?: number
          failure_reason?: string | null
          gate_id?: string
          id?: string
          note?: string | null
          receipt_path?: string | null
          receipt_sha?: string | null
          recorded_at?: string | null
          requested_by_email?: string
          requested_by_role?: string
          requested_by_user_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      wcm_method_learning_evidence: {
        Row: {
          changed_paths: Json
          created_at: string
          detected_at: string | null
          event_id: string
          id: string
          linked_learning_ids: Json
          repair_evidence_sha: string | null
          review_note: string | null
          review_status: string | null
          reviewed_at: string | null
          sort_order: number
          source_committed_at: string | null
          source_ref: string | null
          source_sha: string | null
          source_type: string | null
          summary: string | null
          updated_at: string
        }
        Insert: {
          changed_paths?: Json
          created_at?: string
          detected_at?: string | null
          event_id: string
          id?: string
          linked_learning_ids?: Json
          repair_evidence_sha?: string | null
          review_note?: string | null
          review_status?: string | null
          reviewed_at?: string | null
          sort_order?: number
          source_committed_at?: string | null
          source_ref?: string | null
          source_sha?: string | null
          source_type?: string | null
          summary?: string | null
          updated_at?: string
        }
        Update: {
          changed_paths?: Json
          created_at?: string
          detected_at?: string | null
          event_id?: string
          id?: string
          linked_learning_ids?: Json
          repair_evidence_sha?: string | null
          review_note?: string | null
          review_status?: string | null
          reviewed_at?: string | null
          sort_order?: number
          source_committed_at?: string | null
          source_ref?: string | null
          source_sha?: string | null
          source_type?: string | null
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      wcm_method_learning_health: {
        Row: {
          checked_at: string | null
          components: Json
          created_at: string
          health_status: string
          id: string
          issues: Json
          last_material_method_delta_at: string | null
          last_material_method_delta_sha: string | null
          method_integrity_score: number | null
          metrics: Json
          score_method: string | null
          source_path: string | null
          source_sha: string | null
          system_id: string
          updated_at: string
        }
        Insert: {
          checked_at?: string | null
          components?: Json
          created_at?: string
          health_status?: string
          id?: string
          issues?: Json
          last_material_method_delta_at?: string | null
          last_material_method_delta_sha?: string | null
          method_integrity_score?: number | null
          metrics?: Json
          score_method?: string | null
          source_path?: string | null
          source_sha?: string | null
          system_id?: string
          updated_at?: string
        }
        Update: {
          checked_at?: string | null
          components?: Json
          created_at?: string
          health_status?: string
          id?: string
          issues?: Json
          last_material_method_delta_at?: string | null
          last_material_method_delta_sha?: string | null
          method_integrity_score?: number | null
          metrics?: Json
          score_method?: string | null
          source_path?: string | null
          source_sha?: string | null
          system_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      wcm_method_learning_records: {
        Row: {
          confidence: string | null
          created_at: string
          generalizability: string | null
          id: string
          last_reviewed_at: string | null
          learning_id: string
          origin_created_at: string | null
          origin_refs: Json
          promoted_at: string | null
          promoted_to: Json
          record_path: string | null
          revisit_trigger: string | null
          sort_order: number
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          confidence?: string | null
          created_at?: string
          generalizability?: string | null
          id?: string
          last_reviewed_at?: string | null
          learning_id: string
          origin_created_at?: string | null
          origin_refs?: Json
          promoted_at?: string | null
          promoted_to?: Json
          record_path?: string | null
          revisit_trigger?: string | null
          sort_order?: number
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          confidence?: string | null
          created_at?: string
          generalizability?: string | null
          id?: string
          last_reviewed_at?: string | null
          learning_id?: string
          origin_created_at?: string | null
          origin_refs?: Json
          promoted_at?: string | null
          promoted_to?: Json
          record_path?: string | null
          revisit_trigger?: string | null
          sort_order?: number
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      wcm_method_learning_relations: {
        Row: {
          created_at: string
          evidence_refs: Json
          id: string
          last_verified_at: string | null
          rationale: string | null
          relation_id: string
          relation_type: string | null
          sort_order: number
          source_node: string | null
          status: string | null
          target_node: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          evidence_refs?: Json
          id?: string
          last_verified_at?: string | null
          rationale?: string | null
          relation_id: string
          relation_type?: string | null
          sort_order?: number
          source_node?: string | null
          status?: string | null
          target_node?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          evidence_refs?: Json
          id?: string
          last_verified_at?: string | null
          rationale?: string | null
          relation_id?: string
          relation_type?: string | null
          sort_order?: number
          source_node?: string | null
          status?: string | null
          target_node?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      wcm_project_activity: {
        Row: {
          created_at: string
          description: string | null
          event_id: string
          event_type: string | null
          id: string
          occurred_at: string | null
          project_id: string
          sort_order: number
          source_path: string | null
          source_sha: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id: string
          event_type?: string | null
          id?: string
          occurred_at?: string | null
          project_id: string
          sort_order?: number
          source_path?: string | null
          source_sha?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string
          event_type?: string | null
          id?: string
          occurred_at?: string | null
          project_id?: string
          sort_order?: number
          source_path?: string | null
          source_sha?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      wcm_project_documents: {
        Row: {
          category: string | null
          content_markdown: string | null
          created_at: string
          distribution_ready: boolean
          document_id: string
          id: string
          project_id: string
          requires_stefano: boolean
          sort_order: number
          source_path: string | null
          source_sha: string | null
          source_url: string | null
          status: string | null
          title: string
          updated_at: string
          version: string | null
        }
        Insert: {
          category?: string | null
          content_markdown?: string | null
          created_at?: string
          distribution_ready?: boolean
          document_id: string
          id?: string
          project_id: string
          requires_stefano?: boolean
          sort_order?: number
          source_path?: string | null
          source_sha?: string | null
          source_url?: string | null
          status?: string | null
          title: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          category?: string | null
          content_markdown?: string | null
          created_at?: string
          distribution_ready?: boolean
          document_id?: string
          id?: string
          project_id?: string
          requires_stefano?: boolean
          sort_order?: number
          source_path?: string | null
          source_sha?: string | null
          source_url?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      wcm_project_execution_workflows: {
        Row: {
          authority_refs: Json
          completed_step_ids: Json
          completion_gate: Json | null
          created_at: string
          id: string
          interruption_evidence: Json
          interruption_reason: string | null
          interruption_type: string | null
          last_checkpoint_at: string | null
          last_completed_transition: string | null
          next_transition: string | null
          project_id: string
          resume_required: boolean
          scope: string | null
          sort_order: number
          source_path: string | null
          source_sha: string | null
          started_at: string | null
          status: string
          true_stop_condition: string
          updated_at: string
          workflow: string
          workflow_instance_id: string
        }
        Insert: {
          authority_refs?: Json
          completed_step_ids?: Json
          completion_gate?: Json | null
          created_at?: string
          id?: string
          interruption_evidence?: Json
          interruption_reason?: string | null
          interruption_type?: string | null
          last_checkpoint_at?: string | null
          last_completed_transition?: string | null
          next_transition?: string | null
          project_id: string
          resume_required?: boolean
          scope?: string | null
          sort_order?: number
          source_path?: string | null
          source_sha?: string | null
          started_at?: string | null
          status?: string
          true_stop_condition: string
          updated_at?: string
          workflow: string
          workflow_instance_id: string
        }
        Update: {
          authority_refs?: Json
          completed_step_ids?: Json
          completion_gate?: Json | null
          created_at?: string
          id?: string
          interruption_evidence?: Json
          interruption_reason?: string | null
          interruption_type?: string | null
          last_checkpoint_at?: string | null
          last_completed_transition?: string | null
          next_transition?: string | null
          project_id?: string
          resume_required?: boolean
          scope?: string | null
          sort_order?: number
          source_path?: string | null
          source_sha?: string | null
          started_at?: string | null
          status?: string
          true_stop_condition?: string
          updated_at?: string
          workflow?: string
          workflow_instance_id?: string
        }
        Relationships: []
      }
      wcm_project_knowledge_checkpoints: {
        Row: {
          checkpoint_id: string
          created_at: string
          health_status: string | null
          id: string
          knowledge_integrity_score: number | null
          label: string
          metrics: Json
          note: string | null
          occurred_at: string | null
          project_id: string
          sort_order: number
          source_path: string | null
          source_sha: string | null
          updated_at: string
        }
        Insert: {
          checkpoint_id: string
          created_at?: string
          health_status?: string | null
          id?: string
          knowledge_integrity_score?: number | null
          label: string
          metrics?: Json
          note?: string | null
          occurred_at?: string | null
          project_id: string
          sort_order?: number
          source_path?: string | null
          source_sha?: string | null
          updated_at?: string
        }
        Update: {
          checkpoint_id?: string
          created_at?: string
          health_status?: string | null
          id?: string
          knowledge_integrity_score?: number | null
          label?: string
          metrics?: Json
          note?: string | null
          occurred_at?: string | null
          project_id?: string
          sort_order?: number
          source_path?: string | null
          source_sha?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      wcm_project_knowledge_health: {
        Row: {
          checked_at: string | null
          checkpoint: Json | null
          components: Json
          created_at: string
          health_status: string
          id: string
          issues: Json
          knowledge_integrity_score: number | null
          last_material_delta_at: string | null
          last_reconciliation_at: string | null
          metrics: Json
          notes: string | null
          project_id: string
          score_method: string | null
          source_path: string | null
          source_sha: string | null
          steward_activity: Json | null
          steward_activity_history: Json
          updated_at: string
        }
        Insert: {
          checked_at?: string | null
          checkpoint?: Json | null
          components?: Json
          created_at?: string
          health_status?: string
          id?: string
          issues?: Json
          knowledge_integrity_score?: number | null
          last_material_delta_at?: string | null
          last_reconciliation_at?: string | null
          metrics?: Json
          notes?: string | null
          project_id: string
          score_method?: string | null
          source_path?: string | null
          source_sha?: string | null
          steward_activity?: Json | null
          steward_activity_history?: Json
          updated_at?: string
        }
        Update: {
          checked_at?: string | null
          checkpoint?: Json | null
          components?: Json
          created_at?: string
          health_status?: string
          id?: string
          issues?: Json
          knowledge_integrity_score?: number | null
          last_material_delta_at?: string | null
          last_reconciliation_at?: string | null
          metrics?: Json
          notes?: string | null
          project_id?: string
          score_method?: string | null
          source_path?: string | null
          source_sha?: string | null
          steward_activity?: Json | null
          steward_activity_history?: Json
          updated_at?: string
        }
        Relationships: []
      }
      wcm_project_needs: {
        Row: {
          action_requested: string | null
          created_at: string
          id: string
          need_id: string
          need_type: string | null
          project_id: string
          reason: string | null
          related_document_ids: string[]
          sort_order: number
          source_path: string | null
          source_sha: string | null
          status: string | null
          target_document_id: string | null
          target_tab: string | null
          title: string
          updated_at: string
        }
        Insert: {
          action_requested?: string | null
          created_at?: string
          id?: string
          need_id: string
          need_type?: string | null
          project_id: string
          reason?: string | null
          related_document_ids?: string[]
          sort_order?: number
          source_path?: string | null
          source_sha?: string | null
          status?: string | null
          target_document_id?: string | null
          target_tab?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          action_requested?: string | null
          created_at?: string
          id?: string
          need_id?: string
          need_type?: string | null
          project_id?: string
          reason?: string | null
          related_document_ids?: string[]
          sort_order?: number
          source_path?: string | null
          source_sha?: string | null
          status?: string | null
          target_document_id?: string | null
          target_tab?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      wcm_project_roadmap: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string | null
          label: string
          notes: string | null
          parent_id: string | null
          project_id: string
          related_document_id: string | null
          sequence: number
          source_path: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type?: string | null
          label: string
          notes?: string | null
          parent_id?: string | null
          project_id: string
          related_document_id?: string | null
          sequence?: number
          source_path?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string | null
          label?: string
          notes?: string | null
          parent_id?: string | null
          project_id?: string
          related_document_id?: string | null
          sequence?: number
          source_path?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      wcm_project_status: {
        Row: {
          blocker: string | null
          board_gate_action_requested: string | null
          board_gate_reason: string | null
          board_narrative_mass: string | null
          board_review_summary: string | null
          board_verdict: string | null
          created_at: string
          current_focus: string | null
          documents_to_read_count: number
          heartbeat_cadence: string | null
          heartbeat_last_outcome: string | null
          heartbeat_last_run_at: string | null
          id: string
          last_material_activity: string | null
          last_material_activity_at: string | null
          needs_stefano: boolean
          next_action: string | null
          notes: string | null
          phase: string | null
          progress_summary: string | null
          project_id: string
          project_name: string
          repo_url: string | null
          semantic_fingerprint: string | null
          short_description: string | null
          source: string | null
          source_state_sha: string | null
          status: string
          summary: string | null
          updated_at: string
        }
        Insert: {
          blocker?: string | null
          board_gate_action_requested?: string | null
          board_gate_reason?: string | null
          board_narrative_mass?: string | null
          board_review_summary?: string | null
          board_verdict?: string | null
          created_at?: string
          current_focus?: string | null
          documents_to_read_count?: number
          heartbeat_cadence?: string | null
          heartbeat_last_outcome?: string | null
          heartbeat_last_run_at?: string | null
          id?: string
          last_material_activity?: string | null
          last_material_activity_at?: string | null
          needs_stefano?: boolean
          next_action?: string | null
          notes?: string | null
          phase?: string | null
          progress_summary?: string | null
          project_id: string
          project_name: string
          repo_url?: string | null
          semantic_fingerprint?: string | null
          short_description?: string | null
          source?: string | null
          source_state_sha?: string | null
          status: string
          summary?: string | null
          updated_at?: string
        }
        Update: {
          blocker?: string | null
          board_gate_action_requested?: string | null
          board_gate_reason?: string | null
          board_narrative_mass?: string | null
          board_review_summary?: string | null
          board_verdict?: string | null
          created_at?: string
          current_focus?: string | null
          documents_to_read_count?: number
          heartbeat_cadence?: string | null
          heartbeat_last_outcome?: string | null
          heartbeat_last_run_at?: string | null
          id?: string
          last_material_activity?: string | null
          last_material_activity_at?: string | null
          needs_stefano?: boolean
          next_action?: string | null
          notes?: string | null
          phase?: string | null
          progress_summary?: string | null
          project_id?: string
          project_name?: string
          repo_url?: string | null
          semantic_fingerprint?: string | null
          short_description?: string | null
          source?: string | null
          source_state_sha?: string | null
          status?: string
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      wcm_state_mappings: {
        Row: {
          canonical_state: string | null
          category: string
          confidence: number | null
          created_at: string
          decided_by: string | null
          id: string
          proposed_state: string | null
          reason: string | null
          resolution_status: string
          source_status: string
          updated_at: string
        }
        Insert: {
          canonical_state?: string | null
          category: string
          confidence?: number | null
          created_at?: string
          decided_by?: string | null
          id?: string
          proposed_state?: string | null
          reason?: string | null
          resolution_status?: string
          source_status: string
          updated_at?: string
        }
        Update: {
          canonical_state?: string | null
          category?: string
          confidence?: number | null
          created_at?: string
          decided_by?: string | null
          id?: string
          proposed_state?: string | null
          reason?: string | null
          resolution_status?: string
          source_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      wcm_system_maintenance_log: {
        Row: {
          authority: string | null
          created_at: string
          description: string | null
          event_id: string
          event_type: string | null
          id: string
          language_policy: string | null
          manifest_path: string | null
          occurred_on: string | null
          schema_version: string | null
          scope: string
          sort_order: number
          source_path: string | null
          source_sha: string | null
          status: string | null
          technical_label: string | null
          title: string
          updated_at: string
        }
        Insert: {
          authority?: string | null
          created_at?: string
          description?: string | null
          event_id: string
          event_type?: string | null
          id?: string
          language_policy?: string | null
          manifest_path?: string | null
          occurred_on?: string | null
          schema_version?: string | null
          scope?: string
          sort_order?: number
          source_path?: string | null
          source_sha?: string | null
          status?: string | null
          technical_label?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          authority?: string | null
          created_at?: string
          description?: string | null
          event_id?: string
          event_type?: string | null
          id?: string
          language_policy?: string | null
          manifest_path?: string | null
          occurred_on?: string | null
          schema_version?: string | null
          scope?: string
          sort_order?: number
          source_path?: string | null
          source_sha?: string | null
          status?: string | null
          technical_label?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "admin" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["owner", "admin", "viewer"],
    },
  },
} as const
