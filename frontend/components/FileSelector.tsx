"use client";

import { useEffect, useState } from "react";
import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";
import { cn } from "@/lib/cn";
import {
  IconFilePlus,
  IconFileTypeTxt,
  IconAlertCircle,
} from "@tabler/icons-react";

export type State = "idle" | "processing" | "done" | "error";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MiB
export const MAX_FILE_COUNT = 1;

export function truncateFilename(name: string): string {
  if (name.length <= 40) return name;
  const dotIndex = name.lastIndexOf(".");
  const ext = dotIndex !== -1 ? name.slice(dotIndex) : "";
  const baseName = dotIndex !== -1 ? name.slice(0, dotIndex) : name;
  return baseName.slice(0, 25) + "..." + baseName.slice(-8) + ext;
}

export default function FileSelector({
  className,
  titleText,
  label = "UPLOAD",
  state,
  setFile,
  onClearFilesReady,
}: {
  className?: string;
  titleText?: string;
  label?: string;
  state: State;
  setFile: (file: File | null) => void;
  onClearFilesReady?: (clearFiles: () => void) => void;
}) {
  const [
    { files, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: false,
    accept: "text/plain",
    maxFiles: MAX_FILE_COUNT,
    maxSize: MAX_FILE_SIZE,
  });

  const selectedFile =
    files.length > 0 && files[0]?.file instanceof File ? files[0].file : null;

  const [fileStats, setFileStats] = useState<{
    chars: number;
    words: number;
    lines: number;
  } | null>(null);

  useEffect(() => {
    setFile(selectedFile);
  }, [selectedFile, setFile]);

  useEffect(() => {
    if (!selectedFile) return;
    let cancelled = false;
    selectedFile
      .text()
      .then((text) => {
        if (cancelled) return;
        const chars = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const lines = text.length > 0 ? text.split(/\r\n|\r|\n/).length : 0;
        setFileStats({ chars, words, lines });
      })
      .catch(() => {
        if (!cancelled) setFileStats(null);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedFile]);

  useEffect(() => {
    if (onClearFilesReady) {
      onClearFilesReady(clearFiles);
    }
  }, [onClearFilesReady, clearFiles]);

  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold tracking-wide uppercase select-none leading-relaxed text-foreground">
          {label}
        </span>
      </div>

      <div className="relative w-full">
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Select file"
          disabled={state !== "idle"}
        />

        {!selectedFile ? (
          <div
            role="button"
            onClick={openFileDialog}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="flex h-[232px] min-h-[232px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-input p-6 transition-colors hover:cursor-cell hover:bg-accent/50 has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div
                className="mb-3 flex size-12 shrink-0 items-center justify-center border rounded-none bg-background"
                aria-hidden="true"
              >
                <IconFilePlus className="size-6 opacity-60" />
              </div>
              <p className="mb-1 text-lg font-medium">
                {titleText || "Add File"}
              </p>
              <p className="mb-2 text-sm text-muted-foreground">
                Drag & Drop / Click to browse file
              </p>
              <div className="flex flex-wrap justify-center gap-1 text-xs text-muted-foreground/70">
                <span>Only Text (.txt) file</span>
                <span> • </span>
                <span>Size up to 10 MB</span>
              </div>
            </div>
          </div>
        ) : (
          <div
            role="region"
            className="relative flex h-[232px] min-h-[232px] w-full flex-col items-center justify-center rounded-lg border border-input bg-card p-6 text-center"
          >
            <div className="flex flex-col items-center justify-center text-center max-w-full px-4">
              <div
                className="mb-3 flex size-12 shrink-0 items-center justify-center border rounded-none bg-background"
                aria-hidden="true"
              >
                <IconFileTypeTxt className="size-6 opacity-60" />
              </div>

              <p
                className="mb-1 text-lg font-medium text-foreground max-w-[280px] sm:max-w-[360px] truncate"
                title={selectedFile.name}
              >
                {truncateFilename(selectedFile.name)}
              </p>
              <p className="mb-2 text-sm text-muted-foreground">
                {formatBytes(selectedFile.size)}
              </p>
              {fileStats && (
                <div className="flex flex-wrap justify-center gap-1 text-xs text-muted-foreground/70">
                  <span>{fileStats.lines.toLocaleString()} lines</span>
                  <span> • </span>
                  <span>{fileStats.words.toLocaleString()} words</span>
                  <span> • </span>
                  <span>{fileStats.chars.toLocaleString()} chars</span>
                </div>
              )}
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs text-destructive pointer-events-none"
            role="alert"
          >
            <IconAlertCircle className="size-3.5 shrink-0" />
            <span>{errors[0]}</span>
          </div>
        )}
      </div>
    </div>
  );
}
