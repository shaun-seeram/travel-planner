import { initializeApp } from "firebase/app";
import { getDatabase, ref, remove, set, update } from "firebase/database"
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

  export const latlonkey = "QXrbYHhG2NKXNO6dGMARhg==VCu1VlzdEskHst1K"
  export const geocodingKey = "192c393f9eb54d94825b9ff5610cf057"

  export const fbDelete = (path = "/") => remove(ref(db, auth.currentUser.uid + path))
  export const fbSet = async (path, data) => await set(ref(db, auth.currentUser.uid + path), data)
  export const fbUpdate = async (path, data) => await update(ref(db, auth.currentUser.uid + path), data)

  // Notes

  // PRIOR to init, currentUser is initially null, until init has taken place...
  // Storing data (uid, tokenExpiration) in local storage would allow user to modify and briefly access pages they shouldn't...
  // Issue: Might have to add loader calls to FB for each protected route...
  // Solution? Protected loaders > If redux has UID, continue, if not, do FB check?