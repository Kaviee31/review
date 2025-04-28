// src/layouts/DashboardLayout.jsx
import { Outlet, NavLink } from "react-router-dom";
import "./DashboardLayout.css"; // Optional for styling

export default function DashboardLayout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <nav style={{ width: "250px", backgroundColor: "#1e3a8a", padding: "1rem", color: "white" }}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><NavLink to="/teacher-dashboard" style={{ color: "white", display: "block", padding: "1rem" }}>Dashboard</NavLink></li>
          <li><NavLink to="/teacher-courses" style={{ color: "white", display: "block", padding: "1rem" }}>Enrolled Students</NavLink></li>
          <li><NavLink to="/available-intern" style={{ color: "white", display: "block", padding: "1rem" }}>Internships</NavLink></li>
          <li><NavLink to="/" style={{ color: "white", display: "block", padding: "1rem" }}>Logout</NavLink></li>
        </ul>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
