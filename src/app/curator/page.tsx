"use client";

import { useMemo, useState } from "react";
import { Copy, Eye, Link as LinkIcon, QrCode, Share2, Users } from "lucide-react";
import { listByCurator, formatTicketNumber } from "@/lib/students";
import { TicketStatus } from "@/lib/types";

const CURATOR_NAME = "Меруерт";

export default function CuratorPage() {
  const myStudents = useMemo(() => listByCurator(CURATOR_NAME), []);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyLink = async (token: string, studentId: string) => {
    const url = `${window.location.origin}/ticket/${token}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(studentId);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const shareQr = async (token: string) => {
    const url = `${window.location.origin}/ticket/${token}`;
    if (navigator.share) {
      await navigator.share({ title: "JOO HIGH SCHOOL Ticket", url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <main className="px-6 py-10 md:px-10 space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Curator panel</p>
          <h1 className="text-3xl font-heading font-semibold">{CURATOR_NAME} — оқушылар</h1>
          <p className="text-slate-400 text-sm">QR және ссылка арқылы билетпен бөлісу</p>
        </div>
        <div className="badge bg-success/20 text-success border border-success/30 inline-flex items-center gap-2">
          <Users size={16} /> {myStudents.length} оқушы
        </div>
      </header>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {myStudents.map((student) => (
          <div key={student.id} className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/30 flex items-center justify-center font-heading text-lg">
                {student.fullName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-lg">{student.fullName}</p>
                <p className="text-slate-400 text-sm">{student.className}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span className="font-mono text-primary">{formatTicketNumber(student.ticketNumber)}</span>
              <span className="badge bg-success/10 text-success border border-success/20">
                {student.status === TicketStatus.ENTERED ? "Кірген" : "Кірмеген"}
              </span>
            </div>
            <div className="flex justify-between gap-2 text-sm">
              <button
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex-1"
                onClick={() => copyLink(student.qrToken, student.id)}
              >
                <Copy size={16} />
              </button>
              <button
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex-1"
                onClick={() => shareQr(student.qrToken)}
              >
                <Share2 size={16} />
              </button>
              <a
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex-1 text-center"
                href={`/ticket/${student.qrToken}`}
              >
                <Eye size={16} />
              </a>
              <a
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex-1 text-center"
                href={`/ticket/${student.qrToken}`}
              >
                <QrCode size={16} />
              </a>
            </div>
            {copiedId === student.id && (
              <div className="text-xs text-success text-center flex items-center gap-1 justify-center">
                <LinkIcon size={14} /> Сілтеме көшірілді
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
