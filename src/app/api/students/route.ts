import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Role, TicketStatus } from "@prisma/client";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Auth қажет" }, { status: 401 });

  const where = user.role === Role.CURATOR ? { curatorId: user.id } : {};
  const students = await prisma.student.findMany({
    where,
    include: { ticket: true, curator: { select: { name: true, login: true } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ students });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.CURATOR))
    return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });

  const body = await request.json();
  const { fullName, className } = body ?? {};
  if (!fullName || !className) return NextResponse.json({ error: "Аты-жөні және сыныбы керек" }, { status: 400 });

  const curatorId = user.role === Role.CURATOR ? user.id : body.curatorId ?? user.id;
  const count = await prisma.ticket.count();
  const ticketNumber = 1000 + count + 1;
  const qrToken = crypto.randomUUID();

  const student = await prisma.student.create({
    data: {
      fullName,
      className,
      curatorId,
      ticket: {
        create: {
          qrToken,
          ticketNumber,
          status: TicketStatus.NOT_ENTERED
        }
      }
    },
    include: { ticket: true, curator: { select: { name: true, login: true } } }
  });

  return NextResponse.json({ student });
}
