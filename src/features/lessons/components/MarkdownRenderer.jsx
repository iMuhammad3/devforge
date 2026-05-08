import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MarkdownRenderer({ content }) {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1({ children }) {
            return (
              <h1 className="mt-10 scroll-m-20 text-4xl font-bold tracking-tight">
                {children}
              </h1>
            );
          },

          h2({ children }) {
            return (
              <h2 className="mt-10 scroll-m-20 border-b border-border pb-2 text-2xl font-semibold tracking-tight">
                {children}
              </h2>
            );
          },

          h3({ children }) {
            return (
              <h3 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight">
                {children}
              </h3>
            );
          },

          p({ children }) {
            return (
              <p className="leading-8 text-foreground/90">
                {children}
              </p>
            );
          },

          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary underline underline-offset-4"
              >
                {children}
              </a>
            );
          },

          ul({ children }) {
            return (
              <ul className="my-6 ml-6 list-disc space-y-2">
                {children}
              </ul>
            );
          },

          ol({ children }) {
            return (
              <ol className="my-6 ml-6 list-decimal space-y-2">
                {children}
              </ol>
            );
          },

          blockquote({ children }) {
            return (
              <blockquote className="mt-6 border-l-4 border-primary/40 bg-muted px-4 py-2 italic">
                {children}
              </blockquote>
            );
          },

          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            if (inline) {
              return (
                <code
                  className="rounded bg-muted px-1.5 py-0.5 text-sm font-medium text-foreground"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="my-6 overflow-hidden rounded-xl border border-border bg-zinc-950">
                <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
                  <span className="text-xs font-medium text-zinc-400">
                    {language || "code"}
                  </span>
                </div>

                <SyntaxHighlighter
                  language={language}
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    padding: "1rem",
                    background: "transparent",
                    fontSize: "0.875rem",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    },
                  }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}