import React from 'react';
import { useLocation } from 'react-router-dom';
import "./TeacherSyllabus.css"

const TeacherSyllabus = () => {
  const location = useLocation();
  const { prompt, formData } = location.state || {}; // Retrieve state passed from TeacherDashboard

  return (
    <div className="syllabus-container">
      <h1>Study Plan for {formData?.course}</h1>
      <p><strong>Received prompt:</strong> {prompt}</p>

      <h3>Generated Study Plan:</h3>
      <div className="study-plan">
        {formData?.studyPlan ? (
          <p>{formData.studyPlan}</p>
        ) : (
          <p>Loading study plan...</p>
        )}
      </div>

      <div className="syllabus-details">
        <h4>Course Details:</h4>
        <ul>
          <li><strong>Start Date:</strong> {formData?.startDate}</li>
          <li><strong>End Date:</strong> {formData?.endDate}</li>
          <li><strong>Hours per Week:</strong> {formData?.hoursPerWeek}</li>
          <li><strong>Syllabus Topics:</strong> {formData?.syllabus}</li>
        </ul>
      </div>
    </div>
  );
};

export default TeacherSyllabus;
