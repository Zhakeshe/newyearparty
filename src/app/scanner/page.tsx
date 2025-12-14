"use client";

import { useState } from "react";
import { CheckCircle2, QrCode, XCircle } from "lucide-react";

export default function ScannerPage() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<{ status: "idle" | "valid" | "invalid"; message?: string; meta?: any }>({
    status: "idle"
  });

  const submit = async () => {
    const res = await fetch("/api/check-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qrToken: token })
    });
    const data = await res.json();
    setResult(data);
  };

  const flash = result.status === "valid" ? "ring-4 ring-success/40" : result.status === "invalid" ? "ring-4 ring-error/40" : "";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className={`glass-panel max-w-md w-full rounded-3xl p-8 text-center space-y-6 transition ${flash}`}>
        <div className="flex items-center justify-center gap-3 text-slate-200">
          <QrCode />
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Scanner</p>
            <h1 className="text-xl font-heading font-semibold">QR CHECK-IN</h1>
          </div>
        </div>

        <div className="space-y-3">
          <input
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-center"
            placeholder="QR token енгізіңіз"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button
            onClick={submit}
            className="w-full rounded-xl bg-primary text-white py-3 font-semibold hover:shadow-glow"
          >
            Тексеру
          </button>
        </div>

        {result.status !== "idle" && (
          <div className="space-y-3">
            {result.status === "valid" ? (
              <div className="flex flex-col items-center gap-2 text-success">
                <CheckCircle2 size={48} />
                <p className="text-xl font-heading">ACCESS GRANTED</p>
                <p className="text-slate-200">{result.meta.fullName}</p>
                <p className="text-slate-400 text-sm">{result.meta.className}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-error">
                <XCircle size={48} />
                <p className="text-xl font-heading">INVALID / ALREADY USED</p>
                <p className="text-slate-300 text-sm">{result.message}</p>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-slate-500">Demo режимі: токен ретінде sample qrToken енгізіңіз</p>
      </div>
    </main>
  );
}
