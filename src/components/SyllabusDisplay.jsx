// SyllabusDisplay.jsx
import React from 'react';

function SyllabusDisplay({ syllabus }) {
  return (
    <div className="syllabus-display">
      <h3>Generated Syllabus:</h3>
      <pre>{syllabus}</pre>
    </div>
  );
}

export default SyllabusDisplay;