/**
 * WCM Mission Control — Documentation Center.
 * Release configuration.
 *
 * GitHub main (scoppolabi-ux/WCM-LAB) is the source of truth.
 * DOCX/PDF are derived releases, NOT authority.
 */

export const REPO_OWNER = 'scoppolabi-ux';
export const REPO_NAME = 'WCM-LAB';
export const REPO_REF = 'main';

export const RELEASE_DIR = 'public/wcm/documentation/releases';

/** Minimum plausible size (bytes) for a generated binary artifact. */
export const MIN_DOCX_BYTES = 4000;
export const MIN_PDF_BYTES = 4000;

export const DOCUMENTS = [
  {
    document_id: 'wcm-technical-reference',
    scope: 'wcm',
    project_id: null,
    project_label: null,
    title: 'WCM Technical Reference',
    audience: 'Stakeholder tecnico, developer, architect, partner AI/automation',
    description:
      'Riferimento tecnico end-to-end del Wise Centric Model: runtime durevole, state/projector deterministici, assurance, authority, learning, persistent mutation safety, flow block e Documentation System.',
    version: 'V0.5',
    master_date: '2026-08-24',
    status: 'ACTIVE',
    source_path: 'wcm/documentation/WCM_TECHNICAL_REFERENCE_V0_5.md',
    download_basename: 'WCM_Technical_Reference_V0_5',
    bootstrap_file: 'WCM_TECHNICAL_REFERENCE_V0_5.md',
    bootstrap_sha: '11a025570bb737ed08b0aeddb3b34f7b4e0111de',
    visual_qa_status: 'PASS',
    docx_page_count: 8,
    pdf_page_count: 9,
  },
  {
    document_id: 'wcm-executive-client-guide',
    scope: 'wcm',
    project_id: null,
    project_label: null,
    title: 'WCM Executive / Client Guide',
    audience: 'Clienti, partner, management, investitori e interlocutori non tecnici',
    description:
      'Guida esecutiva al metodo WCM: continuità organizzativa, memoria controllata, determinismo selettivo, authority umana, automazioni spiegabili e field validation su PRIMA DI NOI.',
    version: 'V0.5',
    master_date: '2026-08-24',
    status: 'ACTIVE',
    source_path: 'wcm/documentation/WCM_EXECUTIVE_CLIENT_GUIDE_V0_5.md',
    download_basename: 'WCM_Executive_Client_Guide_V0_5',
    bootstrap_file: 'WCM_EXECUTIVE_CLIENT_GUIDE_V0_5.md',
    bootstrap_sha: 'ac8bf70eea05eefd545e7e375c84fd68cff12663',
    visual_qa_status: 'PASS',
    docx_page_count: 6,
    pdf_page_count: 7,
  },
  {
    document_id: 'wcm-user-manual',
    scope: 'wcm',
    project_id: null,
    project_label: null,
    title: 'WCM User Manual',
    audience: 'Utilizzatori WCM, owner, Board e persone senza background tecnico',
    description:
      'Manuale discorsivo per usare WCM: Mission Control, Needs e Pending, heartbeat, gate, Knowledge Health, assurance, learning, documentazione e cosa richiede davvero l’utente.',
    version: 'V0.6',
    master_date: '2026-08-24',
    status: 'ACTIVE',
    source_path: 'wcm/documentation/WCM_USER_MANUAL_V0_6.md',
    download_basename: 'WCM_User_Manual_V0_6',
    bootstrap_file: 'WCM_USER_MANUAL_V0_6.md',
    bootstrap_sha: '80d886da68e537710826849c3b5e2efc8499291d',
    visual_qa_status: 'PASS',
    docx_page_count: 11,
    pdf_page_count: 14,
  },
  {
    document_id: 'prima-di-noi-technical-reference',
    scope: 'project',
    project_id: 'prima-di-noi',
    project_label: 'PRIMA DI NOI',
    title: 'PRIMA DI NOI Technical Reference',
    audience: 'Tecnici, editori con background tecnologico, production architect, partner AI/editorial tech',
    description:
      'Riferimento tecnico dell’applicazione WCM a PRIMA DI NOI: Chapter Workflow, internal assurance dependency, delivery verificata, living knowledge, state/projector, heartbeat telemetry e Board Gate.',
    version: 'V0.2',
    master_date: '2026-08-24',
    status: 'ACTIVE',
    source_path: 'projects/prima-di-noi/documentation/PRIMA_DI_NOI_TECHNICAL_REFERENCE_V0_2.md',
    download_basename: 'PRIMA_DI_NOI_Technical_Reference_V0_2',
    bootstrap_file: 'PRIMA_DI_NOI_TECHNICAL_REFERENCE_V0_2.md',
    bootstrap_sha: '6e0ce024d4f14d472e9b139d0443a861d8477e62',
    visual_qa_status: 'PASS',
    docx_page_count: 8,
    pdf_page_count: 9,
  },
  {
    document_id: 'prima-di-noi-executive-editorial-partner-guide',
    scope: 'project',
    project_id: 'prima-di-noi',
    project_label: 'PRIMA DI NOI',
    title: 'PRIMA DI NOI Executive / Editorial Partner Guide',
    audience: 'Editori, autori, literary agent, studi editoriali, produttori di contenuti, partner publishing tech',
    description:
      'Case study editoriale AI-native governato: redazione virtuale persistente, maker/reviewer separation, continuity, author authority, assurance, delivery e osservabilità.',
    version: 'V0.2',
    master_date: '2026-08-24',
    status: 'ACTIVE',
    source_path: 'projects/prima-di-noi/documentation/PRIMA_DI_NOI_EXECUTIVE_EDITORIAL_PARTNER_GUIDE_V0_2.md',
    download_basename: 'PRIMA_DI_NOI_Executive_Editorial_Partner_Guide_V0_2',
    bootstrap_file: 'PRIMA_DI_NOI_EXECUTIVE_EDITORIAL_PARTNER_GUIDE_V0_2.md',
    bootstrap_sha: 'c9d239091c74e8b119a402adbb20e376f8737737',
    visual_qa_status: 'PASS',
    docx_page_count: 8,
    pdf_page_count: 8,
  },
  {
    document_id: 'prima-di-noi-user-manual',
    scope: 'project',
    project_id: 'prima-di-noi',
    project_label: 'PRIMA DI NOI',
    title: 'PRIMA DI NOI User Manual',
    audience: 'Author & Creative Director e utenti autorizzati, anche senza background tecnico',
    description:
      'Manuale discorsivo del progetto: ciclo del capitolo, Candidate e Board Report, mass control, continuity, assurance, heartbeat, approval/freeze, post-freeze e automazioni.',
    version: 'V0.2',
    master_date: '2026-08-24',
    status: 'ACTIVE',
    source_path: 'projects/prima-di-noi/documentation/PRIMA_DI_NOI_USER_MANUAL_V0_2.md',
    download_basename: 'PRIMA_DI_NOI_User_Manual_V0_2',
    bootstrap_file: 'PRIMA_DI_NOI_USER_MANUAL_V0_2.md',
    bootstrap_sha: '0e12a04df58402f439e0576e7d99bfacdb01739a',
    visual_qa_status: 'PASS',
    docx_page_count: 13,
    pdf_page_count: 15,
  },
];
