/**
 * Node release renderer: registers the vendored Unicode fonts from disk and
 * delegates the layout to the shared engine in pdfRender.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PDFDocument from 'pdfkit';
import { PDF_FONT_FILES, PDF_OPTIONS, renderPdfContent } from './pdfRender.mjs';

const FONT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fonts');

/**
 * @returns {Promise<Buffer>} the PDF release buffer
 */
export function buildPdf({ blocks, meta }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument(PDF_OPTIONS(meta));
    for (const [name, file] of Object.entries(PDF_FONT_FILES)) {
      doc.registerFont(name, fs.readFileSync(path.join(FONT_DIR, file)));
    }
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('error', reject);
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    renderPdfContent(doc, { blocks, meta });
    doc.end();
  });
}
