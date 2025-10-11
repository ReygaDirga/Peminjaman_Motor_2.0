import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ModalBerhasil from "../components/ModalBerhasil";
import ModalBentrok from "../components/ModalBentrok";
import { sendTelegramMessage } from "../lib/telegram";

export default function FormPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showBentrok, setShowBentrok] = useState(false);
  const [conflictInfo, setConflictInfo] = useState("");

  useEffect(() => {
    const agreed = localStorage.getItem("agreedToRules");
    if (agreed !== "true") navigate("/peraturan");

    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, class");

      if (error) console.error("Error fetch users:", error);
      else setUsers(data);
    };

    fetchUsers();
  }, [navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newErrors = {};

    const tanggal = e.target.hari.value;
    const jamMulai = e.target.jamMulai.value;
    const jamSelesai = e.target.jamSelesai.value;
    const alasan = e.target.alasan.value;
    const stnk = e.target.stnk.value;

    if (!selectedName) newErrors.nama = "Nama peminjam harus diisi";
    if (!tanggal) newErrors.hari = "Tanggal peminjaman harus diisi";
    if (!jamMulai) newErrors.jamMulai = "Jam mulai harus diisi";
    if (!jamSelesai) newErrors.jamSelesai = "Jam selesai harus diisi";
    if (!alasan) newErrors.alasan = "Alasan peminjaman harus diisi";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    if (jamSelesai <= jamMulai)
      newErrors.jamSelesai = "Jam selesai harus lebih besar dari jam mulai";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(tanggal);
    if (selectedDate < today)
      newErrors.hari = "Tanggal tidak boleh di masa lalu";

    const start = new Date(`1970-01-01T${jamMulai}`);
    const end = new Date(`1970-01-01T${jamSelesai}`);
    const durationHours = (end - start) / (1000 * 60 * 60);

    if (durationHours <= 0)
      newErrors.jamSelesai = "Durasi jamnya tidak valid";

    const maxHours = selectedClass.toLowerCase() === "ppti 21" ? 4 : 3;
    if (durationHours > maxHours)
      newErrors.jamSelesai = `Kelas ${selectedClass} hanya boleh pinjam ${maxHours} jam`;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("name", selectedName)
        .single();

      if (userError || !userData) {
        newErrors.nama = "Nama peminjam tidak ditemukan";
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      const userId = userData.id;
      const [{ data: existingByUser }, { data: existingBookings }] = await Promise.all([
        supabase
          .from("borrow_request")
          .select("start_time, end_time")
          .eq("borrow_date", tanggal)
          .eq("users_id", userId),

        supabase
          .from("borrow_request")
          .select("start_time, end_time, users_id")
          .eq("borrow_date", tanggal),
      ]);

      let totalHours = 0;
      existingByUser?.forEach((b) => {
        const s = new Date(`1970-01-01T${b.start_time}`);
        const e = new Date(`1970-01-01T${b.end_time}`);
        totalHours += (e - s) / (1000 * 60 * 60);
      });

      const formatHours = (hours) => {
        const jam = Math.floor(hours);
        const menit = Math.round((hours - jam) * 60);
        if (jam === 0) return `${menit} menit`;
        if (menit === 0) return `${jam} jam`;
        return `${jam} jam ${menit} menit`;
      };

      if (totalHours + durationHours > 4) {
        const over = totalHours + durationHours - 4;
        newErrors.jamSelesai = `Total jam peminjaman ${formatHours(
          totalHours + durationHours
        )}, kelebihan ${formatHours(over)} dari batas 4 jam`;
        setErrors(newErrors);
        setLoading(false);
        return;
      }
      for (const booking of existingBookings || []) {
        const isOverlap =
          jamMulai < booking.end_time && jamSelesai > booking.start_time;

        if (isOverlap) {
          const { data: bentrokUser } = await supabase
            .from("users")
            .select("name")
            .eq("id", booking.users_id)
            .single();

          const conflictName = bentrokUser ? bentrokUser.name : "User lain";
          newErrors.jamMulai =
            booking.users_id === userId
              ? `Zims liat, jadwal kamu bentrok (${booking.start_time} - ${booking.end_time})`
              : `Bentrok dengan ${conflictName} (${booking.start_time} - ${booking.end_time})`;
          setErrors(newErrors);
          setLoading(false);
          return;
        }
      }

      const { error } = await supabase.from("borrow_request").insert([
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
        newErrors.global = "Gagal menyimpan data, coba lagi.";
        setErrors(newErrors);
      } else {
        setShowModal(true);
        setErrors({});
        e.target.reset();
        setSelectedName("");
        setSelectedClass("");

        const message = `
        *Peminjaman Motor Baru!*
        *==================*
        *Nama:* ${selectedName}
        *Kelas:* ${selectedClass}
        *Tanggal:* ${tanggal}
        *Waktu:* ${jamMulai} - ${jamSelesai}
        *Alasan:* ${alasan}
        *Butuh STNK:* ${stnk === "ya" ? "Ya" : "Tidak"}
        `;
        sendTelegramMessage(message).catch(console.error);
      }
    } catch (err) {
      newErrors.global = "Terjadi kesalahan tidak terduga.";
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-6">
      <form
        className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-semibold text-gray-900">
          Formulir Peminjaman Motor PPTI 21
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Silakan isi data peminjaman dengan benar ya
        </p>

        <div className="mt-6 relative">
          <label className="block text-sm font-medium text-gray-900">
            Nama Peminjam
          </label>
          <input
            id="nama"
            name="nama"
            type="text"
            value={selectedName}
            onChange={handleNameChange}
            autoComplete="off"
            placeholder="Ketik nama..."
            className={`mt-2 block w-full rounded-md border px-3 py-2 sm:text-sm ${
              errors.nama ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.nama && (
            <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
          )}
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
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-900">Kelas</label>
          <input
            id="kelas"
            name="kelas"
            type="text"
            value={selectedClass}
            disabled
            className="mt-2 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 sm:text-sm"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-900">Hari Peminjaman</label>
          <input
            id="hari"
            name="hari"
            type="date"
            className={`mt-2 block w-full rounded-md border px-3 py-2 sm:text-sm ${
              errors.hari ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.hari && <p className="text-red-500 text-sm mt-1">{errors.hari}</p>}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-900">Jam Mulai</label>
          <input
            id="jamMulai"
            name="jamMulai"
            type="time"
            className={`mt-2 block w-full rounded-md border px-3 py-2 sm:text-sm ${
              errors.jamMulai ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.jamMulai && <p className="text-red-500 text-sm mt-1">{errors.jamMulai}</p>}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-900">Jam Selesai</label>
          <input
            id="jamSelesai"
            name="jamSelesai"
            type="time"
            className={`mt-2 block w-full rounded-md border px-3 py-2 sm:text-sm ${
              errors.jamSelesai ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.jamSelesai && (
            <p className="text-red-500 text-sm mt-1">{errors.jamSelesai}</p>
          )}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-900">Alasan</label>
          <textarea
            id="alasan"
            name="alasan"
            rows="3"
            placeholder="Tulis alasan kenapa minjam motor..."
            className={`mt-2 block w-full rounded-md border px-3 py-2 sm:text-sm ${
              errors.alasan ? "border-red-500" : "border-gray-300"
            }`}
          ></textarea>
          {errors.alasan && (
            <p className="text-red-500 text-sm mt-1">{errors.alasan}</p>
          )}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-900">Butuh STNK</label>
          <select
            id="stnk"
            name="stnk"
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 sm:text-sm"
          >
            <option value="">Pilih</option>
            <option value="ya">Ya</option>
            <option value="tidak">Tidak</option>
          </select>
        </div>

        {errors.global && <p className="text-red-600 text-sm mt-4">{errors.global}</p>}

        <div className="mt-8 flex items-center justify-end gap-x-4">
          <button
            type="button"
            className="text-sm font-semibold text-gray-900"
            onClick={() => navigate("/")}
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>

      <ModalBerhasil isOpen={showModal} onClose={() => setShowModal(false)} />
      <ModalBentrok
        isOpen={showBentrok}
        onClose={() => setShowBentrok(false)}
        conflictInfo={conflictInfo}
      />
    </div>
  );
}
