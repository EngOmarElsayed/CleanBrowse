"use client";

import { useState, FormEvent } from "react";

export default function EmailSignup() {
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
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-green-500/50 transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-7 py-3.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-green-500/20"
      >
        {status === "loading" ? "Sending..." : "Notify Me"}
      </button>
      {status === "success" && (
        <p className="text-green-400 text-sm self-center mt-4 pt-4 sm:absolute sm:mt-16">You&apos;re on the list!</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-sm self-center mt-4 pt-4 sm:absolute sm:mt-16">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
