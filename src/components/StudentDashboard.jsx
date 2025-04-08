import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentDashboard.css";
import { Link } from "react-router-dom";

function StudentDashboard() {
  const [studentName, setStudentName] = useState("Guest");
  const [registerNumber, setRegisterNumber] = useState("");

  useEffect(() => {
    const fetchUserData = async (user) => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setStudentName(userData.username || user.email);
          setRegisterNumber(userData.registerNumber || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user);
      }
    });
  }, []);

  const courses = [
    {
      name: "Full Stack Software Development",
      teacher: "Dr. Sangeetha",
      teacherEmail: "tsai8004@gmail.com"
    },
    {
      name: "Design and Analysis of Algorithms",
      teacher: "Dr. Arul Deepa",
      teacherEmail: "pkssjr43@gmail.com"
    }
  ];

  const handleEnroll = async (courseName, teacherName, teacherEmail) => {
    try {
      await axios.post("http://localhost:5000/enroll", {
        studentName,
        registerNumber,
        courseName,
        teacherName,
        teacherEmail
      });
      alert(`Enrolled successfully in ${courseName}!`);
    } catch (error) {
      alert(error.response?.data?.error || "Error enrolling");
    }
  };
  

  return (
    <div className="student">
      <h2>Welcome, {studentName}!</h2>
      <p>Register Number: {registerNumber}</p>

      {courses.map((course, index) => (
        <div key={index} className="course-container">
          <p>{course.name} - {course.teacher}</p>
          <button
            className="enroll-btn"
            onClick={() =>
              handleEnroll(course.name, course.teacher, course.teacherEmail)
            }
          >
            Enroll
          </button>
        </div>
      ))}

      <div className="link-container">
        <Link to="/student-courses" className="view-courses-link">
          <button className="view-courses-btn">View My Courses</button>
        </Link>
      </div>
    </div>
  );
}

export default StudentDashboard;
