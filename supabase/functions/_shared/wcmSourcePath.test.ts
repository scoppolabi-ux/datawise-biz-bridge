import { describe, expect, it } from 'vitest';
import { githubContentsUrl, validateSourcePath } from './wcmSourcePath';

describe('validateSourcePath', () => {
  it('accetta i path reali dei documenti PRIMA DI NOI', () => {
    for (const path of [
      'projects/prima-di-noi/outputs/CHAPTER_07_VITE_NON_SUE_CANDIDATE_V0_1.md',
      'projects/prima-di-noi/outputs/CHAPTER_07_V0_1_EDITORIAL_BOARD_REPORT.md',
    ]) {
      const result = validateSourcePath('prima-di-noi', path);
      expect(result).toEqual({ ok: true, path });
    }
  });

  it('rifiuta path fuori dal prefisso del progetto', () => {
    const r = validateSourcePath('prima-di-noi', 'projects/altro/outputs/X.md');
    expect(r.ok).toBe(false);
    expect(r.ok === false && r.code).toBe('PATH_OUT_OF_SCOPE');
  });

  it('rifiuta traversal, backslash, path assoluti e URL', () => {
    const cases = [
      'projects/prima-di-noi/../../secrets.md',
      'projects\\prima-di-noi\\outputs\\X.md',
      '/projects/prima-di-noi/outputs/X.md',
      'https://example.com/projects/prima-di-noi/outputs/X.md',
      'projects/prima-di-noi//outputs/X.md',
    ];
    for (const path of cases) {
      expect(validateSourcePath('prima-di-noi', path).ok).toBe(false);
    }
  });

  it('rifiuta file non markdown e project_id non valido', () => {
    expect(validateSourcePath('prima-di-noi', 'projects/prima-di-noi/outputs/X.pdf').ok).toBe(false);
    expect(validateSourcePath('../x', 'projects/../x/outputs/X.md').ok).toBe(false);
    expect(validateSourcePath('', 'projects//outputs/X.md').ok).toBe(false);
  });

  it('costruisce un URL deterministico sul repo allowlistato', () => {
    expect(githubContentsUrl('projects/prima-di-noi/outputs/A_B.md')).toBe(
      'https://api.github.com/repos/scoppolabi-ux/WCM-LAB/contents/projects/prima-di-noi/outputs/A_B.md?ref=main',
    );
  });
});
