"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function OG() {
  const row1 = [
    "Caesar",
    "Permutation",
    "Playfair (8x8)",
    "Hill (2x2)",
    "Vigenère",
  ];
  const row2 = ["RC5", "DES", "AES"];

  return (
    <>
      <main className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-white dark:bg-background text-foreground p-6">
        <div className="flex max-w-6xl flex-col items-center justify-center gap-4 text-center">
          <h1 className="mb-2 flex items-center justify-center gap-2 text-2xl leading-none font-bold">
            <Image
              src="/logo.png"
              alt="Cipher Logo"
              width={64}
              height={64}
              className="object-contain"
            />
            <span className="font-lexend text-6xl text-foreground">CIPHER</span>
          </h1>

          <h1 className="text-muted-foreground text-2xl font-bold tracking-tight">
            A complete toolkit for Cryptography
          </h1>

          <h2 className="mb-4 text-3xl font-medium tracking-tight text-foreground">
            Encrypt • Decrypt • Frequency Analysis Attack • Generate Report.
          </h2>

          <h3 className="flex flex-wrap items-center justify-center gap-2 font-semibold">
            {row1.map((cipher) => (
              <Badge
                key={cipher}
                variant="secondary"
                className="border-gray-500 dark:border-neutral-700 bg-[#FBFBF9] dark:bg-neutral-900/50 p-3 text-lg text-[#2563EB] dark:text-sky-400 h-auto rounded-lg font-medium"
              >
                {cipher}
              </Badge>
            ))}
          </h3>
          <h3 className="flex flex-wrap items-center justify-center gap-2 font-semibold">
            {row2.map((cipher) => (
              <Badge
                key={cipher}
                variant="secondary"
                className="border-gray-500 dark:border-neutral-700 bg-[#FBFBF9] dark:bg-neutral-900/50 p-3 text-lg text-[#2563EB] dark:text-sky-400 h-auto rounded-lg font-medium"
              >
                {cipher}
              </Badge>
            ))}
          </h3>
        </div>
      </main>
    </>
  );
}
