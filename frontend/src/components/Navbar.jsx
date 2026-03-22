import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <h1
          onClick={() => navigate("/dashboard")}
          className="text-lg font-bold text-blue-600 cursor-pointer"
        >
          Mini CRM
        </h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate("/leads")}
          className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          Leads
        </button>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          {admin?.name}
        </span>
        <button
          onClick={handleLogout}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;