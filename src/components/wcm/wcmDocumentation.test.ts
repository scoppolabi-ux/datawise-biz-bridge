import { describe, expect, it } from 'vitest';
import { canDownload, parseManifest, statusLabel, type WcmReleaseDocument } from './wcmDocumentation';

const base: WcmReleaseDocument = {
  document_id: 'wcm-user-manual',
  scope: 'GENERAL',
  project_id: null,
  project_label: null,
  title: 'WCM User Manual',

  audience: 'Operatori Mission Control',
  description: 'Manuale operativo',
  version: 'V0.1',
  master_date: '2026-08-20',
  status: 'CURRENT',
  source_path: 'wcm/documentation/WCM_USER_MANUAL_V0_1.md',
  source_sha: 'abcdef1234567890',
  source_sha_short: 'abcdef1',
  released_at: '2026-08-20T00:00:00.000Z',
  markdown_path: '/wcm/documentation/releases/wcm-user-manual.md',
  docx_path: '/wcm/documentation/releases/wcm-user-manual.docx',
  pdf_path: '/wcm/documentation/releases/wcm-user-manual.pdf',
  download_filename_docx: 'WCM_User_Manual_V0_1.docx',
  download_filename_pdf: 'WCM_User_Manual_V0_1.pdf',
  qa_status: 'BUILD_PASS',
  visual_qa_status: 'PASS',
  docx_page_count: null,
  pdf_page_count: null,
};


describe('parseManifest', () => {
  it('parses a well formed manifest', () => {
    const manifest = parseManifest({
      manifest_version: '0.9',
      source_of_truth: 'https://github.com/scoppolabi-ux/WCM-LAB (main)',
      generated_at: base.released_at,
      documents: [base],
    });
    expect(manifest?.documents).toHaveLength(1);
    expect(manifest?.documents[0].source_sha_short).toBe('abcdef1');
    expect(manifest?.documents[0].status).toBe('CURRENT');
  });

  it('rejects non-manifest payloads', () => {
    expect(parseManifest(null)).toBeNull();
    expect(parseManifest({})).toBeNull();
    expect(parseManifest('nope')).toBeNull();
  });

  it('drops entries without id or markdown snapshot', () => {
    const manifest = parseManifest({
      documents: [{ ...base, markdown_path: '' }, { ...base, document_id: '' }, base],
    });
    expect(manifest?.documents.map((d) => d.document_id)).toEqual(['wcm-user-manual']);
  });

  it('normalizes missing binary release paths to null', () => {
    const manifest = parseManifest({
      documents: [{ ...base, docx_path: undefined, pdf_path: null }],
    });
    const doc = manifest!.documents[0];
    expect(doc.docx_path).toBeNull();
    expect(doc.pdf_path).toBeNull();
  });
});

describe('canDownload', () => {
  it('allows downloads only for QA-passed existing assets', () => {
    expect(canDownload(base, 'docx')).toBe(true);
    expect(canDownload(base, 'pdf')).toBe(true);
    expect(canDownload({ ...base, pdf_path: null }, 'pdf')).toBe(false);
    expect(canDownload({ ...base, qa_status: 'BUILD_FAIL' }, 'docx')).toBe(false);
  });
});

describe('statusLabel', () => {
  it('localizes known statuses and passes through unknown ones', () => {
    expect(statusLabel('CURRENT')).toBe('Corrente');
    expect(statusLabel('XYZ')).toBe('XYZ');
  });
});
