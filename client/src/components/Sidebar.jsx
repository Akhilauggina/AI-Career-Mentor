import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  ClipboardList,
  Bot,
  LogOut
} from "lucide-react";

const Sidebar = () => {

  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20}/> },
    { name: "Profile", path: "/profile", icon: <User size={20}/> },
    { name: "Resume", path: "/resume", icon: <FileText size={20}/> },
    { name: "Jobs", path: "/jobs", icon: <Briefcase size={20}/> },
    { name: "Applications", path: "/applications", icon: <ClipboardList size={20}/> },
    { name: "AI Mentor", path: "/ai", icon: <Bot size={20}/> }
  ];

  return (

    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col">

      <h1 className="text-2xl font-bold p-6">
        Career Mentor
      </h1>

      <nav className="flex-1">

        {menu.map((item) => (

          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-slate-700 ${
              location.pathname === item.path
                ? "bg-slate-700"
                : ""
            }`}
          >

            {item.icon}

            {item.name}

          </Link>

        ))}

      </nav>

      <button
        className="flex items-center gap-3 px-6 py-4 hover:bg-red-600"
      >

        <LogOut size={20}/>

        Logout

      </button>

    </div>

  );

};

export default Sidebar;