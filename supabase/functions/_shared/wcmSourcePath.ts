/**
 * Fail-closed validation of a WCM document `source_path`.
 *
 * INVARIANTE: il client non può mai fornire un URL o un repo. Il path deve
 * essere esattamente relativo a `projects/<project_id>/` dentro il repo
 * allowlistato, terminare in `.md` e non contenere traversal o schemi.
 */

export const WCM_REPO_OWNER = 'scoppolabi-ux';
export const WCM_REPO_NAME = 'WCM-LAB';
export const WCM_REPO_REF = 'main';

export type SourcePathValidation =
  | { ok: true; path: string }
  | { ok: false; error: string; code: string };

const PROJECT_ID_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;
const SEGMENT_RE = /^[A-Za-z0-9._-]+$/;

export const validateSourcePath = (
  projectIdRaw: unknown,
  sourcePathRaw: unknown,
): SourcePathValidation => {
  const projectId = typeof projectIdRaw === 'string' ? projectIdRaw.trim() : '';
  const path = typeof sourcePathRaw === 'string' ? sourcePathRaw.trim() : '';

  if (!projectId || !PROJECT_ID_RE.test(projectId)) {
    return { ok: false, error: 'project_id non valido', code: 'INVALID_PROJECT_ID' };
  }
  if (!path) {
    return { ok: false, error: 'source_path mancante', code: 'MISSING_SOURCE_PATH' };
  }
  if (path.includes('\\') || path.includes('..') || path.includes('//')) {
    return { ok: false, error: 'source_path contiene una sequenza non ammessa', code: 'UNSAFE_PATH' };
  }
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(path) || path.startsWith('/')) {
    return { ok: false, error: 'source_path deve essere relativo al repository', code: 'UNSAFE_PATH' };
  }
  if (/[\s?#%]/.test(path)) {
    return { ok: false, error: 'source_path contiene caratteri non ammessi', code: 'UNSAFE_PATH' };
  }
  const prefix = `projects/${projectId}/`;
  if (!path.startsWith(prefix)) {
    return {
      ok: false,
      error: `source_path deve iniziare con ${prefix}`,
      code: 'PATH_OUT_OF_SCOPE',
    };
  }
  if (!path.endsWith('.md')) {
    return { ok: false, error: 'source_path deve terminare con .md', code: 'NOT_MARKDOWN' };
  }
  const segments = path.split('/');
  if (segments.length < 3 || !segments.every((s) => SEGMENT_RE.test(s))) {
    return { ok: false, error: 'source_path non valido', code: 'UNSAFE_PATH' };
  }

  return { ok: true, path };
};

/** URL deterministico dell'API contents (repo/ref hard-coded). */
export const githubContentsUrl = (path: string) =>
  `https://api.github.com/repos/${WCM_REPO_OWNER}/${WCM_REPO_NAME}/contents/${path
    .split('/')
    .map(encodeURIComponent)
    .join('/')}?ref=${WCM_REPO_REF}`;
