import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Signup from "./Signup";

function Login() {
  return (
    <div className="app-container">
      <div className="login-form">
        <h2>Login</h2>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button>Login</button>
        <Link to="/signup" style={{ textAlign: "center", display: "block", marginTop: "10px" }}>
          New user? Signup
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
