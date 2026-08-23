/**
 * WCM Mission Control — Documentation Center V0.9
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
    title: 'WCM Technical Reference',
    audience: 'Stakeholder tecnico, developer, architect, partner AI/automation',
    description:
      'Riferimento tecnico end-to-end del Wise Centric Model: architettura, memoria duale, governance RUN/CHANGE, workflow session-independent, pipeline deterministica, assurance, learning, catalogo dei flow block e Documentation System general + project.',
    version: 'V0.4',
    master_date: '2026-08-23',
    status: 'ACTIVE',
    source_path: 'wcm/documentation/WCM_TECHNICAL_REFERENCE_V0_4.md',
    download_basename: 'WCM_Technical_Reference_V0_4',
    /** Bootstrap-only: exact master snapshot + GitHub blob SHA authorized by Stefano. */
    bootstrap_file: 'WCM_TECHNICAL_REFERENCE_V0_4.md',
    bootstrap_sha: '107325031c67a668cc2be2182648aefa40c4dfad',
  },
  {
    document_id: 'wcm-executive-client-guide',
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
];
