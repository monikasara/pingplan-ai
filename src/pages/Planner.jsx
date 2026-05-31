import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { askGemini } from "../services/gemini";
import { getData, saveData } from "../utils/storage";

function Planner() {
  const [studyContent, setStudyContent] = useState("");
  const [examDate, setExamDate] = useState("");
  const [dailyHours, setDailyHours] = useState(2);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");

  const generatePlan = async () => {
    if (!studyContent.trim()) {
      alert("Upload or paste study material first.");
      return;
    }

    setLoading(true);

    try {
      const result = await askGemini(`
You are an AI Study Planner.

Study Material:
${studyContent.slice(0, 6000)}

Exam Date:
${examDate}

Daily Study Hours:
${dailyHours}

Create:

1. Day-wise study plan
2. Revision schedule
3. Important topics
4. Mock test schedule

Keep it concise and student-friendly.
`);

      setPlan(result);

      const data = getData();

      saveData({
        ...data,
        latestStudyPlan: result,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to generate plan.");
    }

    setLoading(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      setStudyContent(event.target.result);
    };

    reader.readAsText(file);
  };

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <TopBar />

        <section className="page no-cover-page">
          <div className="page-icon normal-icon">✨</div>

          <h1 className="page-title normal-title">
            AI Study Planner
          </h1>

          <p className="page-subtitle normal-subtitle">
            Upload study material and generate a smart study schedule.
          </p>

          <div className="grid-2">
            <div className="card">
              <h3>Study Material</h3>

              <input
                type="file"
                className="input"
                accept=".txt"
                onChange={handleFileUpload}
              />

              <br />

              <textarea
                className="textarea"
                placeholder="Or paste notes here..."
                value={studyContent}
                onChange={(e) =>
                  setStudyContent(e.target.value)
                }
              />

              <input
                type="date"
                className="input"
                value={examDate}
                onChange={(e) =>
                  setExamDate(e.target.value)
                }
              />

              <input
                type="number"
                className="input"
                value={dailyHours}
                onChange={(e) =>
                  setDailyHours(e.target.value)
                }
                placeholder="Daily Study Hours"
              />

              <button
                className="btn"
                onClick={generatePlan}
              >
                {loading
                  ? "Generating Plan..."
                  : "Generate AI Plan"}
              </button>
            </div>

            <div className="card">
              <h3>Your Study Plan</h3>

              <pre className="ai-output">
                {plan ||
                  "Your AI-generated study plan will appear here."}
              </pre>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Planner;