import React, { useState } from "react";
import "./Alumni.css";
import { db } from "../firebase"; // path to firebase config
import { collection, addDoc } from "firebase/firestore";

function Alumni() {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    company: "",
    role: "",
    personsRequired: "",
    email: "",
    mobile: "",
    lastDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "alumniInternships"), formData);
      alert("Form submitted successfully!");
      setFormData({
        name: "",
        designation: "",
        company: "",
        role: "",
        personsRequired: "",
        email: "",
        mobile: "",
        lastDate: "",
      });
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to submit the form. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Internship Requirement Form</h2>

        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Designation</label>
        <input type="text" name="designation" value={formData.designation} onChange={handleChange} required />

        <label>Company Name</label>
        <input type="text" name="company" value={formData.company} onChange={handleChange} required />

        <label>Intern Role</label>
        <input type="text" name="role" value={formData.role} onChange={handleChange} required />

        <label>Number of Persons Required</label>
        <input type="number" name="personsRequired" value={formData.personsRequired} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Mobile Number</label>
        <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required />

        <label>Last Date</label>
        <input type="date" name="lastDate" value={formData.lastDate} onChange={handleChange} required />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Alumni;
