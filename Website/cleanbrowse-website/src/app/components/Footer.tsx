import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { GITHUB_URL } from "@/lib/links";

export default function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <footer className="bg-pine text-white/70">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/app-icon.png"
                alt="CleanBrowse"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-display font-bold text-white text-lg tracking-tight">
                CleanBrowse
              </span>
            </div>
            <p className="text-sm text-white/50 max-w-xs leading-relaxed">
              {dict.footer.taglinePre}{" "}
              <span className="text-leaf-bright font-medium">{dict.maker.name}</span>
              {dict.footer.taglinePost}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <a href={`/${locale}#how`} className="hover:text-white transition-colors">
              {dict.nav.how}
            </a>
            <a href={`/${locale}#whats-new`} className="hover:text-white transition-colors">
              {dict.nav.whatsNew}
            </a>
            <a href={`/${locale}#maker`} className="hover:text-white transition-colors">
              {dict.nav.maker}
            </a>
            <a href={`/${locale}#roadmap`} className="hover:text-white transition-colors">
              {dict.nav.roadmap}
            </a>
            <a href={`/${locale}/contact`} className="hover:text-white transition-colors">
              {dict.nav.contact}
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>
            &copy; {new Date().getFullYear()} Omar Elsayed. {dict.footer.rights}
          </span>
          <span className="font-mono">{dict.footer.motto}</span>
        </div>
      </div>
    </footer>
  );
}
