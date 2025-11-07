import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";  

export default function CekPage() {
  const [borrowData, setBorrowData] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const fetchBorrowData = async () => {
    const userId = localStorage.getItem("ID");
    if (!userId) return;

    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("borrow_request")
      .select(`*, users(name, class)`)
      .eq("users_id", userId)
      .gte("borrow_date", today)
      .order("borrow_date", { ascending: true });

    if (error) {
      console.error("Error fetch:", error);
    } else {
      setBorrowData(data);
    }
  };

  const handleDelete = async (id) => {
    console.log("Attempting to delete ID:", id);
    const result = await Swal.fire({
      title: "Yakin mau dihapus?",
      text: "Data yang dihapus gak bisa dikembalikan loh!",
      imageUrl: "/warning.png", 
      imageWidth: 150,
      imageHeight: 150,
      imageAlt: "Custom warning icon",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const { error } = await supabase
        .from("borrow_request")
        .delete()
        .eq("id", id)
      console.log("Delete operation completed for ID:", id);
      if (error) {
        console.error("Delete error:", error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
      } else {
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
        fetchBorrowData();
      }
    }
  };
  
  useEffect(() => {
    fetchBorrowData();
  }, []);

  const userName = localStorage.getItem("Name");

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="max-w-3xl mx-auto">
        {borrowData.length === 0 ? (
          <p className="text-center text-gray-500">
            {userName} belum pernah melakukan peminjaman motor.
          </p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Tanggal</th>
                <th className="border p-2">Mulai</th>
                <th className="border p-2">Selesai</th>
                <th className="border p-2">Nama</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {borrowData.map((row) => (
                <tr key={row.id}>
                  <td className="border p-2">{row.borrow_date}</td>
                  <td className="border p-2">{row.start_time}</td>
                  <td className="border p-2">{row.end_time}</td>
                  <td className="border p-2">{row.users?.name}</td>
                  <td className="border p-2 text-center space-x-2">
                   <button
                      onClick={() => {
                        setEditData(row);
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
          
        )}
        {isEditOpen && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">Edit Peminjaman</h2>

      <label className="block mb-1 text-sm font-medium">Tanggal</label>
      <input
        type="date"
        value={editData.borrow_date}
        className="border p-2 w-full mb-3 rounded"
        onChange={(e) =>
          setEditData({ ...editData, borrow_date: e.target.value })
        }
      />

      <label className="block mb-1 text-sm font-medium">Mulai</label>
      <input
        type="time"
        value={editData.start_time}
        className="border p-2 w-full mb-3 rounded"
        onChange={(e) =>
          setEditData({ ...editData, start_time: e.target.value })
        }
      />

      <label className="block mb-1 text-sm font-medium">Selesai</label>
      <input
        type="time"
        value={editData.end_time}
        className="border p-2 w-full mb-3 rounded"
        onChange={(e) =>
          setEditData({ ...editData, end_time: e.target.value })
        }
      />

      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          onClick={() => setIsEditOpen(false)}
        >
          Batal
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={async () => {
            const { error } = await supabase
              .from("borrow_request")
              .update({
                borrow_date: editData.borrow_date,
                start_time: editData.start_time,
                end_time: editData.end_time,
              })
              .eq("id", editData.id);

            if (error) {
              Swal.fire("Gagal", "Tidak bisa update data", "error");
            } else {
              Swal.fire("Berhasil!", "Data berhasil diperbarui", "success");
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

      </div>
    </div>
  );
}
