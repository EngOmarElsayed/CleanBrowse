import Image from "next/image";
import { notFound } from "next/navigation";
import EmailSignup from "../components/EmailSignup";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DnsLog from "../components/DnsLog";
import RoadPath from "../components/RoadPath";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { DMG_URL, GITHUB_URL, APTABASE_URL, PRODUCT_HUNT_URL, productHuntBadge } from "@/lib/links";

function GitHubIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.27 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

/* ───────────────────────── Icons (inline SVGs) ───────────────────────── */

function DownloadIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function EyeOffIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-leaf">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function PuzzleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-leaf">
      <path d="M19.44 12.99a1.5 1.5 0 0 1 0-2.12l1.12-1.12a1.5 1.5 0 0 0 0-2.12l-2.19-2.19a1.5 1.5 0 0 0-2.12 0l-1.12 1.12a1.5 1.5 0 0 1-2.12 0l-.44-.44a1.5 1.5 0 0 1 0-2.12l.06-.06a1.5 1.5 0 0 0 0-2.12l-.5-.5a1.5 1.5 0 0 0-2.12 0L3.44 7.89a1.5 1.5 0 0 0 0 2.12l.5.5a1.5 1.5 0 0 0 2.12 0l.06-.06a1.5 1.5 0 0 1 2.12 0l.44.44a1.5 1.5 0 0 1 0 2.12l-1.12 1.12a1.5 1.5 0 0 0 0 2.12l2.19 2.19a1.5 1.5 0 0 0 2.12 0l1.12-1.12a1.5 1.5 0 0 1 2.12 0l.06.06a1.5 1.5 0 0 0 2.12 0l.5-.5a1.5 1.5 0 0 0 0-2.12z" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-leaf">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function PhotoGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-leaf">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function BarsIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-leaf">
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="12" y1="20" x2="12" y2="8" />
      <line x1="18" y1="20" x2="18" y2="11" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-leaf shrink-0">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/* ─────────────────────────── Content data ─────────────────────────────── */

const LAYER_NUMBERS = ["01", "02", "03", "04"];

// Demo grid for the Safari image-blur illustration: which tiles are "blurred"
const DEMO_TILES = [false, true, false, false, false, true];

