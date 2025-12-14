"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

type Props = {
  active: boolean;
  onDetected: (value: string) => void;
};

export function QRCamera({ active, onDetected }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader>();
  const [status, setStatus] = useState<string>("Камера өшірулі");

  useEffect(() => {
    if (!active) {
      readerRef.current = undefined;
      setStatus("Камера өшірулі");
      return;
    }

    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;
    setStatus("Камера қосылуда…");

    let cancelled = false;

    reader
      .decodeFromVideoDevice(undefined, videoRef.current!, (result, error) => {
        if (cancelled) return;
        if (result) {
          setStatus("QR табылды");
          onDetected(result.getText());
        }
      })
      .catch((err) => {
        setStatus("Камераға рұқсат жоқ: " + err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [active, onDetected]);

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/60 aspect-video">
        <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
        <div className="absolute inset-6 rounded-2xl border-2 border-primary/50 animate-pulse" />
      </div>
      <p className="text-sm text-slate-400 text-center">{status}</p>
    </div>
  );
}
