import { describe, expect, it } from 'vitest';
import {
  extractMetadata,
  parseMarkdownBlocks,
  spansToPlainText,
  splitFrontMatter,
} from './markdown.mjs';

const SAMPLE = `---
title: WCM User Manual
version: V0.1
date: 2026-08-20
status: CURRENT
---

# WCM User Manual

Paragrafo con **grassetto**, *corsivo* e \`codice\`.

## Sezione

- primo
- secondo
  - annidato

1. uno
2. due

> Nota di governance.

\`\`\`json
{ "ok": true }
\`\`\`

| Campo | Valore |
| --- | --- |
| status | CURRENT |

---
`;

describe('splitFrontMatter', () => {
  it('extracts key/value front matter and body', () => {
    const { frontMatter, body } = splitFrontMatter(SAMPLE);
    expect(frontMatter.version).toBe('V0.1');
    expect(body.startsWith('\n# WCM User Manual')).toBe(true);
  });

  it('is a no-op without front matter', () => {
    const { frontMatter, body } = splitFrontMatter('# Titolo\n');
    expect(frontMatter).toEqual({});
    expect(body).toBe('# Titolo\n');
  });
});

describe('parseMarkdownBlocks', () => {
  const blocks = parseMarkdownBlocks(SAMPLE);
  const types = blocks.map((b) => b.type);

  it('covers every structure used by the masters', () => {
    for (const type of ['heading', 'paragraph', 'listItem', 'blockquote', 'code', 'table', 'hr']) {
      expect(types).toContain(type);
    }
  });

  it('keeps inline styling as spans', () => {
    const paragraph = blocks.find((b) => b.type === 'paragraph');
    expect(spansToPlainText(paragraph.spans)).toBe(
      'Paragrafo con grassetto, corsivo e codice.',
    );
    expect(paragraph.spans.some((s) => s.bold)).toBe(true);
    expect(paragraph.spans.some((s) => s.italic)).toBe(true);
    expect(paragraph.spans.some((s) => s.code)).toBe(true);
  });

  it('marks ordered vs bullet list items and nesting depth', () => {
    const items = blocks.filter((b) => b.type === 'listItem');
    expect(items.filter((i) => !i.ordered)).toHaveLength(3);
    expect(items.filter((i) => i.ordered)).toHaveLength(2);
    expect(items.some((i) => i.depth === 1)).toBe(true);
  });

  it('parses tables into header + rows', () => {
    const table = blocks.find((b) => b.type === 'table');
    expect(table.header.map(spansToPlainText)).toEqual(['Campo', 'Valore']);
    expect(table.rows[0].map(spansToPlainText)).toEqual(['status', 'CURRENT']);
  });

  it('preserves code fence content verbatim', () => {
    const code = blocks.find((b) => b.type === 'code');
    expect(code.lang).toBe('json');
    expect(code.text).toBe('{ "ok": true }');
  });
});

describe('extractMetadata', () => {
  it('prefers front matter', () => {
    expect(extractMetadata(SAMPLE)).toMatchObject({
      version: 'V0.1',
      master_date: '2026-08-20',
      status: 'CURRENT',
      title: 'WCM User Manual',
    });
  });

  it('falls back to the document head', () => {
    const meta = extractMetadata('# Guida\n\nVersione: v0.1 — 2026-01-15\n\nStatus: DRAFT\n');
    expect(meta.title).toBe('Guida');
    expect(meta.master_date).toBe('2026-01-15');
    expect(meta.status).toBe('DRAFT');
    expect(meta.version).toBe('V0_1');
  });
});
