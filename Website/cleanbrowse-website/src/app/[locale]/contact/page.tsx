import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactForm from "../../components/ContactForm";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.contact.metaTitle,
    description: dict.contact.metaDescription,
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar locale={locale} dict={dict.nav} activePage="contact" />

      <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-24 paper-texture">
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-leaf mb-5">
              {dict.contact.eyebrow}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink mb-5">
              {dict.contact.title}
            </h1>
            <p className="text-moss text-lg max-w-md mx-auto">{dict.contact.body}</p>
          </div>

          <div className="rounded-3xl bg-card border border-line shadow-xl shadow-ink/5 p-8 sm:p-12">
            <ContactForm dict={dict.contact} />
          </div>
        </div>
      </section>

      <Footer locale={locale} dict={dict} />
    </main>
  );
}
