"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  function handleClick() {
    const audio = new Audio("/faahhh.mp3");
    audio.play().catch(() => {});
    router.push("/");
  }

  return (
    <>
      <Header />
      <main
        id="main"
        className="flex flex-col items-center justify-center gap-4 min-h-[calc(100vh-9rem)] font-lexend"
      >
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-5xl">Not Found</h2>
        <Button
          size="lg"
          variant="outline"
          className="mt-6 text-lg"
          onClick={handleClick}
        >
          Return Home
        </Button>
      </main>
      <Footer />
    </>
  );
}
