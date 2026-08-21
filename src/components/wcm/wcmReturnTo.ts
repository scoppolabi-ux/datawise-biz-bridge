/**
 * V0.5.6 Navigation Context.
 * Internal-only `returnTo` handling for the document reader.
 * A returnTo is accepted only when it is a safe internal WCM route.
 */

export const DEFAULT_BACK_LABEL = 'Torna ai documenti';

/** Returns the returnTo if it is a safe internal WCM route, otherwise null. */
export const safeReturnTo = (value: string | null | undefined): string | null => {
  if (!value) return null;
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return null;
  }
  // Reject protocol-relative URLs, absolute URLs, backslashes and control chars.
  if (!decoded.startsWith('/wcm')) return null;
  if (decoded.startsWith('//')) return null;
  if (/[\\\s]/.test(decoded)) return null;
  if (decoded.length > 512) return null;
  if (decoded.split('/').includes('..')) return null;
  // Must be exactly /wcm or /wcm/... or /wcm?... 
  if (!/^\/wcm(\/[^?#]*)?(\?[^#]*)?$/.test(decoded)) return null;
  return decoded;
};

/** Appends an internal returnTo query param to a WCM path. */
export const withReturnTo = (path: string, returnTo: string) => {
  const safe = safeReturnTo(returnTo);
  if (!safe) return path;
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}returnTo=${encodeURIComponent(safe)}`;
};

/** Human-facing Italian label for the reader back button. */
export const backLabelFor = (returnTo: string | null | undefined): string => {
  const safe = safeReturnTo(returnTo);
  if (!safe) return DEFAULT_BACK_LABEL;

  const [pathname, query = ''] = safe.split('?');
  const params = new URLSearchParams(query);

  if (pathname === '/wcm/documents') return 'Torna ai documenti da leggere';
  if (pathname === '/wcm/needs') {
    return params.get('view') === 'pending'
      ? 'Torna alle decisioni in elaborazione'
      : 'Torna a Needs Stefano';
  }
  if (pathname === '/wcm/projects') return 'Torna ai progetti';
  if (pathname === '/wcm/learning') return 'Torna a WCM Learning';
  if (pathname === '/wcm') return 'Torna a Mission Control';

  const tab = params.get('tab');
  if (tab === 'board') return 'Torna al Board';
  if (tab === 'roadmap') return 'Torna alla Roadmap';
  return DEFAULT_BACK_LABEL;
};
