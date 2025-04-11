import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Make sure this is the correct path
import { collection, getDocs } from "firebase/firestore";


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
      <h2>Available Internships</h2>
      {internships.length === 0 ? (
        <p>No internships available at the moment.</p>
      ) : (
        <ul>
          {internships.map((intern) => (
            <li key={intern.id} className="intern-card">
              <h3>{intern.role} at {intern.company}</h3>
              <p><strong>Name:</strong> {intern.name}</p>
              <p><strong>Designation:</strong> {intern.designation}</p>
              <p><strong>Email:</strong> {intern.email}</p>
              <p><strong>Mobile:</strong> {intern.mobile}</p>
              <p><strong>Persons Required:</strong> {intern.personsRequired}</p>
              <p><strong>Last Date to Apply:</strong> {intern.lastDate}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AvailableIntern;
