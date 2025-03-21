import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzr9NLODmhLq-lEbKj3ankOEJ9oXSi5EY",
  authDomain: "chronolearn-423eb.firebaseapp.com",
  projectId: "chronolearn-423eb",
  storageBucket: "chronolearn-423eb.firebasestorage.app",
  messagingSenderId: "740450521696",
  appId: "1:740450521696:web:3baa25a6e32de520b6a905"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();