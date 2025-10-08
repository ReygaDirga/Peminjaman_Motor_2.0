import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function CekPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [borrowData, setBorrowData] = useState([]);

  const fetchBorrowData = async (date) => {
    const { data, error } = await supabase
      .from("borrow_request")
      .select(`*, users(name, class)`)
      .eq("borrow_date", date);

    if (error) {
      console.error("❌ Error fetch:", error);
    } else {
      setBorrowData(data);
    }
  };
  useEffect(() => {
    fetchBorrowData(selectedDate);
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="tanggal" className="font-medium whitespace-nowrap">
            Pilih tanggal
          </label>
          <input
            type="date"
            id="tanggal"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {borrowData.length === 0 ? (
          <p className="text-center text-gray-500">
            Belum ada peminjaman di tanggal{" "}
            <span className="font-semibold">{new Date(selectedDate).toLocaleDateString("id-ID")}</span>.
          </p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Mulai</th>
                <th className="border p-2">Selesai</th>
                <th className="border p-2">Nama</th>
                <th className="border p-2">Kelas</th>
              </tr>
            </thead>
            <tbody>
              {borrowData.map((row) => (
                <tr key={row.id}>
                  <td className="border p-2">{row.start_time}</td>
                  <td className="border p-2">{row.end_time}</td>
                  <td className="border p-2">{row.users?.name}</td>
                  <td className="border p-2">{row.users?.class}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
