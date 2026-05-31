import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { getData, saveData } from "../utils/storage";

function CalendarPage() {
  const [data, setData] = useState(getData());
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("Study");

  const events = data.calendarEvents || [];

  const addEvent = () => {
    if (!title.trim() || !date) {
      alert("Enter event title and date");
      return;
    }

    const updated = {
      ...data,
      calendarEvents: [
        ...events,
        {
          id: Date.now(),
          title,
          date,
          type,
        },
      ],
    };

    setData(updated);
    saveData(updated);
    setTitle("");
    setDate("");
    setType("Study");
  };

  const deleteEvent = (id) => {
    const updated = {
      ...data,
      calendarEvents: events.filter((event) => event.id !== id),
    };

    setData(updated);
    saveData(updated);
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <TopBar />

        <section className="page no-cover-page">
          <div className="page-icon normal-icon">📅</div>

          <h1 className="page-title normal-title">Study Calendar</h1>

          <p className="page-subtitle normal-subtitle">
            Add exam dates, revision days, assignment deadlines, and study plans.
          </p>

          <div className="grid-2">
            <div className="card">
              <h3>Add Event</h3>

              <input
                className="input"
                placeholder="Event title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                className="input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <select
                className="input"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option>Study</option>
                <option>Exam</option>
                <option>Assignment</option>
                <option>Revision</option>
                <option>Project</option>
              </select>

              <button className="btn" onClick={addEvent}>
                Add Event
              </button>
            </div>

            <div className="card">
              <h3>Upcoming Events</h3>

              {sortedEvents.length === 0 ? (
                <p>No study events yet.</p>
              ) : (
                sortedEvents.map((event) => (
                  <div className="task-row" key={event.id}>
                    <div className="task">
                      📌 {event.title} — {event.date} ({event.type})
                    </div>

                    <button
                      className="delete-task-btn"
                      onClick={() => deleteEvent(event.id)}
                    >
                      Delete
                    </button>
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

export default CalendarPage;