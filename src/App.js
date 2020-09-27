import React from "react";
import "./App.css";

//firebase imports  --> for this to work, npm install firebase react-firebase-hooks

import firebase from "firebase/app"; // firebase sdk
import "firebase/firestore";
import "firebase/auth";

//importing firebase hooks
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

// initialize firebase app
firebase.initializeApp({
  // your firebase config
  apiKey: "AIzaSyCxi4zFmIjZVLd1PfOMM8hdlppQ8DTgbKg",
  authDomain: "mychatapp-c5d47.firebaseapp.com",
  databaseURL: "https://mychatapp-c5d47.firebaseio.com",
  projectId: "mychatapp-c5d47",
  storageBucket: "mychatapp-c5d47.appspot.com",
  messagingSenderId: "989551998487",
  appId: "1:989551998487:web:a82fcb408a87c761dd0e52",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
    </div>
  );
}

export default App;
