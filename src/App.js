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

// this must be passed into useAuthState hook to get the user info
const auth = firebase.auth();
const firestore = firebase.firestore();

// if user is loggedin, it returns user id, email and other info
const [user] = useAuthState(auth);

// App Component
function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      {/* if user -> show chatroom, else show signin */}
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

// SignIn Component
function SignIn() {
  const signInWithGoogle = () => {
    // signin with google
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return <button onClick={signInWithGoogle}>SignIn With Google</button>;
}

// Signout Component
function Signout = () => {

  // check if the user is logged in using .currentuser and then display the logout btn if current user exists
  return auth.currentUser && (
    <button onClick = {()=>auth.signOut()}>Sign out</button>
  )
}
 

// ChatRoom Component
function ChatRoom() {}

export default App;
