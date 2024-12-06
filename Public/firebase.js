import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendEmailVerification,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    GoogleAuthProvider,
    signInWithPopup
}from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    collection,
    getDocs,
    addDoc,
    onSnapshot,
    serverTimestamp,
    query, 
    orderBy,
    where,
    
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCu1S5M-V35XLi38qy6UlDljUz66279GRo",
    authDomain: "demoproject-545c5.firebaseapp.com",
    projectId: "demoproject-545c5",
    storageBucket: "demoproject-545c5.firebasestorage.app",
    messagingSenderId: "503972781048",
    appId: "1:503972781048:web:14da78faf9d6e1def5d40d",
    measurementId: "G-3650JCYRM8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendEmailVerification,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    GoogleAuthProvider,
    provider,
    signInWithPopup,
    getFirestore,
    doc,
    setDoc,
    db,
    getDoc,
    updateDoc,
    deleteDoc,
    collection,
    getDocs,
    addDoc,
    onSnapshot,
    serverTimestamp,
    query, 
    orderBy,
    where,
}