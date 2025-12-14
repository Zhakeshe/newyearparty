import { ArrowRight, Gauge, KeyRound, LayoutDashboard, QrCode, Ticket } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getStats, listEntered } from "@/lib/students";
import { StudentTable } from "@/components/StudentTable";

export default function Home() {
  const stats = getStats();
  const students = listEntered();

  return (
    <main className="px-6 py-10 md:px-10 space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">JOO High School</p>
          <h1 className="text-4xl font-bold font-heading">New Year Party 2026</h1>
          <p className="text-slate-300">Premium dark-mode админ панель</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/scanner"
            className="inline-flex items-center gap-2 rounded-full bg-success/20 text-success px-4 py-2 border border-success/30 hover:shadow-glow"
          >
            <QrCode size={18} />
            QR Check-in
          </Link>
          <Link
            href="/ticket/JOO-001-AYDANA"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-4 py-2 border border-white/10 hover:shadow-glow"
          >
            <Ticket size={18} />
            Preview ticket
          </Link>
        </div>
      </header>

      <section className="grid grid-auto-fit gap-4">
        {[{
          title: "Барлық билет", value: stats.total, icon: Gauge, tone: "from-primary/60" },
        { title: "Кіргендер", value: stats.entered, icon: ArrowRight, tone: "from-success/60" },
        { title: "Кірмеген", value: stats.notEntered, icon: Ticket, tone: "from-error/60" }].map((card) => (
          <motion.div
            key={card.title}
            className="glass-panel rounded-2xl p-4 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{card.title}</p>
                <div className="text-3xl font-heading font-semibold">{card.value}</div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/40 to-white/10 flex items-center justify-center">
                <card.icon />
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Live check-in</p>
            <h2 className="text-2xl font-heading font-semibold">Кіргендер тізімі</h2>
          </div>
          <div className="flex gap-2 text-sm text-slate-400">
            <span className="badge bg-success/10 text-success border border-success/20">
              Барлығы кіргендер: {stats.entered}
            </span>
          </div>
        </div>
        <StudentTable students={students} />
        <div className="text-sm text-slate-400 flex items-center gap-2">
          <ArrowRight size={14} /> Қалған оқушылар админ/куратор панельде басқарылады
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-6 border border-white/10 grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-xl font-heading">Негізгі талаптар</h3>
          <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <li>Premium dark-mode UI, glassmorphism cardтар</li>
            <li>QR билеттерді Telegram / WhatsApp арқылы бөлісу</li>
            <li>Role-based ролдер: Admin, Curator, Scanner</li>
            <li>Бір QR → 1 рет қана check-in</li>
          </ul>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
          <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Live Preview</div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/30 flex items-center justify-center">
              <QrCode />
            </div>
            <div>
              <p className="font-semibold">QR Check-in ready</p>
              <p className="text-slate-400 text-sm">Scanner экран 2–3 құрылғыда қатар</p>
            </div>
          </div>
          <div className="bg-black/30 rounded-xl p-4 text-sm text-slate-300">
            <p>Demo link:</p>
            <p className="font-mono text-primary">/ticket/JOO-001-AYDANA</p>
            <p className="font-mono text-primary">/scanner</p>
            <p className="font-mono text-primary">/admin</p>
            <p className="font-mono text-primary">/curator</p>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <Link
          href="/admin"
          className="glass-panel rounded-2xl p-6 border border-white/10 flex items-center gap-3 hover:shadow-glow"
        >
          <div className="h-12 w-12 rounded-xl bg-primary/30 flex items-center justify-center">
            <LayoutDashboard />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Админ панель</p>
            <p className="font-semibold">Куратор аккаунттарын ашу және жалпы статистика</p>
          </div>
        </Link>
        <Link
          href="/curator"
          className="glass-panel rounded-2xl p-6 border border-white/10 flex items-center gap-3 hover:shadow-glow"
        >
          <div className="h-12 w-12 rounded-xl bg-success/30 flex items-center justify-center">
            <KeyRound />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Куратор панель</p>
            <p className="font-semibold">Өз оқушыларын көру, билетпен бөлісу</p>
          </div>
        </Link>
      </section>
    </main>
  );
}
