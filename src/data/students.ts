import { TicketStatus } from "@/lib/types";

export type StudentRecord = {
  id: string;
  fullName: string;
  className: string;
  ticketNumber: number;
  qrToken: string;
  status: TicketStatus;
  curator: string;
  enteredAt?: string;
};

export const students: StudentRecord[] = [
  {
    id: "1",
    fullName: "Айдана Жұмабек",
    className: "11A",
    ticketNumber: 1,
    qrToken: "JOO-001-AYDANA",
    status: TicketStatus.ENTERED,
    curator: "Меруерт",
    enteredAt: new Date().toISOString()
  },
  {
    id: "2",
    fullName: "Темірлан Ораз",
    className: "10B",
    ticketNumber: 2,
    qrToken: "JOO-002-TEMIR",
    status: TicketStatus.NOT_ENTERED,
    curator: "Айбек"
  },
  {
    id: "3",
    fullName: "Дариға Сейт",
    className: "11B",
    ticketNumber: 3,
    qrToken: "JOO-003-DARIGA",
    status: TicketStatus.NOT_ENTERED,
    curator: "Меруерт"
  }
];
