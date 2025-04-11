// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp, getApp, getApps} from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZT_NrA_4usav0bacjUX-0PMq3GYy-ajI",
  authDomain: "prepwise-565c8.firebaseapp.com",
  projectId: "prepwise-565c8",
  storageBucket: "prepwise-565c8.firebasestorage.app",
  messagingSenderId: "787396778222",
  appId: "1:787396778222:web:fd87f3fdc2e05d0552fbff",
  measurementId: "G-ZG72RC5CFZ"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);