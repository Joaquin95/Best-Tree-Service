import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAUSar_kS1Joope969e4YCIeTqsn4urA1s",
  authDomain: "best-tree-service-a1029.firebaseapp.com",
  projectId: "best-tree-service-a1029",
  storageBucket: "best-tree-service-a1029.appspot.com",
  messagingSenderId: "560778312218",
  appId: "1:560778312218:web:9fac7624783d1ae56bafa3",
  measurementId: "G-D8XD4CHBRB"

};

const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);
