import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { getData, saveData } from "../utils/storage";

function Focus() {
  const [data, setData] = useState(getData());
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [task, setTask] = useState("");
  const [sound, setSound] = useState("Rain");

  const intervalRef = useRef(null);

  const sounds = ["Rain", "Cafe", "Ocean", "White Noise"];

  useEffect(() => {
    setSecondsLeft(Number(minutes || 0) * 60);
  }, [minutes]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          saveSession();
          alert("Focus session completed 🎉");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const saveSession = () => {
    const session = {
      id: Date.now(),
      task: task || "Untitled focus session",
      minutes: Number(minutes),
      sound,
      date: new Date().toLocaleString(),
    };

    const updated = {
      ...data,
      focusSessions: [...(data.focusSessions || []), session],
    };

    setData(updated);
    saveData(updated);
  };

  const startTimer = () => {
    if (secondsLeft <= 0) {
      setSecondsLeft(Number(minutes || 0) * 60);
    }

    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setSecondsLeft(Number(minutes || 0) * 60);
  };

  const formatTime = () => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <TopBar />

        <section className="page no-cover-page">
          <div className="page-icon normal-icon">⏱️</div>

          <h1 className="page-title normal-title">Focus Mode</h1>

          <p className="page-subtitle normal-subtitle">
            Start a Pomodoro session, choose a focus task, and track your study
            sessions.
          </p>

          <div className="grid-2">
            <div className="card">
              <h3>Pomodoro Timer</h3>

              <div className="big-timer">{formatTime()}</div>

              <input
                className="input"
                type="number"
                min="1"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                disabled={isRunning}
              />

              <button className="btn" onClick={startTimer}>
                Start
              </button>

              <button className="btn-light" onClick={pauseTimer}>
                Pause
              </button>

              <button className="btn-light" onClick={resetTimer}>
                Reset
              </button>
            </div>

            <div className="card">
              <h3>Focus Setup</h3>

              <textarea
                className="textarea"
                placeholder="What are you focusing on?"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />

              <h3>Ambient Sound</h3>

              <div className="setting-tags">
                {sounds.map((item) => (
                  <span
                    key={item}
                    onClick={() => setSound(item)}
                    style={{
                      cursor: "pointer",
                      background: sound === item ? "#dfffd6" : "#f1f1ef",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <button
                className="btn"
                onClick={() =>
                  window.open("https://open.spotify.com", "_blank")
                }
              >
                Open Spotify
              </button>
            </div>
          </div>

          <h2 className="section-title">Focus Session History</h2>

          <div className="card">
            {(data.focusSessions || []).length === 0 ? (
              <p>No focus sessions completed yet.</p>
            ) : (
              (data.focusSessions || [])
                .slice()
                .reverse()
                .map((session) => (
                  <div className="task-row" key={session.id}>
                    <div className="task">
                      🎯 {session.task} — {session.minutes} mins —{" "}
                      {session.sound}
                    </div>

                    <span style={{ color: "#777", fontSize: "13px" }}>
                      {session.date}
                    </span>
                  </div>
                ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Focus;