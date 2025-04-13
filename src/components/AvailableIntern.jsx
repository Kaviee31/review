import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./AvailableIntern.css"; // <-- Add this line

function AvailableIntern() {
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "alumniInternships"));
        const data = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((intern) => {
            const today = new Date();
            const lastDate = new Date(intern.lastDate);
            return lastDate >= today;
          });
        setInternships(data);
      } catch (error) {
        console.error("Error fetching internships:", error);
      }
    };

    fetchInternships();
  }, []);

  return (
    <div className="internships-container">
      <h2>✨ Available Internships</h2>
      {internships.length === 0 ? (
        <p className="empty">No internships available at the moment.</p>
      ) : (
        <div className="intern-grid">
          {internships.map((intern) => (
            <div key={intern.id} className="intern-card">
              <h3>{intern.role}</h3>
              <p><strong>Company:</strong> {intern.company}</p>
              <p><strong>Posted by:</strong> {intern.name}, {intern.designation}</p>
              <p><strong>Email:</strong> {intern.email}</p>
              <p><strong>Mobile:</strong> {intern.mobile}</p>
              <p><strong>Persons Required:</strong> {intern.personsRequired}</p>
              <p><strong>Last Date:</strong> {intern.lastDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AvailableIntern;
