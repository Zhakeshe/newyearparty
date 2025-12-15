"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Loader2, LockKeyhole, LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { TicketStatus, type Student, type Ticket, type User } from "@prisma/client";
import { useRouter } from "next/navigation";

import { formatTicketNumber } from "@/lib/students";
import { TicketActions } from "@/components/ticket-actions";

export type StudentWithTicket = Student & { ticket: Ticket | null; curator: { id: string; name: string; login: string } };

type Props = {
  user: { id: string; name: string; login: string; role: string };
  initialStudents: StudentWithTicket[];
  initialCurators: User[];
};

async function fetchJSON(url: string, options?: RequestInit) {
  const res = await fetch(url, { ...options, headers: { "Content-Type": "application/json" } });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Қате");
  }
  return res.json();
}

export default function AdminClient({ user, initialStudents, initialCurators }: Props) {
  const router = useRouter();
  const [students, setStudents] = useState<StudentWithTicket[]>(initialStudents);
  const [curators, setCurators] = useState<User[]>(initialCurators);
  const [fullName, setFullName] = useState("");
  const [className, setClassName] = useState("");
  const [curatorId, setCuratorId] = useState(curators[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<string | null>(null);
  const [editCuratorId, setEditCuratorId] = useState<string | null>(null);
  const [curatorForm, setCuratorForm] = useState({ name: "", login: "", password: "" });

  useEffect(() => setCuratorId(curators[0]?.id ?? ""), [curators]);

  const totals = useMemo(() => {
    return {
      total: students.length,
      entered: students.filter((s) => s.ticket?.status === TicketStatus.ENTERED).length,
      notEntered: students.filter((s) => s.ticket?.status !== TicketStatus.ENTERED).length
    };
  }, [students]);

  const handleLogout = async () => {
    await fetchJSON("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/login");
  };

  const resetForm = () => {
    setFullName("");
    setClassName("");
    setCuratorId(curators[0]?.id ?? "");
    setEditing(null);
  };

  const saveStudent = async () => {
    setLoading(true);
    setError(null);
    try {
      if (editing) {
        const { student } = await fetchJSON(`/api/students/${editing}`, {
          method: "PATCH",
          body: JSON.stringify({ fullName, className, curatorId })
        });
        setStudents((prev) => prev.map((s) => (s.id === student.id ? student : s)));
      } else {
        const { student } = await fetchJSON("/api/students", {
          method: "POST",
          body: JSON.stringify({ fullName, className, curatorId })
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
    setCuratorId(student.curatorId);
  };

  const saveCurator = async () => {
    setLoading(true);
    setError(null);
    try {
      if (editCuratorId) {
        const { curator } = await fetchJSON(`/api/curators/${editCuratorId}`, {
          method: "PATCH",
          body: JSON.stringify(curatorForm)
        });
        setCurators((prev) => prev.map((c) => (c.id === curator.id ? curator : c)));
      } else {
        const { curator } = await fetchJSON("/api/curators", { method: "POST", body: JSON.stringify(curatorForm) });
        setCurators((prev) => [curator as User, ...prev]);
      }
      setCuratorForm({ name: "", login: "", password: "" });
      setEditCuratorId(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const removeCurator = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await fetchJSON(`/api/curators/${id}`, { method: "DELETE" });
      setCurators((prev) => prev.filter((c) => c.id !== id));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-6 py-10 md:px-10 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Серверлік басқару</p>
          <h1 className="text-3xl font-heading font-semibold">Админ панель</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
        >
          <LogOut className="h-4 w-4" /> Шығу
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Барлық билет", value: totals.total },
          { label: "Кірген", value: totals.entered },
          { label: "Кірмеген", value: totals.notEntered }
        ].map((card) => (
          <div key={card.label} className="glass-panel rounded-2xl p-4 border border-white/10">
            <p className="text-sm text-slate-400">{card.label}</p>
            <p className="text-2xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Оқушы қосу/өзгерту</h2>
          {error && <p className="text-sm text-error">{error}</p>}
        </div>
        <div className="grid gap-3 md:grid-cols-4">
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
          <select className="input" value={curatorId} onChange={(e) => setCuratorId(e.target.value)}>
            {curators.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.login})
              </option>
            ))}
          </select>
          <button
            onClick={saveStudent}
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} {editing ? "Сақтау" : "Қосу"}
          </button>
        </div>
      </div>

      <div className="glass-panel border border-white/10 rounded-2xl p-6 space-y-3 overflow-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Студенттер</h2>
          <a href="/admin/scanner" className="text-sm inline-flex items-center gap-2 text-primary hover:text-white">
            QR сканерге өту <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="min-w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr className="border-b border-white/10">
                <th className="py-2">Ticket №</th>
                <th>ФИО</th>
                <th>Сынып</th>
                <th>Куратор</th>
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
                  <td>{s.curator?.name}</td>
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

      <div className="glass-panel border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <LockKeyhole className="h-4 w-4 text-primary" />
          <h2 className="text-xl font-semibold">Куратор аккаунттары</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="input"
            placeholder="Аты"
            value={curatorForm.name}
            onChange={(e) => setCuratorForm((p) => ({ ...p, name: e.target.value }))}
          />
          <input
            className="input"
            placeholder="Логин"
            value={curatorForm.login}
            onChange={(e) => setCuratorForm((p) => ({ ...p, login: e.target.value }))}
          />
          <input
            className="input"
            placeholder="Құпиясөз"
            type="password"
            value={curatorForm.password}
            onChange={(e) => setCuratorForm((p) => ({ ...p, password: e.target.value }))}
          />
        </div>
        <div className="flex gap-3">
          <button onClick={saveCurator} disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} {editCuratorId ? "Сақтау" : "Қосу"}
          </button>
          {editCuratorId && (
            <button onClick={() => setEditCuratorId(null)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              Бас тарту
            </button>
          )}
        </div>

        <div className="space-y-2">
          {curators.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-slate-400">{c.login}</p>
              </div>
              <div className="flex gap-2">
                <button className="icon-btn" onClick={() => (setEditCuratorId(c.id), setCuratorForm({ name: c.name, login: c.login, password: "" }))}>
                  <Pencil className="h-4 w-4" />
                </button>
                <button className="icon-btn" onClick={() => removeCurator(c.id)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
