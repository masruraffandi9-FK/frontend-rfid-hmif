"use client";

import { useEffect, useState } from "react";

interface Absensi {
  _id: string;
  nama: string;
  uid: string;
  status: string;
  waktu: string;
}

export default function AbsensiPage() {
  const [absensi, setAbsensi] = useState<Absensi[]>([]);
  const [loading, setLoading] = useState(true);

  const getAbsensi = async () => {
    try {
      const response = await fetch("http://localhost:3000/absensi");

      if (!response.ok) {
        throw new Error("Gagal mengambil data absensi");
      }

      const data = await response.json();

      setAbsensi(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAbsensi();

    // Refresh otomatis setiap 5 detik
    const interval = setInterval(() => {
      getAbsensi();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatWaktu = (waktu: string) => {
    return new Date(waktu).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Absensi
          </h1>

          <p className="mt-1 text-gray-500">
            Data kehadiran peserta berdasarkan scan RFID
          </p>
        </div>

        {/* STAT CARD */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">
              Total Absensi
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-800">
              {absensi.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">
              Status Hadir
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {absensi.filter((item) => item.status === "Hadir").length}
            </h2>
          </div>

        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl bg-white shadow">

          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Riwayat Absensi
              </h2>

              <p className="text-sm text-gray-500">
                Data terbaru akan muncul otomatis
              </p>
            </div>

            <button
              onClick={getAbsensi}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Memuat data...
            </div>
          ) : absensi.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Belum ada data absensi.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">

                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      No
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Nama
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      UID RFID
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Waktu
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {absensi.map((item, index) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-800">
                        {item.nama || "Tanpa Nama"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-md bg-gray-100 px-3 py-1 font-mono text-sm">
                          {item.uid}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          {item.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatWaktu(item.waktu)}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}