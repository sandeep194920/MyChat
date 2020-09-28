import React, { useState, useRef } from "react";
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
      <header className="App-header">
        <h2>My Chat</h2>
        <Signout />
      </header>

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
    auth.currentUser && (
      <button
        style={{
          background: "#eba834",
          borderRadius: "20px",
          color: "black",
          fontSize: "15px",
          fontWeight: "bold",
        }}
        onClick={() => auth.signOut()}
      >
        Logout
      </button>
    )
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
  // used in chatMessage comp to send the message
  const [formValue, setFormValue] = useState("");
  // useRef is used which is referenced in the SendMessage comp inside div to scroll to the end of the message after sending it every time
  const dummy = useRef();

  // when user types a message and submits, this triggers. It is declared as async function as we are using await inside
  const sendMessage = async (e) => {
    e.preventDefault(); // prevents page refresh after sending message
    // checks if the message is typed or not
    if (formValue.length < 1) {
      return;
    }
    const { uid, photoURL } = auth.currentUser; // since we logged in with google, we already have access to photoURL

    // creating a new document of messages in firebase. await removes the need of using then keyword
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid, // this is similar to writing uid:uid. Since both are same, we can cut short to uid. Same applies for photoURL
      photoURL,
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        {/* this div helps us to autoscroll to the bottom after each message when used with useRef */}
        <div ref={dummy}></div>
      </main>
      {/* form for the user to send the message */}
      <form onSubmit={sendMessage}>
        <input
          placeholder="Say something nice"
          type="text"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        {/* Use any of them as send btn -  🤳🏹🪁 */}
        <button type="submit">
          {/* to use emoji we need to enclose with span with a role and aria-label to avoid the warning message */}
          <span role="img" aria-label="emoji">
            🏹
          </span>
        </button>
      </form>
    </>
  );

  // ChatMessage Component
  function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;
    // Our chat should appear on right side and others' chats should appear on left. This is done by comparing uid and apply css accordingly

    const messageClass = uid === auth.currentUser.uid ? "sent" : "received"; // if the uid contained in the message object in firestore is equal to the current user id then it means we have sent the message

    return (
      <>
        <div className={`message ${messageClass}`}>
          <img src={photoURL} alt="img" />
          <p>{text}</p>
        </div>
      </>
    );
  }
}

export default App;
