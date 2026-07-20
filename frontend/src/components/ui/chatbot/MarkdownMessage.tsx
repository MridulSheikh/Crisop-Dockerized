import { memo } from "react";
import Markdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownMessageProps {
  content: string;
  role: "user" | "assistant";
}

const MarkdownMessage = memo(function MarkdownMessage({
  content,
  role,
}: MarkdownMessageProps) {
  return (
    <Markdown
      components={{
        h1: ({ children }) => <h1 className="mb-2 text-base font-bold">{children}</h1>,
        h2: ({ children }) => <h2 className="mb-2 mt-3 text-[15px] font-semibold">{children}</h2>,
        h3: ({ children }) => <h3 className="mb-1 mt-2 text-sm font-semibold">{children}</h3>,
        p: ({ children }) => (
          <p className={cn("text-sm leading-6 break-words [&:not(:last-child)]:mb-2", role === "user" ? "text-white" : "text-gray-700")}>{children}</p>
        ),
        ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5 text-sm">{children}</ul>,
        ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5 text-sm">{children}</ol>,
        li: ({ children }) => <li className={cn("leading-6", role === "user" ? "text-white" : "text-gray-700")}>{children}</li>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        blockquote: ({ children }) => (
          <blockquote className={cn("my-2 border-l-4 pl-3 italic text-sm", role === "user" ? "border-green-300 text-green-100" : "border-green-500 text-gray-600")}>{children}</blockquote>
        ),
        code: ({ children }) => (
          <code className={cn("rounded px-1.5 py-0.5 font-mono text-[13px]", role === "user" ? "bg-green-700 text-white" : "bg-gray-100 text-red-600")}>{children}</code>
        ),
        pre: ({ children }) => <pre className="my-3 overflow-x-auto rounded-xl bg-gray-900 p-3 text-[13px] text-gray-100">{children}</pre>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className={cn("underline underline-offset-2", role === "user" ? "text-green-100" : "text-green-600 hover:text-green-700")}>{children}</a>
        ),
        hr: () => <hr className="my-3 border-gray-300" />,
        table: ({ children }) => (
          <div className="my-3 overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
        th: ({ children }) => <th className="border border-gray-300 px-3 py-2 text-left font-medium">{children}</th>,
        td: ({ children }) => <td className="border border-gray-300 px-3 py-2">{children}</td>,
      }}
    >
      {content}
    </Markdown>
  );
});

export default MarkdownMessage;
