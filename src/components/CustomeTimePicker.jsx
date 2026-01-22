import { useEffect, useRef, useState } from "react";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

const polarToXY = (angle, radius) => ({
  x: radius * Math.cos(angle),
  y: radius * Math.sin(angle),
});

export default function AnalogTimePicker({
  value,
  onChange,
  onClose,
  clockImage,
}) {
  const [step, setStep] = useState("hour");
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);

  useEffect(() => {
    if (!value) return;
    const [h, m] = value.split(":").map(Number);
    setHour(h);
    setMinute(m);
  }, [value]);

  const confirm = () => {
    const hh = String(hour).padStart(2, "0");
    const mm = String(minute).padStart(2, "0");
    onChange(`${hh}:${mm}`);
    onClose();
  };


  const radius = 110;
  const center = 120;

  const renderNumbers = (items, onSelect) =>
    items.map((n, i) => {
      const angle = (Math.PI * 2 * i) / items.length - Math.PI / 2;
      const { x, y } = polarToXY(angle, radius);
      return (
        <button
          key={n}
          onClick={() => onSelect(n)}
          className="absolute w-8 h-8 rounded-full text-sm
           text-white hover:bg-[#01eeff] hover:text-[#1f2229]"
          style={{
            left: center + x - 16,
            top: center + y - 16,
          }}
        >
          {n}
        </button>
      );
    });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-[300px] rounded-xl bg-[#1f2229] overflow-hidden">
        <div className="bg-[#01eeff]/50 text-[#1f2229] text-center py-4">
          <div className="text-4xl font-semibold">
            {String(hour).padStart(2, "0")}:
            {String(minute).padStart(2, "0")}
          </div>
        </div>

        <div className="relative flex justify-center py-6">
          <div
            className="relative w-[240px] h-[240px] rounded-full bg-transparent text-white"
            style={{
              backgroundImage: clockImage ? `url(${clockImage})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {step === "hour"
              ? renderNumbers(HOURS, (h) => {
                  setHour(h);
                  setStep("minute");
                })
              : renderNumbers(MINUTES, setMinute)}
          </div>
        </div>

        <div className="flex justify-between px-4 py-3">
          <button onClick={onClose} className="text-[#01eeff]">
            CLOSE
          </button>
          <button onClick={confirm} className="text-[#01eeff] font-semibold">
            SET
          </button>
        </div>
      </div>
    </div>
  );
}
