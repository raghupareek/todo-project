// components/Navbar.jsx
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-white shadow px-6 py-3 flex justify-between">
        <div className="flex gap-4">
          <Link to="/home" className="font-medium text-blue-600">
            Home
          </Link>
          <Link to="/todos" className="font-medium text-blue-600">
            Todos
          </Link>
        </div>

        <button onClick={handleLogout} className="text-red-500 font-medium">
          Logout
        </button>
      </nav>

      {/* 🔥 REQUIRED FOR NESTED ROUTES */}
      <Outlet />
    </>
  );
}
