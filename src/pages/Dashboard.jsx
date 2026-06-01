import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { getSyncedData, saveData } from "../utils/storage";

function Dashboard() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadWorkspace() {
      const synced = await getSyncedData();
      setData(synced);
    }

    loadWorkspace();
  }, []);

  if (!data) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>Loading your workspace...</h2>
        </div>
      </div>
    );
  }

  const currentUser = auth.currentUser;
  const user = data.user || {};
  const subjects = data.subjects || [];
  const focusSessions = data.focusSessions || [];

  const totalTasks = subjects.reduce(
    (sum, subject) => sum + (subject.tasks?.length || 0),
    0
  );

  const completedTasks = subjects.reduce(
    (sum, subject) =>
      sum + (subject.tasks || []).filter((task) => task.done).length,
    0
  );

  const totalFocusMinutes = focusSessions.reduce(
    (sum, session) => sum + Number(session.minutes || 0),
    0
  );

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

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      updateUser({
        homeCover: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="main">
        <TopBar
          search={search}
          setSearch={setSearch}
          setMobileOpen={setMobileOpen}
        />

        <div
          className="cover subject-cover"
          style={{
            backgroundImage: user.homeCover
              ? `url(${user.homeCover})`
              : "linear-gradient(120deg, #dfffd6, #fff2a8, #d8f5ff)",
          }}
        >
          <label className="cover-upload-btn">
            Change Cover
            <input type="file" accept="image/*" onChange={handleCoverUpload} />
          </label>
        </div>

        <section className="page">
          <div className="profile-card">
            <div className="profile-avatar-big">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="profile" />
              ) : (
                currentUser?.displayName?.charAt(0)?.toUpperCase() ||
                user.name?.charAt(0)?.toUpperCase() ||
                "M"
              )}
            </div>

            <div>
              <h1 className="page-title">
                Welcome, {currentUser?.displayName || user.name || "Student"} 👋
              </h1>

              <p className="page-subtitle">
                {currentUser?.email || "Your AI study workspace is ready."}
              </p>
            </div>
          </div>

          <p className="page-subtitle">
            Your calm AI study workspace is ready. Plan, focus, revise, and grow
            one step at a time.
          </p>

          <div className="dashboard-widgets">
            <div className="mini-card">
              <h3>🔥 Study Streak</h3>
              <p>{user.streak || 1} days</p>
            </div>

            <div className="mini-card">
              <h3>🎯 Daily Goal</h3>
              <p>{user.dailyGoal || "Finish 2 hours of focused study"}</p>
            </div>

            <div className="mini-card">
              <h3>✅ Tasks</h3>
              <p>
                {completedTasks}/{totalTasks}
              </p>
            </div>

            <div className="mini-card">
              <h3>⏱ Focus Time</h3>
              <p>{totalFocusMinutes} mins</p>
            </div>
          </div>

          <h2 className="section-title">How are you feeling today?</h2>

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

          <h2 className="section-title">Quick Note</h2>

          <div className="card">
            <textarea
              className="textarea"
              placeholder="Write a quick reminder, thought, or study note..."
              value={user.quickNote || ""}
              onChange={(e) => updateUser({ quickNote: e.target.value })}
            />
          </div>

          <h2 className="section-title">Your Courses</h2>

          <div className="grid-3">
            {filteredSubjects.map((subject) => (
              <div
                className="card clickable-card"
                key={subject.id}
                onClick={() => navigate(`/subjects/${subject.id}`)}
              >
                <div
                  className="card-cover"
                  style={{
                    backgroundImage: subject.cover
                      ? `url(${subject.cover})`
                      : "linear-gradient(120deg, #ccffbd, #fff3a6)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                <h3>
                  {subject.favorite ? "⭐ " : ""}
                  {subject.icon} {subject.title}
                </h3>

                <p>{subject.progress || 0}% progress</p>

                <div className="course-progress">
                  <span style={{ width: `${subject.progress || 0}%` }}></span>
                </div>
              </div>
            ))}
          </div>

          {filteredSubjects.length === 0 && (
            <div className="empty-state">
              <h3>No course found</h3>
              <p>Try searching another subject or add a new course.</p>
            </div>
          )}

          <h2 className="section-title">Recent Focus Sessions</h2>

          <div className="card">
            {focusSessions.length === 0 ? (
              <p>No focus sessions yet. Start one from Focus Mode.</p>
            ) : (
              focusSessions
                .slice()
                .reverse()
                .slice(0, 4)
                .map((session) => (
                  <div className="task" key={session.id}>
                    🎯 {session.task} — {session.minutes} mins
                  </div>
                ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;