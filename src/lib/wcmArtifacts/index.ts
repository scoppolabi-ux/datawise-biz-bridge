/**
 * WCM document distribution artifacts (Word / PDF).
 *
 * Reuses the very same engine as the Documentation Center release pipeline
 * (`scripts/wcm-documentation/*`): markdown -> normalized block model ->
 * DOCX / PDF renderer. Nothing here changes authority, state or content:
 * artifacts are derived views of `content_markdown`.
 */
import { governanceBadgeOf, type ResolvedState } from '@/components/wcm/wcmCanonicalState';

export type WcmArtifactFormat = 'docx' | 'pdf';

export type WcmArtifactSource = {
  document_id: string;
  title: string;
  version?: string | null;
  status?: string | null;
  category?: string | null;
  source_path?: string | null;
  source_sha?: string | null;
  content_markdown?: string | null;
  distribution_ready?: boolean;
  updated_at?: string | null;
};

export const MIME: Record<WcmArtifactFormat, string> = {
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf',
};

/** Minimum plausible size for a generated artifact (same rule as the release QA). */
export const MIN_ARTIFACT_BYTES = 4000;

/** True when the document carries enough canonical content to render artifacts. */
export const canBuildArtifacts = (doc: Pick<WcmArtifactSource, 'content_markdown'>): boolean =>
  (doc.content_markdown ?? '').trim().length > 0;

/** Safe, portable base filename derived from title (+ version, + governance marker). */
export const artifactBaseName = (doc: WcmArtifactSource, state: ResolvedState): string => {
  const base = (doc.title || doc.document_id)
    .normalize('NFKD')
    .replace(/[^\w\s.-]+/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/^-|-$/g, '');
  const version = doc.version ? `-v${String(doc.version).replace(/[^\w.-]+/g, '')}` : '';
  const badge = governanceBadgeOf({ distribution_ready: doc.distribution_ready ?? true }, state);
  const marker =
    badge === 'UNAPPROVED' ? '-UNAPPROVED' : badge === 'UNCLASSIFIED' ? '-DA-CLASSIFICARE' : '';
  return `${base || 'documento'}${version}${marker}`;
};

export const artifactFileName = (
  doc: WcmArtifactSource,
  state: ResolvedState,
  format: WcmArtifactFormat,
): string => `${artifactBaseName(doc, state)}.${format}`;

const AUDIENCE: Record<string, string> = {
  BOARD_REPORT: 'Board / owner — materiale di supporto',
  BOARD_CANDIDATE: 'Board / owner — candidate in valutazione',
};

const audienceOf = (doc: WcmArtifactSource) =>
  AUDIENCE[doc.category ?? ''] ?? 'Distribuzione documentale WCM';

const artifactMeta = (doc: WcmArtifactSource) => ({
  title: doc.title || doc.document_id,
  audience: audienceOf(doc),
  version: doc.version ? `V${String(doc.version).replace(/^[vV]/, '')}` : '—',
  master_date: doc.updated_at ? String(doc.updated_at).slice(0, 10) : null,
  status: doc.status ?? '—',
  source_path: doc.source_path ?? '—',
  source_sha_short: doc.source_sha ? doc.source_sha.slice(0, 7) : '—',
  released_at: new Date().toISOString().slice(0, 10),
});

const blocksOf = async (doc: WcmArtifactSource) => {
  const { parseMarkdownBlocks } = await import('wcm-doc-engine/markdown');
  return parseMarkdownBlocks((doc.content_markdown ?? '').trim());
};

async function buildDocxBlob(doc: WcmArtifactSource): Promise<Blob> {
  const [{ buildDocxDocument }, { Packer }] = await Promise.all([
    import('wcm-doc-engine/docx'),
    import('docx'),
  ]);
  const blocks = await blocksOf(doc);
  return Packer.toBlob(buildDocxDocument({ blocks, meta: artifactMeta(doc) }));
}

let fontCache: Promise<Record<string, ArrayBuffer>> | null = null;

const loadFonts = async (files: Record<string, string>) => {
  if (!fontCache) {
    fontCache = (async () => {
      const base = (import.meta.env?.BASE_URL ?? '/').replace(/\/+$/, '');
      const entries = await Promise.all(
        Object.entries(files).map(async ([name, file]) => {
          const response = await fetch(`${base}/wcm/fonts/${file}`);
          if (!response.ok) throw new Error(`Font non disponibile: ${file}`);
          return [name, await response.arrayBuffer()] as const;
        }),
      );
      return Object.fromEntries(entries);
    })().catch((error) => {
      fontCache = null;
      throw error;
    });
  }
  return fontCache;
};

async function buildPdfBlob(doc: WcmArtifactSource): Promise<Blob> {
  const [{ PDF_FONT_FILES, PDF_OPTIONS, renderPdfContent }, pdfkit] = await Promise.all([
    import('wcm-doc-engine/pdf-render'),
    import('pdfkit'),
  ]);
  const PDFDocument = ((pdfkit as unknown as { default?: unknown }).default ??
    pdfkit) as new (options?: Record<string, unknown>) => Record<string, never>;
  const fonts = await loadFonts(PDF_FONT_FILES);
  const blocks = await blocksOf(doc);
  const meta = artifactMeta(doc);

  return new Promise<Blob>((resolve, reject) => {
    const pdf = new PDFDocument(PDF_OPTIONS(meta)) as unknown as {
      registerFont: (name: string, data: ArrayBuffer | Uint8Array) => void;
      on: (event: string, handler: (value?: unknown) => void) => void;
      end: () => void;
    };
    for (const [name, data] of Object.entries(fonts)) pdf.registerFont(name, new Uint8Array(data));
    const chunks: BlobPart[] = [];
    pdf.on('data', (chunk) => chunks.push(chunk as BlobPart));
    pdf.on('error', (error) => reject(error as Error));
    pdf.on('end', () => resolve(new Blob(chunks, { type: MIME.pdf })));
    renderPdfContent(pdf, { blocks, meta });
    pdf.end();
  });
}

export type WcmArtifact = { blob: Blob; filename: string; format: WcmArtifactFormat };

/** Build a real, paginated artifact from the canonical markdown. */
export async function buildArtifact(
  doc: WcmArtifactSource,
  state: ResolvedState,
  format: WcmArtifactFormat,
): Promise<WcmArtifact> {
  if (!canBuildArtifacts(doc)) throw new Error('Contenuto canonico non disponibile.');
  const blob = format === 'docx' ? await buildDocxBlob(doc) : await buildPdfBlob(doc);
  if (blob.size < MIN_ARTIFACT_BYTES) throw new Error('Artefatto generato non valido (troppo piccolo).');
  return { blob, filename: artifactFileName(doc, state, format), format };
}

export const saveBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
