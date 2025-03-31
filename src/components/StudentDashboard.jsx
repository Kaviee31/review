import React, { useEffect, useState } from 'react';
import { auth } from '../firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import axios from 'axios';
import './StudentDashboard.css';
import { Link } from "react-router-dom";

function StudentDashboard() {
  const [studentName, setStudentName] = useState("Guest");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setStudentName(user.displayName || user.email);
      }
    });
  }, []);

  // Courses with respective teacher emails
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
        courseName,
        teacherName,
        teacherEmail, // Assign correct email dynamically
      });
      alert(`Enrolled successfully in ${courseName}!`);
    } catch (error) {
      alert(error.response?.data?.error || "Error enrolling");
    }
  };

  return (
    <div className="student">
      <h2>Welcome, {studentName}!</h2>
      {courses.map((course, index) => (
        <div key={index} className="course-container">
          <p>{course.name} - {course.teacher}</p>
          <button 
            className="enroll-btn" 
            onClick={() => handleEnroll(course.name, course.teacher, course.teacherEmail)}
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
