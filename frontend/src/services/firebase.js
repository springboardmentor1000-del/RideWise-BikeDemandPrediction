// src/services/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
 // 👈 Add this import
import { getAuth, GoogleAuthProvider } from "firebase/auth";  // optional, if you'll use Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTOPfJPC6e7y3NoMLdWK3LtTpI_N9CYJQ",
  authDomain: "bike-pred-auth.firebaseapp.com",
  projectId: "bike-pred-auth",
  storageBucket: "bike-pred-auth.appspot.com",
  messagingSenderId: "781521864427",
  appId: "1:781521864427:web:f796e92f96d37af15920ae",
  measurementId: "G-TYHC3Y9DQZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); // 👈 Add this line
export const googleProvider = new GoogleAuthProvider();
export default app; // optional, if you want to import app elsewhere
