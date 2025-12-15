"use client";

import { useMemo, useState } from "react";
import { Copy, Share2 } from "lucide-react";
import { formatTicketNumber } from "@/lib/students";
import { TicketStatus, TicketStudent } from "@/lib/types";

type Props = {
  students: TicketStudent[];
};

const badgeStyles: Record<TicketStatus, string> = {
  [TicketStatus.ENTERED]: "bg-success/20 text-success border border-success/30",
  [TicketStatus.NOT_ENTERED]: "bg-error/20 text-error border border-error/30"
};

export function StudentTable({ students }: Props) {
  const [classFilter, setClassFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");

  const filtered = useMemo(() => {
    return students.filter((student) => {
      const classMatch = classFilter === "all" || student.className === classFilter;
      const statusMatch = statusFilter === "all" || student.status === statusFilter;
      return classMatch && statusMatch;
    });
  }, [classFilter, statusFilter, students]);

  const classes = Array.from(new Set(students.map((s) => s.className))).sort();

  const buildShareLink = (student: TicketStudent) => {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    return `${base}/ticket/${student.qrToken}`;
  };

  const copyLink = async (student: TicketStudent) => {
    const url = buildShareLink(student);
    await navigator.clipboard.writeText(url);
  };

  const shareQr = async (student: TicketStudent) => {
    const url = buildShareLink(student);
    if (navigator.share) {
      await navigator.share({ title: "JOO HIGH SCHOOL Ticket", url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
        <div className="flex gap-3">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="bg-surface/60 border border-white/10 rounded-lg px-3 py-2"
          >
            <option value="all">Барлық сыныптар</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TicketStatus | "all")}
            className="bg-surface/60 border border-white/10 rounded-lg px-3 py-2"
          >
            <option value="all">Барлық статус</option>
            <option value={TicketStatus.ENTERED}>Кірген</option>
            <option value={TicketStatus.NOT_ENTERED}>Кірмеген</option>
          </select>
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
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((student) => (
              <tr key={student.id} className="hover:bg-white/5 transition">
                <td className="px-4 py-3 font-mono text-primary">{formatTicketNumber(student.ticketNumber)}</td>
                <td className="px-4 py-3 font-semibold">{student.fullName}</td>
                <td className="px-4 py-3">
                  <span className="badge bg-white/10 text-sm">{student.className}</span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-300">{student.curator}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${badgeStyles[student.status]}`}>
                    {student.status === TicketStatus.ENTERED ? "Кірді" : "Кірмеген"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2 text-sm">
                    <button
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                      onClick={() => copyLink(student)}
                      title="Copy link"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                      onClick={() => shareQr(student)}
                      title="Share QR"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
