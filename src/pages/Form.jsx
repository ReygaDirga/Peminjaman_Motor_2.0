import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ModalBerhasil from "../components/ModalBerhasil";
import ModalBentrok from "../components/ModalBentrok";

export default function FormPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const [showModal, setShowModal] = useState(false);       // Modal Berhasil
  const [showBentrok, setShowBentrok] = useState(false);   // Modal Bentrok
  const [conflictInfo, setConflictInfo] = useState("");    // Info bentrokan

  // Ambil data users buat autocomplete
  useEffect(() => {
    const agreed = localStorage.getItem("agreedToRules");
    if (agreed !== "true") navigate("/peraturan");

    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, class");

      if (error) {
        console.error("❌ Error fetch users:", error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Handle autocomplete nama
  const handleNameChange = (e) => {
    const value = e.target.value;
    setSelectedName(value);

    if (value.trim() === "") {
      setFilteredUsers([]);
      setSelectedClass("");
      return;
    }

    const filtered = users.filter((u) =>
      u.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);

    if (
      filtered.length === 1 &&
      value.toLowerCase() === filtered[0].name.toLowerCase()
    ) {
      setSelectedName(filtered[0].name);
      setSelectedClass(filtered[0].class);
      setFilteredUsers([]);
    }
  };

  const handleSuggestionClick = (user) => {
    setSelectedName(user.name);
    setSelectedClass(user.class);
    setFilteredUsers([]);
  };

  // 📝 Submit form → cek bentrok → insert → modal
  const handleSubmit = async (e) => {
    e.preventDefault();

    const tanggal = e.target.hari.value;
    const jamMulai = e.target.jamMulai.value;
    const jamSelesai = e.target.jamSelesai.value;
    const alasan = e.target.alasan.value;
    const stnk = e.target.stnk.value;

    if (!selectedName || !tanggal || !jamMulai || !jamSelesai || !alasan) {
      alert("⚠️ Tolong isi semua field sebelum submit ya bang 🙏");
      return;
    }

    try {
      // 1️⃣ Ambil semua jadwal di tanggal yang sama
      const { data: existingBookings, error: fetchError } = await supabase
        .from("borrow_request")
        .select("start_time, end_time, users_id")
        .eq("borrow_date", tanggal);

      if (fetchError) {
        console.error("❌ Gagal ambil data jadwal:", fetchError);
        return;
      }

      // 2️⃣ Cek bentrok
      const newStart = jamMulai;
      const newEnd = jamSelesai;

      for (const booking of existingBookings) {
        const existingStart = booking.start_time;
        const existingEnd = booking.end_time;

        // Cek overlap
        const isOverlap = newStart < existingEnd && newEnd > existingStart;
        if (isOverlap) {
          // Ambil nama user yang bentrok
          const { data: userData } = await supabase
            .from("users")
            .select("name")
            .eq("id", booking.users_id)
            .single();

          const conflictName = userData ? userData.name : "User lain";
          setConflictInfo(
            `Bentrok dengan ${conflictName} (${existingStart} - ${existingEnd})`
          );
          setShowBentrok(true);
          return; // ❌ stop, jangan insert
        }
      }

      // 3️⃣ Ambil user_id dari tabel users
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("name", selectedName)
        .single();

      if (userError || !userData) {
        console.error("❌ Gagal cari user_id:", userError);
        alert("Nama peminjam tidak ditemukan 😤");
        return;
      }

      const userId = userData.id;

      // 4️⃣ Insert ke tabel borrow_requests
      const { data, error } = await supabase.from("borrow_requests").insert([
        {
          users_id: userId,
          borrow_date: tanggal,
          start_time: jamMulai,
          end_time: jamSelesai,
          reason: alasan,
          need_stnk: stnk === "ya",
        },
      ]);

      if (error) {
        console.error("❌ Error insert data:", error);
        alert("Gagal menyimpan data 🫠");
      } else {
        console.log("✅ Data berhasil disimpan:", data);
        setShowModal(true);
        e.target.reset();
        setSelectedName("");
        setSelectedClass("");
      }
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      alert("Terjadi kesalahan tidak terduga 😵");
    }
  };

  return (
    <div className="flex justify-center px-6">
      <form
        className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-lg font-semibold text-gray-900">
              Formulir Peminjaman Motor PPTI 21
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Silakan isi data peminjaman dengan benar ya
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Nama Peminjam */}
              <div className="sm:col-span-3 relative">
                <label
                  htmlFor="nama"
                  className="block text-sm font-medium text-gray-900"
                >
                  Nama Peminjam
                </label>
                <div className="mt-2">
                  <input
                    id="nama"
                    name="nama"
                    type="text"
                    value={selectedName}
                    onChange={handleNameChange}
                    autoComplete="off"
                    placeholder="Ketik nama..."
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                {filteredUsers.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredUsers.map((user) => (
                      <li
                        key={user.id}
                        onClick={() => handleSuggestionClick(user)}
                        className="px-3 py-2 cursor-pointer hover:bg-indigo-100"
                      >
                        {user.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Kelas */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="kelas"
                  className="block text-sm font-medium text-gray-900"
                >
                  Kelas
                </label>
                <div className="mt-2">
                  <input
                    id="kelas"
                    name="kelas"
                    type="text"
                    value={selectedClass}
                    disabled
                    className="block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Hari */}
              <div className="sm:col-span-6">
                <label
                  htmlFor="hari"
                  className="block text-sm font-medium text-gray-900"
                >
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
                <label
                  htmlFor="jamMulai"
                  className="block text-sm font-medium text-gray-900"
                >
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
                <label
                  htmlFor="jamSelesai"
                  className="block text-sm font-medium text-gray-900"
                >
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
                <label
                  htmlFor="alasan"
                  className="block text-sm font-medium text-gray-900"
                >
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
                <label
                  htmlFor="stnk"
                  className="block text-sm font-medium text-gray-900"
                >
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
          <button
            type="button"
            className="text-sm font-semibold text-gray-900"
            onClick={() => navigate("/")}
          >
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

      {/* Modal Berhasil */}
      <ModalBerhasil isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* Modal Bentrok */}
      <ModalBentrok
        isOpen={showBentrok}
        onClose={() => setShowBentrok(false)}
        conflictInfo={conflictInfo}
      />
    </div>
  );
}
