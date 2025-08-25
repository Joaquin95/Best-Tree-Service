import { initializeApp } from "firebase/app";
import {
  getFunctions,
  connectFunctionsEmulator
} from "firebase/functions";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "best-tree-service-a1029.firebaseapp.com",
  projectId: "best-tree-service-a1029",
  storageBucket: "best-tree-service-a1029.appspot.com",
  messagingSenderId: "560778312218",
  appId: "1:560778312218:web:9fac7624783d1ae56bafa3",
  measurementId: "G-D8XD4CHBRB"
};


const app = initializeApp(firebaseConfig);
const functions = getFunctions(app, "us-central1");


if (window.location.hostname === "localhost") {
  connectFunctionsEmulator(functions, "localhost", 5001);
}


export { functions };