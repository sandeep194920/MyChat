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

// App Component
function App() {
  // if user is loggedin, it returns user id, email and other info
  const [user] = useAuthState(auth);
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
function Signout() {
  // check if the user is logged in using .currentuser and then display the logout btn if current user exists
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign out</button>
  );
}

// ChatRoom Component
function ChatRoom() {
  // in firebase we create a 'messages' collection
  const messagesRef = firestore.collection("messages");
  // we need to order these messages by timeStamp and limit it to maximum of 50
  const query = messagesRef.orderBy("createdAt").limit(50);
  // we can now listen to any updated to the 'messages' collection in real time using the hook useCollectionData. idField is an optional param which tells what should be the id and here we have 'id' itself as id where each message will have it
  const [messages] = useCollectionData(query, { idField: "id" });
  return (
    <>
      <div>
        {messages &&
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
      </div>
      <div></div>
    </>
  );

  // ChatMessage Component
  function ChatMessage(props) {
    const { text, uid } = props.message;
    return <p>{text}</p>;
  }
}

export default App;
