import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth"; 
import './TeacherDashboard.css';
import { generateStudyPlan } from '../api/generateStudyPlan';
import emailjs from '@emailjs/browser';

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

  const SERVICE_ID = import.meta.env.VITE_REACT_APP_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_REACT_APP_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_REACT_APP_EMAILJS_PUBLICKEY;

  console.log('SERVICE_ID:', SERVICE_ID);
  console.log('TEMPLATE_ID:', TEMPLATE_ID);
  console.log('PUBLIC_KEY:', PUBLIC_KEY);

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
  
      const studyPlan = await generateStudyPlan(formData, token);
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
      const auth = getAuth();
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const result = await emailjs.send(
        'service_7hxdr7i',
        'template_8p5k99j',
        {
          message: announcement,
          to_email: 'kaviee3112@gmail.com', // static for now, later can be looped
        },
        'CALj7UXHXdZxyYqka',
      );
  
      console.log('Email sent:', result);
      alert("Announcement sent via Email!");
      setAnnouncement('');
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send announcement.");
    }
  };
  

  return (
    <div className="app-container">
      <nav className="teacher-sidebar">
        <div className="sidebar-title">📘</div>
        <div className="sidebar-links">
          <button onClick={() => navigate("/teacher-dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/teacher-courses")}>Enrolled Students</button>
          <button onClick={() => navigate("/available-intern")}>Internships</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h2>Send Announcement to Students</h2>
        <form onSubmit={handleAnnouncementSubmit}>
          <input
            type="text"
            placeholder="Type your message here..."
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            required
          />
          <button type="submit">Send Email</button>
        </form>

      </div>
    </div>
  );
}

export default TeacherDashboard;
