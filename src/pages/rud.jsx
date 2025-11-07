import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tableeee from "./crudtableusers";

export default function ProtectedGeneratePage() {
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("ID");
    const _name = localStorage.getItem("Name");

    if (!id) {
      navigate("/edit");
    } else {
      setAuthorized(true);
    }
  }, [navigate]);

  if (!authorized) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Memeriksa akses...
      </div>
    );
  }

  return <Tableeee />;
}
