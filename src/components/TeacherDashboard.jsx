import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth"; 
import SyllabusDisplay from './SyllabusDisplay';
import './TeacherDashboard.css';
import { generateStudyPlan } from '../api/generateStudyPlan';
import axios from "axios";


function TeacherDashboard() {
  const [courseName, setCourseName] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [syllabus, setSyllabus] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setShowSyllabus(false);
  
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
  
      const token = await user.getIdToken();
  
      const formData = {
        syllabus,
        courseName,
        hoursPerWeek,
        startDate,
        endDate,
      };
  
      const studyPlan = await generateStudyPlan(formData, token); // pass formData and token
  
      setSyllabus(studyPlan);
  
      navigate('/teacher-syllabus', {
        state: {
          formData: {
            course: courseName,
            startDate,
            endDate,
            hoursPerWeek,
            syllabus,
            studyPlan,
          },
        },
      });
  
    } catch (error) {
      console.error('Error generating syllabus:', error);
      setSyllabus('Error generating syllabus. Please try again.');
    } finally {
      setLoading(false);
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
        <div className="sidebar-title">📘</div>
        <div className="sidebar-links">
          <button onClick={() => navigate("/student-dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/teacher-courses")}>Enrolled Students</button>
          <button onClick={() => navigate("/available-intern")}>Internships</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
  
      {/* Dashboard Content Start */}
      <div className="dashboard-content">
        <h2>Send Announcement to Students</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await axios.post('http://localhost:5000/post-message', { content: announcement });
              alert("Message sent successfully!");
              setAnnouncement('');
            } catch (error) {
              console.error("Error sending announcement:", error);
              alert("Failed to send announcement.");
            }
          }}
        >
          <input
            type="text"
            placeholder="Type your message here..."
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            required
          />
          <button type="submit">Send</button>
        </form>
      </div>
      {/* Dashboard Content End */}
    </div>
  );
  
}

export default TeacherDashboard;
