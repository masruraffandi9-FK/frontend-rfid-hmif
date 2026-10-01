"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TambahPesertaPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama.trim() || !uid.trim()) {
      setMessage("Nama dan UID RFID wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("http://localhost:3000/peserta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: nama.trim(),
          uid: uid.trim().toUpperCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menambahkan peserta");
      }

      alert("Peserta berhasil ditambahkan!");

      router.push("/peserta");
      router.refresh();

    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Tambah Peserta
          </h1>

          <p className="mt-1 text-gray-500">
            Masukkan nama dan UID RFID peserta
          </p>
        </div>

        {/* FORM */}
        <div className="rounded-xl bg-white p-6 shadow">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAMA */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nama Peserta
              </label>

              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama peserta"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-black"
              />
            </div>

            {/* UID */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                UID RFID
              </label>

              <input
                type="text"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                placeholder="Contoh: 5B7A199D"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono uppercase text-gray-900 placeholder-gray-400 outline-none focus:border-black"
              />

              <p className="mt-1 text-xs text-gray-400">
                Masukkan UID kartu RFID secara manual.
              </p>
            </div>

            {/* ERROR */}
            {message && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {message}
              </div>
            )}

            {/* BUTTON */}
            <div className="flex gap-3 pt-2">

              <button
                type="button"
                onClick={() => router.push("/peserta")}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Kembali
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-black px-4 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Peserta"}
              </button>

            </div>

          </form>

        </div>
      </div>
    </main>
  );
}