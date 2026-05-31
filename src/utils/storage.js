import { loadCloudData, saveCloudData } from "../services/firestore";

const LOCAL_KEY = "pingplan_data";

const defaultData = {
  user: {
    name: "Monika",
    mood: "😊",
    streak: 1,
    dailyGoal: "Finish 2 hours of focused study",
    quickNote: "",
    theme: "light",
    avatar: "",
    homeCover: "",
  },
  subjects: [
    {
      id: "java",
      icon: "☕",
      title: "Java DSA",
      progress: 0,
      notes: "",
      tasks: [],
      cover: "",
      favorite: true,
    },
    {
      id: "dbms",
      icon: "🗄️",
      title: "DBMS",
      progress: 0,
      notes: "",
      tasks: [],
      cover: "",
      favorite: false,
    },
    {
      id: "cloud",
      icon: "☁️",
      title: "Cloud Computing",
      progress: 0,
      notes: "",
      tasks: [],
      cover: "",
      favorite: false,
    },
  ],
  sharedMembers: ["monikasrvnn@gmail.com"],
  focusSessions: [],
  calendarEvents: [],
  flashcards: [],
  quizQuestions: [],
  studyRoomGoal: "",
  studyRoomNote: "",
  latestStudyPlan: "",
};

export function getData() {
  const saved = localStorage.getItem(LOCAL_KEY);
  return saved ? JSON.parse(saved) : defaultData;
}

export function saveData(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  saveCloudData(data);
}

export async function getSyncedData() {
  try {
    const cloudData = await loadCloudData();
    localStorage.setItem(LOCAL_KEY, JSON.stringify(cloudData));
    return cloudData;
  } catch (error) {
    console.error("Cloud load failed:", error);
    return getData();
  }
}

export function resetData() {
  localStorage.removeItem(LOCAL_KEY);
}

export function exportData() {
  const data = getData();

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "pingplan-workspace.json";
  a.click();

  URL.revokeObjectURL(url);
}