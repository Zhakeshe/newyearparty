import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminClient from "./sections/admin-client";
import { Role } from "@prisma/client";

export default async function AdminPage() {
  const user = await getSession();
  if (!user || user.role !== Role.ADMIN) {
    redirect("/login?next=/admin");
  }

  const [students, curators] = await Promise.all([
    prisma.student.findMany({
      include: { ticket: true, curator: { select: { name: true, login: true, id: true } } },
      orderBy: { createdAt: "desc" }
    }),
    prisma.user.findMany({ where: { role: Role.CURATOR }, orderBy: { createdAt: "desc" } })
  ]);

  return <AdminClient user={user} initialStudents={students} initialCurators={curators} />;
}
