
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCHCtvjsP27fpx9oUYWXa7-7HehOoTdfk",
  authDomain: "safepocket-5bcd1.firebaseapp.com",
  projectId: "safepocket-5bcd1",
  storageBucket: "safepocket-5bcd1.firebasestorage.app",
  messagingSenderId: "1093440314935",
  appId: "1:1093440314935:web:e7cd735e50481d876569b2",
  measurementId: "G-LQMDGNZ57Z"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };