type Verdict = "blocked" | "safesearch" | "allowed";

type LogEntry = {
  qtype: string;
  domain: string;
  answer: string;
  verdict: Verdict;
};

const ENTRIES: LogEntry[] = [
  { qtype: "A", domain: "adult-site-2841.com", answer: "NXDOMAIN", verdict: "blocked" },
  { qtype: "A", domain: "www.google.com", answer: "forcesafesearch.google.com", verdict: "safesearch" },
  { qtype: "AAAA", domain: "xxx-stream.net", answer: "NXDOMAIN", verdict: "blocked" },
  { qtype: "A", domain: "wikipedia.org", answer: "198.35.26.96", verdict: "allowed" },
  { qtype: "HTTPS", domain: "explicit-cdn.io", answer: "NXDOMAIN", verdict: "blocked" },
  { qtype: "A", domain: "www.youtube.com", answer: "restrict.youtube.com", verdict: "safesearch" },
  { qtype: "A", domain: "github.com", answer: "140.82.121.4", verdict: "allowed" },
  { qtype: "A", domain: "nsfw-gallery.org", answer: "NXDOMAIN", verdict: "blocked" },
  { qtype: "A", domain: "www.bing.com", answer: "strict.bing.com", verdict: "safesearch" },
  { qtype: "AAAA", domain: "apple.com", answer: "2620:149:af0::10", verdict: "allowed" },
  { qtype: "A", domain: "cam-site-live.tv", answer: "NXDOMAIN", verdict: "blocked" },
  { qtype: "A", domain: "duckduckgo.com", answer: "safe.duckduckgo.com", verdict: "safesearch" },
];

const VERDICT_STYLE: Record<Verdict, { dot: string; text: string; label: string }> = {
  blocked: { dot: "bg-red-400", text: "text-red-300", label: "blocked" },
  safesearch: { dot: "bg-amber-300", text: "text-amber-200", label: "safesearch" },
  allowed: { dot: "bg-leaf-bright", text: "text-leaf-bright", label: "allowed" },
};

function LogLine({ entry }: { entry: LogEntry }) {
  const s = VERDICT_STYLE[entry.verdict];
  return (
    <div className="flex items-center gap-3 py-2 font-mono text-[13px] leading-none">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
      <span className="text-white/35 w-12 shrink-0 hidden sm:inline">{entry.qtype}</span>
      <span className="text-white/80 truncate shrink-0 max-w-[45%]">{entry.domain}</span>
      <span className="text-white/30 shrink-0">→</span>
      <span
        className={`truncate ${entry.verdict === "blocked" ? "text-red-300" : "text-white/60"}`}
      >
        {entry.answer}
      </span>
      <span
        className={`ml-auto shrink-0 text-[11px] uppercase tracking-wider hidden md:inline ${s.text}`}
      >
        {s.label}
      </span>
    </div>
  );
}

export default function DnsLog({ srNote }: { srNote: string }) {
  return (
    <div
      dir="ltr"
      className="rounded-2xl bg-pine-soft/60 border border-white/10 overflow-hidden"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="ml-3 font-mono text-xs text-white/40">
          cleanbrowse — dns proxy · 127.0.0.1:53
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-leaf-bright">
          <span className="w-1.5 h-1.5 rounded-full bg-leaf-bright animate-pulse" />
          live
        </span>
      </div>

      {/* Scrolling log — list duplicated so the -50% translate loops seamlessly */}
      <div className="relative h-64 overflow-hidden px-5" aria-hidden="true">
        <div className="log-scroll">
          {[...ENTRIES, ...ENTRIES].map((entry, i) => (
            <LogLine key={i} entry={entry} />
          ))}
        </div>
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-pine to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-pine to-transparent pointer-events-none" />
      </div>
      <p className="sr-only">{srNote}</p>
    </div>
  );
}
