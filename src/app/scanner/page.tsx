import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ScannerClient from "./scanner-client";

export default async function ScannerPage() {
  const user = await getSession();
  if (!user) redirect("/login?next=/scanner");
  return <ScannerClient />;
}
