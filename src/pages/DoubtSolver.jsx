import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { askGemini } from "../services/gemini";

function DoubtSolver() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const solveDoubt = async () => {
    if (!question.trim()) {
      alert("Please enter your doubt.");
      return;
    }

    setLoading(true);

    try {
      const result = await askGemini(`
You are a friendly teacher.

Explain this question in a very simple way.

Question:
${question}

Format:
1. Simple Explanation
2. Example
3. Exam Point

Keep it short and easy.
`);

      setAnswer(result);
    } catch (error) {
      console.error(error);
      setAnswer("Failed to generate answer.");
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <TopBar />

        <section className="page no-cover-page">
          <div className="page-icon normal-icon">💬</div>

          <h1 className="page-title normal-title">
            AI Doubt Solver
          </h1>

          <p className="page-subtitle normal-subtitle">
            Ask any study-related question and get an AI explanation.
          </p>

          <div className="grid-2">
            <div className="card">
              <h3>Ask Your Doubt</h3>

              <textarea
                className="textarea"
                placeholder="Example: Explain DBMS normalization..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />

              <button className="btn" onClick={solveDoubt}>
                {loading ? "Thinking..." : "Solve Doubt"}
              </button>
            </div>

            <div className="card">
              <h3>AI Answer</h3>

              <pre className="ai-output">
                {answer || "Your answer will appear here."}
              </pre>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DoubtSolver;