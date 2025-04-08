import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import ChatWindow from "./ChatWindow";

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [registerNumber, setRegisterNumber] = useState("");
  const [studentName, setStudentName] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

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

  return (
    <div>
      <h2>Enrolled Courses for: {registerNumber || "Loading..."}</h2>

      {courses.length > 0 ? (
        courses.map((course, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <h3>Course: {course.courseName} (Instructor: {course.teacherName})</h3>
            <table border="1">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Teacher Name</th>
                  <th>Register Number</th>
                  <th>Assessment 1</th>
                  <th>Assessment 2</th>
                  <th>Assessment 3</th>
                  <th>Total</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{course.courseName}</td>
                  <td>{course.teacherName}</td>
                  <td>{registerNumber}</td>
                  <td>{course.Assessment1}</td>
                  <td>{course.Assessment2}</td>
                  <td>{course.Assessment3}</td>
                  <td>{course.Total}</td>
                  <td>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/2462/2462719.png"
                      alt="Chat"
                      width="20"
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedTeacher(course.teacherName)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No enrolled courses yet.</p>
      )}

      {selectedTeacher && (
        <ChatWindow currentUser={registerNumber} contactUser={selectedTeacher} />
      )}
    </div>
  );
}

export default StudentCourses;
