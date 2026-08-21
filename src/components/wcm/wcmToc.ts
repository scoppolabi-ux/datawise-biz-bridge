/**
 * WCM Documentation Center — table of contents helpers.
 *
 * Headings are extracted from the actual Markdown source of the selected
 * release snapshot (never hardcoded per document). Slugs are deterministic
 * and unique so anchors stay stable between renders.
 */

export type WcmTocEntry = {
  id: string;
  text: string;
  level: number;
};

/** GitHub-ish slug: lowercase, accents stripped, non-word chars collapsed. */
export function slugify(text: string): string {
  const base = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || 'sezione';
}

const stripInline = (text: string) =>
  text
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__|\*|_)/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Extract H1/H2/H3 headings in document order, ignoring fenced code blocks.
 * Duplicate slugs get a numeric suffix (`-2`, `-3`, ...).
 */
export function extractHeadings(markdown: string, maxLevel = 3): WcmTocEntry[] {
  const entries: WcmTocEntry[] = [];
  const seen = new Map<string, number>();
  let inFence = false;

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (/^\s{0,3}(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{1,6})\s+(.*)$/.exec(line.trim());
    if (!match) continue;
    const level = match[1].length;
    if (level > maxLevel) continue;
    const text = stripInline(match[2].replace(/\s+#+\s*$/, ''));
    if (!text) continue;

    const base = slugify(text);
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    entries.push({ id: count === 1 ? base : `${base}-${count}`, text, level });
  }

  return entries;
}

/**
 * TOC shown to the user: the leading document title is dropped when it would
 * duplicate the reader header.
 */
export function buildToc(markdown: string, documentTitle?: string): WcmTocEntry[] {
  const headings = extractHeadings(markdown);
  if (!headings.length) return [];
  const first = headings[0];
  const duplicatesTitle =
    first.level === 1 &&
    documentTitle &&
    slugify(first.text) === slugify(documentTitle);
  const rest = duplicatesTitle ? headings.slice(1) : headings;
  return rest.length >= 2 ? rest : [];
}

/** Minimum heading level present, used to normalize indentation. */
export function baseLevel(entries: WcmTocEntry[]): number {
  return entries.reduce((min, e) => Math.min(min, e.level), 6);
}
