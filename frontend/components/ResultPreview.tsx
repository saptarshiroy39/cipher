"use client";

import { useState } from "react";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { cn } from "@/lib/cn";

export default function ResultPreview({
  title,
  content,
  className,
}: {
  title: string;
  content: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      <div className="flex justify-between items-center w-full px-1">
        <span className="text-xs font-semibold tracking-wide uppercase select-none leading-relaxed text-foreground">
          {title}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!content}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50 select-none"
        >
          {copied ? (
            <>
              <IconCheck
                className="size-3.5 text-green-500"
                aria-hidden="true"
              />
              COPIED
            </>
          ) : (
            <>
              <IconCopy className="size-3.5" aria-hidden="true" />
              COPY
            </>
          )}
        </button>
      </div>

      <div className="relative w-full rounded-lg border border-input bg-muted/30 p-3 h-[232px] min-h-[232px] overflow-y-auto font-mono text-sm break-all whitespace-pre-wrap select-all">
        {content}
      </div>
    </div>
  );
}
