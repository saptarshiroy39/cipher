"use client";

import { IconCloudUpload, IconTextSize } from "@tabler/icons-react";
import { cn } from "@/lib/cn";

export type InputMode = "file" | "text";

export default function ModeSelector({
  mode,
  onModeChange,
  disabled = false,
  className,
}: {
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-1.5 p-1.5 bg-card rounded-lg border text-sm w-full",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onModeChange("file")}
        disabled={disabled}
        className={cn(
          "flex items-center justify-center gap-2 py-2.5 px-4 font-medium rounded-md transition-all cursor-pointer text-xs sm:text-sm",
          mode === "file"
            ? "bg-primary text-primary-foreground shadow-xs font-semibold"
            : "text-foreground/75 hover:text-foreground hover:bg-muted/40",
        )}
      >
        <IconCloudUpload className="size-4 shrink-0" aria-hidden="true" />
        <span>Upload File</span>
      </button>
      <button
        type="button"
        onClick={() => onModeChange("text")}
        disabled={disabled}
        className={cn(
          "flex items-center justify-center gap-2 py-2.5 px-4 font-medium rounded-md transition-all cursor-pointer text-xs sm:text-sm",
          mode === "text"
            ? "bg-primary text-primary-foreground shadow-xs font-semibold"
            : "text-foreground/75 hover:text-foreground hover:bg-muted/40",
        )}
      >
        <IconTextSize className="size-4 shrink-0" aria-hidden="true" />
        <span>Direct Text</span>
      </button>
    </div>
  );
}
