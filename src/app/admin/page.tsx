"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, LockKeyhole, ShieldCheck } from "lucide-react";
import { getStats } from "@/lib/students";

const initialCurators = [
  { id: "c1", name: "Меруерт", login: "meruert", password: "curator123" },
  { id: "c2", name: "Айбек", login: "aibek", password: "curator456" }
];

export default function AdminPage() {
  const stats = getStats();
  const [curators, setCurators] = useState(initialCurators);
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const totalCurators = useMemo(() => curators.length, [curators]);

  const addCurator = () => {
    if (!name || !login || !password) return;
    setCurators((prev) => [...prev, { id: crypto.randomUUID(), name, login, password }]);
    setName("");
    setLogin("");
    setPassword("");
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
    </main>
  );
}
