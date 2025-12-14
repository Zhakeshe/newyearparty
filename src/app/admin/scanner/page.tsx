import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import ScannerClient from "@/app/scanner/scanner-client";

export default async function AdminScannerPage() {
  const user = await getSession();
  if (!user || user.role !== Role.ADMIN) redirect("/login?next=/admin/scanner");
  return <ScannerClient />;
}
