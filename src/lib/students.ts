import { students } from "@/data/students";
import { TicketStatus, TicketStudent } from "./types";

export function getStats() {
  const total = students.length;
  const entered = students.filter((s) => s.status === TicketStatus.ENTERED).length;
  const notEntered = total - entered;
  return { total, entered, notEntered };
}

export function getStudentByToken(token: string): TicketStudent | undefined {
  return students.find((s) => s.qrToken.toLowerCase() === token.toLowerCase());
}

export function listStudents(): TicketStudent[] {
  return students;
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

export function formatTicketNumber(value: number) {
  return `№${value.toString().padStart(3, "0")}`;
}
