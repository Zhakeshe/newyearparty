import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "@edge-runtime/jose";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { Role } from "@prisma/client";

const SESSION_COOKIE = "session";
const SESSION_EXP_HOURS = 24;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is required for signing sessions");
  }
  return new TextEncoder().encode(secret);
}

export type SessionUser = {
  id: string;
  role: Role;
  name: string;
  login: string;
};

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const verified = await jwtVerify(token, getSecret());
    return verified.payload as SessionUser;
  } catch (err) {
    return null;
  }
}

export async function setSession(user: SessionUser) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${SESSION_EXP_HOURS}h`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_EXP_HOURS * 3600
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function ensureAdminSeed() {
  const existing = await prisma.user.findFirst({ where: { role: Role.ADMIN } });
  if (existing) return existing;
  const passwordHash = await hashPassword("admin");
  return prisma.user.create({
    data: {
      name: "Admin",
      login: "admin",
      passwordHash,
      role: Role.ADMIN
    }
  });
}
