// firebaseConfig.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; // ✅ ADD THIS

const firebaseConfig = {
  apiKey: "AIzaSyDA_uh3asg2JRb5Y8YWOF7miuKMzjXXQiM",
  authDomain: "allergyguard-44fe9.firebaseapp.com",
  projectId: "allergyguard-44fe9",
  storageBucket: "allergyguard-44fe9.appspot.com",
  messagingSenderId: "222585366862",
  appId: "1:222585366862:web:aa5c14c141ea3f12e6961f"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore(); // ✅ ADD THIS
export default firebase;


