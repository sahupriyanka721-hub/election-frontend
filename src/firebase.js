import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBsrzCQjeffjSjEk0eMEcV0e6e85tikolo",
  authDomain: "univote-app-fc2cb.firebaseapp.com",
  projectId: "univote-app-fc2cb",
  storageBucket: "univote-app-fc2cb.firebasestorage.app",
  messagingSenderId: "1069409748155",
  appId: "1:1069409748155:web:0b9dd43d7d5e8e82f5159e",
  measurementId: "G-3GZ7SVZD01"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);