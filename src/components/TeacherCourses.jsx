import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function TeacherCourses() {
  const [students, setStudents] = useState([]);
  const [teacherName, setTeacherName] = useState("Guest");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setTeacherName(user.displayName || user.email);
      }
    });
  }, []);

  useEffect(() => {
    if (teacherName !== "Guest" && teacherName !== "") {
      axios.get(`http://localhost:5000/teacher-courses/${teacherName}`)
        .then((res) => setStudents(res.data))
        .catch((err) => console.log(err));
    }
  }, [teacherName]);
  

  return (
    <div>
      <h2>Enrolled Students for {teacherName}</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Student Name</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.courseName}</td>
              <td>{student.studentName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherCourses;
