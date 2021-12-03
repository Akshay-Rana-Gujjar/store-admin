// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8fS_63_NkbEUffRHoDn_vbsGae1SDnQI",
  authDomain: "akshay-store.firebaseapp.com",
  projectId: "akshay-store",
  storageBucket: "akshay-store.appspot.com",
  messagingSenderId: "679889779214",
  appId: "1:679889779214:web:8f3d6ec62b4ff123701a5f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;