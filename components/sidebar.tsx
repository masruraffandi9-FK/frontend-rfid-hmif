"use client";

import Link from "next/link";
import { LayoutDashboard, Users, ClipboardList } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen sticky top-0 bg-slate-800 text-white p-5">
      <h1 className="text-2xl font-bold mb-8">
        IoT Absensi
      </h1>

      <nav className="space-y-4">

        <Link
          href="/dashboard"
          className="flex items-center gap-3 hover:bg-slate-700 p-3 rounded-lg"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link
          href="/peserta"
          className="flex items-center gap-3 hover:bg-slate-700 p-3 rounded-lg"
        >
          <Users size={20} />
          Peserta
        </Link>

        <Link
          href="/absensi"
          className="flex items-center gap-3 hover:bg-slate-700 p-3 rounded-lg"
        >
          <ClipboardList size={20} />
          Absensi
        </Link>

      </nav>
    </aside>
  );
}