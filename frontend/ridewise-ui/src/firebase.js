// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8E7Ok5CEDxe0fL7u7eGYIrkMqeap6TiE",
  authDomain: "ridewise25.firebaseapp.com",
  projectId: "ridewise25",
  storageBucket: "ridewise25.firebasestorage.app",
  messagingSenderId: "182278186222",
  appId: "1:182278186222:web:fcdbff85d96fce5e6d3fff"
};

console.log("Initializing Firebase...");

// Initialize Firebase
let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log("Firebase initialized successfully!");
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

export { auth };
export default app;
