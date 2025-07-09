import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBn2l8fBS3Jhqv6d2wWXBMT5Cdow-w-nk",
  authDomain: "team-65-workplace.firebaseapp.com",
  projectId: "team-65-workplace",
  storageBucket: "team-65-workplace.firebasestorage.app",
  messagingSenderId: "731181474634",
  appId: "1:731181474634:web:6235e9c35e54f885ed97b3",
  measurementId: "G-PN16L3547F"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;