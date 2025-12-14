"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, CheckCircle2, LockKeyhole, LogOut, Pencil, ShieldCheck, Trash2, Video, VideoOff, XCircle } from "lucide-react";
import { useStudentStore } from "@/components/student-provider";
import { formatTicketNumber } from "@/lib/students";
import { TicketStatus } from "@/lib/types";
import { useAuth } from "@/components/auth-provider";
import { QRCamera } from "@/components/qr-camera";

type ScanResult = { status: "idle" | "valid" | "invalid"; message?: string; meta?: any };

export default function AdminPage() {
  const { students, stats, addStudent, updateStudent, deleteStudent, markEntered } = useStudentStore();
  const { user, loginAdmin, logout, curators, addCurator, updateCurator, deleteCurator } = useAuth();
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [authLogin, setAuthLogin] = useState("admin");
  const [authPassword, setAuthPassword] = useState("admin");
  const [authError, setAuthError] = useState<string | null>(null);
  const [curatorEditId, setCuratorEditId] = useState<string | null>(null);
  const [curatorEditLogin, setCuratorEditLogin] = useState("");
  const [curatorEditPassword, setCuratorEditPassword] = useState("");
  const [formName, setFormName] = useState("");
  const [formClass, setFormClass] = useState("");
  const [formCurator, setFormCurator] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [result, setResult] = useState<ScanResult>({ status: "idle" });

  const totalCurators = useMemo(() => curators.length, [curators]);

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

  const startCuratorEdit = (id: string) => {
    const curator = curators.find((c) => c.id === id);
    if (!curator) return;
    setCuratorEditId(id);
    setCuratorEditLogin(curator.login);
    setCuratorEditPassword(curator.password);
  };

  const saveCuratorEdit = () => {
    if (!curatorEditId) return;
    updateCurator(curatorEditId, { login: curatorEditLogin, password: curatorEditPassword });
    setCuratorEditId(null);
    setCuratorEditLogin("");
    setCuratorEditPassword("");
  };

  const handleLogin = () => {
    const ok = loginAdmin(authLogin, authPassword);
    setAuthError(ok ? null : "Логин немесе пароль қате");
  };

  const submitCheck = useCallback(
    (value?: string) => {
      const qrToken = value ?? token;
      if (!qrToken) return;
      const response = markEntered(qrToken);
      if (response.error) {
        setResult({ status: "invalid", message: response.error });
      } else if (response.student) {
        setResult({ status: "valid", meta: response.student });
      }
    },
    [markEntered, token]
  );

  const handleDetected = useCallback(
    (value: string) => {
      setToken(value);
      submitCheck(value);
    },
    [submitCheck]
  );

  const flash = result.status === "valid" ? "ring-4 ring-success/40" : result.status === "invalid" ? "ring-4 ring-error/40" : "";

  if (!user || user.role !== "ADMIN") {
    return (
      <main className="px-6 py-16 md:px-10 flex justify-center">
        <div className="glass-panel rounded-3xl p-8 max-w-md w-full space-y-4 border border-white/10">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Admin login</p>
          <h1 className="text-3xl font-heading font-semibold">Админге кіру</h1>
          <div className="space-y-3">
            <input
              value={authLogin}
              onChange={(e) => setAuthLogin(e.target.value)}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 w-full"
              placeholder="Логин"
            />
            <input
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 w-full"
              placeholder="Пароль"
              type="password"
            />
            <button
              onClick={handleLogin}
              className="w-full rounded-xl bg-primary text-white px-4 py-3 font-semibold hover:shadow-glow"
            >
              Кіру
            </button>
            {authError && <p className="text-error text-sm text-center">{authError}</p>}
            <p className="text-xs text-center text-slate-400">Логин: admin / Пароль: admin</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-10 md:px-10 space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Admin panel</p>
          <h1 className="text-3xl font-heading font-semibold">Куратор аккаунттарын басқару</h1>
          <p className="text-slate-400 text-sm">Логин/пароль беріп, сканер мен студенттерді бақылаңыз</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <span className="badge bg-primary/20 text-primary border border-primary/30">{user.name}</span>
          <button onClick={logout} className="inline-flex items-center gap-2 hover:text-white">
            <LogOut size={16} /> Шығу
          </button>
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

      <section className={`glass-panel rounded-3xl p-6 border border-white/10 space-y-6 ${flash}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-400">QR тексеру</p>
            <h2 className="text-xl font-heading font-semibold">Сканер (камера + қолмен)</h2>
          </div>
          <button
            onClick={() => setCameraEnabled((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm hover:shadow-glow"
          >
            {cameraEnabled ? <VideoOff size={16} /> : <Video size={16} />}
            {cameraEnabled ? "Камераны өшіру" : "Камерамен скан"}
          </button>
        </div>

        {cameraEnabled && <QRCamera active={cameraEnabled} onDetected={handleDetected} />}

        <div className="grid md:grid-cols-[2fr,1fr] gap-6 text-left">
          <div className="space-y-3">
            <label className="text-sm text-slate-400">QR token қолмен енгізу</label>
            <div className="flex gap-2">
              <input
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="QR token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <button
                onClick={() => submitCheck()}
                className="rounded-xl bg-primary text-white px-4 py-3 font-semibold hover:shadow-glow"
              >
                Тексеру
              </button>
            </div>
            <p className="text-xs text-slate-500">QR кодты камерамен сканерлеңіз немесе токенді жазыңыз</p>
          </div>

          {result.status !== "idle" && (
            <div className="glass-panel rounded-2xl p-4 space-y-2 text-center">
              {result.status === "valid" ? (
                <div className="flex flex-col items-center gap-2 text-success">
                  <CheckCircle2 size={32} />
                  <p className="text-lg font-heading">ACCESS GRANTED</p>
                  <p className="text-slate-200">{result.meta.fullName}</p>
                  <p className="text-slate-400 text-sm">{result.meta.className}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-error">
                  <XCircle size={32} />
                  <p className="text-lg font-heading">INVALID / ALREADY USED</p>
                  <p className="text-slate-300 text-sm">{result.message}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-6 border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Жаңа куратор</p>
            <h2 className="text-xl font-heading font-semibold">Логин + пароль жасау</h2>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="badge bg-primary/20 text-primary border border-primary/30">Admin: {user.name}</span>
            <span className="text-slate-400">Логин: admin / Пароль: admin</span>
          </div>
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
              onClick={() => {
                addCurator({ name, login, password });
                setName("");
                setLogin("");
                setPassword("");
              }}
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
                <th className="px-4 py-3 text-right">Әрекет</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {curators.map((curator) => (
                <tr key={curator.id} className="hover:bg-white/5 transition">
                  <td className="px-4 py-3 font-semibold">{curator.name}</td>
                  <td className="px-4 py-3 font-mono text-primary">
                    {curatorEditId === curator.id ? (
                      <input
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 w-full"
                        value={curatorEditLogin}
                        onChange={(e) => setCuratorEditLogin(e.target.value)}
                      />
                    ) : (
                      curator.login
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-200">
                    {curatorEditId === curator.id ? (
                      <input
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 w-full"
                        value={curatorEditPassword}
                        onChange={(e) => setCuratorEditPassword(e.target.value)}
                        type="text"
                      />
                    ) : (
                      curator.password
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {curatorEditId === curator.id ? (
                        <button
                          className="p-2 rounded-lg bg-success/20 text-success border border-success/30"
                          onClick={saveCuratorEdit}
                        >
                          Сақтау
                        </button>
                      ) : (
                        <button
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                          onClick={() => startCuratorEdit(curator.id)}
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                      <button
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                        onClick={() => deleteCurator(curator.id)}
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

      <section className="glass-panel rounded-3xl p-6 border border-white/10 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm text-slate-400">Оқушы тізімі</p>
            <h2 className="text-xl font-heading font-semibold">Қосу / өзгерту / өшіру</h2>
          </div>
          <span className="badge bg-success/20 text-success border border-success/30">Сақтаулар жергілікті құрылғыда</span>
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
