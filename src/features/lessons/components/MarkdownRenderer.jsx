import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./Codeblock";

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
                        const language = match ? match[1] : "text";
                        const code = String(children).replace(/\n$/, "");

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

                        return <CodeBlock language={language} code={code} />;
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
