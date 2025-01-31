// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAq9Mqcd6-A-v3bo9SOjXgMjFzmjNb8Iwc",
  authDomain: "tpa-energy-calculator.firebaseapp.com",
  projectId: "tpa-energy-calculator",
  storageBucket: "tpa-energy-calculator.firebasestorage.app",
  messagingSenderId: "656666564469",
  appId: "1:656666564469:web:7a25236cbdca9ceeaca53c",
  measurementId: "G-39S1YZZ84R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);