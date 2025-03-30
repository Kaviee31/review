import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function TeacherCourses() {
  const [students, setStudents] = useState([]);
  const [teacherName, setTeacherName] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setTeacherName(user.email); // Store the teacher's email correctly
      }
    });
  }, []);

  const fetchStudents = () => {
    if (teacherName) {
      axios
        .get(`http://localhost:5000/teacher-courses/${teacherName}`)
        .then((res) => setStudents(res.data))
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [teacherName]); // Fetch data whenever teacherName updates

  // Polling every 5 seconds to keep data updated
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStudents();
    }, 5000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div>
      <h2>Enrolled Students for {teacherName || "Loading..."}</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Student Name</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student, index) => (
              <tr key={index}>
                <td>{student.courseName}</td>
                <td>{student.studentName}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No students enrolled yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherCourses;
