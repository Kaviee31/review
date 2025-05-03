import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./components/Login";
import Signup from "./components/Signup";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import StudentCourses from "./components/StudentCourses";
import TeacherCourses from "./components/TeacherCourses";
import TeacherSyllabus from './components/TeacherSyllabus';
import Alumni from './components/Alumni';
import AvailableIntern from "./components/AvailableIntern";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-courses" element={<StudentCourses />} />
        <Route path="/teacher-courses" element={<TeacherCourses />} />
        <Route path="/teacher-syllabus" element={<TeacherSyllabus />} />
        <Route path="/alumni" element={<Alumni />} />
        <Route path="/available-intern" element={<AvailableIntern />} />
      </Routes>
      <ToastContainer /> {/* ✅ Placed outside Routes */}
    </Router>
  );
}

export default App;
