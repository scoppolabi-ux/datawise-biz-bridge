/**
 * Type surface for the shared WCM document engine (scripts/wcm-documentation).
 * The engine is plain ESM JavaScript reused verbatim by the Node release
 * pipeline and by the in-app distribution artifacts, so it is declared here
 * instead of being duplicated in TypeScript.
 */
declare module 'wcm-doc-engine/markdown' {
  export type WcmDocSpan = {
    text: string;
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
    href?: string;
  };
  export type WcmDocBlock = Record<string, unknown> & { type: string };
  export function parseMarkdownBlocks(markdown: string): WcmDocBlock[];
  export function extractMetadata(markdown: string): {
    version: string | null;
    master_date: string | null;
    status: string | null;
    title: string | null;
  };
  export function splitFrontMatter(markdown: string): {
    frontMatter: Record<string, string>;
    body: string;
  };
  export function spansToPlainText(spans: WcmDocSpan[]): string;
}

declare module 'wcm-doc-engine/docx' {
  import type { Document } from 'docx';
  export function buildDocxDocument(input: {
    blocks: unknown[];
    meta: Record<string, unknown>;
  }): Document;
}

declare module 'wcm-doc-engine/pdf-render' {
  export const PDF_FONT_FILES: Record<string, string>;
  export function PDF_OPTIONS(meta: Record<string, unknown>): Record<string, unknown>;
  export function renderPdfContent(
    doc: unknown,
    input: { blocks: unknown[]; meta: Record<string, unknown> },
  ): void;
}

declare module 'pdfkit' {
  const PDFDocument: new (options?: Record<string, unknown>) => unknown;
  export default PDFDocument;
}
