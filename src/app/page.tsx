import Link from "next/link";
import { ArrowRight, KeyRound, LayoutDashboard } from "lucide-react";

export default function Home() {
  return (
    <main className="px-6 py-16 md:px-10 space-y-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">JOO High School</p>
          <h1 className="text-4xl font-bold font-heading">New Year Party 2026</h1>
          <p className="text-slate-300">Premium электрон билет + QR арқылы кіру</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/login?next=/admin"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-4 py-2 border border-white/10 hover:shadow-glow"
          >
            <LayoutDashboard size={18} />
            Admin login
          </Link>
          <Link
            href="/login?next=/curator"
            className="inline-flex items-center gap-2 rounded-full bg-success/20 text-success px-4 py-2 border border-success/30 hover:shadow-glow"
          >
            <KeyRound size={18} />
            Curator login
          </Link>
        </div>
      </header>

      <section className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Кіру процесі</p>
            <h2 className="text-2xl font-heading font-semibold">QR тексеру админ/сканер беттерінде</h2>
          </div>
          <Link href="/admin/scanner" className="text-sm inline-flex items-center gap-2 text-primary hover:text-white">
            Admin scanner <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="text-slate-300 text-sm">
          Негізгі тексеру жолдары тек /admin/scanner және /scanner беттерінде. Тикет бетінде немесе басты бетте сканер жоқ, тек билетті көрсетуге арналған.
        </p>
      </section>

      <section className="glass-panel rounded-3xl p-6 border border-white/10 grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-xl font-heading">Рөлдер</h3>
          <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <li>Admin: куратор логиндері, студент CRUD, QR check-in</li>
            <li>Curator: тек өз оқушыларын қосу/өңдеу/өшіру</li>
            <li>Scanner: тек /scanner бетімен QR тексеру</li>
          </ul>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
          <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Бекітілген дереккөз</div>
          <p className="text-slate-200 text-sm">Барлық оқушылар мен кураторлар PostgreSQL + Prisma арқылы серверде сақталады. Дерек localStorage-та емес.</p>
          <p className="text-slate-200 text-sm">Қауіпсіздік үшін JWT httpOnly cookie, парольдер bcrypt арқылы хэштелген.</p>
        </div>
      </section>
    </main>
  );
}
