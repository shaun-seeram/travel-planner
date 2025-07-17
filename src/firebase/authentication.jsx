import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDJgweN847EblBQV-JNQ50Vu-Pw8lLCvz8",
    authDomain: "travel-planner-1091a.firebaseapp.com",
    projectId: "travel-planner-1091a",
    storageBucket: "travel-planner-1091a.firebasestorage.app",
    messagingSenderId: "674143267200",
    appId: "1:674143267200:web:65c2dd4126686dd4d97965"
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  export default auth

  // test