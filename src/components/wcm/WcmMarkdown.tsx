import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Safe Markdown renderer: raw HTML is NOT enabled (no rehype-raw),
 * so arbitrary HTML in the source content is escaped, not executed.
 */
const WcmMarkdown = ({ content }: { content: string }) => (
  <div className="prose prose-invert prose-sm max-w-none prose-headings:text-wcm-strong prose-p:text-wcm-text prose-li:text-wcm-text prose-strong:text-wcm-strong prose-a:text-wcm-accent prose-code:text-wcm-accent prose-hr:border-wcm-line prose-blockquote:border-wcm-line-strong prose-blockquote:text-wcm-muted">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ node, ...props }) => (
          <a {...props} target="_blank" rel="noopener noreferrer nofollow" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default WcmMarkdown;
