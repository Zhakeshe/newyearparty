"use client";

import { useCallback, useState } from "react";
import { Loader2, QrCode, XCircle, CheckCircle2 } from "lucide-react";
import { QRCamera } from "@/components/qr-camera";

async function checkTicket(qrToken: string) {
  const res = await fetch("/api/check-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qrToken })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Қате");
  return data;
}

export default function ScannerClient() {
  const [manual, setManual] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; meta?: any } | null>(null);

  const submit = useCallback(
    async (value?: string) => {
      const token = value ?? manual;
      if (!token) return;
      setLoading(true);
      try {
        const data = await checkTicket(token);
        setResult({ ok: true, message: "ACCESS GRANTED", meta: data.student });
      } catch (e: any) {
        setResult({ ok: false, message: e.message });
      } finally {
        setLoading(false);
      }
    },
    [manual]
  );

  return (
    <main className="min-h-screen px-6 py-12 md:px-10 space-y-6 flex flex-col items-center">
      <div className="text-center space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">QR Check-in</p>
        <h1 className="text-3xl font-heading font-semibold">Scanner</h1>
        <p className="text-slate-400 text-sm">QR тексеру тек осы бетте қолжетімді</p>
      </div>

      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-white/10 p-6 space-y-4">
        <div className="aspect-video bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden">
          <QRCamera onDetected={(val) => submit(val)} />
        </div>
        <div className="grid md:grid-cols-6 gap-3">
          <input
            className="input md:col-span-4"
            placeholder="QR токенді қолмен енгізу"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
          />
          <button
            onClick={() => submit()}
            disabled={loading}
            className="btn-primary md:col-span-2 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <QrCode className="h-4 w-4" />} Тексеру
          </button>
        </div>
        {result && (
          <div
            className={`rounded-2xl p-4 flex items-center gap-3 border ${
              result.ok ? "border-success/40 bg-success/10" : "border-error/40 bg-error/10"
            }`}
          >
            {result.ok ? <CheckCircle2 className="h-5 w-5 text-success" /> : <XCircle className="h-5 w-5 text-error" />}
            <div>
              <p className="font-semibold">{result.message}</p>
              {result.meta && (
                <p className="text-sm text-slate-200">
                  {result.meta.fullName} · {result.meta.className}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
