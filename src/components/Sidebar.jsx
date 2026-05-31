import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { getData } from "../utils/storage";

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
  ChevronDown,
  Plus,
  LogOut,
  UserPlus,
  MessageCircle,
  Map,
  Users,
  CalendarDays,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  const data = getData();
  const user = data.user || {};

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  };

  const links = [
    {
      name: "Home",
      path: "/dashboard",
      icon: <Home size={18} />,
    },
    {
      name: "Courses",
      path: "/subjects",
      icon: <BookOpen size={18} />,
    },
    {
      name: "AI Planner",
      path: "/planner",
      icon: <Sparkles size={18} />,
    },
    {
      name: "Study Roadmap",
      path: "/roadmap",
      icon: <Map size={18} />,
    },
    {
      name: "AI Doubt Solver",
      path: "/doubt-solver",
      icon: <MessageCircle size={18} />,
    },
    {
      name: "Assignments",
      path: "/tasks",
      icon: <CheckSquare size={18} />,
    },
    {
      name: "Focus Mode",
      path: "/focus",
      icon: <Timer size={18} />,
    },
    {
      name: "Flashcards",
      path: "/flashcards",
      icon: <Layers size={18} />,
    },
    {
      name: "Quiz Practice",
      path: "/quiz",
      icon: <Brain size={18} />,
    },
    {
      name: "Study Room",
      path: "/study-room",
      icon: <Users size={18} />,
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: <CalendarDays size={18} />,
    },
    {
      name: "Progress",
      path: "/progress",
      icon: <BarChart3 size={18} />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings size={18} />,
    },
  ];

  return (
    <aside className="sidebar">
      <div>
        <button
          className="workspace-btn"
          onClick={() => setWorkspaceOpen(!workspaceOpen)}
        >
          <span>🌿 PingPlan Workspace</span>
          <ChevronDown size={16} />
        </button>

        {workspaceOpen && (
          <div className="workspace-menu">
            <div className="workspace-profile">
              <div className="avatar">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "M"
                )}
              </div>

              <div>
                <b>{user.name || "Monika"}</b>

                <p>
                  {data.sharedMembers?.length || 1} Study Members
                </p>
              </div>
            </div>

            <button onClick={() => navigate("/settings")}>
              <Settings size={16} />
              Workspace Settings
            </button>

            <button onClick={() => navigate("/study-room")}>
              <UserPlus size={16} />
              Invite Members
            </button>

            <button onClick={() => navigate("/subjects")}>
              <Plus size={16} />
              New Course
            </button>

            <hr />

            <button onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}

        <nav className="nav">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive ? "active nav-item" : "nav-item"
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <b>🎯 Daily Goal</b>

          <p>
            {user.dailyGoal ||
              "Finish 2 hours of focused study"}
          </p>
        </div>

        <div className="sidebar-streak">
          🔥 Streak: {user.streak || 1} days
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;