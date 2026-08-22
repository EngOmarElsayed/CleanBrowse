"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export default function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function hrefFor(target: Locale) {
    const rest = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "");
    return `/${target}${rest}`;
  }

  function rememberLocale(target: Locale) {
    document.cookie = `NEXT_LOCALE=${target};path=/;max-age=31536000;samesite=lax`;
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label={label}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-moss hover:text-ink hover:bg-ink/5 transition-colors"
      >
        <GlobeIcon />
        {localeNames[locale]}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute end-0 top-full mt-2 min-w-40 rounded-2xl bg-card border border-line shadow-xl shadow-ink/10 py-2 z-50">
          {locales.map((l) => (
            <a
              key={l}
              href={hrefFor(l)}
              onClick={() => rememberLocale(l)}
              className={`block px-4 py-2 text-sm transition-colors ${
                l === locale
                  ? "text-leaf-deep font-semibold bg-mint/60"
                  : "text-ink hover:bg-paper"
              }`}
            >
              {localeNames[l]}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
