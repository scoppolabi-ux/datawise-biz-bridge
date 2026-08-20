/**
 * Markdown -> normalized block model shared by the DOCX and PDF generators.
 * Keeping a single intermediate model guarantees that both release formats
 * render the same structure from the same source SHA.
 */
import { marked } from 'marked';

/**
 * @typedef {{ text: string, bold?: boolean, italic?: boolean, code?: boolean, href?: string }} Span
 */

/** Flatten marked inline tokens into styled spans. */
export function inlineSpans(tokens, inherited = {}) {
  const out = [];
  for (const token of tokens ?? []) {
    switch (token.type) {
      case 'strong':
        out.push(...inlineSpans(token.tokens, { ...inherited, bold: true }));
        break;
      case 'em':
        out.push(...inlineSpans(token.tokens, { ...inherited, italic: true }));
        break;
      case 'del':
        out.push(...inlineSpans(token.tokens, inherited));
        break;
      case 'codespan':
        out.push({ ...inherited, text: token.text, code: true });
        break;
      case 'link':
        out.push(
          ...inlineSpans(token.tokens, { ...inherited, href: token.href }).map((s) => ({
            ...s,
            href: token.href,
          })),
        );
        break;
      case 'image':
        out.push({ ...inherited, text: token.text || token.href || '' });
        break;
      case 'br':
        out.push({ ...inherited, text: ' ' });
        break;
      case 'escape':
      case 'text':
        if (token.tokens?.length) out.push(...inlineSpans(token.tokens, inherited));
        else out.push({ ...inherited, text: decode(token.text ?? '') });
        break;
      default:
        if (token.tokens?.length) out.push(...inlineSpans(token.tokens, inherited));
        else if (token.text) out.push({ ...inherited, text: decode(token.text) });
    }
  }
  return out.filter((s) => s.text !== '');
}

function decode(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function spansToPlainText(spans) {
  return spans.map((s) => s.text).join('');
}

function listItems(token, depth, blocks) {
  token.items.forEach((item, index) => {
    const itemTokens = item.tokens ?? [];
    const lead = [];
    const rest = [];
    for (const t of itemTokens) {
      if (t.type === 'text' || t.type === 'paragraph') {
        if (rest.length === 0) lead.push(t);
        else rest.push(t);
      } else {
        rest.push(t);
      }
    }
    blocks.push({
      type: 'listItem',
      ordered: Boolean(token.ordered),
      depth,
      index: (Number(token.start) || 1) + index,
      spans: inlineSpans(lead.flatMap((t) => t.tokens ?? [{ type: 'text', text: t.text ?? '' }])),
    });
    for (const t of rest) {
      if (t.type === 'list') listItems(t, depth + 1, blocks);
      else pushBlock(t, blocks, depth + 1);
    }
  });
}

function pushBlock(token, blocks, depth = 0) {
  switch (token.type) {
    case 'space':
      break;
    case 'heading':
      blocks.push({
        type: 'heading',
        depth: Math.min(token.depth, 4),
        spans: inlineSpans(token.tokens),
      });
      break;
    case 'paragraph':
      blocks.push({ type: 'paragraph', indent: depth, spans: inlineSpans(token.tokens) });
      break;
    case 'text':
      blocks.push({
        type: 'paragraph',
        indent: depth,
        spans: token.tokens ? inlineSpans(token.tokens) : [{ text: decode(token.text ?? '') }],
      });
      break;
    case 'code':
      blocks.push({ type: 'code', lang: token.lang || '', text: token.text ?? '' });
      break;
    case 'blockquote': {
      const inner = [];
      for (const t of token.tokens ?? []) pushBlock(t, inner, depth);
      blocks.push({ type: 'blockquote', blocks: inner });
      break;
    }
    case 'list':
      listItems(token, depth, blocks);
      break;
    case 'table':
      blocks.push({
        type: 'table',
        header: (token.header ?? []).map((cell) => inlineSpans(cell.tokens)),
        rows: (token.rows ?? []).map((row) => row.map((cell) => inlineSpans(cell.tokens))),
      });
      break;
    case 'hr':
      blocks.push({ type: 'hr' });
      break;
    case 'html':
      // Raw HTML is not rendered in release artifacts; keep the text as a paragraph
      // only when it carries visible content.
      {
        const stripped = (token.text ?? '').replace(/<[^>]*>/g, '').trim();
        if (stripped) blocks.push({ type: 'paragraph', indent: depth, spans: [{ text: stripped }] });
      }
      break;
    default:
      if (token.text) blocks.push({ type: 'paragraph', indent: depth, spans: [{ text: decode(token.text) }] });
  }
}

/** Strip a leading YAML front matter block, returning body + raw front matter. */
export function splitFrontMatter(markdown) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(markdown);
  if (!match) return { frontMatter: {}, body: markdown };
  const frontMatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_.-]+)\s*:\s*(.*)$/.exec(line.trim());
    if (kv) frontMatter[kv[1].toLowerCase()] = kv[2].replace(/^["']|["']$/g, '').trim();
  }
  return { frontMatter, body: markdown.slice(match[0].length) };
}

/** Parse markdown into the normalized block list. */
export function parseMarkdownBlocks(markdown) {
  const { body } = splitFrontMatter(markdown);
  const tokens = marked.lexer(body);
  const blocks = [];
  for (const token of tokens) pushBlock(token, blocks);
  return blocks;
}

const DATE_RE = /(\d{4}-\d{2}-\d{2})/;
const VERSION_RE = /\bv\s*([0-9]+[._][0-9]+(?:[._][0-9]+)?)/i;

/**
 * Best-effort metadata extraction from the master document itself.
 * Config values remain the fallback: the pipeline never invents data.
 */
export function extractMetadata(markdown) {
  const { frontMatter, body } = splitFrontMatter(markdown);
  const head = body.split(/\r?\n/).slice(0, 40).join('\n');

  const version =
    frontMatter.version ??
    (VERSION_RE.exec(head)?.[1] ? `V${VERSION_RE.exec(head)[1].replace('.', '_')}` : null);

  const master_date =
    frontMatter.date ?? frontMatter.master_date ?? DATE_RE.exec(head)?.[1] ?? null;

  const statusLine = /(?:^|\n)\s*[-*>|#\s]*status\s*[:|]\s*([A-Za-z_ -]+)/i.exec(head);
  const status = frontMatter.status ?? (statusLine ? statusLine[1].trim().toUpperCase() : null);

  const titleLine = /(?:^|\n)#\s+(.+)/.exec(body);
  const title = frontMatter.title ?? (titleLine ? titleLine[1].trim() : null);

  return { version, master_date, status, title };
}
