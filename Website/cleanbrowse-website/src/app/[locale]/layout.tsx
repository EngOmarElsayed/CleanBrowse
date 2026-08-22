import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { Analytics } from "@vercel/analytics/next";
import { locales, isLocale, dirFor, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    icons: {
      icon: [
        { url: "/Favicons/favicon.ico", sizes: "any" },
        { url: "/Favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/Favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/Favicons/apple-touch-icon.png" }],
      other: [
        { rel: "mask-icon", url: "/Favicons/safari-pinned-tab.svg", color: "#128a46" },
      ],
    },
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      title: "CleanBrowse",
      description: dict.meta.description,
      type: "website",
      locale,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} dir={dirFor(locale as Locale)} className="scroll-smooth">
      <body
        className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable} antialiased`}
      >
        {children}
      </body>
      <Analytics />
    </html>
  );
}
