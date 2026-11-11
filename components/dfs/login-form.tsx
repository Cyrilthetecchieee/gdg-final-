"use client";

import { useState, type FormEvent } from "react";

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter the administrator passcode.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/dfs-2026/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-testid="dfs-login-card"
      className="mx-auto max-w-md rounded-3xl border border-paper/15 bg-ink/90 p-8 text-center backdrop-blur-md"
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue/30 bg-blue/15 text-xl font-bold text-blue">
        🔒
      </div>

      <h2 className="text-2xl font-bold text-paper">Administrator Access</h2>
      <p className="mt-2 text-sm text-paper/70">
        Sign in to manage the DFS 2026 selected participants announcement.
      </p>

      {error && (
        <div className="mt-4 rounded-xl border border-red/40 bg-red/10 px-4 py-2.5 text-sm text-red">
          {error}
        </div>
      )}

      <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 text-left">
        <label htmlFor="admin-passcode" className="block text-xs font-semibold uppercase tracking-wider text-paper/70">
          Admin Passcode
        </label>
        <div className="relative mt-2">
          <input
            id="admin-passcode"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Enter passcode"
            required
            autoComplete="current-password"
            disabled={loading}
            className="w-full rounded-xl border border-paper/20 bg-ink px-4 py-3 pr-16 text-sm text-paper placeholder:text-paper/40 focus:border-blue focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-paper/60 hover:text-paper"
            aria-label={showPassword ? "Hide passcode" : "Show passcode"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-blue py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Verifying…" : "Sign In to Dashboard"}
        </button>
      </form>
    </div>
  );
}
