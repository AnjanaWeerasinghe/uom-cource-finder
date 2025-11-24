import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";


// ✅ paste your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyBNol1Wnf0e_kGf9RLCu8npGS3a7AJOxN4",
  authDomain: "uom-course-finder.firebaseapp.com",
  projectId: "uom-course-finder",
  storageBucket: "uom-course-finder.firebasestorage.app",
  messagingSenderId: "1010690347348",
  appId: "1:1010690347348:web:0dabfad540e092138938c1",
  measurementId: "G-T6Y68X1N1R"
};

const app = initializeApp(firebaseConfig);


// ✅ Important for React Native persistence
// Firebase recommends custom persistence using AsyncStorage for RN/Expo. 
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});




export const db = getFirestore(app);
