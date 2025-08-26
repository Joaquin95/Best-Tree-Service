import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";

if (!process.env.REACT_APP_FIREBASE_API_KEY) {
  throw new Error("Missing Firebase API key in .env");
}
if (!process.env.REACT_APP_FIREBASE_AUTH_DOMAIN) {
  throw new Error("Missing Firebase auth domain in .env");
}
if (!process.env.REACT_APP_FIREBASE_PROJECT_ID) {
  throw new Error("Missing Firebase project ID in .env");
}
if (!process.env.REACT_APP_FIREBASE_STORAGE_BUCKET) {
  throw new Error("Missing Firebase storage bucket in .env");
}
if (!process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID) {
  throw new Error("Missing Firebase messaging sender ID in .env");
}
if (!process.env.REACT_APP_FIREBASE_APP_ID) {
  throw new Error("Missing Firebase app ID in .env");
}
if (!process.env.REACT_APP_FIREBASE_MEASUREMENT_ID) {
  throw new Error("Missing Firebase measurement ID in .env");
}

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
  throw new Error("Missing Firebase config in .env");
}

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app, "us-central1");

export const analytics = getAnalytics(app);
export const onFormSubmit = httpsCallable(functions, "onFormSubmit");
