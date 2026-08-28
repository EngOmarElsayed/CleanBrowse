"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { DMG_URL, GITHUB_URL } from "@/lib/links";

function GitHubIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.27 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      className="w-4 h-4"
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

export default function Navbar({
  locale,
  dict,
  activePage,
}: {
  locale: Locale;
  dict: Dictionary["nav"];
  activePage?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: dict.how, href: `/${locale}#how`, key: "how" },
    { label: dict.whatsNew, href: `/${locale}#whats-new`, key: "whats-new" },
    { label: dict.maker, href: `/${locale}#maker`, key: "maker" },
    { label: dict.roadmap, href: `/${locale}#roadmap`, key: "roadmap" },
    { label: dict.contact, href: `/${locale}/contact`, key: "contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-paper/85 backdrop-blur-xl border-b border-line shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href={`/${locale}`} className="flex items-center gap-2.5 group">
          <Image
            src="/app-icon.png"
            alt="CleanBrowse"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="font-display text-ink font-bold text-lg tracking-tight group-hover:text-leaf transition-colors">
            CleanBrowse
          </span>
        </a>

        {/* Desktop Navigation: content links | divider | utilities | primary CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-6 me-2">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className={`transition-colors text-sm font-medium ${
                  activePage === link.key ? "text-ink" : "text-moss hover:text-ink"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <span className="h-5 w-px bg-line" aria-hidden="true" />

          <div className="flex items-center gap-1">
            <LanguageSwitcher locale={locale} label={dict.language} />
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title={dict.viewOnGitHub}
              className="p-2 rounded-full text-moss hover:text-ink hover:bg-ink/5 transition-colors"
            >
              <GitHubIcon />
            </a>
          </div>

          <a
            href={DMG_URL}
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-leaf hover:bg-leaf-deep text-white rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-md"
          >
            <DownloadIcon />
            {dict.download}
          </a>
        </div>

        {/* Mobile: language switcher + hamburger */}
        <div className="lg:hidden flex items-center gap-1">
          <LanguageSwitcher locale={locale} label={dict.language} />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-ink/5 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <span
              className={`block w-5 h-0.5 bg-ink transition-all duration-300 origin-center ${
                isOpen ? "rotate-45 translate-y-[6px]" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-ink mt-1.5 transition-all duration-300 ${
                isOpen ? "opacity-0 scale-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-ink mt-1.5 transition-all duration-300 origin-center ${
                isOpen ? "-rotate-45 -translate-y-[6px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-paper/95 backdrop-blur-xl ${
          isOpen ? "max-h-96 opacity-100 border-b border-line" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link, i) => (
            <a
              key={link.key}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`transition-all text-base font-medium py-2 text-moss hover:text-ink ${
                isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
              }`}
              style={{
                transitionDelay: isOpen ? `${i * 50}ms` : "0ms",
                transitionDuration: "300ms",
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className={`inline-flex items-center gap-2.5 text-base font-medium py-2 text-moss hover:text-ink transition-all ${
              isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            }`}
            style={{
              transitionDelay: isOpen ? `${navLinks.length * 50}ms` : "0ms",
              transitionDuration: "300ms",
            }}
          >
            <GitHubIcon />
            {dict.viewOnGitHub}
          </a>
          <a
            href={DMG_URL}
            download
            onClick={() => setIsOpen(false)}
            className={`inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-leaf hover:bg-leaf-deep text-white rounded-full text-sm font-semibold mt-1 transition-all ${
              isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            }`}
            style={{
              transitionDelay: isOpen ? `${navLinks.length * 50}ms` : "0ms",
              transitionDuration: "300ms",
            }}
          >
            <DownloadIcon />
            {dict.downloadForMac}
          </a>
        </div>
      </div>
    </nav>
  );
}

