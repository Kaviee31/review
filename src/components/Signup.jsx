import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import "./Sign.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profession, setProfession] = useState("Student");
  const [registerNumber, setRegisterNumber] = useState("");
  const navigate = useNavigate();

  const professions = ["Student", "Teacher"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const userData = {
        username,
        email,
        profession,
      };
  
      if (profession === "Student") {
        userData.registerNumber = registerNumber;
      }
  
      await setDoc(doc(db, "users", user.uid), userData);
  
      alert("User registered successfully!");
      navigate("/", { replace: true }); // ✅ Redirect here
    } catch (error) {
      console.error("Error signing up:", error);
      alert(error.message);
    }
  };
  

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <label>Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Profession</label>
        <select
          value={profession}
          onChange={(e) => {
            const selectedProfession = e.target.value;
            setProfession(selectedProfession);
            if (selectedProfession !== "Student") {
              setRegisterNumber(""); // Clear if not student
            }
          }}
          required
        >
          {professions.map((prof) => (
            <option key={prof} value={prof}>
              {prof}
            </option>
          ))}
        </select>

        {/* Register Number only when Student */}
        {profession === "Student" && (
          <>
            <label>Register Number</label>
            <input
              type="text"
              placeholder="Enter your register number"
              value={registerNumber}
              onChange={(e) => setRegisterNumber(e.target.value)}
              required
            />
          </>
        )}

        <button type="submit">Register</button>

        <p>
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
