import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { askGemini } from "../services/gemini";
import { getData, saveData } from "../utils/storage";

function Quiz() {
  const [notes, setNotes] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      setNotes(event.target.result);
    };

    reader.readAsText(file);
  };

  const generateQuiz = async () => {
    if (!notes.trim()) {
      alert("Upload or paste notes first");
      return;
    }

    setLoading(true);

    try {
      const result = await askGemini(`
Create exactly 5 multiple choice questions from these notes.

Return ONLY valid JSON. No markdown.

Format:
[
  {
    "question": "Question text",
    "options": ["A", "B", "C", "D"],
    "answer": "Correct option text"
  }
]

Notes:
${notes.slice(0, 5000)}
`);

      const cleaned = result.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      setQuestions(parsed);
      setSelectedAnswers({});

      const data = getData();

      saveData({
        ...data,
        quizQuestions: parsed,
      });
    } catch (error) {
      console.error(error);
      alert("Could not generate quiz. Try again with shorter notes.");
    }

    setLoading(false);
  };

  const chooseAnswer = (questionIndex, option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: option,
    });
  };

  const score = questions.filter(
    (question, index) => selectedAnswers[index] === question.answer
  ).length;

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <TopBar />

        <section className="page no-cover-page">
          <div className="page-icon normal-icon">📝</div>

          <h1 className="page-title normal-title">AI Quiz Practice</h1>

          <p className="page-subtitle normal-subtitle">
            Upload notes and generate multiple choice questions automatically.
          </p>

          <div className="grid-2">
            <div className="card">
              <h3>Study Notes</h3>

              <input
                type="file"
                className="input"
                accept=".txt"
                onChange={handleFileUpload}
              />

              <textarea
                className="textarea"
                placeholder="Or paste notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <button className="btn" onClick={generateQuiz}>
                {loading ? "Generating..." : "Generate Quiz"}
              </button>
            </div>

            <div className="card">
              <h3>Your Quiz</h3>

              {questions.length > 0 && (
                <p>
                  Score: <b>{score}</b> / {questions.length}
                </p>
              )}

              {questions.length === 0 ? (
                <p>No quiz generated yet.</p>
              ) : (
                questions.map((question, qIndex) => (
                  <div key={qIndex} style={{ marginTop: "18px" }}>
                    <h3>
                      {qIndex + 1}. {question.question}
                    </h3>

                    {question.options.map((option) => {
                      const selected = selectedAnswers[qIndex] === option;
                      const correct = option === question.answer;

                      let className = "option";

                      if (selected && correct) className = "option correct";
                      if (selected && !correct) className = "option wrong";

                      return (
                        <button
                          key={option}
                          className={className}
                          onClick={() => chooseAnswer(qIndex, option)}
                        >
                          {option}
                        </button>
                      );
                    })}

                    {selectedAnswers[qIndex] && (
                      <p>
                        Correct answer: <b>{question.answer}</b>
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Quiz;