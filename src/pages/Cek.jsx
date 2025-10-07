// src/pages/CekPage.jsx
export default function CekPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-2">
      <div className="flex justify-center">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="tanggal" className="font-medium whitespace-nowrap">
              Pilih tanggal
            </label>
            <input
              type="date"
              id="tanggal"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition"
          >
            Cek
          </button>
        </div>
      </div>
    </div>
  );
}
