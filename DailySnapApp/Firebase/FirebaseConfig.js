// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-JwRhk7oL5TcymJtlQZAX2AxdRZl4X1g",
  authDomain: "dailysnapapp-15efb.firebaseapp.com",
  projectId: "dailysnapapp-15efb",
  storageBucket: "dailysnapapp-15efb.appspot.com",
  messagingSenderId: "63037632718",
  appId: "1:63037632718:web:199ea99802d5b0f7d2209f"
};

initializeApp(firebaseConfig);
const firestore =  getFirestore();
const auth = getAuth();


 
export {
  firestore,
  collection,
  addDoc,
  serverTimestamp,
  messages,
  auth


}