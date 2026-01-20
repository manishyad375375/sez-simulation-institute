
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Firebase configuration
// PRO-TIP: Ensure your Firebase Realtime Database rules are set to public or handle Auth.
// Example: { "rules": { ".read": true, ".write": true } } for open testing.
const firebaseConfig = {
  apiKey: "AIzaSyB2uZ7duyMaZL6ub1V5uVMTI6hx9Ks2DRU",
  authDomain: "virtual-ai-lab-a4e2c.firebaseapp.com",
  databaseURL: "https://virtual-ai-lab-a4e2c-default-rtdb.firebaseio.com",
  projectId: "virtual-ai-lab-a4e2c",
  storageBucket: "virtual-ai-lab-a4e2c.firebasestorage.app",
  messagingSenderId: "417841748341",
  appId: "1:417841748341:web:a4ba7ac35c73a3a4a25b3c",
  measurementId: "G-LFPM9Q6SLN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and export
export const db = getDatabase(app);
