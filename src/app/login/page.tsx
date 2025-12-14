"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";

async function loginRequest(login: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Auth error");
  return data;
}

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [login, setLogin] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const next = params.get("next") ?? "/admin";

  useEffect(() => {
    setError(null);
  }, [login, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { role } = await loginRequest(login, password);
      const destination = role === "CURATOR" ? "/curator" : next;
      router.push(destination);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="glass-panel max-w-md w-full rounded-3xl border border-white/10 p-8 space-y-4"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">JOO HIGH SCHOOL</p>
        <h1 className="text-3xl font-heading font-semibold">Жүйеге кіру</h1>
        <div className="space-y-3">
          <input
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="input"
            placeholder="Логин"
            autoComplete="username"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            type="password"
            placeholder="Пароль"
            autoComplete="current-password"
          />
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />} Кіру
        </button>
        <p className="text-xs text-slate-400">Әдепкі админ логин/пароль: admin / admin</p>
      </form>
    </main>
  );
}
