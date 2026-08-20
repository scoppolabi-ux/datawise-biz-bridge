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
      'Riferimento tecnico del sistema WCM: architettura, projector, read model, boundary di governance.',
    version: 'V0.1',
    status: 'CURRENT',
    source_path: 'wcm/documentation/WCM_TECHNICAL_REFERENCE_V0_1.md',
    download_basename: 'WCM_Technical_Reference_V0_1',
  },
  {
    document_id: 'wcm-executive-client-guide',
    title: 'WCM Executive / Client Guide',
    audience: 'Direzione e clienti',
    description:
      'Guida esecutiva al metodo WCM: valore, perimetro, modello di governance e responsabilità decisionali.',
    version: 'V0.1',
    status: 'CURRENT',
    source_path: 'wcm/documentation/WCM_EXECUTIVE_CLIENT_GUIDE_V0_1.md',
    download_basename: 'WCM_Executive_Client_Guide_V0_1',
  },
  {
    document_id: 'wcm-user-manual',
    title: 'WCM User Manual',
    audience: 'Operatori Mission Control',
    description:
      'Manuale operativo di Mission Control: lettura dello stato, Needs, Board, documenti e flussi quotidiani.',
    version: 'V0.1',
    status: 'CURRENT',
    source_path: 'wcm/documentation/WCM_USER_MANUAL_V0_1.md',
    download_basename: 'WCM_User_Manual_V0_1',
  },
];
