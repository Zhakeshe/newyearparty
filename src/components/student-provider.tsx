"use client";

import React, { useEffect, useMemo, useState } from "react";
import { students as seedStudents } from "@/data/students";
import { formatTicketNumber, generateQrToken } from "@/lib/students";
import { TicketStatus, TicketStudent } from "@/lib/types";

type AddInput = { fullName: string; className: string; curator: string };
type UpdateInput = Partial<Pick<TicketStudent, "fullName" | "className" | "curator" | "status">>;

type StudentStore = {
  students: TicketStudent[];
  stats: { total: number; entered: number; notEntered: number };
  addStudent: (input: AddInput) => TicketStudent | null;
  updateStudent: (id: string, updates: UpdateInput) => void;
  deleteStudent: (id: string) => void;
  markEntered: (token: string) => { student?: TicketStudent; error?: string };
};

function loadFromStorage(): TicketStudent[] | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("student-store");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse student store", e);
    return null;
  }
}

function saveToStorage(data: TicketStudent[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("student-store", JSON.stringify(data));
}

const StudentStoreContext = (typeof React !== "undefined"
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (React as any).createContext<StudentStore | null>(null)
  : null);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<TicketStudent[]>(() => loadFromStorage() ?? structuredClone(seedStudents));

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) setStudents(stored);
  }, []);

  useEffect(() => {
    saveToStorage(students);
  }, [students]);

  const stats = useMemo(() => {
    const total = students.length;
    const entered = students.filter((s) => s.status === TicketStatus.ENTERED).length;
    return { total, entered, notEntered: total - entered };
  }, [students]);

  const addStudent = (input: AddInput) => {
    const { fullName, className, curator } = input;
    if (!fullName || !className || !curator) return null;

    const nextNumber = (students.reduce((max, s) => Math.max(max, s.ticketNumber), 0) ?? 0) + 1;
    const qrToken = generateQrToken(fullName, nextNumber);
    const newStudent: TicketStudent = {
      id: crypto.randomUUID(),
      fullName,
      className,
      curator,
      ticketNumber: nextNumber,
      qrToken,
      status: TicketStatus.NOT_ENTERED
    };
    setStudents((prev) => [...prev, newStudent]);
    return newStudent;
  };

  const updateStudent = (id: string, updates: UpdateInput) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const markEntered = (token: string) => {
    let updated: TicketStudent | undefined;
    let error: string | undefined;
    setStudents((prev) => {
      const idx = prev.findIndex((s) => s.qrToken.toLowerCase() === token.toLowerCase());
      if (idx === -1) {
        error = "Билет табылмады";
        return prev;
      }
      if (prev[idx].status === TicketStatus.ENTERED) {
        error = "Билет бұрын қолданылған";
        return prev;
      }
      const next = [...prev];
      updated = { ...prev[idx], status: TicketStatus.ENTERED, enteredAt: new Date().toISOString() };
      next[idx] = updated;
      return next;
    });
    return { student: updated, error };
  };

  const value: StudentStore = {
    students,
    stats,
    addStudent,
    updateStudent,
    deleteStudent,
    markEntered
  };

  if (!StudentStoreContext) return <>{children}</>;

  return <StudentStoreContext.Provider value={value}>{children}</StudentStoreContext.Provider>;
}

export function useStudentStore() {
  if (!StudentStoreContext) throw new Error("StudentStoreContext missing");
  const ctx = (React as any).useContext(StudentStoreContext) as StudentStore | null;
  if (!ctx) throw new Error("StudentStore not available");
  return ctx;
}

export function statusBadge(status: TicketStatus) {
  return status === TicketStatus.ENTERED ? "Кірді" : "Кірмеген";
}

export { formatTicketNumber };
