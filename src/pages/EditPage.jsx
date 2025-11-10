import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { data: user, } = await supabase
      .from("users")
      .select("id, name, nim")
      .eq("nim", code)
      .single();

    

    localStorage.setItem("Name", user.name);
    localStorage.setItem("ID", user.id);
    localStorage.setItem("NIM", user.nim);

    navigate("/rud");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4 text-center">Edit Data</h2>

        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

        <label className="block text-sm font-medium text-gray-700 mb-1">NIM</label>
        <input
          type="text"
          placeholder="Masukkan NIM"
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
