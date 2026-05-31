import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { askGemini } from "../services/gemini";
import { getData, saveData } from "../utils/storage";

function Flashcards() {
  const [notes, setNotes] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateFlashcards = async () => {
    if (!notes.trim()) {
      alert("Upload or paste notes first");
      return;
    }

    setLoading(true);

    try {
      const result = await askGemini(`
Create exactly 10 flashcards.

Format:
Q: question
A: answer

Notes:
${notes.slice(0, 5000)}
`);

      const parsedCards = [];

      const lines = result.split("\n");

      let currentQuestion = "";
      let currentAnswer = "";

      lines.forEach((line) => {
        if (line.startsWith("Q:")) {
          if (currentQuestion && currentAnswer) {
            parsedCards.push({
              question: currentQuestion,
              answer: currentAnswer,
            });
          }

          currentQuestion = line.replace("Q:", "").trim();
          currentAnswer = "";
        }

        if (line.startsWith("A:")) {
          currentAnswer = line.replace("A:", "").trim();
        }
      });

      if (currentQuestion && currentAnswer) {
        parsedCards.push({
          question: currentQuestion,
          answer: currentAnswer,
        });
      }

      setCards(parsedCards);

      const data = getData();

      saveData({
        ...data,
        flashcards: parsedCards,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to generate flashcards");
    }

    setLoading(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      setNotes(event.target.result);
    };

    reader.readAsText(file);
  };

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <TopBar />

        <section className="page no-cover-page">
          <div className="page-icon normal-icon">🧠</div>

          <h1 className="page-title normal-title">
            AI Flashcards
          </h1>

          <p className="page-subtitle normal-subtitle">
            Upload notes and generate revision flashcards automatically.
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
                onChange={(e) =>
                  setNotes(e.target.value)
                }
              />

              <button
                className="btn"
                onClick={generateFlashcards}
              >
                {loading
                  ? "Generating..."
                  : "Generate Flashcards"}
              </button>
            </div>

            <div className="card">
              <h3>Generated Flashcards</h3>

              {cards.length === 0 ? (
                <p>No flashcards generated yet.</p>
              ) : (
                cards.map((card, index) => (
                  <div
                    key={index}
                    className="flashcard"
                  >
                    <h4>
                      Q{index + 1}: {card.question}
                    </h4>

                    <p>{card.answer}</p>
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

export default Flashcards;