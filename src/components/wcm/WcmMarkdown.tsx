import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Safe Markdown renderer: raw HTML is NOT enabled (no rehype-raw),
 * so arbitrary HTML in the source content is escaped, not executed.
 */
const WcmMarkdown = ({ content }: { content: string }) => (
  <div className="prose prose-invert prose-sm max-w-none prose-headings:text-slate-100 prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-slate-100 prose-a:text-sky-400 prose-code:text-amber-300 prose-hr:border-slate-800 prose-blockquote:border-slate-700 prose-blockquote:text-slate-400">
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
