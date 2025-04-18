import React, { useState } from 'react';
import { db, collection, addDoc } from './firebase';

const InternshipForm = () => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [personsRequired, setPersonsRequired] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const internshipData = {
        company,
        role,
        personsRequired,
        createdAt: new Date(),
      };
      await addDoc(collection(db, 'alumniInternships'), internshipData);
      console.log('Internship added successfully');
    } catch (error) {
      console.error('Error adding internship: ', error);
    }
  };

  return (
    <div>
      <h2>Add Internship</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Persons Required"
          value={personsRequired}
          onChange={(e) => setPersonsRequired(e.target.value)}
          required
        />
        <button type="submit">Add Internship</button>
      </form>
    </div>
  );
};

export default InternshipForm;
