import { Analytics } from "@vercel/analytics/next";
import { Metadata } from "next";
import { Lexend } from "next/font/google";
import { Providers } from "@/components/providers";
import Figlet from "@/components/Figlet";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cipher.hirishi.in"),
  title: "Cipher",
  description:
    "A complete toolkit for Cryptography. Encrypt, Decrypt, Run Frequency Analysis Attack and Generate Report with ease.",
  keywords: [
    "Cipher",
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
    "Anabas Labs",
    "Saptarshi Roy",
    "saptarshiroy39",
    "Krishnendu Das",
    "itskdhere",
  ],
  robots: "index, follow",
  creator: "Anabas Labs",
  authors: [
    { name: "Anabas Labs", url: "https://cipher.hirishi.in" },
    { name: "Saptarshi Roy", url: "https://hirishi.in" },
    { name: "Krishnendu Das", url: "https://itskdhere.com" },
  ],

  openGraph: {
    title: "Cipher",
    description:
      "A complete toolkit for Cryptography. Encrypt, Decrypt, Run Frequency Analysis Attack and Generate Report with ease.",
    url: "https://cipher.hirishi.in",
    siteName: "Cipher",
    images: [
      {
        url: "https://cipher.hirishi.in/banner.png",
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
      "A complete toolkit for Cryptography. Encrypt, Decrypt, Run Frequency Analysis Attack and Generate Report with ease.",
    images: ["https://cipher.hirishi.in/banner.png"],
    creator: "@anabaslabs",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${lexend.variable} font-lexend antialiased `}>
        <Providers>{children}</Providers>
        <Analytics />
        <Figlet />
      </body>
    </html>
  );
}
