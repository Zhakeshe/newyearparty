import Image from "next/image";
import QRCode from "qrcode";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatTicketNumber } from "@/lib/students";
import { TicketActions } from "@/components/ticket-actions";
import { TicketStatus } from "@prisma/client";

async function generateQrData(url: string) {
  return QRCode.toDataURL(url, { margin: 2, color: { dark: "#0F172A", light: "#ffffff" } });
}

export default async function TicketPage({ params }: { params: { qrToken: string } }) {
  const ticket = await prisma.ticket.findUnique({
    where: { qrToken: params.qrToken },
    include: { student: true }
  });

  if (!ticket || !ticket.student) {
    notFound();
  }

  const ticketNumber = formatTicketNumber(ticket.ticketNumber);
  const linkUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/ticket/${ticket.qrToken}`;
  const qrDataUrl = await generateQrData(linkUrl);

  return (
    <main className="flex items-center justify-center min-h-screen px-4 py-12">
      <div className="glass-panel max-w-xl w-full rounded-3xl border border-white/10 p-8 text-center space-y-6">
        <div className="text-sm uppercase tracking-[0.3em] text-slate-400">JOO HIGH SCHOOL</div>
        <div className="text-3xl font-heading font-semibold">NEW YEAR PARTY 2026</div>
        <div className="h-px bg-white/10" />

        <div className="space-y-2">
          <div className="text-lg font-semibold">{ticket.student.fullName}</div>
          <div className="flex justify-center gap-2 text-sm text-slate-300">
            <span className="badge bg-white/10 text-white border border-white/10">{ticket.student.className}</span>
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
          <p className={`badge ${ticket.status === TicketStatus.ENTERED ? "bg-success/20 text-success" : "bg-white/10"}`}>
            {ticket.status === TicketStatus.ENTERED ? "Қолданылды" : "Белсенді"}
          </p>
        </div>

        <TicketActions linkUrl={linkUrl} qrDataUrl={qrDataUrl} ticketNumber={ticketNumber} />
      </div>
    </main>
  );
}
