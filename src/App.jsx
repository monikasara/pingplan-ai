import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import SubjectPage from "./pages/SubjectPage";
import Planner from "./pages/Planner";
import Tasks from "./pages/Tasks";
import Focus from "./pages/Focus";
import Flashcards from "./pages/Flashcards";
import Quiz from "./pages/Quiz";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import DoubtSolver from "./pages/DoubtSolver";
import Roadmap from "./pages/Roadmap";
import StudyRoom from "./pages/StudyRoom";
import CalendarPage from "./pages/CalendarPage";

function PrivatePage({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function App() {
  useEffect(() => {
    const saved = localStorage.getItem("pingplan_data");

    if (saved) {
      const data = JSON.parse(saved);
      const theme = data?.user?.theme || "light";
      document.body.setAttribute("data-theme", theme);
    } else {
      document.body.setAttribute("data-theme", "light");
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<PrivatePage><Dashboard /></PrivatePage>} />
        <Route path="/subjects" element={<PrivatePage><Subjects /></PrivatePage>} />
        <Route path="/subjects/:id" element={<PrivatePage><SubjectPage /></PrivatePage>} />
        <Route path="/planner" element={<PrivatePage><Planner /></PrivatePage>} />
        <Route path="/roadmap" element={<PrivatePage><Roadmap /></PrivatePage>} />
        <Route path="/doubt-solver" element={<PrivatePage><DoubtSolver /></PrivatePage>} />
        <Route path="/tasks" element={<PrivatePage><Tasks /></PrivatePage>} />
        <Route path="/focus" element={<PrivatePage><Focus /></PrivatePage>} />
        <Route path="/flashcards" element={<PrivatePage><Flashcards /></PrivatePage>} />
        <Route path="/quiz" element={<PrivatePage><Quiz /></PrivatePage>} />
        <Route path="/study-room" element={<PrivatePage><StudyRoom /></PrivatePage>} />
        <Route path="/calendar" element={<PrivatePage><CalendarPage /></PrivatePage>} />
        <Route path="/progress" element={<PrivatePage><Progress /></PrivatePage>} />
        <Route path="/settings" element={<PrivatePage><Settings /></PrivatePage>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;