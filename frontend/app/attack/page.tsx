"use client";

import { useCallback, useRef, useState } from "react";
import Header from "@/components/Header";
import { API_URL } from "@/lib/config";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatBytes } from "@/hooks/use-file-upload";
import type { State } from "@/components/FileSelector";
import ModeSelector, { type InputMode } from "@/components/ModeSelector";
import DirectTextInput from "@/components/DirectTextInput";
import FileSelector, { truncateFilename } from "@/components/FileSelector";
import ResultPreview from "@/components/ResultPreview";
import {
  IconCheck,
  IconClock,
  IconCopy,
  IconDownload,
  IconFileInfo,
  IconKey,
  IconLoader,
  IconReload,
  IconSkull,
  IconX,
} from "@tabler/icons-react";

type DownloadFile = {
  url: string;
  filename: string;
  size: number;
  label: string;
};

export default function Attack() {
  const [state, setState] = useState<State>("idle");
  const [cipherMethod, setCipherMethod] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("file");
  const [rawText, setRawText] = useState("");
  const [downloadFiles, setDownloadFiles] = useState<DownloadFile[]>([]);
  const [guessedKey, setGuessedKey] = useState<string | null>(null);
  const [guessedPlaintext, setGuessedPlaintext] = useState<string | null>(null);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const [keyCopied, setKeyCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");
  const clearFilesRef = useRef<(() => void) | null>(null);

  const handleFileChange = useCallback((f: File | null) => {
    setFile(f);
  }, []);

  const handleModeChange = useCallback(
    (newMode: InputMode) => {
      if (state === "processing" || newMode === inputMode) return;
      setInputMode(newMode);
      if (clearFilesRef.current) clearFilesRef.current();
      setRawText("");
      setFile(null);
      if (state === "done" || state === "error") {
        setState("idle");
        downloadFiles.forEach((f) => window.URL.revokeObjectURL(f.url));
        setDownloadFiles([]);
        setGuessedKey(null);
        setGuessedPlaintext(null);
        setTimeTaken(null);
        setProgress(0);
        setProgressStatus("");
      }
    },
    [inputMode, state, downloadFiles],
  );

  const handleTextChange = useCallback((text: string) => {
    setRawText(text);
    if (text.trim().length > 0) {
      const generatedFile = new File([text], "ciphertext.txt", {
        type: "text/plain",
      });
      setFile(generatedFile);
    } else {
      setFile(null);
    }
  }, []);

  const handleSetClear = useCallback((clearFn: () => void) => {
    clearFilesRef.current = clearFn;
  }, []);

  const handleClear = useCallback(() => {
    downloadFiles.forEach((f) => window.URL.revokeObjectURL(f.url));
    if (clearFilesRef.current) clearFilesRef.current();
    setRawText("");
    setState("idle");
    setCipherMethod(null);
    setFile(null);
    setDownloadFiles([]);
    setGuessedKey(null);
    setGuessedPlaintext(null);
    setTimeTaken(null);
    setProgress(0);
    setProgressStatus("");
  }, [downloadFiles]);

  const handleAttack = async () => {
    if (!file || !cipherMethod) return;

    const formData = new FormData();
    formData.append("file", file);

    setState("processing");
    setProgress(0);
    setProgressStatus("Starting attack...");
    const startTime = performance.now();

    try {
      const response = await fetch(`${API_URL}/${cipherMethod}/attack/stream`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok || !response.body) {
        throw new Error("Stream failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finalData: Record<string, unknown> | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.progress >= 0) {
                setProgress(parsed.progress);
              }
              if (parsed.status) {
                setProgressStatus(parsed.status);
              }
              if (parsed.result) {
                finalData = parsed.result;
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (parseErr) {
              if (
                parseErr instanceof Error &&
                parseErr.message !== "Stream failed"
              ) {
              }
            }
          }
        }
      }

      if (!finalData) {
        throw new Error("No result received");
      }

      const data = finalData as {
        guessed_plaintext?: string;
        guessed_key?: unknown;
      };
      const files: DownloadFile[] = [];
      const baseName = file.name.replace(/\.[^.]+$/, "");

      if (data.guessed_plaintext) {
        setGuessedPlaintext(data.guessed_plaintext);
        const blob = new Blob([data.guessed_plaintext], { type: "text/plain" });
        files.push({
          url: window.URL.createObjectURL(blob),
          filename: `${baseName}_Attacked.txt`,
          size: blob.size,
          label: "Attacked",
        });
      }
      if (data.guessed_key !== undefined && data.guessed_key !== null) {
        const keyStr =
          typeof data.guessed_key === "object" &&
          (data.guessed_key as Record<string, unknown>).matrix
            ? JSON.stringify(
                (data.guessed_key as Record<string, unknown>).matrix,
              )
            : typeof data.guessed_key === "object"
              ? JSON.stringify(data.guessed_key)
              : String(data.guessed_key);
        const blob = new Blob([keyStr], {
          type: "text/plain",
        });
        files.push({
          url: window.URL.createObjectURL(blob),
          filename: `${baseName}_Key.txt`,
          size: blob.size,
          label: "Key",
        });
        setGuessedKey(keyStr);
      }

      setDownloadFiles(files);
      setTimeTaken((performance.now() - startTime) / 1000);
      setProgress(100);
      setState("done");
    } catch (error) {
      console.error("Attack error:", error);
      setState("error");
    }
  };

  const handleDownload = (dlFile: DownloadFile) => {
    const link = document.createElement("a");
    link.href = dlFile.url;
    link.setAttribute("download", dlFile.filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <>
      <Header backButton animation titleText="FREQUENCY ANALYSIS ATTACK" />
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
              <FileSelector
                titleText="Add Ciphertext File"
                label="CIPHERTEXT"
                setFile={handleFileChange}
                state={state}
                className="w-full"
                onClearFilesReady={handleSetClear}
              />
            ) : (
              <DirectTextInput
                title="Ciphertext"
                value={rawText}
                onChange={handleTextChange}
                placeholder="Type or paste intercepted ciphertext to attack..."
                disabled={state !== "idle"}
              />
            )}
            <div className="flex flex-col justify-center items-center gap-6 w-full">
              <Field>
                <FieldLabel htmlFor="cipher-method-select">
                  Cipher Method
                </FieldLabel>
                <Select
                  value={cipherMethod || ""}
                  onValueChange={setCipherMethod}
                  disabled={state !== "idle"}
                >
                  <SelectTrigger id="cipher-method-select" className="w-full">
                    <SelectValue placeholder="Select cipher method" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      <SelectItem value="caesar">Caesar Cipher</SelectItem>
                      <SelectItem value="permute">
                        Permutation Cipher
                      </SelectItem>
                      <SelectItem value="vigenere">Vigenère Cipher</SelectItem>
                      <SelectItem value="hill">Hill Cipher (2x2)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <div className="flex flex-col gap-2 w-full h-8">
                {(state === "processing" || state === "done") && (
                  <>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{progressStatus}</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 w-full mt-2">
            <Button
              className="col-span-3 w-full leading-none"
              disabled={state !== "idle" || !file || !cipherMethod}
              onClick={handleAttack}
            >
              {state === "processing" ? (
                <>
                  <IconLoader
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                  ATTACKING...
                </>
              ) : state === "done" ? (
                <>
                  <IconCheck className="size-4" aria-hidden="true" />
                  ATTACKED
                </>
              ) : state === "error" ? (
                <>
                  <IconX className="size-4" aria-hidden="true" />
                  FAILED
                </>
              ) : (
                <>
                  <IconSkull className="size-4" aria-hidden="true" />
                  ATTACK
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

        {state === "done" && downloadFiles.length > 0 && (
          <>
            {guessedPlaintext && (
              <div className="flex flex-col justify-between items-center gap-6 p-4 md:p-6 w-full max-w-6xl bg-card border rounded-lg">
                <ResultPreview
                  title="RECOVERED PLAINTEXT"
                  content={guessedPlaintext}
                />
              </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10 p-4 md:p-6 w-full max-w-6xl bg-card border rounded-lg">
              <div className="flex flex-col justify-center items-start gap-4 text-xs w-full">
                {guessedKey && (
                  <div className="flex flex-row flex-wrap justify-start items-center gap-1.5">
                    <span className="flex items-center gap-1.5 leading-none font-semibold tracking-wide uppercase select-none text-foreground">
                      <IconKey
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                      GUESSED KEY:
                    </span>
                    <span className="flex items-center gap-1.5 leading-none font-mono text-muted-foreground">
                      {guessedKey}
                      <Button
                        size="icon-lg"
                        variant="ghost"
                        className="size-4"
                        onClick={() => {
                          navigator.clipboard.writeText(guessedKey || "");
                          setKeyCopied(true);
                          setTimeout(() => setKeyCopied(false), 2000);
                        }}
                        aria-label="Copy key to clipboard"
                      >
                        {keyCopied ? (
                          <IconCheck className="size-4 text-green-500" aria-hidden="true" />
                        ) : (
                          <IconCopy className="size-4" aria-hidden="true" />
                        )}
                      </Button>
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
                      {timeTaken.toFixed(2)} seconds
                    </span>
                  </div>
                )}

                {downloadFiles.map((dlFile) => (
                  <div
                    key={dlFile.filename}
                    className="flex items-center gap-1.5 leading-none"
                  >
                    <span className="flex items-center gap-1.5 font-semibold tracking-wide uppercase select-none text-foreground">
                      <IconFileInfo
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                      {dlFile.label.toUpperCase()} FILE SIZE:
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {formatBytes(dlFile.size)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center items-center gap-4 w-full">
                {downloadFiles.map((dlFile) => (
                  <Button
                    key={dlFile.filename}
                    title={dlFile.filename}
                    className="w-full leading-none"
                    variant="outline"
                    onClick={() => handleDownload(dlFile)}
                  >
                    <IconDownload
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="truncate">
                      {truncateFilename(dlFile.filename)}
                    </span>
                  </Button>
                ))}

                <Button
                  className="text-destructive hover:text-destructive/80 w-full leading-none"
                  variant="outline"
                  onClick={handleClear}
                >
                  <IconReload className="size-4" aria-hidden="true" />
                  ATTACK AGAIN
                </Button>
              </div>
            </div>
          </>
        )}

        {state === "error" && (
          <div className="flex flex-col justify-between items-center gap-4 p-4 md:p-6 w-full max-w-6xl bg-card border rounded-lg">
            <p className="text-destructive text-sm">
              An error occurred during the attack. Please check your file and
              cipher method and try again.
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
