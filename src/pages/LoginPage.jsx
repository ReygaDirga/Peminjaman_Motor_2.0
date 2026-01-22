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
    <div className="flex justify-center items-center bg-[#1f2229] min-h-screen">
      <form onSubmit={handleLogin} className="bg-[#1f2229] p-6 rounded-lg shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4 text-center text-white">Admin Login</h2>

        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

        <label className="block text-sm font-medium text-white mb-1">Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4 text-white bg-[#1f2229]"
        />

        <label className="block text-sm font-medium text-white mb-1">Access Code</label>
        <input
          type="text"
          placeholder="Enter the code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4 text-white"
        />

        <button
          type="submit"
          className="w-full bg-[#01eeff] text-[#1f2229] py-2 rounded hover:bg-[#01eeff]/60"
        >
          Login
        </button>
      </form>
    </div>
  );
}
