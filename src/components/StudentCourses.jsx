import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [studentEmail, setStudentEmail] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setStudentEmail(user.email); // Use email as student ID
      }
    });
  }, []);

  useEffect(() => {
    if (studentEmail) {
      axios
        .get(`http://localhost:5000/student-courses/${studentEmail}`)
        .then((res) => setCourses(res.data))
        .catch((err) => console.log(err));
    }
  }, [studentEmail]);

  return (
    <div>
      <h2>Enrolled Courses for {studentEmail || "Loading..."}</h2>

      {courses.length > 0 ? (
        courses.map((course, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <h3>Course: {course.courseName} (Instructor: {course.teacherName})</h3>
            <table border="1">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Teacher Name</th>
                  <th>Student Email</th>
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
                  <td>{studentEmail}</td>
                  <td>{course.Assessment1}</td>
                  <td>{course.Assessment2}</td>
                  <td>{course.Assessment3}</td>
                  <td>{course.Total }</td>
                  <td>{course.Contact }</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No enrolled courses yet.</p>
      )}
    </div>
  );
}

export default StudentCourses;
