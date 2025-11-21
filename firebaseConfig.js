import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4PVU-WIqd6duoE2iwsBPhJcdHOS4QN_Y",
  authDomain: "moyeora-5efa2.firebaseapp.com",
  projectId: "moyeora-5efa2",
  storageBucket: "moyeora-5efa2.firebasestorage.app",
  messagingSenderId: "375606501252",
  appId: "1:375606501252:web:784e0c90a4b47da4f887d1",
  measurementId: "G-VTTZQFZ3EF"
};

// Initialize Firebase
// Firebase 앱 생성
const app = initializeApp(firebaseConfig);

// React Native에서 Auth Persistence 설정
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };