import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";
import CustomDatePicker from "../components/CustomDatePicker";
import AnalogTimePicker from "../components/CustomeTimePicker";
import { H1Icon } from "@heroicons/react/16/solid";

const formatDate = (date) => {
  if (!(date instanceof Date)) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const userName = localStorage.getItem("Name");

export default function CekPage() {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [borrowData, setBorrowData] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editDate, setEditDate] = useState(null);
  const toMinutes = (t) => {
    if (!t || typeof t !== "string") return 0;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const isOverlap = (aStart, aEnd, bStart, bEnd) => {
    return aStart < bEnd && aEnd > bStart;
  };
  const fetchBorrowData = async () => {
    const userId = localStorage.getItem("ID");
    if (!userId) return;

    const today = formatDate(new Date());

    const { data, error } = await supabase
      .from("borrow_request")
      .select(`*, users(name, class)`)
      .eq("users_id", userId)
      .gte("borrow_date", today)
      .order("borrow_date", { ascending: true });

    if (error) {
      console.error("Error fetch:", error);
    } else {
      setBorrowData(data || []);
    }
  };

  useEffect(() => {
    fetchBorrowData();
  }, []);

  const checkConflictsBeforeUpdate = async ({ id, borrow_date, start_time, end_time }) => {
    if (!borrow_date || !start_time || !end_time) {
      return { ok: false, reason: "Tanggal, jam mulai, dan jam selesai wajib diisi." };
    }

    const start = toMinutes(start_time);
    const end = toMinutes(end_time);

    if (end <= start) {
      return { ok: false, reason: "Jam selesai harus lebih besar dari jam mulai." };
    }
    const { data: bookings, error } = await supabase
      .from("borrow_request")
      .select("id, users_id, start_time, end_time")
      .eq("borrow_date", borrow_date)
      .neq("id", id);

    if (error) {
      console.error("Fetch conflict error:", error);
      return { ok: false, reason: "Gagal ngecek jadwal, coba lagi." };
    }
    for (const b of bookings || []) {
      const bs = toMinutes(b.start_time);
      const be = toMinutes(b.end_time);
      if (isOverlap(start, end, bs, be)) {
        return { ok: false, reason: `Bentrok dengan jadwal lain ${b.start_time} - ${b.end_time}.` };
      }
    }
    const userId = localStorage.getItem("ID");
    const userBookings = (bookings || []).filter(
      (b) => String(b.users_id) === String(userId)
    );

    let totalMinutes = 0;
    for (const b of userBookings) {
      const bs = toMinutes(b.start_time);
      const be = toMinutes(b.end_time);
      totalMinutes += be - bs;
    }
    totalMinutes += end - start;

    if (totalMinutes > 4 * 60) {
      const totalHours = (totalMinutes / 60).toFixed(1);
      return { ok: false, reason: `Kamu udah pinjam total ${totalHours} jam di hari itu (maks 4 jam).` };
    }

    return { ok: true };
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin mau dihapus?",
      text: "Data yang dihapus gak bisa dikembalikan loh!",
      color: "#fff",
      background: "#1f2229",
      imageUrl: "/warning.png",
      imageWidth: 150,
      imageHeight: 150,
      imageAlt: "Custom warning icon",
      showCancelButton: true,
      confirmButtonColor: "#047179",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase.from("borrow_request").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
    } else {
      Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      fetchBorrowData();
    }
  };

  const userName = localStorage.getItem("Name");

  return (
    <div className="min-h-screen py-4 pt-20 bg-[#1f2229] text-white">
      <div className="max-w-3xl mx-auto bg-[#1f2229]">
        {borrowData.length === 0 ? (
          <p className="text-center text-gray-500">
            {userName} belum pernah melakukan peminjaman motor.
          </p>
        ) : (
          <div className="max-w-3xl mx-auto overflow-x-auto">
          <div className="mb-3 flex items-center">
            <p className="text-md text-gray-400">Peminjaman atas nama : {userName}</p>
          </div>
          <table className="w-full border-collapse border border-gray-300 bg-[#1f2229]">
            <thead>
              <tr className="bg-[#1f2229]">
                <th className="border p-2">Tanggal</th>
                <th className="border p-2">Mulai</th>
                <th className="border p-2">Selesai</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {borrowData.map((row) => (
                <tr key={row.id}>
                  <td className="border p-2">{row.borrow_date}</td>
                  <td className="border p-2">{row.start_time}</td>
                  <td className="border p-2">{row.end_time}</td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() => {
                        setEditData(row);
                        setEditDate(new Date(row.borrow_date));
                        setIsEditOpen(true);
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}

        {isEditOpen && editData && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#1f2229] p-6 rounded-xl w-[420px]">
              <h2 className="text-lg font-semibold mb-4 text-center">
                Edit Peminjaman
              </h2>

              <label className="block mb-1 text-sm">Tanggal</label>
              <CustomDatePicker
                value={editDate}
                onChange={(date) => {
                  setEditDate(date);
                  setEditData({
                    ...editData,
                    borrow_date: formatDate(date),
                  });
                }}
              />

              <label className="block mt-3 mb-1 text-sm">Mulai</label>
              <input
                readOnly
                value={editData.start_time || ""}
                placeholder="Select start time"
                onClick={() => setShowStartPicker(true)}
                className="w-full p-2 rounded bg-[#2a2d36] cursor-pointer"
              />

              <label className="block mt-3 mb-1 text-sm">Selesai</label>
              <input
                readOnly
                value={editData.end_time || ""}
                placeholder="Select end time"
                onClick={() => setShowEndPicker(true)}
                className="w-full p-2 rounded bg-[#2a2d36] cursor-pointer"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 bg-gray-600 rounded"
                  onClick={() => setIsEditOpen(false)}
                >
                  Batal
                </button>
                <button
                  className="px-4 py-2 bg-[#01eeff] text-[#1f2229] rounded"
                  onClick={async () => {
                    const res = await checkConflictsBeforeUpdate({
                      id: editData.id,
                      borrow_date: editData.borrow_date,
                      start_time: editData.start_time,
                      end_time: editData.end_time,
                    });

                    if (!res.ok) {
                      Swal.fire("Gagal", res.reason, "error");
                      return;
                    }

                    const { error } = await supabase
                      .from("borrow_request")
                      .update({
                        borrow_date: editData.borrow_date,
                        start_time: editData.start_time,
                        end_time: editData.end_time,
                      })
                      .eq("id", editData.id);

                    if (error) {
                      Swal.fire("Gagal", "Update gagal", "error");
                    } else {
                      Swal.fire("Berhasil", "Data diperbarui", "success");
                      setIsEditOpen(false);
                      fetchBorrowData();
                    }
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
        {showStartPicker && (
          <AnalogTimePicker
            value={editData.start_time}
            clockImage="/logo.png"
            onChange={(t) => {
              setEditData((prev) => ({
                ...prev,
                start_time: t,
              }));
            }}
            onClose={() => setShowStartPicker(false)}
          />
        )}

        {showEndPicker && (
          <AnalogTimePicker
            value={editData.end_time}
            clockImage="/logo.png"
            onChange={(t) => {
              setEditData((prev) => ({
                ...prev,
                end_time: t,
              }));
            }}
            onClose={() => setShowEndPicker(false)}
          />
        )}
      </div>
    </div>
  );
}