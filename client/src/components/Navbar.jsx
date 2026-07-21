import { Menu, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { getInitials } from "../utils/helpers";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/profile": "Profile",
  "/resume": "Resume",
  "/jobs": "Jobs",
  "/applications": "Applications",
  "/ai": "AI Mentor",
};

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-500 hover:text-slate-900 transition-colors"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative text-slate-500 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-100">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
            {getInitials(user?.name || "User")}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-800 leading-tight">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-slate-500 leading-tight">
              {user?.email || ""}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
