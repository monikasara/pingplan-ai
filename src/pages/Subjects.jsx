import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { getData, saveData } from "../utils/storage";

function Subjects() {
  const navigate = useNavigate();
  const [data, setData] = useState(getData());
  const [title, setTitle] = useState("");

  const addCourse = () => {
    if (!title.trim()) return;

    const id = title.toLowerCase().replaceAll(" ", "-") + Date.now();

    const newCourse = {
      id,
      icon: "📘",
      title,
      progress: 0,
      notes: "",
      tasks: [],
      cover: "",
    };

    const updated = {
      ...data,
      subjects: [...data.subjects, newCourse],
    };

    setData(updated);
    saveData(updated);
    setTitle("");
  };

  const deleteCourse = (e, id) => {
    e.stopPropagation();

    if (!confirm("Delete this course?")) return;

    const updated = {
      ...data,
      subjects: data.subjects.filter((item) => item.id !== id),
    };

    setData(updated);
    saveData(updated);
  };

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <TopBar />

        <div className="cover"></div>

        <section className="page">
          <div className="page-icon">📚</div>

          <h1 className="page-title">Courses</h1>

          <p className="page-subtitle">
            Add courses, open workspaces, write notes and track tasks.
          </p>

          <div className="card">
            <input
              className="input"
              placeholder="New course name..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <button className="btn" onClick={addCourse}>
              + Add Course
            </button>
          </div>

          <h2 className="section-title">My Courses</h2>

          <div className="grid-2">
            {data.subjects.map((course) => (
              <div
                className="card course-card clickable-card"
                key={course.id}
                onClick={() => navigate(`/subjects/${course.id}`)}
              >
                <div className="course-card-actions">
                  <h3>
                    {course.icon} {course.title}
                  </h3>

                  <button onClick={(e) => deleteCourse(e, course.id)}>
                    Delete
                  </button>
                </div>

                <p>{course.tasks.length} tasks • Notes saved</p>

                <div className="course-progress">
                  <span style={{ width: `${course.progress}%` }}></span>
                </div>

                <button className="btn-light">Open Workspace</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Subjects;