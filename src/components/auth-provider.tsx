"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { safeRandomId } from "@/lib/utils";

export type Role = "ADMIN" | "CURATOR";

export type CuratorAccount = {
  id: string;
  name: string;
  login: string;
  password: string;
};

export type UserSession = {
  role: Role;
  name: string;
  login: string;
  curatorId?: string;
};

type AuthState = {
  user: UserSession | null;
  curators: CuratorAccount[];
  loginAdmin: (login: string, password: string) => boolean;
  loginCurator: (login: string, password: string) => boolean;
  logout: () => void;
  addCurator: (input: Omit<CuratorAccount, "id">) => void;
  updateCurator: (id: string, updates: Partial<Omit<CuratorAccount, "id">>) => void;
  deleteCurator: (id: string) => void;
};

const ADMIN_CREDENTIALS = { login: "admin", password: "admin", name: "Admin" };

const defaultCurators: CuratorAccount[] = [
  { id: "c1", name: "Меруерт", login: "meruert", password: "curator123" },
  { id: "c2", name: "Айбек", login: "aibek", password: "curator456" }
];

const STORAGE_KEY = "auth-store";

type PersistedState = { user: UserSession | null; curators: CuratorAccount[] };

function loadState(): PersistedState {
  if (typeof window === "undefined") return { user: null, curators: defaultCurators };
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { user: null, curators: defaultCurators };
  try {
    const parsed = JSON.parse(raw) as PersistedState;
    return {
      user: parsed.user ?? null,
      curators: parsed.curators?.length ? parsed.curators : defaultCurators
    };
  } catch (e) {
    console.error("Failed to parse auth store", e);
    return { user: null, curators: defaultCurators };
  }
}

function persist(state: PersistedState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const AuthContext = (typeof React !== "undefined"
  ? (React as any).createContext<AuthState | null>(null)
  : null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [curators, setCurators] = useState<CuratorAccount[]>(defaultCurators);

  useEffect(() => {
    const { user, curators } = loadState();
    setUser(user);
    setCurators(curators);
  }, []);

  useEffect(() => {
    persist({ user, curators });
  }, [user, curators]);

  const loginAdmin = (login: string, password: string) => {
    const ok = login === ADMIN_CREDENTIALS.login && password === ADMIN_CREDENTIALS.password;
    if (ok) {
      setUser({ role: "ADMIN", name: ADMIN_CREDENTIALS.name, login });
    }
    return ok;
  };

  const loginCurator = (login: string, password: string) => {
    const curator = curators.find((c) => c.login === login && c.password === password);
    if (curator) {
      setUser({ role: "CURATOR", name: curator.name, login: curator.login, curatorId: curator.id });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const addCurator = (input: Omit<CuratorAccount, "id">) => {
    if (!input.name || !input.login || !input.password) return;
    setCurators((prev) => [...prev, { ...input, id: safeRandomId("curator") }]);
  };

  const updateCurator = (id: string, updates: Partial<Omit<CuratorAccount, "id">>) => {
    setCurators((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCurator = (id: string) => {
    setCurators((prev) => prev.filter((c) => c.id !== id));
    setUser((prev) => (prev?.curatorId === id ? null : prev));
  };

  const value: AuthState = {
    user,
    curators,
    loginAdmin,
    loginCurator,
    logout,
    addCurator,
    updateCurator,
    deleteCurator
  };

  if (!AuthContext) return <>{children}</>;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  if (!AuthContext) throw new Error("AuthContext missing");
  const ctx = (React as any).useContext(AuthContext) as AuthState | null;
  if (!ctx) throw new Error("Auth store not available");
  return ctx;
}
