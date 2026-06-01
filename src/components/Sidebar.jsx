import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import {
  Home,
  BookOpen,
  Sparkles,
  CheckSquare,
  Timer,
  Layers,
  Brain,
  BarChart3,
  Settings,
  LogOut,
  MessageCircle,
  Map,
  Users,
  CalendarDays,
  X,
} from "lucide-react";

function Sidebar({ mobileOpen = false, setMobileOpen = () => {} }) {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const links = [
    ["Home", "/dashboard", <Home size={18} />],
    ["Courses", "/subjects", <BookOpen size={18} />],
    ["AI Planner", "/planner", <Sparkles size={18} />],
    ["Study Roadmap", "/roadmap", <Map size={18} />],
    ["AI Doubt Solver", "/doubt-solver", <MessageCircle size={18} />],
    ["Assignments", "/tasks", <CheckSquare size={18} />],
    ["Focus Mode", "/focus", <Timer size={18} />],
    ["Flashcards", "/flashcards", <Layers size={18} />],
    ["Quiz Practice", "/quiz", <Brain size={18} />],
    ["Study Room", "/study-room", <Users size={18} />],
    ["Calendar", "/calendar", <CalendarDays size={18} />],
    ["Progress", "/progress", <BarChart3 size={18} />],
    ["Settings", "/settings", <Settings size={18} />],
  ];

  return (
    <>
      {mobileOpen && (
        <div className="mobile-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={mobileOpen ? "sidebar mobile-show" : "sidebar"}>
        <div className="sidebar-head">
          <h2>🌿 PingPlan</h2>

          <button className="mobile-close" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="nav">
          {links.map(([name, path, icon]) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              {icon}
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>

        <button className="logout-btn" onClick={logout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>
    </>
  );
}

export default Sidebar;