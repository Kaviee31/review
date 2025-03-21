import { Link } from "react-router-dom";
import "./App.css";

function Signup() {
  return (
    <div className="app-container">
      <div className="signup-form">
        <h2>Sign Up</h2>
        <label>Enter Username:</label>
        <input type="text" placeholder="Username" />
        
        <label>Enter Email ID:</label>
        <input type="email" placeholder="Enter Email ID" />

        <label>Choose Role:</label>
        <select>
          <option>Lecturer</option>
          <option>Student</option>
        </select>

        <label>Enter Password:</label>
        <input type="password" placeholder="Password" />

        <label>Enter OTP:</label>
        <input type="text" placeholder="OTP" />

        <button type="submit">Sign Up</button>
        
        <Link to="/" style={{ textAlign: "center", display: "block", marginTop: "10px" }}>
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
