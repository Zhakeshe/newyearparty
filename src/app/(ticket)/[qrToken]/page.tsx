import Image from "next/image";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { getStudentByToken, formatTicketNumber } from "@/lib/students";
import { TicketStatus } from "@/lib/types";
import { TicketActions } from "@/components/ticket-actions";

async function generateQrDataUrl(token: string) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com"}/ticket/${token}`;
  return QRCode.toDataURL(url, { margin: 2, color: { dark: "#0F172A", light: "#ffffff" } });
}

export default async function TicketPage({ params }: { params: { qrToken: string } }) {
  const student = getStudentByToken(params.qrToken);
  if (!student) {
    notFound();
  }

  const qrDataUrl = await generateQrDataUrl(student.qrToken);
  const ticketNumber = formatTicketNumber(student.ticketNumber);
  const linkUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/ticket/${student.qrToken}`;

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
            <Image
              src={qrDataUrl}
              alt="Ticket QR"
              className="h-64 w-64 object-contain"
              width={256}
              height={256}
              priority
              unoptimized
            />
          </div>
          <p className="text-slate-400 text-sm">Кіру үшін осы QR көрсетіңіз</p>
          <p className={`badge ${student.status === TicketStatus.ENTERED ? "bg-success/20 text-success" : "bg-error/20 text-error"}`}>
            {student.status === TicketStatus.ENTERED ? "Қолданылды" : "Белсенді"}
          </p>
        </div>

        <TicketActions linkUrl={linkUrl} qrDataUrl={qrDataUrl} ticketNumber={ticketNumber} />
      </div>
    </main>
  );
}
