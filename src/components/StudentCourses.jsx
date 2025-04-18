import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import ChatWindow from "./ChatWindow";
import "./StudentCourses.css";

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [registerNumber, setRegisterNumber] = useState("");
  const [studentName, setStudentName] = useState("");
  const [selectedTeacherEmail, setSelectedTeacherEmail] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchRegisterNumber = async (user) => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRegisterNumber(data.registerNumber);
          setStudentName(data.username);
        }
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchRegisterNumber(user);
      }
    });
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      if (registerNumber) {
        try {
          const response = await axios.get(`http://localhost:5000/student-courses/${registerNumber}`);
          setCourses(response.data);
        } catch (error) {
          console.error("Error fetching student courses:", error);
        }
      }
    };

    fetchCourses();
  }, [registerNumber]);

  const handleCloseChat = () => {
    setSelectedTeacherEmail(null);
  };

  return (
    <div className={`student-courses-container-wrapper ${darkMode ? "dark" : ""}`}>
      <div className="student-courses-layout">
        <div className="student-courses-container">
          <div className="header-bar">
            <h2 className="header">
              Enrolled Courses for: <span>{registerNumber || "Loading..."}</span>
            </h2>
            <button className="toggle-mode" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀️ " : "🌙 "}
            </button>
          </div>

          {courses.length > 0 ? (
            <div className="course-list">
              {courses.map((course, index) => (
                <div key={index} className="course-card fade-in">
                  <div className="course-header">
                    <h3>{course.courseName}</h3>
                    <button onClick={() => setSelectedTeacherEmail(course.teacherEmail)} className="chat-btn">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/2462/2462719.png"
                        alt="Chat"
                        width="20"
                      />
                    </button>
                  </div>
                  <p className="instructor">Instructor: {course.teacherName}</p>
                  <table className="course-table">
                    <thead>
                      <tr>
                        <th>Assessment 1</th>
                        <th>Assessment 2</th>
                        <th>Assessment 3</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{course.Assessment1}</td>
                        <td>{course.Assessment2}</td>
                        <td>{course.Assessment3}</td>
                        <td><strong>{course.Total}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-courses">No enrolled courses yet.</p>
          )}
        </div>

        {selectedTeacherEmail && (
          <div className="chat-window-wrapper">
            <ChatWindow
              currentUser={registerNumber}
              contactUser={selectedTeacherEmail}
              onClose={handleCloseChat}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentCourses;
