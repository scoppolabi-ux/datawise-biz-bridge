/**
 * PDF release renderer (A4) for WCM documentation masters.
 * Layout is flow-based with explicit page-break management: no clipping.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PDFDocument from 'pdfkit';
import { spansToPlainText } from './markdown.mjs';

const FONT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fonts');

const MARGIN = 56; // ~2 cm
// Unicode-capable vendored fonts: the masters use arrows, box drawing and
// symbols that the PDF base-14 fonts cannot encode.
const FONT = 'DejaVu';
const FONT_BOLD = 'DejaVu-Bold';
const FONT_ITALIC = 'DejaVu-Italic';
const FONT_MONO = 'DejaVu-Mono';
const FONT_MONO_BOLD = 'DejaVu-Mono-Bold';

function registerFonts(doc) {
  doc.registerFont(FONT, path.join(FONT_DIR, 'DejaVuSans.ttf'));
  doc.registerFont(FONT_BOLD, path.join(FONT_DIR, 'DejaVuSans-Bold.ttf'));
  doc.registerFont(FONT_ITALIC, path.join(FONT_DIR, 'DejaVuSans-Oblique.ttf'));
  doc.registerFont(FONT_MONO, path.join(FONT_DIR, 'DejaVuSansMono.ttf'));
  doc.registerFont(FONT_MONO_BOLD, path.join(FONT_DIR, 'DejaVuSansMono-Bold.ttf'));
}


const HEADING = {
  1: { size: 18, gapBefore: 18, gapAfter: 8, color: '#1F3864' },
  2: { size: 15, gapBefore: 14, gapAfter: 6, color: '#1F4E79' },
  3: { size: 13, gapBefore: 12, gapAfter: 5, color: '#2E5C8A' },
  4: { size: 11.5, gapBefore: 10, gapAfter: 4, color: '#333333' },
};

const BODY_SIZE = 10.5;

function fontFor(span) {
  if (span.code) return span.bold ? FONT_MONO_BOLD : FONT_MONO;
  if (span.bold) return FONT_BOLD;
  if (span.italic) return FONT_ITALIC;
  return FONT;
}


/**
 * Render styled spans as one continued, wrapping text flow.
 * NOTE: pdfkit only keeps segments on the same line when the continuation
 * calls omit explicit coordinates, so the cursor is positioned up-front.
 */
function writeSpans(doc, spans, { x, width, size = BODY_SIZE, color = '#1A1A1A' }) {
  const list = spans.length ? spans : [{ text: ' ' }];
  doc.x = x;
  doc.fontSize(size);
  list.forEach((span, i) => {
    doc
      .font(fontFor(span))
      .fontSize(size)
      .fillColor(span.href ? '#1F4E79' : span.code ? '#8A2222' : color)
      .text(span.text, {
        width,
        continued: i < list.length - 1,
        align: 'left',
        lineGap: 1.5,
      });
  });
  doc.x = x;
  doc.fillColor('#1A1A1A').font(FONT);
}

function measureSpans(doc, spans, width, size = BODY_SIZE) {
  doc.fontSize(size);
  let height = 0;
  let lineText = '';
  for (const span of spans) lineText += span.text;
  const bold = spans.some((s) => s.bold);
  doc.font(bold ? FONT_BOLD : FONT);
  height = doc.heightOfString(lineText || ' ', { width, lineGap: 1.5 });
  doc.font(FONT);
  return height;
}

function ensureSpace(doc, needed) {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + needed > bottom) doc.addPage();
}

