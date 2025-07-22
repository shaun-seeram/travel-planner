import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDJgweN847EblBQV-JNQ50Vu-Pw8lLCvz8",
    authDomain: "travel-planner-1091a.firebaseapp.com",
    databaseURL: "https://travel-planner-1091a-default-rtdb.firebaseio.com",
    projectId: "travel-planner-1091a",
    storageBucket: "travel-planner-1091a.firebasestorage.app",
    messagingSenderId: "674143267200",
    appId: "1:674143267200:web:65c2dd4126686dd4d97965"
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  export const db = getDatabase(app)
  export default auth;


  // Notes

  // PRIOR to init, currentUser is initially null, until init has taken place...
  // Storing data (uid, tokenExpiration) in local storage would allow user to modify and briefly access pages they shouldn't...
  // Issue: Might have to add loader calls to FB for each protected route...
  // Solution? Protected loaders > If redux has UID, continue, if not, do FB check?