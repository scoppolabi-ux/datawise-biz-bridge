/**
 * DOCX release renderer (A4) for WCM documentation masters.
 */
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  LevelFormat,
  Packer,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { spansToPlainText } from './markdown.mjs';

// A4 portrait in DXA (1440 = 1 inch)
const PAGE_WIDTH = 11906;
const PAGE_HEIGHT = 16838;
const MARGIN = 1134; // 2 cm
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const HEADING_LEVELS = {
  1: HeadingLevel.HEADING_1,
  2: HeadingLevel.HEADING_2,
  3: HeadingLevel.HEADING_3,
  4: HeadingLevel.HEADING_4,
};

const runs = (spans, extra = {}) =>
  (spans.length ? spans : [{ text: '' }]).map(
    (span) =>
      new TextRun({
        text: span.text,
        bold: span.bold || extra.bold,
        italics: span.italic || extra.italics,
        font: span.code ? 'Courier New' : undefined,
        color: span.href ? '1F4E79' : extra.color,
        size: extra.size,
      }),
  );

const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: 'BFBFBF' };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const cellMargins = { top: 60, bottom: 60, left: 120, right: 120 };

function tableBlock(block) {
  const columns = Math.max(block.header.length, ...block.rows.map((r) => r.length), 1);
  const width = Math.floor(CONTENT_WIDTH / columns);
  const columnWidths = Array.from({ length: columns }, (_, i) =>
    i === columns - 1 ? CONTENT_WIDTH - width * (columns - 1) : width,
  );

  const buildRow = (cells, header) =>
    new TableRow({
      tableHeader: header,
      children: columnWidths.map((w, i) => {
        const spans = cells[i] ?? [];
        return new TableCell({
          borders: cellBorders,
          margins: cellMargins,
          width: { size: w, type: WidthType.DXA },
          shading: header ? { fill: 'EDF2F7', type: ShadingType.CLEAR } : undefined,
          children: [
            new Paragraph({
              spacing: { before: 0, after: 0 },
              children: runs(spans, { bold: header, size: 18 }),
            }),
          ],
        });
      }),
    });

  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths,
    rows: [
      ...(block.header.length ? [buildRow(block.header, true)] : []),
      ...block.rows.map((row) => buildRow(row, false)),
    ],
  });
}

// Each ordered list in the master must restart at 1: Word continues numbering
// when consecutive lists share the same numbering reference, so we allocate one
// reference per contiguous ordered-list group.
let orderedState = { index: 0, active: false };

function renderBlock(block, out, quoted = false) {
  if (!(block.type === 'listItem' && block.ordered)) orderedState.active = false;

  switch (block.type) {
    case 'heading':
      out.push(
        new Paragraph({
          heading: HEADING_LEVELS[block.depth] ?? HeadingLevel.HEADING_4,
          children: runs(block.spans),
        }),
      );
      break;
    case 'paragraph':
      out.push(
        new Paragraph({
          spacing: { after: 120 },
          indent: block.indent ? { left: 360 * block.indent } : undefined,
          border: quoted
            ? { left: { style: BorderStyle.SINGLE, size: 12, color: 'C00000', space: 8 } }
            : undefined,
          children: runs(block.spans, quoted ? { italics: true, color: '444444' } : {}),
        }),
      );
      break;
    case 'listItem':
      out.push(
        new Paragraph({
          spacing: { after: 60 },
          numbering: {
            reference: block.ordered ? 'wcm-numbers' : 'wcm-bullets',
            level: Math.min(block.depth ?? 0, 2),
          },
          children: runs(block.spans),
        }),
      );
      break;
    case 'code':
      for (const line of block.text.split('\n')) {
        out.push(
          new Paragraph({
            spacing: { before: 0, after: 0 },
            shading: { fill: 'F2F2F2', type: ShadingType.CLEAR },
            indent: { left: 240 },
            children: [new TextRun({ text: line || ' ', font: 'Courier New', size: 16 })],
          }),
        );
      }
      out.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
      break;
    case 'blockquote':
      for (const inner of block.blocks) renderBlock(inner, out, true);
      break;
    case 'table':
      out.push(tableBlock(block));
      out.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
      break;
    case 'hr':
      out.push(
        new Paragraph({
          spacing: { before: 120, after: 120 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'BFBFBF', space: 1 } },
          children: [],
        }),
      );
      break;
    default:
      break;
  }
}

