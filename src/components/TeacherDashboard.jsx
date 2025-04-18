import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth"; 
import SyllabusDisplay from './SyllabusDisplay';
import './TeacherDashboard.css';
import { generateStudyPlan } from '../api/generateStudyPlan';

function TeacherDashboard() {
  const [courseName, setCourseName] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [syllabus, setSyllabus] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSyllabus, setShowSyllabus] = useState(false);

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
  
      // Create a more structured and clear custom prompt
      const customPrompt = `
        Please create a detailed study plan for the course "${courseName}", which runs from ${startDate} to ${endDate}.
        The course will consist of ${hoursPerWeek} hours of study per week.
        The syllabus topics are as follows:
        ${syllabus}.
        
        The study plan should include:
        1. A breakdown of the topics to be covered by week.
        2. Recommended study methods or tips for each topic.
        3. How to balance the topics over the available weeks.
        4. Suggested assignments or exercises to reinforce learning.
        5. Any additional resources or study tools to help with understanding.
  
        Be sure to distribute the hours evenly across the weeks and provide guidance on managing study time effectively.
      `;
  
      // Use the generateStudyPlan function for the custom prompt
      const studyPlan = await generateStudyPlan(customPrompt); // pass custom prompt
      setSyllabus(studyPlan);

      // Navigate to TeacherSyllabus page and pass the data
      navigate('/teacher-syllabus', {
        state: {
          prompt: customPrompt,
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
      const auth = getAuth(); // Initialize auth here
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
  <button onClick={() => navigate("/teacher-dashboard")}>Dashboard</button>
    <button onClick={() => navigate("/teacher-courses")}>Enrolled Students</button>
    <button onClick={() => navigate("/available-intern")}>Internships</button>
    <button onClick={handleLogout}>Logout</button>
  </div>
</nav>



      <div className="dashboard-content">
        <h2>Plan Your Schedule</h2>
        <form onSubmit={handleSubmit}>
          <label>Enter Course Name:</label>
          <input
            type="text"
            placeholder="Course"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />

          <label>Enter Number of Hours per Week:</label>
          <input
            type="number"
            placeholder="Hours"
            min="1"
            value={hoursPerWeek || ""}
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value) : "";
              setHoursPerWeek(val);
            }}
            required
          />

          <label>Select Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <label>Select End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />

          <label>Enter Syllabus Content:</label>
          <textarea
            rows="5"
            placeholder="Enter the syllabus topics..."
            value={syllabus}
            onChange={(e) => setSyllabus(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Submit'}
          </button>
        </form>

        {showSyllabus && <SyllabusDisplay syllabus={syllabus} />}

        
        
      </div>
    </div>
  );
}

export default TeacherDashboard;
