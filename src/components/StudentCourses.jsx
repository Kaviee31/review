import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [studentName, setStudentName] = useState("Guest");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setStudentName(user.displayName || user.email);
      }
    });
  }, []);

  useEffect(() => {
    if (studentName !== "Guest") {
      axios.get(`http://localhost:5000/student-courses/${studentName}`)
        .then((res) => setCourses(res.data))
        .catch((err) => console.log(err));
    }
  }, [studentName]);

  return (
    <div>
      <h2>Enrolled Courses for {studentName}</h2>
      <ul>
        {courses.map((course, index) => (
          <li key={index}>{course.courseName} - {course.teacherName}</li>
        ))}
      </ul>
    </div>
  );
}

export default StudentCourses;
