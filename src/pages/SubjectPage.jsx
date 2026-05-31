import { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { getData, saveData } from "../utils/storage";
import { askGemini } from "../services/gemini";

function SubjectPage() {
  const { id } = useParams();
  const [data, setData] = useState(getData());
  const [taskText, setTaskText] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const subject = data.subjects.find((item) => item.id === id);

  if (!subject) {
    return <h1 style={{ padding: "40px" }}>Subject not found</h1>;
  }

  const updateSubject = (updatedSubject) => {
    const updated = {
      ...data,
      subjects: data.subjects.map((item) =>
        item.id === id ? updatedSubject : item
      ),
    };

    setData(updated);
    saveData(updated);
  };

  const updateProgress = (tasks) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((task) => task.done).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      updateSubject({
        ...subject,
        cover: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  const renameSubject = () => {
    const newTitle = prompt("New subject name:", subject.title);
    if (!newTitle) return;

    updateSubject({
      ...subject,
      title: newTitle,
    });
  };

  const changeIcon = () => {
    const newIcon = prompt("Choose emoji icon:", subject.icon);
    if (!newIcon) return;

    updateSubject({
      ...subject,
      icon: newIcon,
    });
  };

  const addTask = () => {
    if (!taskText.trim()) return;

    const updatedTasks = [
      ...subject.tasks,
      {
        text: taskText,
        done: false,
      },
    ];

    updateSubject({
      ...subject,
      tasks: updatedTasks,
      progress: updateProgress(updatedTasks),
    });

    setTaskText("");
  };

  const toggleTask = (index) => {
    const updatedTasks = subject.tasks.map((task, i) =>
      i === index ? { ...task, done: !task.done } : task
    );

    updateSubject({
      ...subject,
      tasks: updatedTasks,
      progress: updateProgress(updatedTasks),
    });
  };

  const deleteTask = (index) => {
    const updatedTasks = subject.tasks.filter((_, i) => i !== index);

    updateSubject({
      ...subject,
      tasks: updatedTasks,
      progress: updateProgress(updatedTasks),
    });
  };

  const summarizeNotes = async () => {
    if (!subject.notes.trim()) {
      alert("Write notes first");
      return;
    }

    setLoading(true);

    const result = await askGemini(`
Summarize these notes in very simple bullet points.
Keep it short and exam-friendly.

Notes:
${subject.notes.slice(0, 5000)}
`);

    setAiOutput(result);
    setLoading(false);
  };

  const generateQuiz = async () => {
    if (!subject.notes.trim()) {
      alert("Write notes first");
      return;
    }

    setLoading(true);

    const result = await askGemini(`
Create 5 short MCQ questions from these notes.

Format:
1. Question
A)
B)
C)
D)
Answer:

Notes:
${subject.notes.slice(0, 5000)}
`);

    setAiOutput(result);
    setLoading(false);
  };

  const generateFlashcards = async () => {
    if (!subject.notes.trim()) {
      alert("Write notes first");
      return;
    }

    setLoading(true);

    const result = await askGemini(`
Create 5 flashcards from these notes.

Format:
Q:
A:

Notes:
${subject.notes.slice(0, 5000)}
`);

    setAiOutput(result);
    setLoading(false);
  };

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <TopBar />

        <div
          className="cover subject-cover"
          style={{
            backgroundImage: subject.cover
              ? `url(${subject.cover})`
              : "linear-gradient(120deg, #dfffd6, #fff2a8, #d8f5ff)",
          }}
        >
          <label className="cover-upload-btn">
            Change Cover
            <input type="file" accept="image/*" onChange={handleCoverUpload} />
          </label>
        </div>

        <section className="page">
          <div className="page-icon">{subject.icon}</div>

          <h1 className="page-title">{subject.title}</h1>

          <p className="page-subtitle">
            Notes, tasks, revision, AI summary, quiz and flashcards for this
            subject.
          </p>

          <button className="btn-light" onClick={renameSubject}>
            ✏️ Rename Subject
          </button>

          <button className="btn-light" onClick={changeIcon}>
            😀 Change Icon
          </button>

          <div className="grid-2" style={{ marginTop: "24px" }}>
            <div className="card">
              <h3>📝 Notes</h3>

              <textarea
                className="textarea"
                value={subject.notes}
                placeholder="Write notes here..."
                onChange={(e) =>
                  updateSubject({
                    ...subject,
                    notes: e.target.value,
                  })
                }
              />

              <button className="btn" onClick={summarizeNotes}>
                {loading ? "Generating..." : "✨ AI Summarize Notes"}
              </button>
            </div>

            <div className="card">
              <h3>✅ Tasks</h3>

              <input
                className="input"
                placeholder="Add subject task..."
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
              />

              <button className="btn" onClick={addTask}>
                Add Task
              </button>

              <br />
              <br />

              {subject.tasks.length === 0 ? (
                <p>No tasks yet.</p>
              ) : (
                subject.tasks.map((task, index) => (
                  <div className="task-row" key={index}>
                    <label className="task">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(index)}
                      />
                      <span
                        style={{
                          textDecoration: task.done ? "line-through" : "none",
                        }}
                      >
                        {task.text}
                      </span>
                    </label>

                    <button
                      className="delete-task-btn"
                      onClick={() => deleteTask(index)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="card">
              <h3>📈 Progress</h3>

              <h1>{subject.progress || 0}%</h1>

              <p>
                {subject.tasks.filter((task) => task.done).length}/
                {subject.tasks.length} tasks completed
              </p>

              <div className="course-progress">
                <span style={{ width: `${subject.progress || 0}%` }}></span>
              </div>
            </div>

            <div className="card">
              <h3>✨ AI Tools</h3>

              <button className="btn-light" onClick={summarizeNotes}>
                ✨ Summarize Notes
              </button>

              <button className="btn-light" onClick={generateQuiz}>
                📝 Generate Quiz
              </button>

              <button className="btn-light" onClick={generateFlashcards}>
                🧠 Generate Flashcards
              </button>
            </div>
          </div>

          <h2 className="section-title">AI Output</h2>

          <pre className="ai-output">
            {aiOutput || "AI summary, quiz, or flashcards will appear here."}
          </pre>
        </section>
      </main>
    </div>
  );
}

export default SubjectPage;