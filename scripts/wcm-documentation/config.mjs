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
    audience: 'Team tecnico e integratori',
    description:
      'Riferimento tecnico del sistema WCM: architettura, memoria duale, governance RUN/CHANGE, assurance, learning e Documentation System.',
    version: 'V0.2',
    master_date: '2026-08-20',
    status: 'ACTIVE',
    source_path: 'wcm/documentation/WCM_TECHNICAL_REFERENCE_V0_2.md',
    download_basename: 'WCM_Technical_Reference_V0_2',
    /** Bootstrap-only: exact master snapshot + GitHub blob SHA authorized by Stefano. */
    bootstrap_file: 'WCM_TECHNICAL_REFERENCE_V0_2.md',
    bootstrap_sha: 'fbb2cf43db8cb4298dd455fd9b7fdb9248d1bcc3',
  },
  {
    document_id: 'wcm-executive-client-guide',
    title: 'WCM Executive / Client Guide',
    audience: 'Direzione, clienti e partner non tecnici',
    description:
      'Guida esecutiva al metodo WCM: problema affrontato, valore, memoria organizzativa, governance umana e benefici attesi.',
    version: 'V0.2',
    master_date: '2026-08-20',
    status: 'ACTIVE',
    source_path: 'wcm/documentation/WCM_EXECUTIVE_CLIENT_GUIDE_V0_2.md',
    download_basename: 'WCM_Executive_Client_Guide_V0_2',
    bootstrap_file: 'WCM_EXECUTIVE_CLIENT_GUIDE_V0_2.md',
    bootstrap_sha: '006e8eb8c6286f2263008314e42a325f3b23ef43',
  },
  {
    document_id: 'wcm-user-manual',
    title: 'WCM User Manual',
    audience: 'Utilizzatori WCM, owner e Board',
    description:
      'Manuale operativo di Mission Control: Home, Needs, Board, documenti, Knowledge Health, Learning e Documentation Center.',
    version: 'V0.2',
    master_date: '2026-08-20',
    status: 'ACTIVE',
    source_path: 'wcm/documentation/WCM_USER_MANUAL_V0_2.md',
    download_basename: 'WCM_User_Manual_V0_2',
    bootstrap_file: 'WCM_USER_MANUAL_V0_2.md',
    bootstrap_sha: '16e354b84638581e8386c6e1cf0982349a80a9d5',
  },
];
