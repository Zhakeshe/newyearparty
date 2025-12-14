"use client";

import { useCallback, useState } from "react";
import { CheckCircle2, QrCode, Video, VideoOff, XCircle } from "lucide-react";
import { QRCamera } from "@/components/qr-camera";

type ScanResult = { status: "idle" | "valid" | "invalid"; message?: string; meta?: any };

export default function ScannerPage() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<ScanResult>({ status: "idle" });
  const [cameraEnabled, setCameraEnabled] = useState(false);

  const submit = useCallback(
    async (value?: string) => {
      const qrToken = value ?? token;
      if (!qrToken) return;

      const res = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrToken })
      });
      const data = await res.json();
      setResult(data);
    },
    [token]
  );

  const handleDetected = useCallback(
    (value: string) => {
      setToken(value);
      submit(value);
    },
    [submit]
  );

  const flash = result.status === "valid" ? "ring-4 ring-success/40" : result.status === "invalid" ? "ring-4 ring-error/40" : "";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className={`glass-panel max-w-3xl w-full rounded-3xl p-8 text-center space-y-8 transition ${flash}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-slate-200">
          <div className="flex items-center gap-3">
            <QrCode />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Scanner</p>
              <h1 className="text-xl font-heading font-semibold">QR CHECK-IN</h1>
            </div>
          </div>
          <button
            onClick={() => setCameraEnabled((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm hover:shadow-glow"
          >
            {cameraEnabled ? <VideoOff size={16} /> : <Video size={16} />}
            {cameraEnabled ? "Камераны өшіру" : "Камерамен скан"}
          </button>
        </div>

        {cameraEnabled && <QRCamera active={cameraEnabled} onDetected={handleDetected} />}

        <div className="grid md:grid-cols-[2fr,1fr] gap-6 text-left">
          <div className="space-y-3">
            <label className="text-sm text-slate-400">QR token қолмен енгізу</label>
            <div className="flex gap-2">
              <input
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="QR token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <button
                onClick={() => submit()}
                className="rounded-xl bg-primary text-white px-4 py-3 font-semibold hover:shadow-glow"
              >
                Тексеру
              </button>
            </div>
            <p className="text-xs text-slate-500">Demo: sample qrToken енгізіңіз немесе камерамен сканерлеңіз</p>
          </div>

          {result.status !== "idle" && (
            <div className="glass-panel rounded-2xl p-4 space-y-2 text-center">
              {result.status === "valid" ? (
                <div className="flex flex-col items-center gap-2 text-success">
                  <CheckCircle2 size={32} />
                  <p className="text-lg font-heading">ACCESS GRANTED</p>
                  <p className="text-slate-200">{result.meta.fullName}</p>
                  <p className="text-slate-400 text-sm">{result.meta.className}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-error">
                  <XCircle size={32} />
                  <p className="text-lg font-heading">INVALID / ALREADY USED</p>
                  <p className="text-slate-300 text-sm">{result.message}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
