import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(_request: Request, { params }: { params: { token: string } }) {
  const dataUrl = await QRCode.toDataURL(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/ticket/${params.token}`, {
    margin: 2,
    color: { dark: "#0F172A", light: "#ffffff" }
  });
  const base64 = dataUrl.split(",")[1];
  const buffer = Buffer.from(base64, "base64");
  return new NextResponse(buffer, {
    status: 200,
    headers: { "Content-Type": "image/png" }
  });
}
