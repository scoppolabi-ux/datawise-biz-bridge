import type { WcmReleaseDocument, WcmReleaseManifest } from '@/components/wcm/wcmDocumentation';

export const BOOK_PUBLICATION_PROJECT_ID = 'wcm-documentation-system';
export const BOOK_PUBLICATION_BOOK_ID = 'wcm-process-memory-book';
export const BOOK_LIVE_SCHEME = 'wcm-live://';

export type BookPublicationReadModelRow = {
  document_id: string;
  title: string;
  category: string | null;
  status: string | null;
  version: string | null;
  source_url: string | null;
  source_sha: string | null;
  content_markdown: string | null;
  distribution_ready: boolean;
  sort_order: number;
  updated_at: string;
};

const SHA_RE = /^[0-9a-f]{40}$/;
const CHAPTER_ID_RE = /^wcm-process-memory-book-ch(\d{2})$/;

function chapterNumber(row: BookPublicationReadModelRow): number | null {
  const match = CHAPTER_ID_RE.exec(row.document_id);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isInteger(value) && value > 0 ? value : null;
}

function sourcePathFromUrl(sourceUrl: string | null): string {
  if (!sourceUrl) return '';
  const marker = '/WCM-LAB/blob/';
  const index = sourceUrl.indexOf(marker);
  if (index < 0) return '';
  const rest = sourceUrl.slice(index + marker.length);
  const slash = rest.indexOf('/');
  return slash >= 0 ? decodeURIComponent(rest.slice(slash + 1)) : '';
}

function masterDate(markdown: string | null): string | null {
  if (!markdown) return null;
  const match = markdown.match(/\*\*Data:\*\*\s*(\d{4}-\d{2}-\d{2})/i);
  return match?.[1] ?? null;
}

function canonicalTitle(row: BookPublicationReadModelRow, number: number): string {
  const prefix = `${String(number).padStart(2, '0')} — `;
  return row.title.startsWith(prefix) ? row.title : `${prefix}${row.title}`;
}

function projectedDocument(
  row: BookPublicationReadModelRow,
  number: number,
  existing?: WcmReleaseDocument,
): WcmReleaseDocument {
  const sourceSha = row.source_sha ?? '';
  const sameSource = Boolean(existing && existing.source_sha === sourceSha);

  return {
    document_id: row.document_id,
    document_kind: 'book_chapter',
    book_id: BOOK_PUBLICATION_BOOK_ID,
    chapter_number: number,
    scope: 'wcm',
    project_id: null,
    project_label: null,
    title: canonicalTitle(row, number),
    audience: existing?.audience ?? 'Lettori tecnici e non tecnici del WCM Process & Memory Book',
    description:
      existing?.description ??
      'Capitolo FROZEN proiettato deterministicamente dalla source of truth WCM-LAB.',
    version: row.version ?? `FROZEN-${String(number).padStart(2, '0')}`,
    master_date: masterDate(row.content_markdown) ?? existing?.master_date ?? null,
    status: 'FROZEN',
    source_path: sourcePathFromUrl(row.source_url) || existing?.source_path || '',
    source_sha: sourceSha,
    source_sha_short: sourceSha.slice(0, 7),
    released_at: row.updated_at,
    markdown_path: `${BOOK_LIVE_SCHEME}${encodeURIComponent(row.document_id)}`,
    // Binary artifacts remain bound to the static release only when its source
    // blob is exactly the same. A live update never inherits stale downloads.
    docx_path: sameSource ? existing?.docx_path ?? null : null,
    pdf_path: sameSource ? existing?.pdf_path ?? null : null,
    download_filename_docx: sameSource ? existing?.download_filename_docx ?? null : null,
    download_filename_pdf: sameSource ? existing?.download_filename_pdf ?? null : null,
    qa_status: 'BUILD_PASS',
    visual_qa_status: 'PASS',
    docx_page_count: sameSource ? existing?.docx_page_count ?? null : null,
    pdf_page_count: sameSource ? existing?.pdf_page_count ?? null : null,
  };
}

export function mergeBookPublicationRows(
  base: WcmReleaseManifest,
  rows: BookPublicationReadModelRow[],
): WcmReleaseManifest {
  const valid = rows
    .filter((row) => {
      const number = chapterNumber(row);
      return (
        number !== null &&
        row.category === 'BOOK_CHAPTER' &&
        row.status === 'FROZEN' &&
        row.distribution_ready === true &&
        typeof row.content_markdown === 'string' &&
        row.content_markdown.trim().length > 0 &&
        typeof row.source_sha === 'string' &&
        SHA_RE.test(row.source_sha)
      );
    })
    .sort((a, b) => (chapterNumber(a) ?? 0) - (chapterNumber(b) ?? 0));

  if (valid.length === 0) return base;

  const documents = [...base.documents];
  const byId = new Map(documents.map((doc, index) => [doc.document_id, index]));

  for (const row of valid) {
    const number = chapterNumber(row) as number;
    const existingIndex = byId.get(row.document_id);
    const existing = existingIndex === undefined ? undefined : documents[existingIndex];
    const projected = projectedDocument(row, number, existing);

    if (existingIndex === undefined) {
      byId.set(row.document_id, documents.length);
      documents.push(projected);
    } else {
      documents[existingIndex] = projected;
    }
  }

  const publishedByNumber = new Map(
    valid.map((row) => [String(chapterNumber(row)), row.document_id]),
  );

  const books = base.books.map((book) => {
    if (book.book_id !== BOOK_PUBLICATION_BOOK_ID) return book;

    const sections = book.sections.map((section) => ({
      ...section,
      chapters: section.chapters.map((chapter) => {
        const documentId = publishedByNumber.get(String(chapter.number));
        if (!documentId) return chapter;
        const row = valid.find((candidate) => candidate.document_id === documentId);
        const number = chapterNumber(row as BookPublicationReadModelRow) as number;
        return {
          ...chapter,
          title: (row as BookPublicationReadModelRow).title.replace(
            new RegExp(`^${String(number).padStart(2, '0')}\\s*[—-]\\s*`),
            '',
          ),
          status: 'FROZEN',
          document_id: documentId,
        };
      }),
    }));

    const frozenChapters = sections.reduce(
      (count, section) => count + section.chapters.filter((chapter) => chapter.status === 'FROZEN').length,
      0,
    );

    return {
      ...book,
      frozen_chapters: frozenChapters,
      sections,
    };
  });

  const newest = valid[valid.length - 1];
  return {
    ...base,
    source_of_truth:
      'GitHub WCM-LAB/main → deterministic OIDC projection → Control Panel read-model',
    generated_at: newest.updated_at,
    documents,
    books,
  };
}
