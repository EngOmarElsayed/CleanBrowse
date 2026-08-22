"use client";

import { useState, FormEvent } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

export default function EmailSignup({ dict }: { dict: Dictionary["signup"] }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "f72605f1-5c0a-4ade-927b-c0929784e336",
          email,
          subject: "CleanBrowse — New Email Signup",
        }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        required
        placeholder={dict.placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-5 py-3.5 rounded-full bg-white/[0.07] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-leaf-bright/60 transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-7 py-3.5 bg-white/10 hover:bg-white/15 border border-white/15 disabled:opacity-50 text-white font-medium rounded-full transition-all"
      >
        {status === "loading" ? dict.sending : dict.button}
      </button>
      {status === "success" && (
        <p className="text-leaf-bright text-sm self-center mt-4 pt-4 sm:absolute sm:mt-16">
          {dict.success}
        </p>
      )}
      {status === "error" && (
        <p className="text-red-300 text-sm self-center mt-4 pt-4 sm:absolute sm:mt-16">
          {dict.error}
        </p>
      )}
    </form>
  );
}
