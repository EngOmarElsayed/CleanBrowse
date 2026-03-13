import Image from "next/image";
import EmailSignup from "./components/EmailSignup";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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

function EyeOffIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-32 pt-32">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-green-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
              <div className="relative">
                <Image src="/app-icon.png" alt="CleanBrowse" width={80} height={80} className="rounded-2xl" />
                <span className="absolute -bottom-2 -right-3 text-[10px] font-semibold text-green-400 border border-green-400/30 bg-green-400/10 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  Beta
                </span>
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Clean<span className="text-gradient-green">Browse</span>
            </h1>

            <p className="text-xl text-neutral-400 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
              A macOS menu bar app that blocks adult content at the system level. Free forever — with premium features coming soon.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-4">
              <a
                href="https://mwxjmxew0wyerqxi.public.blob.vercel-storage.com/CleanBrowse.dmg"
                download
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-green-500/20"
              >
                <DownloadIcon />
                Download for macOS
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
              CleanBrowse is completely <span className="text-green-400 font-medium">free</span> — and always will be. Premium plans with advanced features like ad blocking, parental controls, and VPN are coming soon.
            </p>
          </div>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section id="roadmap" className="py-40 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

        <div className="w-full max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              What&apos;s <span className="text-gradient-green">Next</span>
            </h2>
            <p className="text-neutral-400 text-lg">
              CleanBrowse is just getting started. Here&apos;s what&apos;s coming.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Roadmap card 1 */}
            <div className="card-hover rounded-2xl bg-white/[0.03] p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-400" />
              <div className="mb-5 flex justify-center">
                <EyeOffIcon />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Ad Blocking & Tracker Protection</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Block ads and trackers system-wide across every browser and app.
              </p>
              <span className="inline-block mt-5 text-xs font-medium text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                Coming Soon
              </span>
            </div>

            {/* Roadmap card 2 */}
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

            {/* Roadmap card 3 */}
            <div className="card-hover rounded-2xl bg-white/[0.03] p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500/50 to-green-400/50" />
              <div className="mb-5 flex justify-center">
                <UsersIcon />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Parent Mode</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Remote configuration, activity dashboard, and device passcode protection.
              </p>
              <span className="inline-block mt-5 text-xs font-medium text-neutral-400 bg-white/5 px-3 py-1 rounded-full">
                Planned
              </span>
            </div>

            {/* Roadmap card 4 */}
            <div className="card-hover rounded-2xl bg-white/[0.03] p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500/30 to-green-400/30" />
              <div className="mb-5 flex justify-center">
                <LockIcon />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">VPN & DNS Encryption</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Browse privately with encrypted DNS protocols and a built-in VPN.
              </p>
              <span className="inline-block mt-5 text-xs font-medium text-neutral-400 bg-white/5 px-3 py-1 rounded-full">
                Planned
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Email Signup ── */}
      <section className="py-40 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Stay in the <span className="text-gradient-green">Loop</span>
          </h2>
          <p className="text-neutral-400 text-lg mb-12">
            Get notified when new features and plans launch.
          </p>
          <div className="relative">
            <EmailSignup />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
