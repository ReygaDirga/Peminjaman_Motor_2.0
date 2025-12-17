import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ModalBerhasil from "../components/ModalBerhasil";
import ModalBentrok from "../components/ModalBentrok";
import { sendTelegramMessage } from "../lib/telegram";

const addHours = (timeStr, hours) => {
  const d = new Date(`1970-01-01T${timeStr}`);
  d.setHours(d.getHours() + hours);
  return d.toTimeString().slice(0, 5);
};

const parseVoucherType = (raw) => {
  if (!raw) return null;
  const code = raw.trim().toUpperCase();
  const match = code.match(/^[A-Z]{3}-[A-Z0-9]{6,10}$/);
  if (!match) return null;
  const prefix = code.split("-")[0];
  if (prefix === "AUR" || prefix === "VCH") return { type: "aurum", code };
  if (prefix === "PLT") return { type: "platina", code };
  return { type: "unknown", code };
};

const checkVoucher = async (rawCode) => {
  const info = parseVoucherType(rawCode);
  if (!info) return { valid: false };

  const table =
    info.type === "aurum"
      ? "vouchers"
      : info.type === "platina"
      ? "vouchersFD"
      : null;
  if (!table) return { valid: false };

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("code", info.code)
    .eq("is_used", false)
    .maybeSingle();

  if (data && !error)
    return { valid: true, type: info.type, table, code: info.code };
  return { valid: false };
};

