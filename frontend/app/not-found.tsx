"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MorphingText } from "@/components/ui/morphing-text";

export default function NotFound() {
  const router = useRouter();

  function handleClick() {
    router.push("/");
  }

  return (
    <main
      id="main"
      className="flex flex-col items-center justify-center gap-12 min-h-screen p-4 text-center font-sans"
    >
      <div className="w-full max-w-xl py-6">
        <MorphingText
          texts={["404", "Not Found"]}
          className="text-[#5BAFE3] font-sans font-bold"
        />
      </div>
      <Button
        size="lg"
        variant="outline"
        className="mt-6 text-lg font-sans"
        onClick={handleClick}
      >
        Return Home
      </Button>
    </main>
  );
}
