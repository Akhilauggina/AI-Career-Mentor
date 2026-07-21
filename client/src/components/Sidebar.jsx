import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  ClipboardList,
  Bot,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Resume", path: "/resume", icon: FileText },
  { name: "Jobs", path: "/jobs", icon: Briefcase },
  { name: "Applications", path: "/applications", icon: ClipboardList },
  { name: "AI Mentor", path: "/ai", icon: Bot },
];

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { addToast } = useToast();

  const handleLogout = () => {
    logout();
    addToast("Logged out successfully", "info");
    navigate("/login");
  };

  return (
    <div className="w-64 h-full bg-slate-900 text-white flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">CareerMentor</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-slate-700">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-slate-800">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.name}</p>
              <p className="text-slate-400 text-xs truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-all duration-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
