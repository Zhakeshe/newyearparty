import { students as seedStudents } from "@/data/students";
import { TicketStatus, TicketStudent } from "./types";

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
