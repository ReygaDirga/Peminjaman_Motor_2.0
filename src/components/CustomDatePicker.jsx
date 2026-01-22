import { useEffect, useRef, useState } from "react";

export default function CustomDatePicker({
  value,
  onChange,
  error,
  maxDays = 14,
}) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(value || new Date());
  const wrapperRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const isDisabled = (date) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setDate(start.getDate() + maxDays);
    end.setHours(23, 59, 59, 999);

    return date < start || date > end;
  };

  const isSelected = (date) =>
    value && date.toDateString() === value.toDateString();

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };


  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        readOnly
        value={value ? formatDate(value) : ""}
        placeholder="Select date"
        onClick={() => setOpen((o) => !o)}
        className={`mt-2 w-full rounded-md px-3 py-2 bg-[#1f2229] text-white border sm:text-sm
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          ${error ? "border-red-500" : "border-gray-300"}`}
      />

      {open && (
        <div className="absolute z-30 mt-2 w-72 rounded-lg border border-gray-700 bg-[#1f2229] p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrent(new Date(year, month - 1, 1))}
              className="text-gray-300 hover:text-white"
            >
              ◀
            </button>
            <span className="font-semibold text-white">
              {current.toLocaleString("en-US", {
                month: "long",
              })}{" "}
              {year}
            </span>
            <button
              type="button"
              onClick={() => setCurrent(new Date(year, month + 1, 1))}
              className="text-gray-300 hover:text-white"
            >
              ▶
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-sm">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(year, month, day);
              const disabled = isDisabled(date);
              const selected = isSelected(date);

              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(date);
                    setOpen(false);
                  }}
                  className={`rounded-md py-1.5 text-center transition
                    ${
                      selected
                        ? "bg-[#01eeff] text-[#1f2229] font-semibold"
                        : disabled
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-white hover:bg-[#01eeff]/20"
                    }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
