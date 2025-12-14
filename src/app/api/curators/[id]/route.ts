import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await getSession();
  if (!user || user.role !== Role.ADMIN) return NextResponse.json({ error: "Тек админ" }, { status: 403 });
  const body = await request.json();
  const { name, login, password } = body ?? {};
  const data: any = {};
  if (name) data.name = name;
  if (login) data.login = login;
  if (password) data.passwordHash = await hashPassword(password);
  const updated = await prisma.user.update({ where: { id: params.id }, data });
  return NextResponse.json({ curator: { ...updated, password: undefined } });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const user = await getSession();
  if (!user || user.role !== Role.ADMIN) return NextResponse.json({ error: "Тек админ" }, { status: 403 });
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
