import { describe, expect, it } from 'vitest';
import { baseLevel, buildToc, extractHeadings, slugify } from './wcmToc';

describe('slugify', () => {
  it('normalizes accents, case and punctuation', () => {
    expect(slugify('1. Perché è così?')).toBe('1-perche-e-cosi');
    expect(slugify('   ')).toBe('sezione');
  });
});

describe('extractHeadings', () => {
  const md = [
    '# WCM — User Manual',
    'testo',
    '## Sezione A',
    '```',
    '# non è un heading',
    '```',
    '### Dettaglio `tecnico`',
    '## Sezione A',
    '#### Troppo profondo',
  ].join('\n');

  it('extracts H1/H2/H3 in order, ignoring code fences and deep levels', () => {
    expect(extractHeadings(md).map((h) => [h.level, h.text])).toEqual([
      [1, 'WCM — User Manual'],
      [2, 'Sezione A'],
      [3, 'Dettaglio tecnico'],
      [2, 'Sezione A'],
    ]);
  });

  it('produces unique slugs for duplicated headings', () => {
    const ids = extractHeadings(md).map((h) => h.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain('sezione-a');
    expect(ids).toContain('sezione-a-2');
  });
});

describe('buildToc', () => {
  it('drops the leading title heading when it duplicates the document title', () => {
    const toc = buildToc('# WCM User Manual\n## Uno\n## Due', 'WCM User Manual');
    expect(toc.map((t) => t.text)).toEqual(['Uno', 'Due']);
  });

  it('keeps headings when the first one is not the title', () => {
    const toc = buildToc('# Uno\n## Due', 'Altro documento');
    expect(toc).toHaveLength(2);
  });

  it('hides a toc with fewer than two entries', () => {
    expect(buildToc('# Solo titolo', 'Solo titolo')).toEqual([]);
  });

  it('normalizes indentation baseline', () => {
    expect(baseLevel(buildToc('# T\n## A\n### B', 'T'))).toBe(2);
  });
});
