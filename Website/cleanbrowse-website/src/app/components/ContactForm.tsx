"use client";

import { useState, FormEvent } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

export default function ContactForm({ dict }: { dict: Dictionary["contact"] }) {
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
        <div className="text-leaf text-5xl mb-4">&#10003;</div>
        <h3 className="font-display text-2xl font-bold text-ink mb-2">
          {dict.successTitle}
        </h3>
        <p className="text-moss">{dict.successBody}</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-leaf hover:text-leaf-deep font-medium transition-colors"
        >
          {dict.sendAnother}
        </button>
      </div>
    );
  }

  const inputStyles =
    "w-full px-5 py-3.5 rounded-2xl bg-paper border border-line text-ink placeholder:text-moss/60 focus:outline-none focus:border-leaf/60 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mx-auto">
      <div>
        <input
          type="text"
          required
          placeholder={dict.namePlaceholder}
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <input
          type="email"
          required
          placeholder={dict.emailPlaceholder}
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <textarea
          required
          placeholder={dict.messagePlaceholder}
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className={`${inputStyles} resize-none`}
        />
      </div>
      {status === "error" && <p className="text-red-500 text-sm">{dict.error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full px-7 py-3.5 bg-leaf hover:bg-leaf-deep disabled:opacity-50 text-white font-semibold rounded-full transition-all shadow-md shadow-leaf/15"
      >
        {status === "loading" ? dict.sending : dict.send}
      </button>
    </form>
  );
}
