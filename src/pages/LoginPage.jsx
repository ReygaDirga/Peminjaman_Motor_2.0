import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("id, name, role")
      .eq("name", name)
      .single();

    if (fetchError || !user) {
      setError("Nama tidak ditemukan");
      return;
    }

    if (user.id !== code) {
      setError("Kode salah!");
      return;
    }

    if (user.role !== "admin") {
      setError("Akses ditolak, kamu bukan admin!");
      return;
    }
    localStorage.setItem("adminName", user.name);
    localStorage.setItem("adminId", user.id);
    localStorage.setItem("role", user.role);

    navigate("/generate");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4 text-center">Login Admin</h2>

        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

        <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
        <input
          type="text"
          placeholder="Masukkan nama..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Kode Masuk</label>
        <input
          type="text"
          placeholder="Masukkan kode"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500"
        >
          Masuk
        </button>
      </form>
    </div>
  );
}
