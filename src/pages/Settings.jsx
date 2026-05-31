import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { getData, saveData, exportData } from "../utils/storage";

function Settings() {
  const [data, setData] = useState(getData());

  const user = data.user || {
    name: "Monika",
    mood: "😊",
    dailyGoal: "Finish 2 hours of study",
    theme: "light",
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", user.theme || "light");
  }, [user.theme]);

  const updateUser = (updates) => {
    const updated = {
      ...data,
      user: {
        ...user,
        ...updates,
      },
    };

    setData(updated);
    saveData(updated);
  };

  const toggleTheme = () => {
    const nextTheme = user.theme === "dark" ? "light" : "dark";

    document.body.setAttribute("data-theme", nextTheme);

    updateUser({
      theme: nextTheme,
    });
  };

  const uploadAvatar = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      updateUser({
        avatar: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <TopBar />

        <section className="page no-cover-page">
          <div className="page-icon normal-icon">⚙️</div>

          <h1 className="page-title normal-title">Settings</h1>

          <p className="page-subtitle normal-subtitle">
            Personalize your PingPlan workspace.
          </p>

          <div className="grid-2">
            <div className="card">
              <h3>Profile</h3>

              <div className="profile-row">
                <img
                  src={user.avatar || "https://ui-avatars.com/api/?name=Monika"}
                  alt="avatar"
                  className="profile-avatar"
                />

                <label className="btn-light">
                  Upload Avatar
                  <input hidden type="file" accept="image/*" onChange={uploadAvatar} />
                </label>
              </div>

              <input
                className="input"
                placeholder="Your name"
                value={user.name || ""}
                onChange={(e) => updateUser({ name: e.target.value })}
              />

              <input
                className="input"
                placeholder="Daily Goal"
                value={user.dailyGoal || ""}
                onChange={(e) => updateUser({ dailyGoal: e.target.value })}
              />
            </div>

            <div className="card">
              <h3>Appearance</h3>

              <p>
                Current Theme: <b>{user.theme || "light"}</b>
              </p>

              <button className="btn" onClick={toggleTheme}>
                {user.theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>

              <h3 style={{ marginTop: "24px" }}>Mood</h3>

              <div className="mood-row">
                {["😊", "😐", "😴", "🔥", "🥲"].map((mood) => (
                  <button
                    key={mood}
                    className={user.mood === mood ? "mood active-mood" : "mood"}
                    onClick={() => updateUser({ mood })}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Workspace</h3>

              <p>Courses: <b>{data.subjects?.length || 0}</b></p>
              <p>Shared Members: <b>{data.sharedMembers?.length || 0}</b></p>
              <p>Focus Sessions: <b>{data.focusSessions?.length || 0}</b></p>
            </div>

            <div className="card">
              <h3>Backup</h3>

              <button className="btn" onClick={exportData}>
                Export Workspace
              </button>

              <p style={{ marginTop: "16px" }}>
                Download all courses, notes, flashcards, quizzes and settings.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Settings;