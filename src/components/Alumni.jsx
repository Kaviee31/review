import React, { useState, useEffect } from "react";
import "./Alumni.css";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUser,
  FaBuilding,
  FaBriefcase,
  FaUsers,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
} from "react-icons/fa";

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
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alumniProfile, setAlumniProfile] = useState(null);

  useEffect(() => {
    const checkFormStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDocRef = doc(db, "alumniUsers", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setFormSubmitted(data.formSubmitted);
            setAlumniProfile(data); // Load existing profile
          } else {
            // First time user, create base doc
            await setDoc(userDocRef, {
              formSubmitted: false,
              email: user.email,
              uid: user.uid,
            });
            setFormSubmitted(false);
          }
        } catch (error) {
          console.error("Error checking form submission status:", error);
        }
      }
      setLoading(false);
    };

    checkFormStatus();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, "alumniInternships"), {
          ...formData,
          submittedBy: user.uid,
        });

        const userDocRef = doc(db, "alumniUsers", user.uid);
        await updateDoc(userDocRef, {
          ...formData,
          formSubmitted: true,
        });

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
        setFormSubmitted(true);
        setAlumniProfile({ ...formData, formSubmitted: true });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (formSubmitted && alumniProfile) {
    return (
      <div className="form-wrapper">
        <div className="form-container">
          <h2>🎓 Alumni Profile</h2>
          <div style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}>
            <p><strong>👤 Name:</strong> {alumniProfile.name}</p>
            <p><strong>🏢 Company:</strong> {alumniProfile.company}</p>
            <p><strong>💼 Designation:</strong> {alumniProfile.designation}</p>
            <p><strong>🎯 Intern Role:</strong> {alumniProfile.role}</p>
            <p><strong>👥 Persons Required:</strong> {alumniProfile.personsRequired}</p>
            <p><strong>📧 Email:</strong> {alumniProfile.email}</p>
            <p><strong>📱 Mobile:</strong> {alumniProfile.mobile}</p>
            <p><strong>🗓️ Last Date to Apply:</strong> {alumniProfile.lastDate}</p>
          </div>
  
          {/* Chat placeholder */}
          <div className="chat-placeholder" style={{
            marginTop: "30px",
            padding: "15px",
            border: "1px dashed #aaa",
            borderRadius: "10px",
            backgroundColor: "#fff8e1"
          }}>
            <h3>📬 Messages from Teachers</h3>
            <p>Chat feature coming soon. Stay connected!</p>
          </div>
        </div>
      </div>
    );
  }
  

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
