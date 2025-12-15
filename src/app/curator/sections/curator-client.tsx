"use client";

import { useState } from "react";
import { Loader2, LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { TicketStatus, type Student, type Ticket } from "@prisma/client";
import { useRouter } from "next/navigation";
import { formatTicketNumber } from "@/lib/students";
import { TicketActions } from "@/components/ticket-actions";

export type StudentWithTicket = Student & { ticket: Ticket | null; curator: { id: string; name: string; login: string } };

type Props = {
  user: { id: string; name: string; login: string; role: string };
  initialStudents: StudentWithTicket[];
};

async function fetchJSON(url: string, options?: RequestInit) {
  const res = await fetch(url, { ...options, headers: { "Content-Type": "application/json" } });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Қате");
  }
  return res.json();
}

export default function CuratorClient({ user, initialStudents }: Props) {
  const router = useRouter();
  const [students, setStudents] = useState<StudentWithTicket[]>(initialStudents);
  const [fullName, setFullName] = useState("");
  const [className, setClassName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    await fetchJSON("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/login");
  };

  const resetForm = () => {
    setFullName("");
    setClassName("");
    setEditing(null);
  };

  const saveStudent = async () => {
    setLoading(true);
    setError(null);
    try {
      if (editing) {
        const { student } = await fetchJSON(`/api/students/${editing}`, {
          method: "PATCH",
          body: JSON.stringify({ fullName, className })
        });
        setStudents((prev) => prev.map((s) => (s.id === student.id ? student : s)));
      } else {
        const { student } = await fetchJSON("/api/students", {
          method: "POST",
          body: JSON.stringify({ fullName, className })
        });
        setStudents((prev) => [student, ...prev]);
      }
      resetForm();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const removeStudent = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await fetchJSON(`/api/students/${id}`, { method: "DELETE" });
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (student: StudentWithTicket) => {
    setEditing(student.id);
    setFullName(student.fullName);
    setClassName(student.className);
  };

  return (
    <main className="px-6 py-10 md:px-10 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Куратор</p>
          <h1 className="text-3xl font-heading font-semibold">{user.name}</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
        >
          <LogOut className="h-4 w-4" /> Шығу
        </button>
      </div>

      <div className="glass-panel border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Оқушы қосу/өзгерту</h2>
          {error && <p className="text-sm text-error">{error}</p>}
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="input"
            placeholder="ФИО"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Сынып"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
          <button onClick={saveStudent} disabled={loading} className="btn-primary flex items-center justify-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} {editing ? "Сақтау" : "Қосу"}
          </button>
        </div>
      </div>

      <div className="glass-panel border border-white/10 rounded-2xl p-6 space-y-3 overflow-auto">
        <h2 className="text-xl font-semibold">Менің оқушыларым</h2>
        <div className="min-w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr className="border-b border-white/10">
                <th className="py-2">Ticket №</th>
                <th>ФИО</th>
                <th>Сынып</th>
                <th>Статус</th>
                <th className="text-right">Әрекет</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="py-3 font-mono">{s.ticket ? formatTicketNumber(s.ticket.ticketNumber) : "-"}</td>
                  <td>{s.fullName}</td>
                  <td>{s.className}</td>
                  <td>
                    <span
                      className={`badge ${s.ticket?.status === TicketStatus.ENTERED ? "bg-success/20 text-success" : "bg-white/10"}`}
                    >
                      {s.ticket?.status === TicketStatus.ENTERED ? "Кірген" : "Кірмеген"}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button className="icon-btn" onClick={() => startEdit(s)}>
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="icon-btn" onClick={() => removeStudent(s.id)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {s.ticket && (
                        <TicketActions
                          compact
                          linkUrl={`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/ticket/${s.ticket.qrToken}`}
                          qrDataUrl={`/api/qr/${s.ticket.qrToken}`}
                          ticketNumber={formatTicketNumber(s.ticket.ticketNumber)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
