// TeacherDashboard.jsx
import React, { useState } from 'react';
import './TeacherDashboard.css';
import SyllabusDisplay from './SyllabusDisplay';

function TeacherDashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [courseName, setCourseName] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [syllabus, setSyllabus] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSyllabus, setShowSyllabus] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSyllabus('');

    try {
        const formData = new FormData();
        formData.append('courseName', courseName);
        formData.append('hoursPerWeek', hoursPerWeek);
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
        formData.append('syllabusFile', selectedFile); // Append the file

        const response = await fetch('http://localhost:3001/api/generate-syllabus', {
            method: 'POST',
            body: formData, // Send FormData instead of JSON
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSyllabus(data.syllabus);
        setShowSyllabus(true);
    } catch (error) {
        console.error('Error generating syllabus:', error);
        setSyllabus('Error generating syllabus. Please try again.');
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="app-container">
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

          <label>Enter Number of Hours you can Spend Per Week:</label>
          <input
            type="number"
            placeholder="Hours"
            min="1"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
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

          <label>Upload Course Material (PDF or JPG only):</label>
          <input type="file" accept=".pdf, .jpg" onChange={handleFileChange} />

          {selectedFile && <p>Selected File: {selectedFile.name}</p>}

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