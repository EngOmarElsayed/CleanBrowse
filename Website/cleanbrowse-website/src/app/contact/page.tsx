import Image from "next/image";
import type { Metadata } from "next";
import ContactForm from "../components/ContactForm";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Contact — CleanBrowse",
  description: "Get in touch with the CleanBrowse team.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar activePage="contact" />

      {/* ── Contact Section ── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-green-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Get in <span className="text-gradient-green">Touch</span>
            </h1>
            <p className="text-neutral-400 text-lg">
              Have a question, feedback, or just want to say hi? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="card-hover rounded-2xl bg-white/[0.03] p-8 sm:p-12">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5" style={{ marginTop: '2rem', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="w-full flex items-center justify-between" style={{ paddingLeft: '6rem', paddingRight: '6rem' }}>
          <div className="flex items-center gap-3">
            <Image src="/app-icon.png" alt="CleanBrowse" width={28} height={28} className="rounded-lg" />
            <span className="text-sm"><span className="font-semibold text-white">CleanBrowse</span> <span className="text-neutral-500">by </span><span className="text-green-400">Omar Elsayed</span></span>
          </div>
          <span className="text-neutral-500 text-sm">&copy; {new Date().getFullYear()} CleanBrowse</span>
        </div>
      </footer>
    </main>
  );
}
