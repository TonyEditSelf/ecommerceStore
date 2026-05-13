"use client";

import { useState } from "react";

export default function AuthForm({ mode }) {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setStatus("Submitting");
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok) {
      setStatus(result.error || "Request failed");
      setSubmitting(false);
      return;
    }

    window.location.assign(result.data.role === "admin" ? "/admin" : "/");
  }

  return (
    <form onSubmit={submit} className="rounded-md border border-borderSoft bg-card p-6 shadow-soft">
      {mode === "signup" && (
        <>
          <label className="text-sm font-medium text-textPrimary">Full name</label>
          <input name="name" required className="mt-2 w-full rounded-md border border-borderSoft bg-white px-4 py-3 outline-none focus:border-primary" placeholder="Your name" />
        </>
      )}
      <label className={`${mode === "signup" ? "mt-5 " : ""}block text-sm font-medium text-textPrimary`}>Email</label>
      <input name="email" type="email" required className="mt-2 w-full rounded-md border border-borderSoft bg-white px-4 py-3 outline-none focus:border-primary" placeholder="you@example.com" />
      <label className="mt-5 block text-sm font-medium text-textPrimary">Password</label>
      <input name="password" type="password" required minLength={8} className="mt-2 w-full rounded-md border border-borderSoft bg-white px-4 py-3 outline-none focus:border-primary" placeholder="Create password" />
      <button
        disabled={submitting}
        className="mt-6 w-full rounded-md bg-cta px-5 py-3 text-sm font-semibold text-textPrimary hover:bg-ctaHover disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Submitting" : mode === "signup" ? "Create account" : "Login"}
      </button>
      {status && <p className="mt-4 text-center text-sm text-textSecondary">{status}</p>}
    </form>
  );
}
