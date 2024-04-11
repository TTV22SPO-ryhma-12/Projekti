// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage, ref, uploadString } from "firebase/storage";
import {
  FIREBASEAPIKEY,
  FIREBASEAUTHDOMAIN,
  FIREBASEPROJECTID,
  FIREBASESTORAGEBUCKET,
  FIREBASEMESSAGINGSENDERID,
  FIREBASEAPPID

} from "@env"


const firebaseConfig = {
  apiKey: FIREBASEAPIKEY,
  authDomain: FIREBASEAUTHDOMAIN,
  projectId: FIREBASEPROJECTID,
  storageBucket: FIREBASESTORAGEBUCKET,
  messagingSenderId: FIREBASEMESSAGINGSENDERID,
  appId: FIREBASEAPPID,
};

initializeApp(firebaseConfig);
const firestore =  getFirestore();
const auth = getAuth();
const storage = getStorage();

 
export {
  firestore,
  collection,
  addDoc,
  serverTimestamp,
  auth,
  storage
}