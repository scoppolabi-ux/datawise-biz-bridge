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
      'Riferimento tecnico end-to-end del Wise Centric Model: architettura, memoria duale, governance RUN/CHANGE, workflow session-independent, pipeline deterministica, assurance, learning, catalogo dei flow block e Documentation System general + project.',
    version: 'V0.4',
    master_date: '2026-08-23',
    status: 'ACTIVE',
    source_path: 'wcm/documentation/WCM_TECHNICAL_REFERENCE_V0_4.md',
    download_basename: 'WCM_Technical_Reference_V0_4',
    bootstrap_file: 'WCM_TECHNICAL_REFERENCE_V0_4.md',
    bootstrap_sha: '107325031c67a668cc2be2182648aefa40c4dfad',
  },
  {
    document_id: 'wcm-executive-client-guide',
    scope: 'wcm',
    project_id: null,
    project_label: null,
    title: 'WCM Executive / Client Guide',
    audience: 'Clienti, partner, management, investitori e interlocutori non tecnici',
    description:
      'Guida esecutiva al metodo WCM: problema affrontato, memoria organizzativa, continuità tra sessioni, automazioni spiegabili, authority umana, documentazione a due livelli e field validation su PRIMA DI NOI.',
    version: 'V0.4',
    master_date: '2026-08-23',
    status: 'ACTIVE',
    source_path: 'wcm/documentation/WCM_EXECUTIVE_CLIENT_GUIDE_V0_4.md',
    download_basename: 'WCM_Executive_Client_Guide_V0_4',
    bootstrap_file: 'WCM_EXECUTIVE_CLIENT_GUIDE_V0_4.md',
    bootstrap_sha: '1cf289b9054b614a0b0d04f44d89a389a0ca85bf',
  },
  {
    document_id: 'wcm-user-manual',
    scope: 'wcm',
    project_id: null,
    project_label: null,
    title: 'WCM User Manual',
    audience: 'Utilizzatori WCM, owner e Board',
    description:
      'Manuale operativo di Mission Control: home e Needs, stato di progetto, Execution Health, Board e authority, documenti, Knowledge Health, Steward, Learning, Documentation Center e processi automatici.',
    version: 'V0.4',
    master_date: '2026-08-23',
    status: 'ACTIVE',
    source_path: 'wcm/documentation/WCM_USER_MANUAL_V0_4.md',
    download_basename: 'WCM_User_Manual_V0_4',
    bootstrap_file: 'WCM_USER_MANUAL_V0_4.md',
    bootstrap_sha: '9329a0a05290a5be3e06dc8a548bdb43b9b3fc88',
  },
  {
    document_id: 'prima-di-noi-technical-reference',
    scope: 'project',
    project_id: 'prima-di-noi',
    project_label: 'PRIMA DI NOI',
    title: 'PRIMA DI NOI Technical Reference',
    audience: 'Tecnici, editori con background tecnologico, production architect, partner AI/editorial tech',
    description:
      'Riferimento tecnico dell’applicazione WCM a PRIMA DI NOI: governance editoriale, runtime, Chapter Workflow, living knowledge, automazioni, assurance, state/projector deterministici e Board Gate.',
    version: 'V0.1',
    master_date: '2026-08-23',
    status: 'ACTIVE',
    source_path: 'projects/prima-di-noi/documentation/PRIMA_DI_NOI_TECHNICAL_REFERENCE_V0_1.md',
    download_basename: 'PRIMA_DI_NOI_Technical_Reference_V0_1',
    bootstrap_file: 'PRIMA_DI_NOI_TECHNICAL_REFERENCE_V0_1.md',
    bootstrap_sha: '4ffdd72cb38f6b6bb692a203062aeb85e7000ad9',
  },
  {
    document_id: 'prima-di-noi-executive-editorial-partner-guide',
    scope: 'project',
    project_id: 'prima-di-noi',
    project_label: 'PRIMA DI NOI',
    title: 'PRIMA DI NOI Executive / Editorial Partner Guide',
    audience: 'Editori, autori, literary agent, studi editoriali, produttori di contenuti, partner publishing tech',
    description:
      'Case study executive del processo editoriale AI-native governato: ruoli, continuità, review separate, automazioni spiegabili, author authority, assurance e osservabilità.',
    version: 'V0.1',
    master_date: '2026-08-23',
    status: 'ACTIVE',
    source_path: 'projects/prima-di-noi/documentation/PRIMA_DI_NOI_EXECUTIVE_EDITORIAL_PARTNER_GUIDE_V0_1.md',
    download_basename: 'PRIMA_DI_NOI_Executive_Editorial_Partner_Guide_V0_1',
    bootstrap_file: 'PRIMA_DI_NOI_EXECUTIVE_EDITORIAL_PARTNER_GUIDE_V0_1.md',
    bootstrap_sha: '3675469d63cb38683d511a1b7a7ad8ac66803eb2',
  },
  {
    document_id: 'prima-di-noi-user-manual',
    scope: 'project',
    project_id: 'prima-di-noi',
    project_label: 'PRIMA DI NOI',
    title: 'PRIMA DI NOI User Manual',
    audience: 'Author & Creative Director e utenti autorizzati del progetto',
    description:
      'Manuale operativo di PRIMA DI NOI: heartbeat, Chapter Workflow, Candidate/Board Report, Narrative Mass Control, approval/freeze, post-freeze reconciliation, Knowledge Health, projector e learning.',
    version: 'V0.1',
    master_date: '2026-08-23',
    status: 'ACTIVE',
    source_path: 'projects/prima-di-noi/documentation/PRIMA_DI_NOI_USER_MANUAL_V0_1.md',
    download_basename: 'PRIMA_DI_NOI_User_Manual_V0_1',
    bootstrap_file: 'PRIMA_DI_NOI_USER_MANUAL_V0_1.md',
    bootstrap_sha: '61496b42ed1c30233d53a1f3d854c7772bbe1428',
  },
];
