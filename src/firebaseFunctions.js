import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseConfig } from "./firebaseConfig";  // your config file


const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);


export const onFormSubmit = httpsCallable(functions, "onFormSubmit");