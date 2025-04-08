import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
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
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy
};