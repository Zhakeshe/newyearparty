import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Auth қажет" }, { status: 401 });
  const body = await request.json();
  const { fullName, className, curatorId } = body ?? {};
  const student = await prisma.student.findUnique({ where: { id: params.id } });
  if (!student) return NextResponse.json({ error: "Табылмады" }, { status: 404 });
  if (user.role === Role.CURATOR && student.curatorId !== user.id)
    return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });

  const updated = await prisma.student.update({
    where: { id: params.id },
    data: {
      fullName: fullName ?? student.fullName,
      className: className ?? student.className,
      curatorId: user.role === Role.CURATOR ? student.curatorId : curatorId ?? student.curatorId
    },
    include: { ticket: true, curator: { select: { name: true, login: true } } }
  });
  return NextResponse.json({ student: updated });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Auth қажет" }, { status: 401 });
  const student = await prisma.student.findUnique({ where: { id: params.id } });
  if (!student) return NextResponse.json({ error: "Табылмады" }, { status: 404 });
  if (user.role === Role.CURATOR && student.curatorId !== user.id)
    return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });

  await prisma.ticket.deleteMany({ where: { studentId: params.id } });
  await prisma.student.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
