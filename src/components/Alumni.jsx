import React, { useState } from "react";
import "./Alumni.css";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaBuilding, FaBriefcase, FaUsers, FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";

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
      toast.success("Form submitted successfully!");
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
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-container">
        <h2>Internship Requirement Form</h2>

        {[
          { icon: <FaUser />, name: "name", placeholder: "Name" },
          { icon: <FaBriefcase />, name: "designation", placeholder: "Designation" },
          { icon: <FaBuilding />, name: "company", placeholder: "Company Name" },
          { icon: <FaBriefcase />, name: "role", placeholder: "Intern Role" },
          { icon: <FaUsers />, name: "personsRequired", placeholder: "No. of Persons", type: "number" },
          { icon: <FaEnvelope />, name: "email", placeholder: "Email", type: "email" },
          { icon: <FaPhone />, name: "mobile", placeholder: "Mobile Number", type: "tel" },
          { icon: <FaCalendarAlt />, name: "lastDate", placeholder: "Last Date", type: "date" },
        ].map(({ icon, name, placeholder, type = "text" }) => (
          <div className="input-group" key={name}>
            {icon}
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label>{placeholder}</label>
          </div>
        ))}

        <button type="submit">Submit</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Alumni;
