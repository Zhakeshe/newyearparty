import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET() {
  const user = await getSession();
  if (!user || user.role !== Role.ADMIN) return NextResponse.json({ error: "Тек админ" }, { status: 403 });
  const curators = await prisma.user.findMany({ where: { role: Role.CURATOR }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ curators });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user || user.role !== Role.ADMIN) return NextResponse.json({ error: "Тек админ" }, { status: 403 });
  const body = await request.json();
  const { name, login, password } = body ?? {};
  if (!name || !login || !password) return NextResponse.json({ error: "Барлық өрісті толтырыңыз" }, { status: 400 });
  const passwordHash = await hashPassword(password);
  const created = await prisma.user.create({ data: { name, login, passwordHash, role: Role.CURATOR } });
  return NextResponse.json({ curator: { ...created, password: undefined } });
}
