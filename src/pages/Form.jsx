// src/pages/Form.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FormPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const agreed = localStorage.getItem("agreedToRules");
    if (agreed !== "true") {
      navigate("/peraturan");
    }
  }, [navigate]);

    return (
    <div className="flex justify-center px-6">
      <form className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-md">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-lg font-semibold text-gray-900">Formulir Peminjaman Motor PPTI 21</h2>
            <p className="mt-1 text-sm text-gray-600">
              Silakan isi data peminjaman dengan benar ya
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Nama Peminjam */}
              <div className="sm:col-span-3">
                <label htmlFor="nama" className="block text-sm font-medium text-gray-900">
                  Nama Peminjam
                </label>
                <div className="mt-2">
                  <input
                    id="nama"
                    name="nama"
                    type="text"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Masukkan nama"
                  />
                </div>
              </div>

              {/* Kelas */}
              <div className="sm:col-span-3">
                <label htmlFor="kelas" className="block text-sm font-medium text-gray-900">
                  Kelas
                </label>
                <div className="mt-2">
                  <select
                    id="kelas"
                    name="kelas"
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Pilih Kelas</option>
                    <option value="21">Kelas 21</option>
                    <option value="22">Kelas 22</option>
                    <option value="23">Kelas 23</option>
                    <option value="24">Kelas 24</option>
                  </select>
                </div>
              </div>

              {/* Hari */}
              <div className="sm:col-span-6">
                <label htmlFor="hari" className="block text-sm font-medium text-gray-900">
                  Hari Peminjaman
                </label>
                <div className="mt-2">
                  <input
                    id="hari"
                    name="hari"
                    type="date"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Jam Mulai */}
              <div className="sm:col-span-3">
                <label htmlFor="jamMulai" className="block text-sm font-medium text-gray-900">
                  Jam Peminjaman
                </label>
                <div className="mt-2">
                  <input
                    id="jamMulai"
                    name="jamMulai"
                    type="time"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Jam Selesai */}
              <div className="sm:col-span-3">
                <label htmlFor="jamSelesai" className="block text-sm font-medium text-gray-900">
                  Selesai Peminjaman
                </label>
                <div className="mt-2">
                  <input
                    id="jamSelesai"
                    name="jamSelesai"
                    type="time"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Alasan */}
              <div className="sm:col-span-6">
                <label htmlFor="alasan" className="block text-sm font-medium text-gray-900">
                  Alasan Penggunaan
                </label>
                <div className="mt-2">
                  <textarea
                    id="alasan"
                    name="alasan"
                    rows="3"
                    placeholder="Tulis alasan kenapa pinjam motor..."
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  ></textarea>
                </div>
              </div>

              {/* STNK */}
              <div className="sm:col-span-6">
                <label htmlFor="stnk" className="block text-sm font-medium text-gray-900">
                  Butuh STNK
                </label>
                <div className="mt-2">
                  <select
                    id="stnk"
                    name="stnk"
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Pilih</option>
                    <option value="ya">Ya</option>
                    <option value="tidak">Tidak</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tombol */}
        <div className="mt-6 flex items-center justify-end gap-x-4">
          <button type="button" className="text-sm font-semibold text-gray-900">
            Batal
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  )

}
