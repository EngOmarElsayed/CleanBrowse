"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "ac458dde-b020-48bf-9bd1-12c09197ac8f",
          name: form.name,
          email: form.email,
          message: form.message,
          subject: "CleanBrowse — New Contact Message",
        }),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <div className="text-green-400 text-5xl mb-4">&#10003;</div>
        <h3 className="text-2xl font-semibold text-white mb-2">Message Sent</h3>
        <p className="text-neutral-400">Thanks for reaching out. We&apos;ll get back to you soon.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-green-400 hover:text-green-300 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mx-auto">
      <div>
        <input
          type="text"
          required
          placeholder="Your name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-green-500/50 transition-colors"
        />
      </div>
      <div>
        <input
          type="email"
          required
          placeholder="Your email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-green-500/50 transition-colors"
        />
      </div>
      <div>
        <textarea
          required
          placeholder="Your message"
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-green-500/50 transition-colors resize-none"
        />
      </div>
      {status === "error" && (
        <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full px-7 py-3.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-green-500/20"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
