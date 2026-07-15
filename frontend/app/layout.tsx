import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata, Viewport } from "next";
import { Lexend, Oxanium } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Figlet from "@/components/Figlet";
import "./globals.css";
import { cn } from "@/lib/cn";
import ClickSpark from "@/components/ui/click-spark";

const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" });

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1115" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://cipher.hirishi.in"),
  title: "Cipher",
  description:
    "A complete toolkit for Cryptography. Encrypt, Decrypt, Frequency Analysis Attack & Generate Report with ease.",
  applicationName: "Cipher",
  keywords: [
    "Cipher",
    "cipher.hirishi.in",
    "https://cipher.hirishi.in",
    "Cryptography",
    "Encryption",
    "Decryption",
    "Frequency Analysis Attack",
    "Report Generation",
    "Caesar Cipher",
    "Substitution Cipher",
    "Permutation Cipher",
    "Vigenère Cipher",
    "Playfair Cipher",
    "Hill Cipher",
    "DES",
    "AES",
    "RC5",
    "Saptarshi Roy",
    "saptarshiroy39",
    "hirishi",
    "hirishi.in",
    "https://hirishi.in",
  ],
  robots: "index, follow",
  creator: "Saptarshi Roy",
  authors: [
    { name: "Saptarshi Roy", url: "https://hirishi.in" },
    { name: "Krishnendu Das", url: "https://itskdhere.com" },
  ],

  openGraph: {
    title: "Cipher",
    description:
      "A complete toolkit for Cryptography. Encrypt, Decrypt, Frequency Analysis Attack & Generate Report with ease.",
    url: "https://cipher.hirishi.in",
    siteName: "Cipher",
    images: [
      {
        url: "https://cipher.hirishi.in/OG.png",
        width: 1200,
        height: 630,
        alt: "Cipher",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Cipher",
    description:
      "A complete toolkit for Cryptography. Encrypt, Decrypt, Frequency Analysis Attack & Generate Report with ease.",
    images: ["https://cipher.hirishi.in/OG.png"],
    site: "@saptarshiroy39",
    creator: "@saptarshiroy39",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  alternates: {
    canonical: "https://cipher.hirishi.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(oxanium.variable, lexend.variable)}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <ClickSpark
            sparkColor="var(--spark-color)"
            className="relative min-h-screen w-full flex flex-col"
          >
            {children}
          </ClickSpark>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <Figlet />
      </body>
    </html>
  );
}
