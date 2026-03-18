import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBnLkG6tslt8YmOc_Pq6Opn44jBOHo2ywM",
  authDomain: "esl-games-23e0a.firebaseapp.com",
  projectId: "esl-games-23e0a",
  storageBucket: "esl-games-23e0a.firebasestorage.app",
  messagingSenderId: "396575348952",
  appId: "1:396575348952:web:d93e82ab49a63a15415fad",
};

const app = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(app);
export const storage = getStorage(app);
