import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { assetUrl } from './wcmDocumentation';
import { slugify } from './wcmToc';

const nodeText = (node: React.ReactNode): string => {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join('');
  if (React.isValidElement(node)) return nodeText((node.props as { children?: React.ReactNode }).children);
  return '';
};

const resolveImageSrc = (src: string | undefined, markdownPath?: string): string | undefined => {
  if (!src) return src;
  if (/^(?:https?:|data:|blob:)/i.test(src) || src.startsWith('/')) return src;
  if (!markdownPath) return src;
  const baseDir = markdownPath.includes('/') ? markdownPath.slice(0, markdownPath.lastIndexOf('/')) : '';
  return assetUrl(`${baseDir}/${src}`);
};

/**
 * Safe Markdown renderer: raw HTML is NOT enabled (no rehype-raw),
 * so arbitrary HTML in the source content is escaped, not executed.
 *
 * H1/H2/H3 receive deterministic unique slug ids (same algorithm as
 * `wcmToc.extractHeadings`) so a table of contents can link to them.
 */
const WcmMarkdown = ({ content, markdownPath }: { content: string; markdownPath?: string }) => {
  // Recreated on every render pass so ids stay stable and unique.
  const seen = new Map<string, number>();
  const headingId = (children: React.ReactNode) => {
    const base = slugify(nodeText(children));
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  };

  return (
  <div
    className="
      prose prose-invert prose-sm max-w-none break-words
      prose-headings:text-wcm-strong prose-headings:font-semibold prose-headings:tracking-tight
      prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
      prose-p:text-wcm-text prose-li:text-wcm-text prose-li:marker:text-wcm-accent
      prose-strong:text-wcm-strong
      prose-a:text-wcm-accent prose-a:underline-offset-2
      prose-code:text-wcm-accent prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-wcm-bg prose-pre:border prose-pre:border-wcm-line prose-pre:text-wcm-text
      prose-hr:border-wcm-line
      prose-blockquote:border-l-2 prose-blockquote:border-wcm-accent/60 prose-blockquote:text-wcm-muted prose-blockquote:not-italic
      prose-th:text-wcm-strong prose-td:text-wcm-text
    "
  >
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, children, ...props }) => (
          <h1 {...props} id={headingId(children)} className="scroll-mt-24">{children}</h1>
        ),
        h2: ({ node, children, ...props }) => (
          <h2 {...props} id={headingId(children)} className="scroll-mt-24">{children}</h2>
        ),
        h3: ({ node, children, ...props }) => (
          <h3 {...props} id={headingId(children)} className="scroll-mt-24">{children}</h3>
        ),
        a: ({ node, ...props }) => (
          <a {...props} target="_blank" rel="noopener noreferrer nofollow" />
        ),
        img: ({ node, src, alt, ...props }) => (
          <img
            {...props}
            src={resolveImageSrc(src, markdownPath)}
            alt={alt ?? ''}
            className="my-5 h-auto max-w-full rounded-lg border border-wcm-line bg-white"
            loading="lazy"
          />
        ),
        table: ({ node, ...props }) => (
          <div className="my-4 w-full max-w-full overflow-x-auto rounded-lg border border-wcm-line">
            <table
              {...props}
              className="m-0 w-full min-w-[520px] border-collapse text-left text-xs"
            />
          </div>
        ),
        thead: ({ node, ...props }) => <thead {...props} className="bg-wcm-panel" />,
        th: ({ node, ...props }) => (
          <th
            {...props}
            className="whitespace-nowrap border-b border-wcm-line px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-wcm-strong"
          />
        ),
        td: ({ node, ...props }) => (
          <td {...props} className="border-b border-wcm-line/60 px-3 py-2 align-top text-wcm-text" />
        ),
        pre: ({ node, ...props }) => (
          <pre {...props} className="overflow-x-auto rounded-lg border border-wcm-line bg-wcm-bg p-3 text-xs" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
  );
};

export default WcmMarkdown;
