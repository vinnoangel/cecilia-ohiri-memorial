import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword(form);

    if (signInError) {
      setError("Sign in failed. Check your email and password.");
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf0] px-5 py-12 text-[#4a3530]">
      <section className="w-full max-w-md rounded-3xl border border-[#eadcae] bg-[#fffdf5] p-8 shadow-[0_18px_60px_rgba(127,17,24,0.08)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a71920]">
          Cecilia Ohiri Memorial
        </p>
        <h1 className="mt-4 font-serif text-3xl text-[#3a2522]">
          Administrator sign in
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Sign in to review and publish guestbook tributes.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-[#3a2522]">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-2 min-h-12 w-full rounded-xl border border-[#eadcae] bg-[#fffaf0] px-4 py-3 outline-none focus:border-[#a71920] focus:ring-2 focus:ring-[#a71920]/20"
            />
          </label>
          <label className="block text-sm font-medium text-[#3a2522]">
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              className="mt-2 min-h-12 w-full rounded-xl border border-[#eadcae] bg-[#fffaf0] px-4 py-3 outline-none focus:border-[#a71920] focus:ring-2 focus:ring-[#a71920]/20"
            />
          </label>
          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="min-h-12 w-full rounded-full bg-[#a71920] px-5 py-3 text-sm font-semibold text-white hover:bg-[#7f1118] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <a href="/" className="mt-6 block text-center text-sm text-[#a71920] hover:underline">
          Return to memorial
        </a>
      </section>
    </main>
  );
}
