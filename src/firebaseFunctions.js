import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";



const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};




if (!firebaseConfig.apiKey) {
  throw new Error(
    "Missing Firebase API key. Check your REACT_APP_FIREBASE_API_KEY in .env"
  );
}

const app = initializeApp(firebaseConfig);


export const functions = getFunctions(app);


export const onFormSubmit = httpsCallable(functions, "onFormSubmit");
