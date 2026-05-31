import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

function Progress() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <TopBar search="" setSearch={() => {}} />

        <section className="page no-cover-page">
          <div className="page-icon normal-icon">📈</div>

          <h1 className="page-title normal-title">Progress</h1>

          <p className="page-subtitle normal-subtitle">
            Track your study hours, tasks, focus score and growth.
          </p>

          <div className="grid-3">
            <div className="card">
              <h3>Study Hours</h3>
              <h1>42h</h1>
              <p>This month</p>
            </div>

            <div className="card">
              <h3>Tasks Done</h3>
              <h1>18</h1>
              <p>Completed tasks</p>
            </div>

            <div className="card">
              <h3>Focus Score</h3>
              <h1>91%</h1>
              <p>Deep work quality</p>
            </div>
          </div>

          <h2 className="section-title">Subject Progress</h2>

          <div className="database">
            <div className="db-row db-head">
              <span>Subject</span>
              <span>Progress</span>
              <span>Status</span>
            </div>

            <div className="db-row">
              <span>Java DSA</span>
              <span>75%</span>
              <span>Good</span>
            </div>

            <div className="db-row">
              <span>DBMS</span>
              <span>70%</span>
              <span>Revision</span>
            </div>

            <div className="db-row">
              <span>Cloud Computing</span>
              <span>45%</span>
              <span>Learning</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Progress;