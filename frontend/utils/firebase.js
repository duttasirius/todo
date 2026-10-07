// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "todologin-c663e.firebaseapp.com",
  projectId: "todologin-c663e",
  storageBucket: "todologin-c663e.firebasestorage.app",
  messagingSenderId: "278466072227",
  appId: "1:278466072227:web:6d590ca42c7578d9ca3916",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
