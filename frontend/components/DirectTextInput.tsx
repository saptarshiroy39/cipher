"use client";

import { useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";

export default function DirectTextInput({
  title,
  value,
  onChange,
  placeholder = "Type or paste your text here...",
  disabled = false,
  className,
}: {
  title?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const charCount = useMemo(() => value.length, [value]);
  const wordCount = useMemo(() => {
    const trimmed = value.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [value]);

  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
        <span className="text-xs font-semibold tracking-wide uppercase select-none leading-relaxed text-foreground">
          {title || "Text Input"}
        </span>
        <span className="select-none leading-relaxed">
          {wordCount.toLocaleString()} words • {charCount.toLocaleString()}{" "}
          chars
        </span>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="h-[232px] min-h-[232px] resize-y bg-background font-mono text-sm"
      />
    </div>
  );
}