export default function FormPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [voucherList, setVoucherList] = useState([]);

  useEffect(() => {
    const agreed = localStorage.getItem("agreedToRules");
    if (agreed !== "true") navigate("/peraturan");

    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("id, name, class");
      if (!error) setUsers(data);
    };

    const fetchVouchers = async () => {
      const [{ data: aurum }, { data: platina }] = await Promise.all([
        supabase.from("vouchers").select("code").eq("is_used", false),
        supabase.from("vouchersFD").select("code").eq("is_used", false),
      ]);

      const formatted = [
        ...(aurum?.map((v) => ({ code: v.code, type: "Aurum" })) || []),
        ...(platina?.map((v) => ({ code: v.code, type: "Platina" })) || []),
      ];

      setVoucherList(formatted);
    };

    fetchUsers();
    fetchVouchers();
  }, [navigate]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setSelectedName(value);
    if (!value.trim()) return setFilteredUsers([]);
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
    setLoading(true);
    const newErrors = {};

    const tanggal = e.target.hari.value;
    const jamMulai = e.target.jamMulai.value;
    const jamSelesai = e.target.jamSelesai.value;
    const alasan = e.target.alasan.value.trim();
    const stnk = e.target.stnk.value;

    if (!selectedName) newErrors.nama = "Borrower name is required";
    if (!tanggal) newErrors.hari = "Borrowing date is required";
    if (!jamMulai) newErrors.jamMulai = "Start time is required";
    if (!jamSelesai) newErrors.jamSelesai = "End time is required";
    if (!alasan) newErrors.alasan = "Reason or voucher code is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const voucherCheck = await checkVoucher(alasan);
      const isVoucherValid = voucherCheck.valid;

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("name", selectedName)
        .single();

      if (userError || !userData) {
        newErrors.nama = "Borrower name not found";
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      const userId = userData.id;
      let finalEndTime = jamSelesai;

      if (isVoucherValid) {
        if (voucherCheck.type === "aurum") {
          finalEndTime = addHours(jamMulai, 5);
        } else if (voucherCheck.type === "platina") {
          finalEndTime = addHours(jamMulai, 20);
        }
      }

      const { data: existingByUser } = await supabase
        .from("borrow_request")
        .select("start_time, end_time")
        .eq("borrow_date", tanggal)
        .eq("users_id", userId);

      let totalHours = 0;
      existingByUser?.forEach((b) => {
        const s = new Date(`1970-01-01T${b.start_time}`);
        const e = new Date(`1970-01-01T${b.end_time}`);
        totalHours += (e - s) / (1000 * 60 * 60);
      });

      const sNew = new Date(`1970-01-01T${jamMulai}`);
      const eNew = new Date(`1970-01-01T${finalEndTime}`);
      const durationNew = (eNew - sNew) / (1000 * 60 * 60);

      if (totalHours + durationNew > 4 && !isVoucherValid) {
        newErrors.jamSelesai = `Total duration today ${totalHours + durationNew} hours (max 4 hours without a voucher)`;
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      const { data: existingBookings } = await supabase
        .from("borrow_request")
        .select("start_time, end_time")
        .eq("borrow_date", tanggal);

      const toDate = (t) => new Date(`1970-01-01T${t}`);
      for (const booking of existingBookings || []) {
        const isOverlap =
          toDate(jamMulai) < toDate(booking.end_time) &&
          toDate(finalEndTime) > toDate(booking.start_time);

        if (isOverlap) {
          newErrors.jamMulai = `Conflicts with another booking (${booking.start_time} - ${booking.end_time})`;
          setErrors(newErrors);
          setLoading(false);
          return;
        }
      }

      const { error: insertError } = await supabase.from("borrow_request").insert([
        {
          users_id: userId,
          borrow_date: tanggal,
          start_time: jamMulai,
          end_time: finalEndTime,
          reason: alasan,
          need_stnk: stnk === "yes",
        },
      ]);

      if (insertError) {
        newErrors.global = "Failed to save data, please try again.";
        setErrors(newErrors);
      } else {
        if (isVoucherValid) {
          await supabase
            .from(voucherCheck.table)
            .update({ is_used: true })
            .eq("code", voucherCheck.code);
        }

        setShowModal(true);
        setErrors({});
        e.target.reset();
        setSelectedName("");
        setSelectedClass("");

      const message = `
      📋 *New Motorcycle Borrowing Request!*
      ===========================
      👤 *Name:* ${selectedName}
      🏫 *Class:* ${selectedClass}
      📅 *Date:* ${tanggal}
      🕒 *Time:* ${jamMulai} - ${finalEndTime}
      📄 *Reason / Code:* ${alasan}
      🪪 *Need STNK:* ${stnk === "ya" ? "Yes" : "No"}
      ${isVoucherValid ? `🎟 *Voucher:* ${voucherCheck.type.toUpperCase()} (${voucherCheck.code})` : ""}
`      ;
        sendTelegramMessage(message).catch(console.error);
      }
    } catch (err) {
      newErrors.global = "Unexpected error occurred.";
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-6 pt-20">
      <form
        className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-semibold text-gray-900">
          Motorcycle Borrowing Form PPTI 21
        </h2>

        <div className="mt-6 relative">
          <label className="block text-sm font-medium text-gray-900">
            Borrower Name
          </label>
          <input
            id="nama"
            name="nama"
            type="text"
            value={selectedName}
            onChange={handleNameChange}
            autoComplete="off"
            placeholder="Type your name…"
            className={`mt-2 block w-full rounded-md border px-3 py-2 sm:text-sm ${
              errors.nama ? "border-red-500" : "border-gray-300"
            }`}
          />
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
          {errors.nama && (
            <p className="mt-1 text-sm text-red-600">{errors.nama}</p>
          )}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-900">Class</label>
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
          <label className="block text-sm font-medium text-gray-900">
            Borrowing Date
          </label>
          <input
            id="hari"
            name="hari"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            max={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]}
            onChange={(e) => {
              const value = e.target.value;
              const date = new Date(value);
              const day = date.getDate();

              const blockedDays = [21,22,23,24,25,26,27,28,29,30,31,1,2,3,4];

              if (blockedDays.includes(day)) {
                e.target.value = "";
                setErrors((prev) => ({
                  ...prev,
                  hari: "Happy holidays!",
                }));
              } else {
                setErrors((prev) => {
                  const n = { ...prev };
                  delete n.hari;
                  return n;
                });
              }
            }}
            className={`mt-2 block w-full rounded-md border px-3 py-2 sm:text-sm ${
              errors.hari ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.hari && (
            <p className="mt-1 text-sm text-red-600">{errors.hari}</p>
          )}
        </div>

        <div className="mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-900">Start Time</label>
            <input
              id="jamMulai"
              name="jamMulai"
              type="time"
              className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 sm:text-sm"
            />
          </div>
          {errors.jamMulai && <p className="mt-1 text-sm text-red-600">{errors.jamMulai}</p>}
        </div>

        <div className="mt-6">
         <div>
            <label className="block text-sm font-medium text-gray-900">End Time</label>
            <input
              id="jamSelesai"
              name="jamSelesai"
              type="time"
              className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 sm:text-sm"
            />
          </div>
          {errors.jamSelesai && <p className="mt-1 text-sm text-red-600">{errors.jamSelesai}</p>}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-900">
            Reason
          </label>
          <textarea
            id="alasan"
            name="alasan"
            rows="3"
            placeholder="Write the reason"
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 sm:text-sm"
          ></textarea>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-900">
            Voucher
          </label>
          {voucherList.length > 0 ? (
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val !== "") {
                  document.getElementById("alasan").value = val;
                }
              }}
              className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 sm:text-sm"
            >
              <option value="">Select Vouchers</option>
              {voucherList.map((v, i) => (
                <option key={i} value={v.code}>
                  {v.type} - {v.code}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-400 text-sm mt-2">
              No active vouchers available at the moment.
            </p>
          )}

          <button
            type="button"
            onClick={async () => {
              const [{ data: aurum }, { data: platina }] = await Promise.all([
                supabase.from("vouchers").select("code").eq("is_used", false),
                supabase.from("vouchersFD").select("code").eq("is_used", false),
              ]);
              const formatted = [
                ...(aurum?.map((v) => ({ code: v.code, type: "Aurum" })) || []),
                ...(platina?.map((v) => ({ code: v.code, type: "Platina" })) || []),
              ];
              setVoucherList(formatted);
            }}
            className="mt-2 text-sm text-indigo-600 hover:underline"
          >
            Refresh Voucher
          </button>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-900">STNK</label>
          <select
            id="stnk"
            name="stnk"
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 sm:text-sm"
          >
            <option value="">Select</option>
            <option value="ya">Yes</option>
            <option value="tidak">No</option>
          </select>
        </div>

        <div className="mt-8 flex items-center justify-end gap-x-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm font-semibold text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      <ModalBerhasil isOpen={showModal} onClose={() => setShowModal(false)} />
      <ModalBentrok
        isOpen={false}
        onClose={() => {}}
        conflictInfo={""}
      />
    </div>
  );
}
