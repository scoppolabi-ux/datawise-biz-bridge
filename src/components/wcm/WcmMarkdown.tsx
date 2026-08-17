import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Safe Markdown renderer: raw HTML is NOT enabled (no rehype-raw),
 * so arbitrary HTML in the source content is escaped, not executed.
 */
const WcmMarkdown = ({ content }: { content: string }) => (
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
        a: ({ node, ...props }) => (
          <a {...props} target="_blank" rel="noopener noreferrer nofollow" />
        ),
        // Tables are wrapped so long GFM tables scroll horizontally on mobile
        // instead of blowing out the page layout.
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

export default WcmMarkdown;
