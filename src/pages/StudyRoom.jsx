import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { auth, db } from "../services/firebase";

import {
  doc,
  setDoc,
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

function StudyRoom() {
  const [roomId, setRoomId] = useState("main-study-room");
  const [roomName, setRoomName] = useState("PingPlan Study Room");
  const [goal, setGoal] = useState("");
  const [note, setNote] = useState("");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState([]);

  const user = auth.currentUser;

  useEffect(() => {
    const roomRef = doc(db, "studyRooms", roomId);

    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();

        setRoomName(data.roomName || "PingPlan Study Room");
        setGoal(data.goal || "");
        setNote(data.note || "");
      } else {
        setDoc(roomRef, {
          roomName: "PingPlan Study Room",
          goal: "",
          note: "",
          createdAt: serverTimestamp(),
        });
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    const messagesRef = collection(db, "studyRooms", roomId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setMessages(list);
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    const tasksRef = collection(db, "studyRooms", roomId, "tasks");
    const q = query(tasksRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setTasks(list);
    });

    return () => unsubscribe();
  }, [roomId]);

  const updateRoom = async (updates) => {
    const roomRef = doc(db, "studyRooms", roomId);

    await setDoc(
      roomRef,
      {
        ...updates,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    await addDoc(collection(db, "studyRooms", roomId, "messages"), {
      text: message,
      userName: user?.displayName || user?.email || "Student",
      userEmail: user?.email || "unknown",
      createdAt: serverTimestamp(),
    });

    setMessage("");
  };

  const addTask = async () => {
    if (!taskText.trim()) return;

    await addDoc(collection(db, "studyRooms", roomId, "tasks"), {
      text: taskText,
      done: false,
      createdBy: user?.email || "unknown",
      createdAt: serverTimestamp(),
    });

    setTaskText("");
  };

  const toggleTask = async (task) => {
    const taskRef = doc(db, "studyRooms", roomId, "tasks", task.id);

    await updateDoc(taskRef, {
      done: !task.done,
    });
  };

  const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, "studyRooms", roomId, "tasks", taskId));
  };

  const copyRoomLink = async () => {
    const link = `${window.location.origin}/study-room`;
    await navigator.clipboard.writeText(link);
    alert("Study room link copied ✅");
  };

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <TopBar />

        <section className="page no-cover-page">
          <div className="page-icon normal-icon">👥</div>

          <h1 className="page-title normal-title">Real-time Study Room</h1>

          <p className="page-subtitle normal-subtitle">
            Study together with friends using shared goals, notes, tasks and live chat.
          </p>

          <div className="card">
            <h3>Room Setup</h3>

            <input
              className="input"
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />

            <input
              className="input"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => {
                setRoomName(e.target.value);
                updateRoom({ roomName: e.target.value });
              }}
            />

            <button className="btn" onClick={copyRoomLink}>
              Copy Room Link
            </button>
          </div>

          <br />

          <div className="grid-2">
            <div className="card">
              <h3>🎯 Shared Study Goal</h3>

              <input
                className="input"
                placeholder="Example: Finish DBMS Unit 2 today"
                value={goal}
                onChange={(e) => {
                  setGoal(e.target.value);
                  updateRoom({ goal: e.target.value });
                }}
              />

              <h3 style={{ marginTop: "20px" }}>📝 Shared Notes</h3>

              <textarea
                className="textarea"
                placeholder="Write group notes, doubts, reminders..."
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  updateRoom({ note: e.target.value });
                }}
              />
            </div>

            <div className="card">
              <h3>✅ Shared Tasks</h3>

              <input
                className="input"
                placeholder="Add group task..."
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
              />

              <button className="btn" onClick={addTask}>
                Add Task
              </button>

              <br />
              <br />

              {tasks.length === 0 ? (
                <p>No shared tasks yet.</p>
              ) : (
                tasks.map((task) => (
                  <div className="task-row" key={task.id}>
                    <label className="task">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(task)}
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
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <h2 className="section-title">Live Chat</h2>

          <div className="card">
            <div className="chat-box">
              {messages.length === 0 ? (
                <p>No messages yet. Say hi 👋</p>
              ) : (
                messages.map((msg) => (
                  <div className="chat-message" key={msg.id}>
                    <b>{msg.userName}</b>
                    <p>{msg.text}</p>
                  </div>
                ))
              )}
            </div>

            <div className="chat-input-row">
              <input
                className="input"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />

              <button className="btn" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudyRoom;