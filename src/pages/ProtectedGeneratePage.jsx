import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenerateVoucherPage from "./GenerateVoucherPage";

export default function ProtectedGeneratePage() {
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("adminName");

    if (!role || role !== "admin" || !name) {
      navigate("/login");
    } else {
      setAuthorized(true);
    }
  }, [navigate]);

  if (!authorized) {
    return <div className="text-center mt-10 text-gray-500">Memeriksa akses...</div>;
  }

  return <GenerateVoucherPage />;
}
