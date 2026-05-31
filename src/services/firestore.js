import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

const defaultCloudData = {
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

export async function loadCloudData() {
  const user = auth.currentUser;

  if (!user) {
    return defaultCloudData;
  }

  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    return {
      ...defaultCloudData,
      ...snapshot.data(),
    };
  }

  await setDoc(ref, defaultCloudData);
  return defaultCloudData;
}

export async function saveCloudData(data) {
  const user = auth.currentUser;

  if (!user) return;

  const ref = doc(db, "users", user.uid);
  await setDoc(ref, data, { merge: true });
}