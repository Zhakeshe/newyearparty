import { NextResponse } from "next/server";
import { getStudentByToken, markEntered } from "@/lib/students";

export async function POST(request: Request) {
  const { qrToken } = await request.json();
  const { student, error } = markEntered(qrToken);

  if (error) {
    return NextResponse.json({ status: "invalid", message: error });
  }

  const meta = {
    fullName: student?.fullName,
    className: student?.className,
    ticketNumber: student?.ticketNumber
  };

  return NextResponse.json({ status: "valid", meta });
}
