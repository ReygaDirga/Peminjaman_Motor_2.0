import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomDatePicker from "../components/CustomDatePicker";

export default function CekPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [borrowData, setBorrowData] = useState([]);
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const fetchBorrowData = async (dateObj) => {
  const dateStr = formatDate(dateObj);

  const { data, error } = await supabase
    .from("borrow_request")
    .select(`*, users(name, class)`)
    .eq("borrow_date", dateStr)
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetch:", error);
  } else {
    setBorrowData(data);
  }
};

  useEffect(() => {
    fetchBorrowData(selectedDate);
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-[#1f2229] text-white py-4 pt-25">
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="tanggal" className="font-medium whitespace-nowrap">
            Select Date
          </label>

          <CustomDatePicker
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {borrowData.length === 0 ? (
          <p className="text-center text-gray-500">
            No bookings found for{" "}
            <span className="font-semibold">
              {new Date(selectedDate).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            .
          </p>
        ) : (
          <table className="w-full table-fixed border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-[#1f2229]">
                <th className="border p-2 w-[40px]">Start</th>
                <th className="border p-2 w-[40px]">End</th>
                <th className="border p-2 w-[90px]">Name</th>
                <th className="border p-2 w-[50px]">Class / Reason</th>
              </tr>
            </thead>
            <tbody>
              {borrowData.map((row) => (
                <tr key={row.id}>
                  <td className="border p-2 w-[50px]">{row.start_time}</td>
                  <td className="border p-2 w-[50px]">{row.end_time}</td>
                  <td className="border p-2 w-[100px]">{row.users?.name}</td>
                  <td className="border p-2 w-[50px]">
                    {row.users?.name == "Admin" ? row.reason : row.users?.class}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}