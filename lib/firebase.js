import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFunctions} from "firebase/functions";


const firebaseConfig = {
    apiKey: "AIzaSyDKpSfKcaKOMGw287hrqP5Avpced7t7HhU",
    authDomain: "jh-interim-backend-11c5f.firebaseapp.com",
    projectId: "jh-interim-backend-11c5f",
    storageBucket: "jh-interim-backend-11c5f.appspot.com",
    messagingSenderId: "307732447685",
    appId: "1:307732447685:web:83ab3da886f0a1f0bc8bac",
    measurementId: "G-GC80GFM2V2"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
export { auth, db,functions };