import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth"; 
import './TeacherDashboard.css';
import { generateStudyPlan } from '../api/generateStudyPlan';
import emailjs from '@emailjs/browser';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // If not already imported


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
  
    if (!announcement) {
      toast.error("Announcement message cannot be empty");
      return;
    }
  
    try {
      const response = await axios.get("https://review-dashboard.onrender.com/all-students");
      const students = response.data;
  
      // Collect all valid BCC emails
      const bccEmails = students
        .filter((student) => student.registerNumber)
        .map((student) => `${student.registerNumber}@student.annauniv.edu`);
  
      if (bccEmails.length === 0) {
        toast.error("No valid student emails found.");
        return;
      }
  
      const templateParams = {
        //to_email: "kaviee3112@gmail.com", // default recipient
        to_name: "Student", // or your preferred name
        message: announcement,
        bcc: bccEmails.join(","),
      };
  
      await emailjs.send(
        'service_bsbrxxs',
        'template_8snwbzk',
        templateParams,
        'KG_9zM7DeZhRC2vTX'
      );
  
      toast.success("Announcement sent via BCC!");
      setAnnouncement("");
    } catch (error) {
      console.error("Error sending announcement:", error);
      toast.error("Failed to send announcement");
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
