"use client";

import { useEffect, useState } from "react";

interface Peserta {
  _id: string;
  nama: string;
  uid: string;
}

interface Absensi {
  _id: string;
  uid: string;
  mac: string;
  status: string;
  waktu: string;
}

const API = "http://localhost:3000";

export default function Home() {
  const [peserta, setPeserta] = useState<Peserta[]>([]);
  const [absensi, setAbsensi] = useState<Absensi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // AMBIL DATA
  // ==========================================

  const getData = async () => {
    try {
      setError("");

      const [pesertaRes, absensiRes] = await Promise.all([
        fetch(`${API}/peserta`),
        fetch(`${API}/absensi`),
      ]);

      if (!pesertaRes.ok) {
        throw new Error("Gagal mengambil data peserta");
      }

      if (!absensiRes.ok) {
        throw new Error("Gagal mengambil data absensi");
      }

      const pesertaData = await pesertaRes.json();
      const absensiData = await absensiRes.json();

      console.log("DATA PESERTA:", pesertaData);
      console.log("DATA ABSENSI:", absensiData);

      setPeserta(pesertaData);
      setAbsensi(absensiData);
    } catch (err) {
      console.error("ERROR:", err);
      setError("Gagal mengambil data dari server.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // AUTO REFRESH
  // ==========================================

  useEffect(() => {
    getData();

    const interval = setInterval(() => {
      getData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // ABSENSI HARI INI SAJA
  // ==========================================

  const isHariIni = (waktu: string) => {
    if (!waktu) return false;

    const tanggal = new Date(waktu);
    const sekarang = new Date();

    return (
      tanggal.getFullYear() === sekarang.getFullYear() &&
      tanggal.getMonth() === sekarang.getMonth() &&
      tanggal.getDate() === sekarang.getDate()
    );
  };

  const absensiHariIni = absensi.filter((item) =>
    isHariIni(item.waktu)
  );

  // UID yang sudah scan HARI INI
  const uidHadir = new Set(
    absensiHariIni
      .map((item) => item.uid?.toUpperCase())
      .filter(Boolean)
  );

  // ==========================================
  // STATISTIK
  // ==========================================

  const totalPeserta = peserta.length;

  const hadir = peserta.filter((item) =>
    uidHadir.has(item.uid?.toUpperCase())
  ).length;

  const tidakHadir = totalPeserta - hadir;

  // ==========================================
  // CEK STATUS PESERTA
  // ==========================================

  const sudahHadir = (uid: string) => {
    return uidHadir.has(uid?.toUpperCase());
  };

  // ==========================================
  // CARI ABSENSI TERAKHIR PESERTA
  // ==========================================

  const getAbsensiTerakhir = (uid: string) => {
    const data = absensiHariIni
      .filter(
        (item) =>
          item.uid?.toUpperCase() === uid?.toUpperCase()
      )
      .sort(
        (a, b) =>
          new Date(b.waktu).getTime() -
          new Date(a.waktu).getTime()
      );

    return data[0];
  };

  // ==========================================
  // CARI NAMA BERDASARKAN UID
  // ==========================================

  const getNamaPeserta = (uid: string) => {
    const pesertaDitemukan = peserta.find(
      (item) =>
        item.uid?.toUpperCase() === uid?.toUpperCase()
    );

    return pesertaDitemukan?.nama || "Tidak terdaftar";
  };

  // ==========================================
  // FORMAT WAKTU
  // ==========================================

  const formatWaktu = (waktu: string) => {
    if (!waktu) return "-";

    return new Date(waktu).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-7xl">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Absensi
          </h1>

          <p className="mt-1 text-gray-500">
            Sistem Absensi Rapat Berbasis RFID
          </p>

        </div>

        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* ==========================================
            STATISTIK
        ========================================== */}

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* TOTAL PESERTA */}

          <div className="rounded-xl bg-white p-6 shadow">

            <p className="text-sm font-medium text-gray-500">
              Total Peserta
            </p>

            <h2 className="mt-2 text-4xl font-bold text-gray-800">
              {loading ? "..." : totalPeserta}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Peserta terdaftar
            </p>

          </div>

          {/* HADIR */}

          <div className="rounded-xl bg-white p-6 shadow">

            <p className="text-sm font-medium text-gray-500">
              Hadir
            </p>

            <h2 className="mt-2 text-4xl font-bold text-green-600">
              {loading ? "..." : hadir}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Sudah melakukan absensi
            </p>

          </div>

          {/* TIDAK HADIR */}

          <div className="rounded-xl bg-white p-6 shadow">

            <p className="text-sm font-medium text-gray-500">
              Tidak Hadir
            </p>

            <h2 className="mt-2 text-4xl font-bold text-red-600">
              {loading ? "..." : tidakHadir}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Belum melakukan absensi
            </p>

          </div>

        </div>

        {/* ==========================================
            DAFTAR KEHADIRAN
        ========================================== */}

        <div className="mb-8 overflow-hidden rounded-xl bg-white shadow">

          {/* HEADER */}

          <div className="flex items-center justify-between border-b p-5">

            <div>

              <h2 className="text-lg font-semibold text-gray-800">
                Daftar Kehadiran
              </h2>

              <p className="text-sm text-gray-500">
                Status seluruh peserta rapat
              </p>

            </div>

            <button
              onClick={getData}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Refresh
            </button>

          </div>

          {/* TABLE */}

          {loading ? (

            <div className="p-10 text-center text-gray-500">
              Memuat data...
            </div>

          ) : peserta.length === 0 ? (

            <div className="p-10 text-center text-gray-500">
              Belum ada peserta terdaftar.
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

                  {peserta.map((item, index) => {

                    const hadirPeserta = sudahHadir(item.uid);

                    const absensiTerakhir =
                      getAbsensiTerakhir(item.uid);

                    return (

                      <tr
                        key={item._id}
                        className="hover:bg-gray-50"
                      >

                        {/* NO */}

                        <td className="px-6 py-4 text-sm text-gray-500">
                          {index + 1}
                        </td>

                        {/* NAMA */}

                        <td className="px-6 py-4 font-medium text-gray-800">
                          {item.nama}
                        </td>

                        {/* UID */}

                        <td className="px-6 py-4">

                          <span className="inline-block rounded-md bg-gray-200 px-3 py-2 font-mono text-sm font-bold tracking-wider text-gray-900">
                            {item.uid}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">

                          {hadirPeserta ? (

                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                              Hadir
                            </span>

                          ) : (

                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                              Tidak Hadir
                            </span>

                          )}

                        </td>

                        {/* WAKTU */}

                        <td className="px-6 py-4 text-sm text-gray-600">

                          {absensiTerakhir
                            ? formatWaktu(absensiTerakhir.waktu)
                            : "-"}

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* ==========================================
            ABSENSI TERBARU
        ========================================== */}

        <div className="overflow-hidden rounded-xl bg-white shadow">

          <div className="border-b p-5">

            <h2 className="text-lg font-semibold text-gray-800">
              Absensi Terbaru
            </h2>

            <p className="text-sm text-gray-500">
              Riwayat kartu RFID yang baru saja melakukan scan
            </p>

          </div>

          {loading ? (

            <div className="p-10 text-center text-gray-500">
              Memuat data...
            </div>

          ) : absensi.length === 0 ? (

            <div className="p-10 text-center text-gray-500">
              Belum ada peserta yang melakukan absensi.
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

                  {absensiHariIni.slice(0, 10).map((item, index) => {

                    const nama = getNamaPeserta(item.uid);

                    return (

                      <tr
                        key={item._id}
                        className="hover:bg-gray-50"
                      >

                        <td className="px-6 py-4 text-sm text-gray-500">
                          {index + 1}
                        </td>

                        <td className="px-6 py-4 font-medium text-gray-800">

                          {nama === "Tidak terdaftar" ? (

                            <span className="text-red-500">
                              Tidak terdaftar
                            </span>

                          ) : (

                            nama

                          )}

                        </td>

                        <td className="px-6 py-4">

                          <span className="inline-block rounded-md bg-gray-200 px-3 py-2 font-mono text-sm font-bold tracking-wider text-gray-900">
                            {item.uid}
                          </span>

                        </td>

                        <td className="px-6 py-4">

                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            Hadir
                          </span>

                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatWaktu(item.waktu)}
                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </main>
  );
}