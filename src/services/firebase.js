import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

import {
  getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDbxTZyWwY9PWdB97AAQX80LZmdVJwmC8",
  authDomain: "ai-study-planner-b5451.firebaseapp.com",
  projectId: "ai-study-planner-b5451",
  storageBucket: "ai-study-planner-b5451.firebasestorage.app",
  messagingSenderId: "976331271029",
  appId: "1:976331271029:web:157a114f8397fed181813c",
  measurementId: "G-00D9VEE91L",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

export const db = getFirestore(app);

export default app;