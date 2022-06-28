import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAdKJMErxGWhjgBEpMC0YKSqX7AhXFhQ8A",
  authDomain: "cs-network-fire.firebaseapp.com",
  projectId: "cs-network-fire",
  storageBucket: "cs-network-fire.appspot.com",
  messagingSenderId: "362724592484",
  appId: "1:362724592484:web:4563a0da693a3466e8c871",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
