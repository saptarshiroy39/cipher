"use client";

export default function Footer() {
  return (
    <footer className="flex flex-col justify-center items-center gap-2 py-4 text-sm text-muted-foreground">
      <div className="flex justify-center items-center gap-1">
        <a
          href="https://hirishi.in"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          SR
        </a>
        <span
          className="select-none"
          title="🤝"
        >
          🤝
        </span>
        <a
          href="https://itskdhere.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          KD
        </a>
      </div>
    </footer>
  );
}
