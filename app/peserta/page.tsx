"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Peserta {
  _id: string;
  nama: string;
  uid: string;
}

export default function PesertaPage() {
  const [peserta, setPeserta] = useState<Peserta[]>([]);
  const [loading, setLoading] = useState(true);

  const getPeserta = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:3000/peserta"
      );

      setPeserta(response.data);
    } catch (error) {
      console.error("Gagal mengambil data peserta:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPeserta();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        {/* ================= HEADER ================= */}
        <div className="mb-6 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Data Peserta
            </h1>

            <p className="mt-1 text-gray-500">
              Daftar peserta yang terdaftar pada sistem absensi RFID
            </p>
          </div>

          {/* TOMBOL TAMBAH PESERTA */}
          <button
            onClick={() => {
              window.location.href = "/peserta/tambah";
            }}
            className="rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            + Tambah Peserta
          </button>

        </div>

        {/* ================= CARD ================= */}
        <div className="overflow-hidden rounded-xl bg-white shadow">

          {/* CARD HEADER */}
          <div className="flex items-center justify-between border-b p-5">

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Daftar Peserta
              </h2>

              <p className="text-sm text-gray-500">
                Total {peserta.length} peserta
              </p>
            </div>

            {/* REFRESH */}
            <button
              onClick={getPeserta}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Refresh
            </button>

          </div>

          {/* ================= LOADING ================= */}
          {loading ? (

            <div className="p-8 text-center text-gray-500">
              Memuat data...
            </div>

          ) : peserta.length === 0 ? (

            /* ================= DATA KOSONG ================= */

            <div className="p-8 text-center">

              <p className="text-gray-500">
                Belum ada peserta.
              </p>

              <button
                onClick={() => {
                  window.location.href = "/peserta/tambah";
                }}
                className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                + Tambah Peserta
              </button>

            </div>

          ) : (

            /* ================= TABLE ================= */

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                {/* TABLE HEADER */}
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

                  </tr>

                </thead>

                {/* TABLE BODY */}
                <tbody className="divide-y">

                  {peserta.map((item, index) => (

                    <tr
                      key={item._id}
                      className="transition hover:bg-gray-50"
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

                        <span className="rounded-md bg-gray-100 px-3 py-1 font-mono text-sm text-gray-700">
                          {item.uid}
                        </span>

                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Terdaftar
                        </span>

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