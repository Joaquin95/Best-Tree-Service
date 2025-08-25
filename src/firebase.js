// src/firebase.js

import { initializeApp } from "firebase/app";
import {
  getFunctions,
  connectFunctionsEmulator
} from "firebase/functions";

// your Firebase web config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "best-tree-service-a1029.firebaseapp.com",
  projectId: "best-tree-service-a1029",
  storageBucket: "best-tree-service-a1029.appspot.com",
  messagingSenderId: "560778312218",
  appId: "1:560778312218:web:9fac7624783d1ae56bafa3",
  measurementId: "G-D8XD4CHBRB"
};

// initialize the app
const app = initializeApp(firebaseConfig);

// point at your us-central1 functions by default
const functions = getFunctions(app, "us-central1");

// in local dev, talk to the emulator (no CORS headache)
if (window.location.hostname === "localhost") {
  connectFunctionsEmulator(functions, "localhost", 5001);
}

// export only once
export { functions };