// src/pages/GenerateVoucherPage.jsx
import { useState } from "react";
import { supabase } from "../lib/supabase";

/* ----------------------------------------------------------
   UI Component
---------------------------------------------------------- */
function CodeBox({ code, onCopy, tone = "gold" }) {
  const toneStyle =
    tone === "gold"
      ? "border-yellow-300 bg-yellow-50 text-yellow-800"
      : "border-slate-300 bg-slate-50 text-slate-700";

  return (
    <div className={`flex items-center justify-between gap-2 rounded-xl border ${toneStyle} px-3 py-2`}>
      <span className="font-semibold tracking-wide tabular-nums font-mono">{code}</span>
      <button
        onClick={onCopy}
        className="text-sm px-3 py-1 rounded-lg border hover:bg-white transition"
      >
        Copy
      </button>
    </div>
  );
}

/* ----------------------------------------------------------
   Helpers (RNG, generator, safe insert)
---------------------------------------------------------- */

// RNG yang bener (hindarin Math.random kek jaman batu)
const randomId = (len = 8) => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
  const buf = new Uint8Array(len);
  crypto.getRandomValues(buf);
  return Array.from(buf, (v) => alphabet[v % alphabet.length]).join("");
};

const genCode = (prefix, len = 8) => `${prefix}-${randomId(len)}`;

// insert + retry kalau duplicate
const insertVoucherWithRetry = async (table, prefix, len = 8, maxTry = 8) => {
  let lastErr = null;

  for (let i = 0; i < maxTry; i++) {
    const code = genCode(prefix, len);

    const { data, error } = await supabase
      .from(table)
      .insert([{ code }])
      .select()
      .single();

    if (!error) return { code: data.code }; // sukses

    // duplicate unique key
    if (error.code === "23505") {
      lastErr = error;
      continue;
    }

    // error type yang bikin gagal total (kayak struktur tabel rusak)
    throw error;
  }

  throw lastErr || new Error("Gagal generate voucher setelah beberapa percobaan.");
};

/* ----------------------------------------------------------
   Main Page
---------------------------------------------------------- */

export default function GenerateVoucherPage() {
  const [loading, setLoading] = useState(null);
  const [aurCode, setAurCode] = useState("");
  const [pltCode, setPltCode] = useState("");

  const copy = (text) => navigator.clipboard.writeText(text);

  const handleGenerateAurum = async () => {
    try {
      setLoading("aur");
      const { code } = await insertVoucherWithRetry("vouchers", "AUR", 8);
      setAurCode(code);
    } catch (e) {
      console.error("AUR ERROR:", e);
      alert("Gagal generate voucher Aurum");
    } finally {
      setLoading(null);
    }
  };

  const handleGeneratePlatina = async () => {
    try {
      setLoading("plt");
      const { code } = await insertVoucherWithRetry("vouchersFD", "PLT", 8);
      setPltCode(code);
    } catch (e) {
      console.error("PLT ERROR:", e);
      alert("Gagal generate voucher Platina");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center">
      <div className="container mx-auto px-4">
        <div className="mx-auto w-full max-w-2xl">

          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">
              🎟️ Generate Voucher
            </h1>
          </div>

          <div className="bg-white/90 shadow rounded-2xl p-8 border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Aurum */}
              <section className="flex flex-col gap-3">
                <h2 className="text-lg font-medium text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 ring-2 ring-yellow-200"></span>
                  Aurum Access
                  <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                    5h
                  </span>
                </h2>

                <button
                  onClick={handleGenerateAurum}
                  disabled={loading === "aur"}
                  className={`w-full py-3 rounded-xl text-slate-900 font-medium transition
                    ${loading === "aur"
                      ? "bg-yellow-200 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500"}
                  `}
                >
                  {loading === "aur" ? "Generating…" : "Generate Aurum Voucher"}
                </button>

                {aurCode && <CodeBox code={aurCode} onCopy={() => copy(aurCode)} />}
              </section>

              {/* Platina */}
              <section className="flex flex-col gap-3">
                <h2 className="text-lg font-medium text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 ring-2 ring-slate-200"></span>
                  Platina Access
                  <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Full Day
                  </span>
                </h2>

                <button
                  onClick={handleGeneratePlatina}
                  disabled={loading === "plt"}
                  className={`w-full py-3 rounded-xl text-white font-medium transition
                    ${loading === "plt"
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-700 hover:to-slate-600"}
                  `}
                >
                  {loading === "plt" ? "Generating…" : "Generate Platina Voucher"}
                </button>

                {pltCode && <CodeBox code={pltCode} onCopy={() => copy(pltCode)} tone="silver" />}
              </section>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
