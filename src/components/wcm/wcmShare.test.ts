import { describe, expect, it } from 'vitest';
import { preferredShareFormat } from './wcmShare';
import { isSafeSourcePath, sourceLink } from './wcmSourceLink';
import { artifactBaseName, artifactFileName, canBuildArtifacts } from '@/lib/wcmArtifacts';

const doc = (over: Record<string, unknown> = {}) => ({
  document_id: 'chapter-07-vite-non-sue-candidate-v0-1',
  title: 'Chapter 7 — Vite non sue — Candidate V0.1',
  version: '0.1',
  distribution_ready: true,
  content_markdown: '# Titolo\n\nCorpo.',
  ...over,
}) as never;

describe('artifact naming', () => {
  it('produces portable docx/pdf filenames, never .txt', () => {
    expect(artifactFileName(doc(), 'APPROVED_FROZEN', 'docx')).toBe(
      'Chapter-7-Vite-non-sue-Candidate-V0.1-v0.1.docx',
    );
    expect(artifactFileName(doc(), 'APPROVED_FROZEN', 'pdf')).toMatch(/\.pdf$/);
    expect(artifactFileName(doc(), 'APPROVED_FROZEN', 'pdf')).not.toMatch(/\.txt$/);
  });

  it('marks non-approved and unclassified artifacts', () => {
    expect(artifactBaseName(doc(), 'WAITING_AUTHORITY')).toContain('-UNAPPROVED');
    expect(artifactBaseName(doc(), 'UNKNOWN')).toContain('-DA-CLASSIFICARE');
  });

  it('requires canonical markdown to build artifacts', () => {
    expect(canBuildArtifacts(doc())).toBe(true);
    expect(canBuildArtifacts(doc({ content_markdown: '   ' }))).toBe(false);
    expect(canBuildArtifacts(doc({ content_markdown: null }))).toBe(false);
  });
});

describe('source link', () => {
  const project = 'prima-di-noi';
  const ok = 'projects/prima-di-noi/outputs/CHAPTER_07_V0_1_EDITORIAL_BOARD_REPORT.md';

  it('builds an allowlisted GitHub blob url from source_path', () => {
    expect(sourceLink(project, ok)).toBe(
      `https://github.com/scoppolabi-ux/WCM-LAB/blob/main/${ok}`,
    );
  });

  it('fails closed on unsafe or foreign paths', () => {
    expect(isSafeSourcePath(project, ok)).toBe(true);
    for (const bad of [
      'projects/other-project/outputs/X.md',
      'projects/prima-di-noi/../secrets.md',
      '/projects/prima-di-noi/x.md',
      'https://evil.example/x.md',
      'projects/prima-di-noi/outputs/x.txt',
      'projects\\prima-di-noi\\x.md',
      '',
      null,
    ]) {
      expect(isSafeSourcePath(project, bad as string)).toBe(false);
      expect(sourceLink(project, bad as string)).toBeNull();
    }
  });
});

describe('share fallbacks', () => {
  it('prefers PDF, then Word, then link-only', () => {
    expect(preferredShareFormat(['pdf', 'docx'])).toBe('pdf');
    expect(preferredShareFormat(['docx'])).toBe('docx');
    expect(preferredShareFormat([])).toBeNull();
  });
});
