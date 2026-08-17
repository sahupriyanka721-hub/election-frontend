// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsrzCQjeffjSjEk0eMEcV0e6e85tikolo",
  authDomain: "univote-app-fc2cb.firebaseapp.com",
  projectId: "univote-app-fc2cb",
  storageBucket: "univote-app-fc2cb.firebasestorage.app",
  messagingSenderId: "1069409748155",
  appId: "1:1069409748155:web:0b9dd43d7d5e8e82f5159e",
  measurementId: "G-3GZ7SVZD01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);