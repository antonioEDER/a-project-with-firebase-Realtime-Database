import firebase from "firebase";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyB3eAz012fqKvSrxpbvfV1Wkx1XRHk8FbQ",
  authDomain: "a-project-with-firebase-670d5.firebaseapp.com",
  projectId: "a-project-with-firebase-670d5",
  storageBucket: "a-project-with-firebase-670d5.appspot.com",
  messagingSenderId: "111625725383",
  appId: "1:111625725383:web:7f63a7db9aebf361a9e5e2",
  databaseURL: "https://a-project-with-firebase-670d5-default-rtdb.firebaseio.com",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database;

window.dbRefUsers = database


