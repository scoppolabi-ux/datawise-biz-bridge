/**
 * WCM Documentation Center V0.9 — presentation helpers.
 *
 * Read-only: the manifest and the release assets are static build-time
 * artifacts produced by `scripts/wcm-release.mjs`. Nothing here writes to
 * GitHub or to the backend.
 */

export type WcmReleaseDocument = {
  document_id: string;
  title: string;
  audience: string;
  description: string;
  version: string;
  master_date: string | null;
  status: string;
  source_path: string;
  source_sha: string;
  source_sha_short: string;
  released_at: string;
  markdown_path: string;
  docx_path: string | null;
  pdf_path: string | null;
  download_filename_docx: string | null;
  download_filename_pdf: string | null;
  qa_status: string;
};

export type WcmReleaseManifest = {
  manifest_version: string;
  source_of_truth: string;
  generated_at: string;
  documents: WcmReleaseDocument[];
};

export const MANIFEST_PATH = 'wcm/documentation/releases/manifest.json';

export const SOURCE_OF_TRUTH_NOTE =
  'GitHub main è la source of truth. Word e PDF sono release derivate: il download non equivale ad approvazione né ad autorità.';

/** Resolve a release path against the app base URL (works on subpath deploys). */
export function assetUrl(releasePath: string): string {
  const base = (import.meta.env?.BASE_URL ?? '/').replace(/\/+$/, '');
  return `${base}/${releasePath.replace(/^\/+/, '')}`;
}

const str = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

/**
 * Strict manifest parsing: a document is kept only when its identity and its
 * markdown snapshot are present. Missing DOCX/PDF entries are surfaced as
 * `null` so the UI can hide the download instead of faking it.
 */
export function parseManifest(raw: unknown): WcmReleaseManifest | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;
  if (!Array.isArray(data.documents)) return null;

  const documents: WcmReleaseDocument[] = [];
  for (const item of data.documents) {
    if (!item || typeof item !== 'object') continue;
    const d = item as Record<string, unknown>;
    const document_id = str(d.document_id);
    const markdown_path = str(d.markdown_path);
    if (!document_id || !markdown_path) continue;

    documents.push({
      document_id,
      title: str(d.title) ?? document_id,
      audience: str(d.audience) ?? '',
      description: str(d.description) ?? '',
      version: str(d.version) ?? '—',
      master_date: str(d.master_date),
      status: (str(d.status) ?? 'UNKNOWN').toUpperCase(),
      source_path: str(d.source_path) ?? '',
      source_sha: str(d.source_sha) ?? '',
      source_sha_short: str(d.source_sha_short) ?? (str(d.source_sha) ?? '').slice(0, 7),
      released_at: str(d.released_at) ?? '',
      markdown_path,
      docx_path: str(d.docx_path),
      pdf_path: str(d.pdf_path),
      download_filename_docx: str(d.download_filename_docx),
      download_filename_pdf: str(d.download_filename_pdf),
      qa_status: (str(d.qa_status) ?? 'UNKNOWN').toUpperCase(),
    });
  }

  return {
    manifest_version: str(data.manifest_version) ?? '0',
    source_of_truth: str(data.source_of_truth) ?? '',
    generated_at: str(data.generated_at) ?? '',
    documents,
  };
}

/** A download is offered only for a QA-passed asset that actually exists. */
export function canDownload(doc: WcmReleaseDocument, format: 'docx' | 'pdf'): boolean {
  if (doc.qa_status !== 'BUILD_PASS') return false;
  return Boolean(format === 'docx' ? doc.docx_path : doc.pdf_path);
}

export const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Attivo',
  CURRENT: 'Corrente',
  DRAFT: 'Bozza',
  FROZEN: 'Congelato',
  APPROVED: 'Approvato',
  SUPERSEDED: 'Superato',
  UNKNOWN: 'Non dichiarato',
};

export const statusLabel = (status: string) => STATUS_LABELS[status] ?? status;
