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
        setTeacherName(user.email); // Store teacher's email correctly
      }
    });
  }, []);

  const fetchStudents = () => {
    if (teacherName) {
      axios
        .get(`http://localhost:5000/teacher-courses/${teacherName}`)
        .then((res) => {
          // Initialize marks fields if not set
          const updatedStudents = res.data.map(student => ({
            ...student,
            marks1: student.Assessment1 || "",
            marks2: student.Assessment2 || "",
            marks3: student.Assessment3 || "",
            marks4: student.Total || "",
            extraColumn: student.Contact || ""
          }));
          setStudents(updatedStudents);
        })
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

  // Function to update marks in local state
  const handleMarkChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  // Function to save all marks at once
  const handleSaveAllMarks = () => {
    axios
      .post("http://localhost:5000/update-marks", {
        students: students.map(student => ({
          studentEmail: student.email, // Use student email as ID
          Assessment1: student.marks1,
          Assessment2: student.marks2,
          Assessment3: student.marks3,
          Total: student.marks4
        }))
      })
      .then(() => alert("Marks saved for all students successfully!"))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h2>
        Enrolled Students for {students.length > 0 ? students[0].courseName : "Loading..."}
      </h2>

      <table border="1">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Student Name</th>
            <th>Student Email</th>
            <th>Assessment 1</th>
            <th>Assessment 2</th>
            <th>Assessment 3</th>
            <th>Total</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student, index) => (
              <tr key={index}>
                <td>{student.courseName}</td>
                <td>{student.studentName}</td>
                <td>{student.email}</td>
                <td>
                  <input
                    type="number"
                    value={student.marks1}
                    onChange={(e) => handleMarkChange(index, "marks1", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={student.marks2}
                    onChange={(e) => handleMarkChange(index, "marks2", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={student.marks3}
                    onChange={(e) => handleMarkChange(index, "marks3", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={student.marks4}
                    onChange={(e) => handleMarkChange(index, "marks4", e.target.value)}
                  />
                </td>
                <td>{student.extraColumn}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No students enrolled yet</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Save All Marks Button */}
      <button onClick={handleSaveAllMarks} style={{ marginTop: "10px" }}>
        Save All Marks
      </button>
    </div>
  );
}

export default TeacherCourses;
