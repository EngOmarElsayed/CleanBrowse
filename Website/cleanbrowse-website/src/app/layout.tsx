import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CleanBrowse — System-Level Adult Content Blocker for macOS",
  description:
    "A free, open-source macOS menu bar app that blocks adult content at the system level. Protect yourself and your loved ones.",
  icons: {
    icon: [
      { url: "/Favicons/favicon.ico", sizes: "any" },
      { url: "/Favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/Favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/Favicons/apple-touch-icon.png" },
    ],
    other: [
      { rel: "mask-icon", url: "/Favicons/safari-pinned-tab.svg", color: "#22c55e" },
    ],
  },
  manifest: undefined,
  openGraph: {
    title: "CleanBrowse",
    description:
      "A free, open-source macOS menu bar app that blocks adult content at the system level.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
