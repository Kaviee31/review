import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import "./Sign.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profession, setProfession] = useState("Student");
  const [registerNumber, setRegisterNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const professions = ["Student", "Teacher", "Alumni"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Password Validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

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

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), userData);

      // Send email verification
      await sendEmailVerification(user);

      // Clear form fields after successful registration
      setUsername("");
      setEmail("");
      setPassword("");
      setProfession("Student");
      setRegisterNumber("");

      // Redirect based on profession
      if (profession === "Teacher") {
        navigate("/teacher-dashboard", { replace: true });
      } else if (profession === "Alumni") {
        navigate("/alumni-dashboard", { replace: true });
      } else {
        navigate("/student-dashboard", { replace: true });
      }
      
      alert("User registered successfully! Please check your email to verify your account.");

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError("The email is already registered.");
      } else if (error.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        {error && <div className="error-message">{error}</div>}

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

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p>
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
