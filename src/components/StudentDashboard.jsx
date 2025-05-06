import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TeacherDashboard.css";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [studentName, setStudentName] = useState("Guest");
  const [registerNumber, setRegisterNumber] = useState("");
  const [courses, setCourses] = useState([
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
  ]);
  const [announcement, setAnnouncement] = useState(null);  // State for the latest announcement

  const navigate = useNavigate();

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

    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("https://review-dashboard.onrender.com/all-messages"); // replace with your backend URL
        setAnnouncement(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user);
        fetchAnnouncements();
      }
    });
  }, []);

  const handleEnroll = async (courseName, teacherName, teacherEmail) => {
    try {
      await axios.post("https://review-dashboard.onrender.com/enroll", {
        studentName,
        registerNumber,
        courseName,
        teacherName,
        teacherEmail
      });
      alert(`Enrolled successfully in ${courseName}!`);
      setCourses(prevCourses => prevCourses.filter(course => course.name !== courseName));
    } catch (error) {
      alert(error.response?.data?.error || "Error enrolling");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/"); // Redirect to the home or login page after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="app-container">
      <nav className="teacher-sidebar">
        <div className="sidebar-title">📚</div>
        <div className="sidebar-links">
          <button onClick={() => navigate("/student-dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/student-courses")}>My Courses</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="dashboard-content">
        <h2>Welcome, {studentName}!</h2>
        <p>Register Number: {registerNumber}</p>

        
        {announcement && announcement.length > 0 && (
  <div style={{ marginBottom: "20px" }}>
    {announcement.map((item, index) => (
      <p key={index} style={{ fontWeight: 'bold', color: 'black', fontSize: '18px' }}>
        Announcement: {item.content}
      </p>
    ))}
  </div>
)}

        {courses.map((course, index) => (
          <div key={index} className="course-item">
            <p>{course.name} - {course.teacher}</p>
            <button
              onClick={() =>
                handleEnroll(course.name, course.teacher, course.teacherEmail)
              }
            >
              Enroll
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentDashboard;