function renderTable(doc, block, contentWidth) {
  const columns = Math.max(block.header.length, ...block.rows.map((r) => r.length), 1);
  const size = columns > 4 ? 7.5 : columns > 3 ? 8.5 : 9.5;

  // Graceful degradation: too many columns for A4 -> render as labelled blocks.
  if (columns > 6) {
    const labels = block.header.map(spansToPlainText);
    for (const row of block.rows) {
      ensureSpace(doc, 40);
      row.forEach((cell, i) => {
        writeSpans(
          doc,
          [{ text: `${labels[i] ?? `#${i + 1}`}: `, bold: true }, ...cell],
          { x: MARGIN + 10, width: contentWidth - 10, size: BODY_SIZE - 0.5 },
        );
      });
      doc.moveDown(0.4);
    }
    return;
  }

  const colWidth = contentWidth / columns;
  const padding = 5;
  const cellWidth = colWidth - padding * 2;

  const drawRow = (cells, header) => {
    const heights = Array.from({ length: columns }, (_, i) =>
      measureSpans(doc, cells[i] ?? [{ text: '' }], cellWidth, size),
    );
    const rowHeight = Math.max(...heights, size + 4) + padding * 2;
    ensureSpace(doc, rowHeight + 2);
    const top = doc.y;
    if (header) doc.rect(MARGIN, top, contentWidth, rowHeight).fill('#EDF2F7');
    for (let i = 0; i < columns; i += 1) {
      const x = MARGIN + colWidth * i;
      doc.lineWidth(0.5).strokeColor('#BFBFBF').rect(x, top, colWidth, rowHeight).stroke();
      doc.y = top + padding;
      const cell = (cells[i] ?? []).map((s) => ({ ...s, bold: s.bold || header }));
      writeSpans(doc, cell.length ? cell : [{ text: '' }], {
        x: x + padding,
        width: cellWidth,
        size,
      });
    }
    doc.y = top + rowHeight;
  };

  if (block.header.length) drawRow(block.header, true);
  for (const row of block.rows) drawRow(row, false);
  doc.x = MARGIN;
  doc.moveDown(0.6);
}

function renderBlock(doc, block, contentWidth, quoted = false) {
  switch (block.type) {
    case 'heading': {
      const style = HEADING[block.depth] ?? HEADING[4];
      doc.moveDown(0);
      doc.y += style.gapBefore;
      ensureSpace(doc, style.size * 2.4);
      writeSpans(
        doc,
        block.spans.map((s) => ({ ...s, bold: true })),
        { x: MARGIN, width: contentWidth, size: style.size, color: style.color },
      );
      doc.y += style.gapAfter;
      break;
    }
    case 'paragraph': {
      const indent = (block.indent ?? 0) * 14 + (quoted ? 14 : 0);
      const width = contentWidth - indent;
      ensureSpace(doc, measureSpans(doc, block.spans, width) + 4);
      if (quoted) {
        const top = doc.y;
        const height = measureSpans(doc, block.spans, width);
        doc.lineWidth(2).strokeColor('#C00000')
          .moveTo(MARGIN + 3, top).lineTo(MARGIN + 3, top + height).stroke();
      }
      writeSpans(doc, quoted ? block.spans.map((s) => ({ ...s, italic: true })) : block.spans, {
        x: MARGIN + indent,
        width,
        color: quoted ? '#444444' : '#1A1A1A',
      });
      doc.y += 5;
      break;
    }
    case 'listItem': {
      const indent = 12 + (block.depth ?? 0) * 16;
      const marker = block.ordered ? `${block.index}.` : ['•', '–', '·'][Math.min(block.depth ?? 0, 2)];
      const markerWidth = 18;
      const width = contentWidth - indent - markerWidth;
      ensureSpace(doc, measureSpans(doc, block.spans, width) + 4);
      const top = doc.y;
      doc.font(FONT).fontSize(BODY_SIZE).fillColor('#1A1A1A')
        .text(marker, MARGIN + indent, top, { width: markerWidth });
      doc.y = top;
      writeSpans(doc, block.spans, { x: MARGIN + indent + markerWidth, width });
      doc.y += 3;
      break;
    }
    case 'code': {
      const lines = block.text.replace(/\t/g, '    ').split('\n');
      const maxSize = 8.5;
      const minSize = 5.2;
      const avail = contentWidth - 16;
      doc.font(FONT_MONO).fontSize(maxSize);
      const longest = lines.reduce((m, l) => Math.max(m, doc.widthOfString(l || ' ')), 0);
      // Shrink to fit so ASCII diagrams never wrap or overflow the box.
      const size = longest > avail ? Math.max(minSize, (maxSize * avail) / longest) : maxSize;
      const lineHeight = size * 1.34;
      let i = 0;
      while (i < lines.length) {
        let limit = doc.page.height - doc.page.margins.bottom;
        if (doc.y + lineHeight + 12 > limit) {
          doc.addPage();
          limit = doc.page.height - doc.page.margins.bottom;
        }
        const fit = Math.max(1, Math.floor((limit - doc.y - 12) / lineHeight));
        const chunk = lines.slice(i, i + fit);
        const top = doc.y;
        doc.rect(MARGIN, top, contentWidth, chunk.length * lineHeight + 12).fill('#F4F4F4');
        let yy = top + 6;
        for (const line of chunk) {
          doc.font(FONT_MONO).fontSize(size).fillColor('#333333')
            .text(line || ' ', MARGIN + 8, yy, { width: avail, lineBreak: false });
          yy += lineHeight;
        }
        doc.y = yy + 6;
        i += chunk.length;
      }
      doc.x = MARGIN;
      doc.font(FONT).fontSize(BODY_SIZE).fillColor('#1A1A1A');
      doc.y += 6;
      break;
    }

    case 'blockquote':
      for (const inner of block.blocks) renderBlock(doc, inner, contentWidth, true);
      break;
    case 'table':
      renderTable(doc, block, contentWidth);
      break;
    case 'hr':
      ensureSpace(doc, 16);
      doc.moveTo(MARGIN, doc.y + 4).lineTo(MARGIN + contentWidth, doc.y + 4)
        .lineWidth(0.5).strokeColor('#BFBFBF').stroke();
      doc.y += 14;
      break;
    default:
      break;
  }
}

/**
 * @returns {Promise<Buffer>} the PDF release buffer
 */
export function buildPdf({ blocks, meta }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: MARGIN, bottom: MARGIN + 20, left: MARGIN, right: MARGIN },
      info: { Title: `${meta.title} ${meta.version}`, Author: 'DataWisePartners · WCM' },
      autoFirstPage: true,
      bufferPages: true,
    });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('error', reject);
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    const contentWidth = doc.page.width - MARGIN * 2;

    const documentTitle = blocks.find((b) => b.type === 'heading' && b.depth === 1);

    // Cover / metadata header
    doc.font(FONT_BOLD).fontSize(9).fillColor('#C00000')
      .text('DATAWISEPARTNERS · WCM MISSION CONTROL', MARGIN, MARGIN, { width: contentWidth });
    doc.moveDown(0.6);
    doc.font(FONT_BOLD).fontSize(21).fillColor('#111111')
      .text(documentTitle ? spansToPlainText(documentTitle.spans) : meta.title, { width: contentWidth });
    doc.moveDown(0.8);

    const metaRows = [
      ['Pubblico', meta.audience],
      ['Versione', meta.version],
      ['Data master', meta.master_date],
      ['Stato', meta.status],
      ['Source path', meta.source_path],
      ['Source SHA', meta.source_sha_short],
      ['Release', meta.released_at],
    ];
    for (const [label, value] of metaRows) {
      const top = doc.y;
      doc.font(FONT_BOLD).fontSize(9).fillColor('#555555').text(label, MARGIN, top, { width: 110 });
      doc.font(FONT).fontSize(9).fillColor('#222222')
        .text(String(value ?? '—'), MARGIN + 114, top, { width: contentWidth - 114 });
      doc.y = Math.max(doc.y, top) + 2;
    }

    doc.moveDown(0.6);
    doc.font(FONT_ITALIC).fontSize(8.5).fillColor('#666666').text(
      'GitHub main è la source of truth. Questo PDF è una release derivata: non costituisce approvazione né autorità.',
      MARGIN,
      doc.y,
      { width: contentWidth },
    );
    doc.moveDown(0.4);
    doc.moveTo(MARGIN, doc.y).lineTo(MARGIN + contentWidth, doc.y)
      .lineWidth(0.8).strokeColor('#C00000').stroke();
    doc.y += 12;
    doc.fillColor('#1A1A1A').font(FONT).fontSize(BODY_SIZE);

    for (const block of blocks) {
      if (block === documentTitle) continue;
      renderBlock(doc, block, contentWidth);
    }

    // Footers on every page. The bottom margin is temporarily neutralized so
    // pdfkit does not treat the footer as an overflow and append blank pages.
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i += 1) {
      doc.switchToPage(range.start + i);
      const bottom = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;
      doc.font(FONT).fontSize(7.5).fillColor('#888888').text(
        `${meta.title} · ${meta.version} · source ${meta.source_sha_short} · pag. ${i + 1}/${range.count}`,
        MARGIN,
        doc.page.height - MARGIN + 6,
        { width: contentWidth, align: 'center', lineBreak: false },
      );
      doc.page.margins.bottom = bottom;
    }
    doc.flushPages();

    doc.end();
  });
}
