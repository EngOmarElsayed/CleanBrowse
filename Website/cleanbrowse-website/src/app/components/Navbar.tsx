"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

function DownloadIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default function Navbar({ activePage }: { activePage?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const isContact = activePage === "contact";

  const navLinks = [
    { label: "Why", href: isContact ? "/#why" : "#why" },
    { label: "Roadmap", href: isContact ? "/#roadmap" : "#roadmap" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/app-icon.png"
            alt="CleanBrowse"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-white font-semibold text-lg group-hover:text-green-400 transition-colors">
            CleanBrowse
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`transition-colors text-sm font-medium ${
                activePage === link.label.toLowerCase()
                  ? "text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://mwxjmxew0wyerqxi.public.blob.vercel-storage.com/CleanBrowse.dmg"
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-green-500/20"
          >
            <DownloadIcon />
            Download
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-neutral-400 transition-all duration-300 origin-center ${
              isOpen ? "rotate-45 translate-y-[6px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-neutral-400 mt-1.5 transition-all duration-300 ${
              isOpen ? "opacity-0 scale-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-neutral-400 mt-1.5 transition-all duration-300 origin-center ${
              isOpen ? "-rotate-45 -translate-y-[6px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-80 opacity-100 border-b border-white/5"
            : "max-h-0 opacity-0"
        }`}
        style={{
          backgroundColor: scrolled ? "rgba(5, 5, 5, 0.95)" : "rgba(5, 5, 5, 0.98)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className={`transition-all text-base font-medium py-2 ${
                isOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0"
              } ${
                activePage === link.label.toLowerCase()
                  ? "text-white"
                  : "text-neutral-400 hover:text-white"
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
            href="https://mwxjmxew0wyerqxi.public.blob.vercel-storage.com/CleanBrowse.dmg"
            download
            onClick={handleLinkClick}
            className={`inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold mt-1 transition-all ${
              isOpen
                ? "translate-y-0 opacity-100"
                : "-translate-y-2 opacity-0"
            }`}
            style={{
              transitionDelay: isOpen ? `${navLinks.length * 50}ms` : "0ms",
              transitionDuration: "300ms",
            }}
          >
            <DownloadIcon />
            Download
          </a>
        </div>
      </div>
    </nav>
  );
}
