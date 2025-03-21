import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBBVtMJKxFpgX0o1HZ3XVJeCyQTTC_kvP4",
    authDomain: "messenger-e8f7e.firebaseapp.com",
    projectId: "messenger-e8f7e",
    storageBucket: "messenger-e8f7e.firebasestorage.app",
    messagingSenderId: "607796995294",
    appId: "1:607796995294:web:b873268f507c117b1e0e4f",
    measurementId: "G-P13QBKMY6Z"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };