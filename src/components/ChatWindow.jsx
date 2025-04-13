import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, addDoc, where } from "firebase/firestore";

function ChatWindow({ currentUser, contactUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentUser || !contactUser) return;

    const chatKey = currentUser < contactUser
      ? `${currentUser}_${contactUser}`
      : `${contactUser}_${currentUser}`;

    const messagesRef = collection(db, "chats", chatKey, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
      // Scroll to the latest message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [currentUser, contactUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const chatKey = currentUser < contactUser
      ? `${currentUser}_${contactUser}`
      : `${contactUser}_${currentUser}`;

    const messagesRef = collection(db, "chats", chatKey, "messages");
    await addDoc(messagesRef, {
      senderId: currentUser,
      receiverId: contactUser,
      message: newMessage,
      timestamp: new Date(),
    });
    setNewMessage("");
  };

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "10px", margin: "10px", maxHeight: "300px", overflowY: "auto" }}>
      <h3>Chat with {contactUser}</h3>
      <div style={{ marginBottom: "10px" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              padding: "8px",
              borderRadius: "5px",
              marginBottom: "5px",
              backgroundColor: msg.senderId === currentUser ? "#e0f7fa" : "#f5f5f5",
              textAlign: msg.senderId === currentUser ? "right" : "left",
            }}
          >
            <strong>{msg.senderId === currentUser ? "You" : msg.senderId}:</strong> {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} style={{ display: "flex" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ flexGrow: 1, padding: "8px", borderRadius: "3px", border: "1px solid #ddd" }}
        />
        <button type="submit" style={{ padding: "8px 12px", marginLeft: "10px", borderRadius: "3px", border: "none", backgroundColor: "#007bff", color: "white", cursor: "pointer" }}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;