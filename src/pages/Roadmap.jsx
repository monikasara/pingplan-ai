import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { askGemini } from "../services/gemini";

function Roadmap() {
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState("");
  const [hours, setHours] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);

  const generateRoadmap = async () => {
    if (!goal || !days || !hours) {
      alert("Fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const result = await askGemini(`
Create a study roadmap.

Goal: ${goal}
Days Available: ${days}
Daily Study Hours: ${hours}

Give:
- Day-wise study plan
- Revision days
- Practice tasks
- Final exam preparation

Keep it short and student friendly.
`);

      setRoadmap(result);
    } catch (error) {
      console.error(error);
      setRoadmap("Failed to generate roadmap.");
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <TopBar />

        <section className="page no-cover-page">
          <div className="page-icon normal-icon">🗺️</div>

          <h1 className="page-title normal-title">
            AI Study Roadmap
          </h1>

          <p className="page-subtitle normal-subtitle">
            Generate a complete study roadmap for your exams or learning goals.
          </p>

          <div className="grid-2">
            <div className="card">
              <h3>Create Roadmap</h3>

              <input
                className="input"
                placeholder="Goal (Example: DBMS Exam)"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />

              <input
                className="input"
                placeholder="Days Available"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />

              <input
                className="input"
                placeholder="Daily Study Hours"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />

              <button className="btn" onClick={generateRoadmap}>
                {loading ? "Generating..." : "Generate Roadmap"}
              </button>
            </div>

            <div className="card">
              <h3>Your Roadmap</h3>

              <pre className="ai-output">
                {roadmap || "Your roadmap will appear here."}
              </pre>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Roadmap;