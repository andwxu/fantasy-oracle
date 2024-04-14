// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCa9dNGDeXhUimYhI7IUeqLR8ZPn_fOv7A",
  authDomain: "oracle-c2281.firebaseapp.com",
  projectId: "oracle-c2281",
  storageBucket: "oracle-c2281.appspot.com",
  messagingSenderId: "252995969803",
  appId: "1:252995969803:web:5b68b07a707afd29cb380e",
  measurementId: "G-BKWBGQHCKC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);