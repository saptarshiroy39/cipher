"use client";

import axios from "axios";
import { useCallback, useRef, useState } from "react";
import Header from "@/components/Header";
import { API_URL } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/hooks/use-file-upload";
import type { State } from "@/components/FileSelector";
import ModeSelector, { type InputMode } from "@/components/ModeSelector";
import DirectTextInput from "@/components/DirectTextInput";
import FileSelector, { truncateFilename } from "@/components/FileSelector";
import ResultPreview from "@/components/ResultPreview";
import {
  IconCheck,
  IconClock,
  IconDownload,
  IconFileInfo,
  IconLoader,
  IconReload,
  IconPercentage,
  IconAbc,
  IconLineHeight,
  IconLetterCase,
  IconRuler2,
  IconMessageReport,
  IconClipboardList,
  IconX,
} from "@tabler/icons-react";

interface ReportStats {
  overallAccuracy: string;
  lengthDifference: string;
  originalLength: string;
  decryptedLength: string;
  alphabetAccuracy: string;
  nonAlphaAccuracy: string;
  wordAccuracy: string;
  lineAccuracy: string;
  verdict: string;
}

function parseReportStats(reportText: string): ReportStats {
  const lines = reportText.split("\n");
  const get = (prefix: string) =>
    lines
      .find((l) => l.startsWith(prefix))
      ?.replace(prefix, "")
      .trim() ?? "N/A";

  return {
    overallAccuracy: get("Overall accuracy:"),
    lengthDifference: get("Length difference:"),
    originalLength: get("Original File Length:"),
    decryptedLength: get("Decrypted File Length:"),
    alphabetAccuracy: get("Alphabet accuracy:"),
    nonAlphaAccuracy: get("Non-alpha accuracy:"),
    wordAccuracy: get("Word accuracy:"),
    lineAccuracy: get("Line accuracy:"),
    verdict: get("VERDICT:"),
  };
}

