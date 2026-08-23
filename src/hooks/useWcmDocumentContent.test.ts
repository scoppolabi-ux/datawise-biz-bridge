import { describe, expect, it } from 'vitest';
import { canFetchSourceContent } from './useWcmDocumentContent';

const doc = (over: Partial<{ content_markdown: string | null; source_path: string | null }> = {}) => ({
  content_markdown: null,
  source_path: 'projects/prima-di-noi/outputs/CHAPTER_07_V0_1_EDITORIAL_BOARD_REPORT.md',
  ...over,
});

describe('fallback di lettura dal sorgente GitHub', () => {
  it('si attiva quando il read model non ha contenuto ma il source_path è valido', () => {
    expect(canFetchSourceContent('prima-di-noi', doc())).toBe(true);
    expect(canFetchSourceContent('prima-di-noi', doc({ content_markdown: '   ' }))).toBe(true);
    expect(
      canFetchSourceContent(
        'prima-di-noi',
        doc({ source_path: 'projects/prima-di-noi/outputs/CHAPTER_07_VITE_NON_SUE_CANDIDATE_V0_1.md' }),
      ),
    ).toBe(true);
  });

  it('non si attiva se il contenuto è già nel read model', () => {
    expect(canFetchSourceContent('prima-di-noi', doc({ content_markdown: '# Titolo' }))).toBe(false);
  });

  it('non si attiva su source_path assente o non valido', () => {
    expect(canFetchSourceContent('prima-di-noi', doc({ source_path: null }))).toBe(false);
    expect(canFetchSourceContent('prima-di-noi', doc({ source_path: 'projects/altro/x.md' }))).toBe(
      false,
    );
    expect(canFetchSourceContent('', doc())).toBe(false);
  });
});
