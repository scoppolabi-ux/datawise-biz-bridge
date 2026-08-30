import type {
  WcmReleaseDocument,
  WcmReleaseManifest,
} from '@/components/wcm/wcmDocumentation';

export const BOOK_PUBLICATION_OVERLAY_URL =
  'https://raw.githubusercontent.com/scoppolabi-ux/WCM-LAB/main/wcm/documentation/process-memory-book/runtime/CONTROL_PANEL_PUBLICATION.json';

type PublicationChapter = {
  number: number;
  title: string;
  master_date: string | null;
  source_path: string;
  source_sha: string;
  released_at: string;
  markdown_url: string;
  reader_qa: 'PASS';
  docx_page_count: number | null;
  release_complete: true;
};

export type BookPublicationOverlay = {
  schema_version: '1.0';
  book_id: string;
  index_source_path: string;
  index_source_sha: string;
  publication_fingerprint: string;
  latest_complete_chapter: number;
  chapters: PublicationChapter[];
};

const isSha = (value: unknown): value is string =>
  typeof value === 'string' && /^[0-9a-f]{40}$/.test(value);

export function parseBookPublicationOverlay(raw: unknown): BookPublicationOverlay | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;
  if (
    data.schema_version !== '1.0' ||
    typeof data.book_id !== 'string' ||
    typeof data.index_source_path !== 'string' ||
    !isSha(data.index_source_sha) ||
    typeof data.publication_fingerprint !== 'string' ||
    !Number.isInteger(data.latest_complete_chapter) ||
    !Array.isArray(data.chapters)
  ) {
    return null;
  }

  const chapters: PublicationChapter[] = [];
  for (const item of data.chapters) {
    if (!item || typeof item !== 'object') return null;
    const chapter = item as Record<string, unknown>;
    if (
      !Number.isInteger(chapter.number) ||
      typeof chapter.title !== 'string' ||
      !chapter.title.trim() ||
      typeof chapter.source_path !== 'string' ||
      !isSha(chapter.source_sha) ||
      typeof chapter.released_at !== 'string' ||
      typeof chapter.markdown_url !== 'string' ||
      chapter.reader_qa !== 'PASS' ||
      chapter.release_complete !== true
    ) {
      return null;
    }

    const pageCount =
      chapter.docx_page_count === null ||
      (typeof chapter.docx_page_count === 'number' &&
        Number.isInteger(chapter.docx_page_count) &&
        chapter.docx_page_count >= 0)
        ? (chapter.docx_page_count as number | null)
        : null;

    chapters.push({
      number: chapter.number as number,
      title: chapter.title.trim(),
      master_date: typeof chapter.master_date === 'string' ? chapter.master_date : null,
      source_path: chapter.source_path,
      source_sha: chapter.source_sha,
      released_at: chapter.released_at,
      markdown_url: chapter.markdown_url,
      reader_qa: 'PASS',
      docx_page_count: pageCount,
      release_complete: true,
    });
  }

  chapters.sort((a, b) => a.number - b.number);

  return {
    schema_version: '1.0',
    book_id: data.book_id,
    index_source_path: data.index_source_path,
    index_source_sha: data.index_source_sha,
    publication_fingerprint: data.publication_fingerprint,
    latest_complete_chapter: data.latest_complete_chapter as number,
    chapters,
  };
}

function projectedDocument(
  chapter: PublicationChapter,
  bookId: string,
  existing?: WcmReleaseDocument,
): WcmReleaseDocument {
  const sameSource = existing?.source_sha === chapter.source_sha;

  return {
    document_id: `wcm-process-memory-book-ch${String(chapter.number).padStart(2, '0')}`,
    document_kind: 'book_chapter',
    book_id: bookId,
    chapter_number: chapter.number,
    scope: 'wcm',
    project_id: null,
    project_label: null,
    title: `${String(chapter.number).padStart(2, '0')} — ${chapter.title}`,
    audience: existing?.audience ?? 'Lettori tecnici e non tecnici del WCM Process & Memory Book',
    description:
      existing?.description ??
      'Capitolo FROZEN pubblicato direttamente dalla source of truth WCM-LAB tramite projection deterministica.',
    version: `FROZEN-${String(chapter.number).padStart(2, '0')}`,
    master_date: chapter.master_date,
    status: 'FROZEN',
    source_path: chapter.source_path,
    source_sha: chapter.source_sha,
    source_sha_short: chapter.source_sha.slice(0, 7),
    released_at: chapter.released_at,
    markdown_path: chapter.markdown_url,
    // Binary release paths are reusable only when they were generated from the
    // exact same source blob. A newer source never inherits stale downloads.
    docx_path: sameSource ? existing?.docx_path ?? null : null,
    pdf_path: sameSource ? existing?.pdf_path ?? null : null,
    download_filename_docx: sameSource ? existing?.download_filename_docx ?? null : null,
    download_filename_pdf: sameSource ? existing?.download_filename_pdf ?? null : null,
    qa_status: sameSource ? existing?.qa_status ?? 'BUILD_PASS' : 'BUILD_PASS',
    visual_qa_status: 'PASS',
    docx_page_count: chapter.docx_page_count ?? (sameSource ? existing?.docx_page_count ?? null : null),
    pdf_page_count: sameSource ? existing?.pdf_page_count ?? null : null,
  };
}

export function mergeBookPublicationOverlay(
  base: WcmReleaseManifest,
  overlay: BookPublicationOverlay,
): WcmReleaseManifest {
  const documents = [...base.documents];
  const byId = new Map(documents.map((doc, index) => [doc.document_id, index]));

  for (const chapter of overlay.chapters) {
    const id = `wcm-process-memory-book-ch${String(chapter.number).padStart(2, '0')}`;
    const existingIndex = byId.get(id);
    const existing = existingIndex === undefined ? undefined : documents[existingIndex];
    const projected = projectedDocument(chapter, overlay.book_id, existing);

    if (existingIndex === undefined) {
      byId.set(id, documents.length);
      documents.push(projected);
    } else {
      documents[existingIndex] = projected;
    }
  }

  const books = base.books.map((book) => {
    if (book.book_id !== overlay.book_id) return book;

    const available = new Map(
      overlay.chapters.map((chapter) => [
        String(chapter.number),
        `wcm-process-memory-book-ch${String(chapter.number).padStart(2, '0')}`,
      ]),
    );

    const sections = book.sections.map((section) => ({
      ...section,
      chapters: section.chapters.map((chapter) => {
        const documentId = available.get(String(chapter.number));
        if (!documentId) return chapter;
        const published = overlay.chapters.find((item) => String(item.number) === String(chapter.number));
        return {
          ...chapter,
          title: published?.title ?? chapter.title,
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
      index_source_path: overlay.index_source_path,
      index_source_sha: overlay.index_source_sha,
      frozen_chapters: Math.max(frozenChapters, overlay.latest_complete_chapter),
      sections,
    };
  });

  return {
    ...base,
    source_of_truth: 'GitHub WCM-LAB/main — static release + deterministic live book projection',
    generated_at: overlay.publication_fingerprint,
    documents,
    books,
  };
}
