import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function GenerateVoucherPage() {
  const [voucher, setVoucher] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const code = "VCH-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const { error } = await supabase.from("vouchers").insert([{ code }]);
    if (error) alert("Gagal generate voucher");
    else setVoucher(code);

    setLoading(false);
  };

  return (
    <div className="flex justify-center p-8">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">🎟️ Generate Voucher</h2>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full py-2 rounded-md text-white ${
            loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-500"
          }`}
        >
          {loading ? "Generating..." : "Generate Voucher"}
        </button>
        {voucher && (
          <p className="mt-4 text-green-600 font-semibold text-center">
            Voucher Code: <span className="bg-green-100 px-2 py-1 rounded">{voucher}</span>
          </p>
        )}
      </div>
    </div>
  );
}
