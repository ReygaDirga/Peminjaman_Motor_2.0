import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function FormPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]); 
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedName, setSelectedName] = useState("");  
  const [selectedClass, setSelectedClass] = useState(""); 

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
    if (filtered.length === 1 && value.toLowerCase() === filtered[0].name.toLowerCase()) {
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
    console.log("🚀 Data yang mau dikirim:", {
      nama: selectedName,
      kelas: selectedClass,
      tanggal: e.target.hari.value,
      jamMulai: e.target.jamMulai.value,
      jamSelesai: e.target.jamSelesai.value,
      alasan: e.target.alasan.value,
      stnk: e.target.stnk.value,
    });

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
    </div>
  );
}
