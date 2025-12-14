import { students as seedStudents } from "@/data/students";
import { SharedStudentPayload, TicketStatus, TicketStudent } from "./types";

export function formatTicketNumber(value: number) {
  return `№${value.toString().padStart(3, "0")}`;
}

export function generateQrToken(fullName: string, ticketNumber: number) {
  const normalized = fullName
    .trim()
    .toUpperCase()
    .replace(/[^A-ZА-Я0-9]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `JOO-${formatTicketNumber(ticketNumber).replace("№", "")}-${normalized || ticketNumber}`.toUpperCase();
}

function base64Encode(value: string) {
  if (typeof window === "undefined") {
    // Node fallback for build time
    return Buffer.from(value, "utf-8").toString("base64");
  }
  return window.btoa(encodeURIComponent(value));
}

function base64Decode(value: string) {
  try {
    if (typeof window === "undefined") {
      return Buffer.from(value, "base64").toString("utf-8");
    }
    return decodeURIComponent(window.atob(value));
  } catch (e) {
    console.error("Failed to decode payload", e);
    return null;
  }
}

export function encodeStudentPayload(student: TicketStudent): string {
  const payload: SharedStudentPayload = {
    fullName: student.fullName,
    className: student.className,
    curator: student.curator,
    ticketNumber: student.ticketNumber,
    qrToken: student.qrToken,
    status: student.status,
    enteredAt: student.enteredAt
  };
  return base64Encode(JSON.stringify(payload));
}

export function decodeStudentPayload(value?: string | null): SharedStudentPayload | null {
  if (!value) return null;
  const decoded = base64Decode(value);
  if (!decoded) return null;
  try {
    return JSON.parse(decoded) as SharedStudentPayload;
  } catch (e) {
    console.error("Invalid payload json", e);
    return null;
  }
}

export function buildTicketLink(student: TicketStudent, origin?: string) {
  const base = origin || (typeof window !== "undefined" ? window.location.origin : "");
  const payload = encodeStudentPayload(student);
  const url = new URL(`/ticket/${student.qrToken}`, base || "http://localhost");
  url.searchParams.set("data", payload);
  return url.toString();
}

const apiStudents: TicketStudent[] = structuredClone(seedStudents);

export function getStudentByToken(token: string): TicketStudent | undefined {
  return apiStudents.find((s) => s.qrToken.toLowerCase() === token.toLowerCase());
}

export function markEntered(token: string): { student?: TicketStudent; error?: string } {
  const student = getStudentByToken(token);
  if (!student) {
    return { error: "Билет табылмады" };
  }
  if (student.status === TicketStatus.ENTERED) {
    return { error: "Билет бұрын қолданылған" };
  }
  student.status = TicketStatus.ENTERED;
  student.enteredAt = new Date().toISOString();
  return { student };
}
