"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { useParams, useSearchParams } from "next/navigation";
import { buildTicketLink, decodeStudentPayload, formatTicketNumber } from "@/lib/students";
import { TicketStatus } from "@/lib/types";
import { TicketActions } from "@/components/ticket-actions";
import { useStudentStore } from "@/components/student-provider";

export default function TicketPage() {
  const params = useParams<{ qrToken: string }>();
  const searchParams = useSearchParams();
  const { students, importStudent } = useStudentStore();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const student = useMemo(
    () => students.find((s) => s.qrToken.toLowerCase() === params.qrToken.toLowerCase()),
    [students, params.qrToken]
  );

  useEffect(() => {
    if (student) return;
    const payload = decodeStudentPayload(searchParams.get("data"));
    if (payload) {
      importStudent(payload);
    }
  }, [student, searchParams, importStudent]);

  useEffect(() => {
    if (!student) return;
    const url = buildTicketLink(student);
    QRCode.toDataURL(url, { margin: 2, color: { dark: "#0F172A", light: "#ffffff" } }).then(setQrDataUrl);
  }, [student]);

  if (!student) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="glass-panel max-w-md w-full rounded-3xl border border-white/10 p-8 text-center space-y-3">
          <p className="text-sm text-slate-400">Ticket табылмады</p>
          <p className="text-lg font-heading">QR дұрыс емес</p>
        </div>
      </main>
    );
  }

  const ticketNumber = formatTicketNumber(student.ticketNumber);
  const linkUrl = buildTicketLink(student);

  return (
    <main className="flex items-center justify-center min-h-screen px-4 py-12">
      <div className="glass-panel max-w-xl w-full rounded-3xl border border-white/10 p-8 text-center space-y-6">
        <div className="text-sm uppercase tracking-[0.3em] text-slate-400">JOO HIGH SCHOOL</div>
        <div className="text-3xl font-heading font-semibold">NEW YEAR PARTY 2026</div>
        <div className="h-px bg-white/10" />

        <div className="space-y-2">
          <div className="text-lg font-semibold">{student.fullName}</div>
          <div className="flex justify-center gap-2 text-sm text-slate-300">
            <span className="badge bg-white/10 text-white border border-white/10">{student.className}</span>
            <span className="badge bg-gradient-to-r from-primary to-secondary text-white font-mono">{ticketNumber}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-xl">
            {qrDataUrl ? (
              <Image
                src={qrDataUrl}
                alt="Ticket QR"
                className="h-64 w-64 object-contain"
                width={256}
                height={256}
                priority
                unoptimized
              />
            ) : (
              <div className="h-64 w-64 flex items-center justify-center text-slate-400">QR жүктелуде...</div>
            )}
          </div>
          <p className="text-slate-400 text-sm">Кіру үшін осы QR көрсетіңіз</p>
          <p className={`badge ${student.status === TicketStatus.ENTERED ? "bg-success/20 text-success" : "bg-error/20 text-error"}`}>
            {student.status === TicketStatus.ENTERED ? "Қолданылды" : "Белсенді"}
          </p>
        </div>

        {qrDataUrl && <TicketActions linkUrl={linkUrl} qrDataUrl={qrDataUrl} ticketNumber={ticketNumber} />}
      </div>
    </main>
  );
}