export default function Report() {
  const [state, setState] = useState<State>("idle");
  const [inputMode, setInputMode] = useState<InputMode>("file");
  const [originalRawText, setOriginalRawText] = useState("");
  const [attackedRawText, setAttackedRawText] = useState("");
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [attackedFile, setAttackedFile] = useState<File | null>(null);
  const [reportFile, setReportFile] = useState<{
    url: string;
    filename: string;
    size: number;
  } | null>(null);
  const [reportStats, setReportStats] = useState<ReportStats | null>(null);
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const clearOriginalRef = useRef<(() => void) | null>(null);
  const clearAttackedRef = useRef<(() => void) | null>(null);

  const handleOriginalFileChange = useCallback((file: File | null) => {
    setOriginalFile(file);
  }, []);

  const handleModeChange = useCallback(
    (newMode: InputMode) => {
      if (state === "processing" || newMode === inputMode) return;
      setInputMode(newMode);
      clearOriginalRef.current?.();
      clearAttackedRef.current?.();
      setOriginalRawText("");
      setAttackedRawText("");
      setOriginalFile(null);
      setAttackedFile(null);
      if (state === "done" || state === "error") {
        if (reportFile) window.URL.revokeObjectURL(reportFile.url);
        setState("idle");
        setReportFile(null);
        setReportStats(null);
        setReportContent(null);
        setTimeTaken(null);
      }
    },
    [inputMode, state, reportFile],
  );

  const handleOriginalTextChange = useCallback((text: string) => {
    setOriginalRawText(text);
    if (text.trim().length > 0) {
      setOriginalFile(new File([text], "original.txt", { type: "text/plain" }));
    } else {
      setOriginalFile(null);
    }
  }, []);

  const handleAttackedTextChange = useCallback((text: string) => {
    setAttackedRawText(text);
    if (text.trim().length > 0) {
      setAttackedFile(
        new File([text], "recovered.txt", { type: "text/plain" }),
      );
    } else {
      setAttackedFile(null);
    }
  }, []);

  const handleAttackedFileChange = useCallback((file: File | null) => {
    setAttackedFile(file);
  }, []);

  const handleSetClearOriginal = useCallback((clearFn: () => void) => {
    clearOriginalRef.current = clearFn;
  }, []);

  const handleSetClearAttacked = useCallback((clearFn: () => void) => {
    clearAttackedRef.current = clearFn;
  }, []);

  const handleClear = useCallback(() => {
    if (reportFile) {
      window.URL.revokeObjectURL(reportFile.url);
    }
    clearOriginalRef.current?.();
    clearAttackedRef.current?.();
    setOriginalRawText("");
    setAttackedRawText("");
    setState("idle");
    setOriginalFile(null);
    setAttackedFile(null);
    setReportFile(null);
    setReportStats(null);
    setReportContent(null);
    setTimeTaken(null);
  }, [reportFile]);

  const handleDownload = () => {
    if (!reportFile) return;

    const link = document.createElement("a");
    link.href = reportFile.url;
    link.setAttribute("download", reportFile.filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleGenerateReport = async () => {
    if (!originalFile || !attackedFile) return;

    const formData = new FormData();
    formData.append("original", originalFile);
    formData.append("recovered", attackedFile);

    setState("processing");
    const startTime = performance.now();

    try {
      const response = await axios.post(`${API_URL}/report`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const contentDisposition = response.headers["content-disposition"];
      const headerFilename = contentDisposition?.match(
        /filename="?([^";]+)"?/,
      )?.[1];
      const filename =
        headerFilename ||
        `${originalFile.name.replace(/\.[^.]+$/, "")}_comparison_report.txt`;

      const reportText = await blob.text();
      setReportContent(reportText);
      const stats = parseReportStats(reportText);
      setReportStats(stats);

      setReportFile({ url, filename, size: blob.size });

      const endTime = performance.now();
      setTimeTaken((endTime - startTime) / 1000);

      setState("done");
    } catch (error) {
      console.error("Report generation error:", error);
      setState("error");
    }
  };

  return (
    <>
      <Header backButton animation titleText="COMPARISON REPORT" />
      <main className="flex flex-col justify-center items-center gap-4 md:gap-5 p-4 md:p-6 w-full">
        <ModeSelector
          mode={inputMode}
          onModeChange={handleModeChange}
          disabled={state === "processing"}
          className="max-w-6xl"
        />

        <div className="flex flex-col justify-between items-center gap-6 p-4 md:p-6 w-full max-w-6xl bg-card border rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-10 w-full">
            {inputMode === "file" ? (
              <>
                <FileSelector
                  titleText="Add Original File"
                  label="Original"
                  setFile={handleOriginalFileChange}
                  state={state}
                  className="w-full"
                  onClearFilesReady={handleSetClearOriginal}
                />
                <FileSelector
                  titleText="Add Recovered File"
                  label="Recovered"
                  setFile={handleAttackedFileChange}
                  state={state}
                  className="w-full"
                  onClearFilesReady={handleSetClearAttacked}
                />
              </>
            ) : (
              <>
                <DirectTextInput
                  title="Original"
                  value={originalRawText}
                  onChange={handleOriginalTextChange}
                  placeholder="Type or paste original text..."
                  disabled={state !== "idle"}
                />
                <DirectTextInput
                  title="Recovered"
                  value={attackedRawText}
                  onChange={handleAttackedTextChange}
                  placeholder="Type or paste recovered text..."
                  disabled={state !== "idle"}
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-5 gap-2 w-full mt-2">
            <Button
              className="col-span-3 w-full leading-none"
              disabled={state !== "idle" || !originalFile || !attackedFile}
              onClick={handleGenerateReport}
            >
              {state === "processing" ? (
                <>
                  <IconLoader
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                  GENERATING...
                </>
              ) : state === "done" ? (
                <>
                  <IconCheck className="size-4" aria-hidden="true" />
                  GENERATED
                </>
              ) : state === "error" ? (
                <>
                  <IconX className="size-4" aria-hidden="true" />
                  FAILED
                </>
              ) : (
                <>
                  <IconClipboardList className="size-4" aria-hidden="true" />
                  GENERATE REPORT
                </>
              )}
            </Button>
            <Button
              className="col-span-2 w-full leading-none"
              variant="destructive"
              disabled={state === "processing"}
              onClick={handleClear}
            >
              <IconReload className="size-4" aria-hidden="true" />
              RESET
            </Button>
          </div>
        </div>

        {state === "done" && reportStats && (
          <>
            {reportContent && (
              <div className="flex flex-col justify-between items-center gap-6 p-4 md:p-6 w-full max-w-6xl bg-card border rounded-lg">
                <ResultPreview
                  title="COMPARISON REPORT"
                  content={reportContent}
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full p-4 md:p-6 max-w-6xl bg-card border rounded-lg">
              <div className="flex flex-col justify-center items-start gap-4 text-xs w-full">
                {reportFile && (
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="flex items-center gap-1.5 font-semibold tracking-wide uppercase select-none text-foreground">
                      <IconFileInfo
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                      FILE SIZE:
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {formatBytes(reportFile.size)}
                    </span>
                  </div>
                )}
                {timeTaken !== null && (
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="flex items-center gap-1.5 font-semibold tracking-wide uppercase select-none text-foreground">
                      <IconClock
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                      TIME TAKEN:
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {timeTaken.toFixed(2)}s
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="flex items-center gap-1.5 font-semibold tracking-wide uppercase select-none text-foreground">
                    <IconMessageReport
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                    VERDICT:
                  </span>
                  <span className="font-mono text-muted-foreground font-semibold">
                    {reportStats.verdict}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="flex items-center gap-1.5 font-semibold tracking-wide uppercase select-none text-foreground">
                    <IconRuler2
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                    LENGTH DIFFERENCE:
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {reportStats.lengthDifference}
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center items-start gap-4 text-xs w-full">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="flex items-center gap-1.5 font-semibold tracking-wide uppercase select-none text-foreground">
                    <IconPercentage
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                    OVERALL ACCURACY:
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {reportStats.overallAccuracy}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="flex items-center gap-1.5 font-semibold tracking-wide uppercase select-none text-foreground">
                    <IconLineHeight
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                    LINE ACCURACY:
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {reportStats.lineAccuracy}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="flex items-center gap-1.5 font-semibold tracking-wide uppercase select-none text-foreground">
                    <IconAbc className="size-4 shrink-0" aria-hidden="true" />
                    WORD ACCURACY:
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {reportStats.wordAccuracy}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="flex items-center gap-1.5 font-semibold tracking-wide uppercase select-none text-foreground">
                    <IconLetterCase
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                    ALPHABET ACCURACY:
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {reportStats.alphabetAccuracy}
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center gap-6 md:gap-8">
                <Button
                  title={reportFile?.filename || "N/A"}
                  className="w-full leading-none"
                  variant="outline"
                  onClick={handleDownload}
                >
                  <IconDownload
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="truncate">
                    {reportFile?.filename
                      ? truncateFilename(reportFile.filename)
                      : "N/A"}
                  </span>
                </Button>

                <Button
                  className="text-destructive hover:text-destructive/80 w-full leading-none"
                  variant="outline"
                  onClick={handleClear}
                >
                  <IconReload className="size-4" aria-hidden="true" />
                  GENERATE AGAIN
                </Button>
              </div>
            </div>
          </>
        )}

        {state === "error" && (
          <div className="flex flex-col justify-between items-center gap-4 p-4 md:p-6 w-full max-w-6xl bg-card border rounded-lg">
            <p className="text-destructive text-sm">
              An error occurred while generating the report. Please check your
              files and try again.
            </p>

            <Button
              className="w-full"
              variant="outline"
              onClick={() => setState("idle")}
            >
              TRY AGAIN
            </Button>
          </div>
        )}
      </main>
    </>
  );
}
