import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function CekPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [borrowData, setBorrowData] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [baseDate, setBaseDate] = useState(new Date());

  // detect mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // format yyyy-mm-dd
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // format HH:mm
  const formatTime = (time) => time?.slice(0, 5);

  // ambil 14 hari
  const getNext14Days = (date) => {
    const days = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(date);
      d.setDate(date.getDate() + i);
      days.push(d);
    }
    return days;
  };

  // fetch data
  const fetchBorrowData = async (dateObj) => {
    const start = new Date(dateObj);
    const end = new Date(dateObj);
    end.setDate(start.getDate() + 13);

    const { data, error } = await supabase
      .from("borrow_request")
      .select(`*, users(name, class)`)
      .gte("borrow_date", formatDate(start))
      .lte("borrow_date", formatDate(end))
      .order("borrow_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (!error) setBorrowData(data);
  };

  useEffect(() => {
    fetchBorrowData(baseDate);
  }, [baseDate]);

  // auto update hari
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date();
      if (today.toDateString() !== baseDate.toDateString()) {
        setBaseDate(today);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [selectedDate]);

  // grouping
  const groupByDate = (data) => {
    const grouped = {};
    data.forEach((item) => {
      if (!grouped[item.borrow_date]) {
        grouped[item.borrow_date] = [];
      }
      grouped[item.borrow_date].push(item);
    });
    return grouped;
  };

  const groupedData = groupByDate(borrowData);
  const days = getNext14Days(baseDate);

  return (
    <div className="min-h-screen bg-[#1f2229] text-white py-6 pt-24 px-4">
      <h1 className="text-center text-lg font-semibold mb-6">
        Borrowing Schedule
      </h1>

      {isMobile ? (
        <MobileView
          days={days}
          groupedData={groupedData}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          formatDate={formatDate}
          formatTime={formatTime}
        />
      ) : (
        <DesktopView
          days={days}
          groupedData={groupedData}
          formatDate={formatDate}
          formatTime={formatTime}
        />
      )}
    </div>
  );
}

function MobileView({
  days,
  groupedData,
  selectedDate,
  setSelectedDate,
  formatDate,
  formatTime,
}) {
  const selectedStr = formatDate(selectedDate);
  const dayData = groupedData[selectedStr] || [];

  const firstWeek = days.slice(0, 7);
  const secondWeek = days.slice(7, 14);

  return (
    <div className="max-w-md mx-auto">

      {/* DATE SELECTOR 2 BARIS */}
      <div className="flex flex-col gap-3 pb-4">

        {/* WEEK 1 */}
        <div className="grid grid-cols-7 gap-2">
          {firstWeek.map((date) => {
            const isActive =
              date.toDateString() === selectedDate.toDateString();

            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`py-2 rounded-xl transition border ${
                  isActive
                    ? "text-[#70F2FF] border-[#70F2FF]"
                    : "text-gray-300 border-white"
                }`}
              >
                <p className="text-[10px]">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <p className="text-sm font-bold">{date.getDate()}</p>
              </button>
            );
          })}
        </div>

        {/* WEEK 2 */}
        <div className="grid grid-cols-7 gap-2">
          {secondWeek.map((date) => {
            const isActive =
              date.toDateString() === selectedDate.toDateString();

            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`py-2 rounded-xl transition border ${
                  isActive
                    ? "text-[#70F2FF] border-[#70F2FF]"
                    : "text-gray-300 border-white"
                }`}
              >
                <p className="text-[10px]">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <p className="text-sm font-bold">{date.getDate()}</p>
              </button>
            );
          })}
        </div>

      </div>

      {/* EVENTS */}
      <div className="flex flex-col gap-3">
        {dayData.length === 0 ? (
          <p className="text-center text-gray-400">Available</p>
        ) : (
          dayData.map((item) => (
            <div
              key={item.id}
              className="bg-[#2a2f3a] p-4 rounded-2xl shadow"
            >
              <p className="text-sm text-[#70F2FF]">
                {formatTime(item.start_time)} -{" "}
                {formatTime(item.end_time)}
              </p>

              <p className="text-lg font-semibold">
                {item.users?.name}
              </p>

              <p className="text-sm text-gray-400">
                {item.users?.name === "Admin"
                  ? item.reason
                  : item.users?.class}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function DesktopView({ days, groupedData, formatDate, formatTime }) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-7 gap-4">
        {days.map((date) => {
          const dateStr = formatDate(date);
          const dayData = groupedData[dateStr] || [];

          return (
            <div key={dateStr} className="p-2 h-[220px] flex flex-col">
              <h3 className="text-xs text-center border-b border-gray-600 pb-1">
                {date.toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </h3>

              <div className="flex flex-col gap-2 flex-1 overflow-y-auto no-scrollbar">
                {dayData.length === 0 ? (
                  <p className="text-gray-500 text-xs text-center">
                    Available
                  </p>
                ) : (
                  dayData.map((item) => (
                    <div key={item.id} className="p-2 border text-[10px]">
                      <p className="text-[#70F2FF]">
                        {formatTime(item.start_time)} -{" "}
                        {formatTime(item.end_time)}
                      </p>
                      <p>{item.users?.name}</p>
                      <p className="text-[9px]">
                        {item.users?.name === "Admin"
                          ? item.reason
                          : item.users?.class}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}