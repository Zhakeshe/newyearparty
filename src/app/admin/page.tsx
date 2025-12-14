"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, LockKeyhole, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { useStudentStore } from "@/components/student-provider";
import { formatTicketNumber } from "@/lib/students";
import { TicketStatus } from "@/lib/types";

const initialCurators = [
  { id: "c1", name: "Меруерт", login: "meruert", password: "curator123" },
  { id: "c2", name: "Айбек", login: "aibek", password: "curator456" }
];

export default function AdminPage() {
  const { students, stats, addStudent, updateStudent, deleteStudent } = useStudentStore();
  const [curators, setCurators] = useState(initialCurators);
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [formName, setFormName] = useState("");
  const [formClass, setFormClass] = useState("");
  const [formCurator, setFormCurator] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const totalCurators = useMemo(() => curators.length, [curators]);

  const addCurator = () => {
    if (!name || !login || !password) return;
    setCurators((prev) => [...prev, { id: crypto.randomUUID(), name, login, password }]);
    setName("");
    setLogin("");
    setPassword("");
  };

  const submitStudent = () => {
    if (editingId) {
      updateStudent(editingId, { fullName: formName, className: formClass, curator: formCurator });
      setEditingId(null);
    } else {
      const created = addStudent({ fullName: formName, className: formClass, curator: formCurator });
      if (!created) return;
    }
    setFormName("");
    setFormClass("");
    setFormCurator("");
  };

  const startEdit = (id: string) => {
    const student = students.find((s) => s.id === id);
    if (!student) return;
    setEditingId(id);
    setFormName(student.fullName);
    setFormClass(student.className);
    setFormCurator(student.curator);
  };

  return (
    <main className="px-6 py-10 md:px-10 space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Admin panel</p>
          <h1 className="text-3xl font-heading font-semibold">Куратор аккаунттарын басқару</h1>
          <p className="text-slate-400 text-sm">Логин/пароль беріп, сканер мен студенттерді бақылаңыз</p>
        </div>
      </header>

      <section className="grid grid-auto-fit gap-4">
        {[{
          title: "Барлық билет", value: stats.total, icon: ShieldCheck
        },
        { title: "Кіргендер", value: stats.entered, icon: BadgeCheck },
        { title: "Кірмеген", value: stats.notEntered, icon: LockKeyhole },
        { title: "Кураторлар", value: totalCurators, icon: ArrowRight }].map((card) => (
          <div key={card.title} className="glass-panel rounded-2xl p-4 border border-white/10 flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/30 flex items-center justify-center">
              <card.icon />
            </div>
            <div>
              <p className="text-sm text-slate-400">{card.title}</p>
              <p className="text-2xl font-heading font-semibold">{card.value}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="glass-panel rounded-3xl p-6 border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Жаңа куратор</p>
            <h2 className="text-xl font-heading font-semibold">Логин + пароль жасау</h2>
          </div>
          <span className="badge bg-primary/20 text-primary border border-primary/30">Тек демо UI</span>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
            placeholder="Куратор аты"
          />
          <input
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
            placeholder="Логин"
          />
          <div className="flex gap-2">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 w-full"
              placeholder="Құпиясөз"
              type="text"
            />
            <button
              onClick={addCurator}
              className="rounded-xl bg-primary text-white px-4 py-3 font-semibold hover:shadow-glow"
            >
              Қосу
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-white/5 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Аты</th>
                <th className="px-4 py-3">Логин</th>
                <th className="px-4 py-3">Пароль</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {curators.map((curator) => (
                <tr key={curator.id} className="hover:bg-white/5 transition">
                  <td className="px-4 py-3 font-semibold">{curator.name}</td>
                  <td className="px-4 py-3 font-mono text-primary">{curator.login}</td>
                  <td className="px-4 py-3 font-mono text-slate-200">{curator.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-6 border border-white/10 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm text-slate-400">Оқушы тізімі</p>
            <h2 className="text-xl font-heading font-semibold">Қосу / өзгерту / өшіру</h2>
          </div>
          <span className="badge bg-success/20 text-success border border-success/30">Live demo — state сақталады</span>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
            placeholder="ФИО"
          />
          <input
            value={formClass}
            onChange={(e) => setFormClass(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
            placeholder="Сынып (мыс: 11A)"
          />
          <div className="flex gap-2">
            <input
              value={formCurator}
              onChange={(e) => setFormCurator(e.target.value)}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 w-full"
              placeholder="Куратор аты"
            />
            <button
              onClick={submitStudent}
              className="rounded-xl bg-primary text-white px-4 py-3 font-semibold hover:shadow-glow"
            >
              {editingId ? "Сақтау" : "Қосу"}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-white/5 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Ticket №</th>
                <th className="px-4 py-3">ФИО</th>
                <th className="px-4 py-3">Сынып</th>
                <th className="px-4 py-3">Куратор</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3 text-right">Әрекет</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-white/5 transition">
                  <td className="px-4 py-3 font-mono text-primary">{formatTicketNumber(student.ticketNumber)}</td>
                  <td className="px-4 py-3 font-semibold">{student.fullName}</td>
                  <td className="px-4 py-3 text-sm">{student.className}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{student.curator}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        student.status === TicketStatus.ENTERED
                          ? "bg-success/20 text-success border border-success/30"
                          : "bg-error/20 text-error border border-error/30"
                      }`}
                    >
                      {student.status === TicketStatus.ENTERED ? "Кірген" : "Кірмеген"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                        onClick={() => startEdit(student.id)}
                        title="Өңдеу"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                        onClick={() => deleteStudent(student.id)}
                        title="Өшіру"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
