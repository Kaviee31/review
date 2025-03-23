import React, { useState } from 'react';
import './TeacherDashboard.css';

function TeacherDashboard() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="app-container">
      <div className="dashboard-content">
        <h2>Plan Your Schedule</h2>

        <label>Enter Course Name:</label>
        <input type="text" placeholder="Course" />

        <label>Enter Number of Hours you can Spend Per Week:</label>
        <input type="number" placeholder="Hours" min="1" />

        <label>Select Start Date:</label>
        <input type="date" />

        <label>Select End Date:</label>
        <input type="date" />

        <label>Upload Course Material (PDF or JPG only):</label>
        <input type="file" accept=".pdf, .jpg" onChange={handleFileChange} />

        {selectedFile && <p>Selected File: {selectedFile.name}</p>}

        <button type='submit' value='submit'> Submit</button >
      </div>
    </div>
  );
}

export default TeacherDashboard;
