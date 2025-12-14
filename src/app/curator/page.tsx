import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import CuratorClient from "./sections/curator-client";
import { Role } from "@prisma/client";

export default async function CuratorPage() {
  const user = await getSession();
  if (!user || user.role !== Role.CURATOR) {
    redirect("/login?next=/curator");
  }

  const students = await prisma.student.findMany({
    where: { curatorId: user.id },
    include: { ticket: true, curator: { select: { name: true, login: true, id: true } } },
    orderBy: { createdAt: "desc" }
  });

  return <CuratorClient user={user} initialStudents={students} />;
}
