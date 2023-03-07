import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwvDyHAPnGZelXhGj_E6ZyKXRdCrglTa8",
  authDomain: "skillset-28685.firebaseapp.com",
  projectId: "skillset-28685",
  storageBucket: "skillset-28685.appspot.com",
  messagingSenderId: "229398256425",
  appId: "1:229398256425:web:95564fc6b7197304087538"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore();
}

export const db = firebase.firestore();

export default firebase;
