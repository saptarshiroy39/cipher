"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { HyperText } from "@/components/ui/hyper-text";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { IconArrowLeft } from "@tabler/icons-react";

export default function Header({
  titleText,
  backButton = false,
  animation = false,
}: {
  titleText?: string;
  backButton?: boolean;
  animation?: boolean;
}) {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <header className="flex justify-center items-center px-4 sm:px-6 py-4 w-full">
      <div className="relative flex justify-between items-center w-full max-w-6xl">
        <span className="flex justify-center items-center gap-2 text-xl font-bold leading-none font-mono">
          {backButton ? (
            <button
              className="p-1 border rounded-full bg-accent hover:bg-accent/70 flex items-center justify-center border-border cursor-pointer transition-colors"
              onClick={handleBackClick}
              aria-label="Go back"
            >
              <IconArrowLeft aria-hidden="true" />
            </button>
          ) : (
            <Image
              src="/logo.png"
              alt="Cipher Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          )}
          {animation ? (
            <HyperText as="span">{titleText || "CIPHER"}</HyperText>
          ) : (
            <span>{titleText || "Cipher"}</span>
          )}
        </span>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center gap-1 text-sm text-muted-foreground font-mono">
          <a
            href="https://hirishi.in"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            SR
          </a>
          <span className="select-none">•</span>
          <a
            href="https://itskdhere.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            KD
          </a>
        </div>

        <AnimatedThemeToggler
          variant="hexagon"
          className="p-1 border rounded-full bg-accent hover:bg-accent/70"
        />
      </div>
    </header>
  );
}