/* ───────────────────────────── Page ──────────────────────────────────── */

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CleanBrowse",
    operatingSystem: "macOS 14.0 or later",
    applicationCategory: "UtilitiesApplication",
    softwareVersion: "1.3.0",
    description: dict.meta.description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    downloadUrl: DMG_URL,
    author: { "@type": "Person", name: "Omar Elsayed" },
    featureList: [
      "System-wide adult content blocking via /etc/hosts and a DNS proxy",
      "NSFW image and video-frame blurring in Safari with on-device Core ML",
      "Enforced SafeSearch on Google, YouTube, Bing, and DuckDuckGo",
      "Custom domain blocking",
    ],
  };

  return (
    <main className="min-h-screen overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar locale={locale} dict={dict.nav} />

      {/* ── Hero ── */}
      <section className="relative paper-texture">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-paper pointer-events-none" />

        <div className="relative w-full max-w-6xl mx-auto px-6 pt-36 pb-24 grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center">
          {/* Text content */}
          <div className="text-center lg:text-start">
            <div className="rise-in inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-mint border border-leaf/20 text-leaf-deep text-sm font-medium">
              <ShieldCheckIcon />
              {dict.hero.badge}
            </div>

            <h1 className="rise-in rise-delay-1 font-display text-5xl sm:text-6xl lg:text-[4rem] font-bold text-ink leading-[1.08] tracking-tight mb-6">
              {dict.hero.title}
              <span className="text-leaf">{dict.hero.titlePunct}</span>
            </h1>

            <p className="rise-in rise-delay-2 text-lg sm:text-xl text-moss max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
              {dict.hero.subtitle}
            </p>

            <div className="rise-in rise-delay-3 w-fit max-w-full mx-auto lg:mx-0">
              <div className="flex flex-wrap gap-4 justify-center items-center">
                <a
                  href={DMG_URL}
                  download
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-leaf hover:bg-leaf-deep text-white font-semibold rounded-full transition-all shadow-lg shadow-leaf/20 hover:shadow-xl hover:shadow-leaf/25 hover:-translate-y-0.5"
                >
                  <DownloadIcon />
                  {dict.nav.downloadForMac}
                </a>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-4 bg-card border border-line hover:border-ink/25 text-ink font-semibold rounded-full transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  <GitHubIcon />
                  {dict.nav.viewOnGitHub}
                </a>
              </div>

              <p className="mt-5 text-sm text-moss text-center">{dict.hero.ctaNote}</p>

              <div className="mt-5 flex justify-center">
                <a
                  href={PRODUCT_HUNT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:-translate-y-0.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={productHuntBadge("light")}
                    alt="CleanBrowse - Free Adult Content Blocker | Product Hunt"
                    width={250}
                    height={54}
                  />
                </a>
              </div>
            </div>

            <div className="rise-in rise-delay-4 mt-10 flex flex-wrap gap-x-8 gap-y-3 justify-center lg:justify-start font-mono text-[13px] text-moss tnum">
              <span>
                <strong className="text-ink font-medium">{dict.hero.statDomainsValue}</strong>{" "}
                {dict.hero.statDomains}
              </span>
              <span>
                <strong className="text-ink font-medium">{dict.hero.statRegionsValue}</strong>{" "}
                {dict.hero.statRegions}
              </span>
              <span>
                <strong className="text-ink font-medium">{dict.hero.statDataValue}</strong>{" "}
                {dict.hero.statData}
              </span>
            </div>
          </div>

          {/* Screenshot with floating chips */}
          <div className="rise-in rise-delay-2 relative flex justify-center lg:justify-end">
            <div className="relative">
              <Image
                src="/screenshot.png"
                alt={dict.hero.screenshotAlt}
                width={480}
                height={498}
                className="rounded-2xl border border-line shadow-2xl shadow-ink/15"
                priority
              />
              <div className="float-soft absolute -left-6 top-10 hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-line shadow-lg text-sm font-medium text-ink">
                <span className="w-2 h-2 rounded-full bg-leaf-bright" />
                {dict.hero.chipProtected}
              </div>
              <div className="float-soft-late absolute -right-4 bottom-16 hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-line shadow-lg text-sm font-medium text-ink">
                <span className="font-mono text-xs text-leaf-deep bg-mint px-1.5 py-0.5 rounded">
                  {dict.hero.chipSafeSearch}
                </span>
                {dict.hero.chipEnforced}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dark band — live DNS log ── */}
      <section className="bg-pine text-white py-24">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1fr_1.2fr] gap-14 items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-leaf-bright mb-5">
              {dict.dns.eyebrow}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight mb-6">
              {dict.dns.title}
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8">{dict.dns.body}</p>
            <ul className="space-y-3 font-mono text-sm">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span className="text-white/70">{dict.dns.adult}</span>
                <span className="text-white/40 rtl-flip">→</span>
                <span className="text-red-300">{dict.dns.adultResult}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0" />
                <span className="text-white/70">{dict.dns.search}</span>
                <span className="text-white/40 rtl-flip">→</span>
                <span className="text-amber-200">{dict.dns.searchResult}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-leaf-bright shrink-0" />
                <span className="text-white/70">{dict.dns.other}</span>
                <span className="text-white/40 rtl-flip">→</span>
                <span className="text-leaf-bright">{dict.dns.otherResult}</span>
              </li>
            </ul>
          </div>

          <DnsLog srNote={dict.dns.srNote} />
        </div>
      </section>

      {/* ── Safari image blur (new in 1.3.0) ── */}
      <section id="blur" className="py-28 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-leaf mb-5">
              {dict.blur.eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight mb-5">
              {dict.blur.title}
            </h2>
            <p className="text-moss text-lg leading-relaxed mb-10">{dict.blur.intro}</p>

            <div className="space-y-7 mb-10">
              {dict.blur.points.map((point) => (
                <div key={point.title} className="border-s-2 border-leaf/30 ps-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-1.5">
                    {point.title}
                  </h3>
                  <p className="text-moss leading-relaxed">{point.body}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {dict.blur.chips.map((chip) => (
                <span
                  key={chip}
                  className="px-3 py-1.5 rounded-full bg-mint text-leaf-deep text-sm font-medium"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Illustration: browser window with a grid of image results, explicit ones blurred */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              role="img"
              aria-label={dict.blur.demoNote}
              className="rounded-3xl bg-card border border-line shadow-2xl shadow-ink/10 p-4 sm:p-5"
            >
              <div className="flex items-center gap-1.5 mb-4 px-1" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-leaf-bright/70" />
                <span className="ms-3 flex-1 h-6 rounded-full bg-mint/70 border border-line" />
              </div>
              <div className="grid grid-cols-3 gap-2.5" aria-hidden="true">
                {DEMO_TILES.map((isBlurred, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden border border-line"
                  >
                    {isBlurred ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-200 via-orange-100 to-rose-300">
                          <span className="absolute top-2 start-2 w-5 h-5 rounded-full bg-rose-300/80" />
                          <span className="absolute bottom-2 end-2 w-8 h-4 rounded-md bg-orange-200/90" />
                        </div>
                        <div className="absolute inset-0 backdrop-blur-md bg-white/40 flex flex-col items-center justify-center gap-1 text-ink/60">
                          <EyeOffIcon size={18} />
                          <span className="text-[10px] font-mono">{dict.blur.demoBlurred}</span>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-mint to-leaf/25 flex items-center justify-center text-leaf/70">
                        <PhotoGlyph />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="float-soft absolute -bottom-4 start-6 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pine text-white font-mono text-xs shadow-lg">
              <span className="w-2 h-2 rounded-full bg-leaf-bright" />
              {dict.blur.demoBadge}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="py-28 bg-mint/40 border-y border-line scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-leaf mb-5">
              {dict.how.eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight mb-5">
              {dict.how.title}
            </h2>
            <p className="text-moss text-lg leading-relaxed">{dict.how.intro}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {dict.how.layers.map((layer, i) => (
              <div key={layer.title} className="rounded-3xl bg-card border border-line p-9">
                <span className="font-mono text-sm text-leaf">
                  {dict.how.layerLabel} {LAYER_NUMBERS[i]}
                </span>
                <h3 className="font-display text-xl font-bold text-ink mt-4 mb-3">
                  {layer.title}
                </h3>
                <p className="text-moss leading-relaxed">{layer.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's new in 1.0 ── */}
      <section id="whats-new" className="py-28 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-leaf mb-5">
              {dict.whatsNew.eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight mb-5">
              {dict.whatsNew.title}
            </h2>
            <p className="text-moss text-lg leading-relaxed">{dict.whatsNew.intro}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Image blur card */}
            <div className="rounded-3xl bg-card border border-line p-9 hover:border-leaf/40 hover:shadow-lg hover:shadow-leaf/5 transition-all">
              <div className="mb-6">
                <EyeOffIcon />
              </div>
              <h3 className="font-display text-xl font-bold text-ink mb-3">
                {dict.whatsNew.blurTitle}
              </h3>
              <p className="text-moss leading-relaxed mb-6">{dict.whatsNew.blurBody}</p>
              <div className="grid grid-cols-3 gap-2" aria-hidden="true">
                {[false, true, false].map((isBlurred, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-lg overflow-hidden border border-line"
                  >
                    {isBlurred ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-200 to-orange-200" />
                        <div className="absolute inset-0 backdrop-blur-md bg-white/40 flex items-center justify-center text-ink/60">
                          <EyeOffIcon size={16} />
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-mint to-leaf/25 flex items-center justify-center text-leaf/70">
                        <PhotoGlyph />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Menu bar shortcut card */}
            <div className="rounded-3xl bg-card border border-line p-9 hover:border-leaf/40 hover:shadow-lg hover:shadow-leaf/5 transition-all">
              <div className="mb-6">
                <PuzzleIcon />
              </div>
              <h3 className="font-display text-xl font-bold text-ink mb-3">
                {dict.whatsNew.menuTitle}
              </h3>
              <p className="text-moss leading-relaxed mb-6">{dict.whatsNew.menuBody}</p>
              <span className="inline-block font-mono text-xs bg-mint text-leaf-deep px-3 py-1.5 rounded-lg" dir="ltr">
                Safari ▸ Extensions ▸ CleanBrowse
              </span>
            </div>

            {/* In-app updates card */}
            <div className="rounded-3xl bg-card border border-line p-9 hover:border-leaf/40 hover:shadow-lg hover:shadow-leaf/5 transition-all">
              <div className="mb-6">
                <RefreshIcon />
              </div>
              <h3 className="font-display text-xl font-bold text-ink mb-3">
                {dict.whatsNew.updateTitle}
              </h3>
              <p className="text-moss leading-relaxed mb-6">{dict.whatsNew.updateBody}</p>
              <div className="inline-flex items-center gap-2.5 font-mono text-sm">
                <span className="px-2.5 py-1 rounded-lg bg-ink/5 text-moss">
                  {dict.whatsNew.updateFrom}
                </span>
                <span className="text-moss rtl-flip" aria-hidden="true">→</span>
                <span className="px-2.5 py-1 rounded-lg bg-leaf text-white font-medium">
                  {dict.whatsNew.updateTo}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── From the maker ── */}
      <section id="maker" className="relative overflow-hidden bg-pine text-white py-24 sm:py-28 scroll-mt-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative">
            {/* Decorative oversized quote mark */}
            <span
              aria-hidden="true"
              className="absolute -top-10 start-6 font-display text-[14rem] leading-none text-leaf-bright/10 select-none pointer-events-none"
            >
              &ldquo;
            </span>
            {/* Soft glow */}
            <div className="absolute -bottom-32 -end-32 w-96 h-96 rounded-full bg-leaf-bright/10 blur-[100px] pointer-events-none" />

            <div className="relative grid lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-16 items-center">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-leaf-bright mb-6">
                  {dict.maker.eyebrow}
                </p>
                <blockquote className="font-display text-2xl sm:text-3xl font-semibold leading-snug text-white">
                  {dict.maker.quote}
                </blockquote>
              </div>

              <div className="lg:border-s lg:border-white/10 lg:ps-14">
                <p className="text-white/60 leading-relaxed mb-8">{dict.maker.body}</p>
                <div className="border-s-2 border-leaf-bright ps-4">
                  <span className="block text-white font-semibold">{dict.maker.name}</span>
                  <span className="block text-sm text-white/50">{dict.maker.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Privacy — what stays local, what's counted ── */}
      <section id="privacy" className="py-28 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-leaf mb-5">
              {dict.privacy.eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight mb-5">
              {dict.privacy.title}
            </h2>
            <p className="text-moss text-lg leading-relaxed mb-8">{dict.privacy.body}</p>
            <a
              href={APTABASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-leaf-deep font-semibold hover:text-leaf transition-colors"
            >
              {dict.privacy.linkLabel}
              <span aria-hidden="true" className="rtl-flip">→</span>
            </a>
          </div>

          <div className="rounded-3xl bg-card border border-line p-8 sm:p-10">
            <div className="grid sm:grid-cols-2 gap-10">
              <div>
                <div className="mb-5">
                  <LockIcon />
                </div>
                <h3 className="font-display text-lg font-bold text-ink mb-4">
                  {dict.privacy.stayTitle}
                </h3>
                <ul className="space-y-2.5 text-sm text-moss">
                  {dict.privacy.stayPoints.map((point) => (
                    <li key={point} className="flex gap-2.5">
                      <span className="text-leaf mt-0.5">✓</span> {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-5">
                  <BarsIcon />
                </div>
                <h3 className="font-display text-lg font-bold text-ink mb-4">
                  {dict.privacy.countTitle}
                </h3>
                <ul className="space-y-2.5 text-sm text-moss">
                  {dict.privacy.countPoints.map((point) => (
                    <li key={point} className="flex gap-2.5">
                      <span className="text-leaf mt-0.5">✓</span> {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-8 pt-6 border-t border-line text-sm text-moss leading-relaxed">
              {dict.privacy.note}
            </p>
          </div>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section id="roadmap" className="py-28 bg-mint/40 border-y border-line scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-leaf mb-5">
              {dict.roadmap.eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight mb-5">
              {dict.roadmap.title}
            </h2>
          </div>

          <div className="relative">
            {/* The winding road, drawn through every checkpoint */}
            <RoadPath />

            {/* Start cap — where v1.3.0 stands today */}
            <div className="relative grid grid-cols-[2.5rem_1fr] lg:flex lg:justify-center mb-12">
              <span
                data-road-point
                className="justify-self-center inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-leaf text-white font-mono text-xs font-medium border-4 border-card shadow-md shadow-leaf/25"
              >
                v1.3.0
              </span>
            </div>

            {/* Checkpoints */}
            <div className="space-y-8 lg:space-y-10">
              {dict.roadmap.items.map((item, i) => {
                const onLeft = i % 2 === 0;
                return (
                  <div
                    key={item.title}
                    className="relative grid grid-cols-[2.5rem_1fr] gap-x-5 lg:grid-cols-[1fr_13rem_1fr] lg:gap-x-0"
                  >
                    {/* Checkpoint marker on the road */}
                    <div
                      className={`row-start-1 col-start-1 lg:col-start-2 flex justify-center pt-8 lg:items-center lg:pt-0 ${
                        onLeft ? "lg:justify-end lg:pe-6" : "lg:justify-start lg:ps-6"
                      }`}
                    >
                      <span
                        data-road-point
                        className={`z-10 w-9 h-9 rounded-full border-4 border-card font-mono text-xs font-medium flex items-center justify-center shadow-md ${
                          item.active
                            ? "bg-leaf text-white shadow-leaf/25"
                            : "bg-mint text-leaf-deep shadow-ink/10"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Checkpoint card */}
                    <div
                      className={`col-start-2 row-start-1 lg:row-start-1 ${
                        onLeft ? "lg:col-start-1" : "lg:col-start-3"
                      }`}
                    >
                      <div className="rounded-3xl bg-card border border-line p-7 sm:p-8 hover:border-leaf/40 hover:shadow-lg hover:shadow-leaf/5 transition-all">
                        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 mb-2.5">
                          <h3 className="font-display text-lg font-bold text-ink">
                            {item.title}
                          </h3>
                          <span
                            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap ${
                              item.active
                                ? "bg-mint text-leaf-deep"
                                : "bg-ink/5 text-moss"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-moss text-sm leading-relaxed">{item.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Finish flag */}
            <div className="relative grid grid-cols-[2.5rem_1fr] lg:flex lg:justify-center mt-12">
              <span
                data-road-point
                className="justify-self-center w-10 h-10 rounded-full bg-pine border-4 border-card shadow-md flex items-center justify-center text-leaf-bright"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA + signup ── */}
      <section className="bg-pine text-white py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-6">
            {dict.cta.title}
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">{dict.cta.body}</p>
          <a
            href={DMG_URL}
            download
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-leaf-bright hover:bg-leaf text-pine hover:text-white font-semibold rounded-full transition-all shadow-lg shadow-leaf-bright/20 hover:-translate-y-0.5 mb-14"
          >
            <DownloadIcon />
            {dict.nav.downloadForMac}
          </a>
          <div className="relative">
            <EmailSignup dict={dict.signup} />
          </div>
        </div>
      </section>

      <Footer locale={locale} dict={dict} />
    </main>
  );
}
