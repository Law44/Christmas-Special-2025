import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBs1k1qzkGoP2lZdbtipk9KnkWxCX2m89o",
    authDomain: "christmas-9144f.firebaseapp.com",
    projectId: "christmas-9144f",
    storageBucket: "christmas-9144f.firebasestorage.app",
    messagingSenderId: "373008360050",
    appId: "1:373008360050:web:92cadd7265dd9c272898eb"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);