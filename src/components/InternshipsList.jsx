import React, { useState, useEffect } from 'react';
import { db, collection, getDocs } from './firebase';

const InternshipsList = () => {
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    const fetchInternships = async () => {
      const querySnapshot = await getDocs(collection(db, 'alumniInternships'));
      const internshipsArray = [];
      querySnapshot.forEach((doc) => {
        internshipsArray.push({ id: doc.id, ...doc.data() });
      });
      setInternships(internshipsArray);
    };

    fetchInternships();
  }, []);

  return (
    <div>
      <h2>Internships</h2>
      <ul>
        {internships.map((internship) => (
          <li key={internship.id}>
            {internship.company} - {internship.role} (Required: {internship.personsRequired})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InternshipsList;
