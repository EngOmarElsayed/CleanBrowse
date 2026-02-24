import Image from "next/image";

/* ───────────────────────── Icons (inline SVGs) ───────────────────────── */

function ShieldIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function DnsIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
      <rect x="2" y="3" width="20" height="6" rx="1" />
      <rect x="2" y="15" width="20" height="6" rx="1" />
      <circle cx="6" cy="6" r="1" fill="currentColor" />
      <circle cx="6" cy="18" r="1" fill="currentColor" />
      <path d="M12 9v6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
      <path d="M8 11h6" />
      <path d="M11 8v6" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function BlockIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function GitHubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

/* ───────────────────────────── Page ──────────────────────────────────── */

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#050505]/80 border-b border-white/5">
        <div className="w-full h-20 flex items-center justify-between" style={{ paddingLeft: '6rem', paddingRight: '6rem' }}>
          <a href="#" className="flex items-center gap-3">
            <Image src="/app-icon.png" alt="CleanBrowse" width={32} height={32} className="rounded-lg" />
            <span className="font-semibold text-white text-lg">CleanBrowse</span>
          </a>
          <div className="flex items-center gap-8">
            <a href="#about" className="text-sm text-neutral-400 hover:text-white transition-colors hidden sm:block">About</a>
            <a href="#why" className="text-sm text-neutral-400 hover:text-white transition-colors hidden sm:block">Why</a>
            <a href="#roadmap" className="text-sm text-neutral-400 hover:text-white transition-colors hidden sm:block">Roadmap</a>
            <a
              href="https://github.com/EngOmarElsayed/CleanBrowse"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
            >
              <GitHubIcon className="w-5 h-5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-32 pt-32">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-green-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
              <Image src="/app-icon.png" alt="CleanBrowse" width={80} height={80} className="rounded-2xl" />
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Clean<span className="text-gradient-green">Browse</span>
            </h1>

            <p className="text-xl text-neutral-400 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
              A free, open-source macOS menu bar app that blocks adult content at the system level. No subscriptions. No data collection.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-4">
              <a
                href="https://github.com/EngOmarElsayed/CleanBrowse/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-green-500/20"
              >
                <DownloadIcon />
                Download for macOS
              </a>
              <a
                href="https://github.com/EngOmarElsayed/CleanBrowse"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/10 text-white hover:border-white/30 font-medium rounded-xl transition-all hover:bg-white/5"
              >
                <GitHubIcon />
                View on GitHub
              </a>
            </div>

            <p className="text-sm text-neutral-500 mt-5">
              Requires macOS 14 (Sonoma) or later
            </p>
          </div>

          {/* Right — Screenshot */}
          <div className="relative animate-fade-in-up animate-delay-200 flex justify-center">
            <div className="relative glow-green rounded-2xl">
              <Image
                src="/screenshot.png"
                alt="CleanBrowse app screenshot"
                width={420}
                height={520}
                className="rounded-2xl border border-white/10"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-40 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

        <div className="w-full max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Three Layers of <span className="text-gradient-green">Protection</span>
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed">
              CleanBrowse uses a multi-layered approach to ensure content blocking cannot be bypassed — across every browser and app on your Mac.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="card-hover rounded-2xl bg-white/[0.03] p-10">
              <div className="mb-6">
                <ShieldIcon />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Hosts File Blocking</h3>
              <p className="text-neutral-400 leading-relaxed">
                Blocks over 249,000 adult domains by redirecting them to localhost via the system hosts file. Works across every application.
              </p>
            </div>

            {/* Card 2 */}
            <div className="card-hover rounded-2xl bg-white/[0.03] p-10">
              <div className="mb-6">
                <DnsIcon />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">DNS Proxy</h3>
              <p className="text-neutral-400 leading-relaxed">
                A system-wide DNS proxy intercepts all DNS query types — including encrypted DNS — returning NXDOMAIN for blocked domains. No bypass possible.
              </p>
            </div>

            {/* Card 3 */}
            <div className="card-hover rounded-2xl bg-white/[0.03] p-10">
              <div className="mb-6">
                <SearchIcon />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Forced SafeSearch</h3>
              <p className="text-neutral-400 leading-relaxed">
                Enforces SafeSearch on Google, YouTube, Bing, and DuckDuckGo across 190+ country-code domains at the IP level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why ── */}
      <section id="why" className="py-40 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="mb-10 flex justify-center">
            <HeartIcon />
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
            Why <span className="text-gradient-green">CleanBrowse</span>?
          </h2>

          <blockquote className="text-2xl sm:text-3xl font-medium text-white leading-snug mb-12">
            &ldquo;Everyone should have the tools to protect themselves and their loved ones from the internet.&rdquo;
          </blockquote>

          <div className="space-y-8 text-lg text-neutral-400 leading-relaxed">
            <p>
              The internet is an incredible resource — but not all of it is safe, especially for families. The tools to stay protected shouldn&apos;t cost a monthly subscription or require handing your data to a third party.
            </p>
            <p>
              CleanBrowse is completely <span className="text-green-400 font-medium">free</span>, <span className="text-green-400 font-medium">open source</span>, and runs entirely on your Mac. No cloud. No data collection. No accounts. Just protection that works.
            </p>
            <p>
              This isn&apos;t a product — it&apos;s a tool for the community. If it helps even one family browse safer, it was worth building.
            </p>
          </div>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section id="roadmap" className="py-40 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

        <div className="w-full max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              What&apos;s <span className="text-gradient-green">Next</span>
            </h2>
            <p className="text-neutral-400 text-lg">
              CleanBrowse is just getting started. Here&apos;s what&apos;s coming.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {/* Roadmap card 1 */}
            <div className="card-hover rounded-2xl bg-white/[0.03] p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-400" />
              <div className="mb-5 flex justify-center">
                <PhoneIcon />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">iOS App</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Bringing the same system-level protection to iPhone and iPad.
              </p>
              <span className="inline-block mt-5 text-xs font-medium text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                In Development
              </span>
            </div>

            {/* Roadmap card 2 */}
            <div className="card-hover rounded-2xl bg-white/[0.03] p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500/50 to-green-400/50" />
              <div className="mb-5 flex justify-center">
                <BlockIcon />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Expanded Blocklist</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Community-driven blocklist expansion with more categories and sources.
              </p>
              <span className="inline-block mt-5 text-xs font-medium text-neutral-400 bg-white/5 px-3 py-1 rounded-full">
                Planned
              </span>
            </div>

            {/* Roadmap card 3 */}
            <div className="card-hover rounded-2xl bg-white/[0.03] p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500/30 to-green-400/30" />
              <div className="mb-5 flex justify-center">
                <GlobeIcon />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">More Search Engines</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Adding SafeSearch enforcement for additional search engines and browsers.
              </p>
              <span className="inline-block mt-5 text-xs font-medium text-neutral-400 bg-white/5 px-3 py-1 rounded-full">
                Planned
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5" style={{ marginTop: '2rem', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="w-full flex items-center justify-between" style={{ paddingLeft: '6rem', paddingRight: '6rem' }}>
          <div className="flex items-center gap-3">
            <Image src="/app-icon.png" alt="CleanBrowse" width={28} height={28} className="rounded-lg" />
            <span className="text-sm"><span className="font-semibold text-white">CleanBrowse</span> <span className="text-neutral-500">by </span><a href="https://github.com/EngOmarElsayed" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors">Omar Elsayed</a></span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/EngOmarElsayed/CleanBrowse"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
            >
              <GitHubIcon className="w-4 h-4" />
              GitHub
            </a>
            <span className="text-neutral-500 text-sm">MIT License</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
