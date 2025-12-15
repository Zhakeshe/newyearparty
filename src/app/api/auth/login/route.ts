import { NextResponse } from "next/server";
import { ensureAdminSeed, setSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { login, password } = body ?? {};
  if (!login || !password) {
    return NextResponse.json({ error: "Логин және пароль енгізіңіз" }, { status: 400 });
  }

  await ensureAdminSeed();
  const user = await prisma.user.findUnique({ where: { login } });
  if (!user) {
    return NextResponse.json({ error: "Пайдаланушы табылмады" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Қате пароль" }, { status: 401 });
  }

  await setSession({ id: user.id, role: user.role, name: user.name, login: user.login });
  return NextResponse.json({ role: user.role, name: user.name, login: user.login });
}
