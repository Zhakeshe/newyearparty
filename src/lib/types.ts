export enum TicketStatus {
  NOT_ENTERED = "NOT_ENTERED",
  ENTERED = "ENTERED"
}

export type TicketStudent = {
  id: string;
  fullName: string;
  className: string;
  ticketNumber: number;
  qrToken: string;
  status: TicketStatus;
  curator: string;
  enteredAt?: string;
};

export type SharedStudentPayload = {
  fullName: string;
  className: string;
  ticketNumber: number;
  qrToken: string;
  curator: string;
  status?: TicketStatus;
  enteredAt?: string;
};
