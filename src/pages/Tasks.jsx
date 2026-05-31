import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

function Tasks() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([
    "Revise DBMS normalization",
    "Solve Java DSA problems",
    "Prepare AI quiz",
  ]);

  const addTask = () => {
    if (!task.trim()) return;
    setTasks([...tasks, task]);
    setTask("");
  };

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <TopBar search="" setSearch={() => {}} />

        <section className="page no-cover-page">
          <div className="page-icon normal-icon">✅</div>

          <h1 className="page-title normal-title">Assignments</h1>

          <p className="page-subtitle normal-subtitle">
            Keep track of study tasks, deadlines and revision work.
          </p>

          <div className="card">
            <input
              className="input"
              placeholder="Add new task..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />

            <button className="btn" onClick={addTask}>
              Add Task
            </button>
          </div>

          <h2 className="section-title">Task List</h2>

          {tasks.map((item, index) => (
            <label className="task" key={index}>
              <input type="checkbox" />
              {item}
            </label>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Tasks;