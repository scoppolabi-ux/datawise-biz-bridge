/**
 * Safe canonical source links.
 *
 * The link is always rebuilt from the allowlisted repository plus the
 * project-scoped `source_path`: arbitrary URLs coming from the read model are
 * never followed. Fail-closed — an invalid path yields no link at all.
 */
export const SOURCE_REPO_OWNER = 'scoppolabi-ux';
export const SOURCE_REPO_NAME = 'WCM-LAB';
export const SOURCE_REPO_REF = 'main';

const INVALID = /(\.\.|\\|\/\/|^\/|^[a-zA-Z][a-zA-Z0-9+.-]*:|\s)/;

/** Validate a project-scoped markdown path exactly like the backend does. */
export const isSafeSourcePath = (projectId: string, sourcePath: string | null | undefined) => {
  const path = (sourcePath ?? '').trim();
  const project = (projectId ?? '').trim();
  if (!path || !project) return false;
  if (INVALID.test(path)) return false;
  if (!path.startsWith(`projects/${project}/`)) return false;
  return path.toLowerCase().endsWith('.md');
};

/** GitHub blob URL for a validated source path, or null. */
export const sourceLink = (
  projectId: string,
  sourcePath: string | null | undefined,
): string | null => {
  if (!isSafeSourcePath(projectId, sourcePath)) return null;
  const path = (sourcePath as string)
    .trim()
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `https://github.com/${SOURCE_REPO_OWNER}/${SOURCE_REPO_NAME}/blob/${SOURCE_REPO_REF}/${path}`;
};
