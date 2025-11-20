import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ------------------------------------------------------------------
// FIREBASE CONFIGURATION
// ------------------------------------------------------------------
// To use a real database:
// 1. Go to console.firebase.google.com
// 2. Create a project
// 3. Add a Web App to get these details
// 4. Replace the object below with your config
// ------------------------------------------------------------------

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app;
let db = null;

try {
  // We check if the config is still the placeholder to avoid errors in the demo environment
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
  } else {
    console.warn("Firebase config missing. Using LocalStorage for orders.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { db };