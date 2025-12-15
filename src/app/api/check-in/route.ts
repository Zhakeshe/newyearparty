import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { TicketStatus } from "@prisma/client";

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Auth қажет" }, { status: 401 });

  const body = await request.json();
  const { qrToken } = body ?? {};
  if (!qrToken) return NextResponse.json({ error: "QR бос" }, { status: 400 });

  const ticket = await prisma.ticket.findUnique({
    where: { qrToken },
    include: { student: true }
  });

  if (!ticket) {
    return NextResponse.json({ error: "Билет табылмады" }, { status: 404 });
  }

  if (ticket.status === TicketStatus.ENTERED) {
    await prisma.checkInLog.create({ data: { ticketId: ticket.id, scannerId: user.id, result: "already-entered" } });
    return NextResponse.json({ error: "Бұрын скан жасалған" }, { status: 400 });
  }

  const updated = await prisma.ticket.update({
    where: { id: ticket.id },
    data: { status: TicketStatus.ENTERED, enteredAt: new Date() },
    include: { student: true }
  });

  await prisma.checkInLog.create({ data: { ticketId: ticket.id, scannerId: user.id, result: "ok" } });

  return NextResponse.json({
    ticket: updated,
    student: updated.student
  });
}
