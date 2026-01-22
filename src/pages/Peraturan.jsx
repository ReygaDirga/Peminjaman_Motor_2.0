import { useNavigate } from "react-router-dom";

export default function PeraturanPage() {
  const navigate = useNavigate();

  const handleAgree = () => {
    localStorage.setItem("agreedToRules", "true");
    navigate("/form");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-15 bg-[#1f2229]">
      <div className="bg-[#1f2229] text-white rounded-lg shadow-xl max-w-4xl w-full p-10">
        <h1 className="text-2xl font-bold text-center mb-8">
          📌 Borrowing Rules PPTI 21
        </h1>

        <ol className="list-decimal list-inside space-y-3 text-white mb-8 text-base leading-relaxed">
          <li>Motorcycles are provided to support <b>PPTI 21</b> activities.</li>
          <li>Outside PPTI 21, borrowing is subject to a rental system.</li>
          <li>
            Usage time limits:
            <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
              <li>
                PPTI 21 → Free <b>4 hours per person per day</b>. More than that will be charged Rp15.000/hour.
              </li>
              <li>
                Non-PPTI 21 → Maximum <b>3 hours per person per day</b> (Rp7.000/hour).
              </li>
              <li>
                Committee Members → Maximum <b>5 hours per day</b> (free, but only with prior approval).
              </li>
            </ul>
          </li>
          <li>
            For non-PPTI 21 usage less than 1 hour or only for buying food, no rental fee will be charged.
          </li>
          <li>
            Using the motorcycle longer than the allowed time is{" "}
            <b>NOT PERMITTED</b>, unless prior approval has been granted by the Komti.
          </li>
          <li>All rental funds will go to the class treasury.</li>
          <li>Fuel is the responsibility of the borrower.</li>
          <li>After returning the motorcycle, please leave the key in the motorcycle compartment. <b>DO NOT TAKE IT</b>, unless specifically requested by the owner.</li>
        </ol>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-[#01eeff]/50 rounded hover:bg-[#01eeff]/30 transition"
          >
            Check Availability
          </button>
          <button
            onClick={handleAgree}
            className="px-4 py-2 bg-[#01eeff] text-[#1f2229] rounded hover:bg-[#01eeff]/60 transition"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
}