function metaTable(meta) {
  const rows = [
    ['Documento', meta.title],
    ['Pubblico', meta.audience],
    ['Versione', meta.version],
    ['Data master', meta.master_date],
    ['Stato', meta.status],
    ['Source path', meta.source_path],
    ['Source SHA', meta.source_sha_short],
    ['Release', meta.released_at],
  ];
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [2800, CONTENT_WIDTH - 2800],
    rows: rows.map(
      ([label, value]) =>
        new TableRow({
          children: [
            new TableCell({
              borders: cellBorders,
              margins: cellMargins,
              width: { size: 2800, type: WidthType.DXA },
              shading: { fill: 'EDF2F7', type: ShadingType.CLEAR },
              children: [
                new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 18 })] }),
              ],
            }),
            new TableCell({
              borders: cellBorders,
              margins: cellMargins,
              width: { size: CONTENT_WIDTH - 2800, type: WidthType.DXA },
              children: [
                new Paragraph({ children: [new TextRun({ text: String(value ?? '—'), size: 18 })] }),
              ],
            }),
          ],
        }),
    ),
  });
}

/**
 * @returns {Promise<Buffer>} the DOCX release buffer
 */
export async function buildDocx({ blocks, meta }) {
  const documentTitle = blocks.find((b) => b.type === 'heading' && b.depth === 1);
  const body = [
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: 'DataWisePartners · WCM Mission Control',
          bold: true,
          color: 'C00000',
          size: 18,
        }),
      ],
    }),
    new Paragraph({
      heading: HeadingLevel.TITLE,
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: documentTitle ? spansToPlainText(documentTitle.spans) : meta.title,
          bold: true,
          size: 40,
        }),
      ],
    }),
    metaTable(meta),
    new Paragraph({
      spacing: { before: 160, after: 240 },
      children: [
        new TextRun({
          text:
            'GitHub main è la source of truth. Questo Word è una release derivata: non costituisce approvazione né autorità.',
          italics: true,
          size: 18,
          color: '555555',
        }),
      ],
    }),
  ];

  for (const block of blocks) {
    if (block === documentTitle) continue;
    renderBlock(block, body);
  }

  const doc = new Document({
    styles: {
      default: { document: { run: { font: 'Calibri', size: 22 } } },
      paragraphStyles: [
        {
          id: 'Title',
          name: 'Title',
          basedOn: 'Normal',
          next: 'Normal',
          run: { size: 40, bold: true, font: 'Calibri' },
          paragraph: { spacing: { after: 200 } },
        },
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { size: 30, bold: true, font: 'Calibri', color: '1F3864' },
          paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 0 },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { size: 26, bold: true, font: 'Calibri', color: '1F4E79' },
          paragraph: { spacing: { before: 220, after: 120 }, outlineLevel: 1 },
        },
        {
          id: 'Heading3',
          name: 'Heading 3',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { size: 23, bold: true, font: 'Calibri', color: '2E5C8A' },
          paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 2 },
        },
        {
          id: 'Heading4',
          name: 'Heading 4',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { size: 22, bold: true, italics: true, font: 'Calibri' },
          paragraph: { spacing: { before: 140, after: 80 }, outlineLevel: 3 },
        },
      ],
    },
    numbering: {
      config: [
        {
          reference: 'wcm-bullets',
          levels: [0, 1, 2].map((level) => ({
            level,
            format: LevelFormat.BULLET,
            text: ['•', '–', '·'][level],
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 480 + level * 360, hanging: 240 } } },
          })),
        },
        {
          reference: 'wcm-numbers',
          levels: [0, 1, 2].map((level) => ({
            level,
            format: level === 1 ? LevelFormat.LOWER_LETTER : LevelFormat.DECIMAL,
            text: `%${level + 1}.`,
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 480 + level * 360, hanging: 240 } } },
          })),
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
            margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${meta.title} · ${meta.version} · source ${meta.source_sha_short} · pag. `,
                    size: 16,
                    color: '777777',
                  }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '777777' }),
                ],
              }),
            ],
          }),
        },
        children: body,
      },
    ],
  });

  return Packer.toBuffer(doc);
}
