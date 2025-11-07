import { useNavigate } from "react-router-dom";

export default function PeraturanPage() {
  const navigate = useNavigate();

  const handleAgree = () => {
    localStorage.setItem("agreedToRules", "true");
    navigate("/form");
  };

  return (
    <div className="flex items-center justify-center px-6">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-10">
        <h1 className="text-2xl font-bold text-center mb-8">
          📌 Aturan Peminjaman Motor Kelas PPTI 21
        </h1>

        <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-8 text-base leading-relaxed">
          <li>Motor disiapkan untuk mendukung aktivitas <b>PPTI 21</b>.</li>
          <li>Selain kelas PPTI 21 peminjaman motor dilakukan dengan sistem sewa.</li>
          <li>
            Batas waktu pemakaian:
            <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
              <li>
                Kelas PPTI 21 → Gratis <b>4 jam per orang per hari</b>. Lebih dari itu akan dikenakan
                denda Rp10.000/jam.
              </li>
              <li>
                Selain PPTI 21 → maksimal <b>3 jam per orang per hari</b> (Rp7.000/jam).
              </li>
              <li>
                Kepanitiaan → maksimal <b>5 jam per hari</b> (gratis) bisa lebih jika sudah
                mendapat izin.
              </li>
            </ul>
          </li>
          <li>
            Di luar kelas PPTI 21 jika penggunaan &lt; 1 jam atau hanya untuk beli makan, maka
            tidak dikenakan biaya sewa.
          </li>
          <li>
            Penggunaan/Peminjaman motor lebih dari batas waktu yang telah ditentukan maka{" "}
            <b>TIDAK DIIZINKAN</b>.
          </li>
          <li>Semua uang sewa akan masuk ke kas kelas.</li>
          <li>Bensin menjadi tanggung jawab masing masing dari peminjam.</li>
          <li>Setelah peminjaman selesai, kunci motor harap diletakkan di laci motor, <b>JANGAN DIBAWA</b> kecuali ada permintaan dari pemilik motor</li>
        </ol>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Cek Ketersediaan
          </button>
          <button
            onClick={handleAgree}
            className="px-4 py-2 bg-[#6077ba] text-white rounded hover:bg-indigo-500 transition"
          >
            Saya Setuju
          </button>
        </div>
      </div>
    </div>
  );
}
