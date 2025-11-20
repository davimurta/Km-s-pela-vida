import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBtlMP1VFlWEdnZL3eblN7by9zKd8n_q1Q",
  authDomain: "km-s-pela-vida.firebaseapp.com",
  projectId: "km-s-pela-vida",
  storageBucket: "km-s-pela-vida.firebasestorage.app",
  messagingSenderId: "1064560537733",
  appId: "1:1064560537733:web:2d9bf16451b45a7e68b9ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
