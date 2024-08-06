// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyBjAo4po2mSyX5KejZ_ZWAVn68WfqfspEQ",
    authDomain: "fintech-2-ee373.firebaseapp.com",
    projectId: "fintech-2-ee373",
    storageBucket: "fintech-2-ee373.appspot.com",
    messagingSenderId: "323017105769",
    appId: "1:323017105769:web:cf7bc04b4948104f0d9df8"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
