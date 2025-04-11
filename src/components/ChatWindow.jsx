import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

function ChatWindow({ currentUser, contactUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentUser || !contactUser) return;

    const messagesRef = collection(db, "messages");

    // Query messages where currentUser is a participant
    const q = query(
      messagesRef,
      where("participants", "array-contains", currentUser),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const filteredMessages = snapshot.docs
        .map((doc) => doc.data())
        .filter(
          (msg) =>
            (msg.sender === currentUser && msg.receiver === contactUser) ||
            (msg.sender === contactUser && msg.receiver === currentUser)
        );

      setMessages(filteredMessages);
    });

    return () => unsubscribe();
  }, [currentUser, contactUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (newMessage.trim() === "") return;
  
    const messagesRef = collection(db, "messages");
  
    await addDoc(messagesRef, {
      sender: currentUser,
      receiver: contactUser,
      text: newMessage.trim(),
      timestamp: serverTimestamp(),
      participants: [currentUser, contactUser].sort(), // 🔑 SORTED for consistency
      chatId: [currentUser, contactUser].sort().join("_"), // 🔑 for querying
    });
  
    setNewMessage("");
  };
  

  return (
    <div style={styles.chatBox}>
      <h4>Chat with {contactUser}</h4>
      <div style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === currentUser ? "flex-end" : "flex-start",
              backgroundColor:
                msg.sender === currentUser ? "#dcf8c6" : "#f1f0f0",
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.sendBtn}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;

const styles = {
  chatBox: {
    border: "1px solid #ccc",
    padding: "10px",
    width: "300px",
    height: "400px",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    position: "fixed",
    bottom: "20px",
    right: "20px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
    zIndex: 1000,
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    backgroundColor: "#fafafa",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  message: {
    padding: "8px 12px",
    borderRadius: "15px",
    maxWidth: "70%",
    wordBreak: "break-word",
  },
  inputContainer: {
    display: "flex",
  },
  input: {
    flex: 1,
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  sendBtn: {
    marginLeft: "8px",
    padding: "8px 12px",
    backgroundColor: "#2196f3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
