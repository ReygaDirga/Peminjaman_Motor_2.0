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
    <div className="flex justify-center items-center min-h-screen bg-[#1f2229]">
      <form onSubmit={handleLogin} className="bg-[#1f2229] text-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4 text-center">Edit Data</h2>

        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

        <label className="block text-sm font-medium text-white mb-1">Student ID</label>
        <input
          type="text"
          placeholder="Enter Student ID Number"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
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
