import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, doc, getDoc } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import "../App.css"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user profession from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      console.log("Firestore response:", userDoc.exists(), userDoc.data());
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User data:", userData);

        // Redirect based on profession
        if (userData.profession === "Teacher") {
          navigate("/teacher-dashboard");
        } else if (userData.profession === "Alumni") {
          navigate("/alumni");
        } else {
          navigate("/student-dashboard");
        }
        } else {
        alert("User data not found.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleLogin}>
        <h2 style={{ color: "black" }}>Log In</h2>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ backgroundColor: "#f0e6ff" }}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ backgroundColor: "#f0e6ff" }}
        />

        <button type="submit">Login</button>

        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
