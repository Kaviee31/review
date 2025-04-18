import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ChatWindow from "./ChatWindow"; // Adjust path if needed
import * as XLSX from "xlsx";
import "./TeacherCourses.css"

function TeacherCourses() {
  const [students, setStudents] = useState([]);
  const [teacherEmail, setTeacherEmail] = useState("");
  const [selectedStudentRegisterNumber, setSelectedStudentRegisterNumber] = useState(null); // Changed to registerNumber

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setTeacherEmail(user.email);
      }
    });
  }, []);

  const fetchStudents = () => {
    if (teacherEmail) {
      axios
        .get(`http://localhost:5000/teacher-courses/${teacherEmail}`)
        .then((res) => {
          const updatedStudents = res.data.map((student) => ({
            ...student,
            marks1: student.Assessment1 || "",
            marks2: student.Assessment2 || "",
            marks3: student.Assessment3 || "",
            marks4: student.Total || "",
            extraColumn: student.Contact || "",
            registerNumber: student.registerNumber,
          }));
          setStudents(updatedStudents);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [teacherEmail]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStudents();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCloseChat = () => {
    setSelectedStudentRegisterNumber(null);
  };
  const handleMarkChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  const handleSaveAllMarks = () => {
    const payload = {
      students: students.map((student) => ({
        registerNumber: student.registerNumber,
        courseName: student.courseName,
        Assessment1: Number(student.marks1) || 0,
        Assessment2: Number(student.marks2) || 0,
        Assessment3: Number(student.marks3) || 0,
        Total: Number(student.marks4) || 0,
      })),
    };
    console.log("Sending Marks Data:", payload);
    axios
      .post("http://localhost:5000/update-marks", payload)
      .then(() => {
        alert("Marks saved successfully!");
        console.log("Marks saved in backend!");
      })
      .catch((err) => console.log("Error saving marks:", err));
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Student Marks Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    const tableColumn = [
      "Course",
      "Student Name",
      "Email",
      "Assessment 1",
      "Assessment 2",
      "Assessment 3",
      "Total",
    ];
    const tableRows = [];
    students.forEach((student) => {
      const studentData = [
        student.courseName,
        student.studentName,
        student.studentName, // Assuming studentName can be used as a placeholder if email isn't directly available here
        student.marks1,
        student.marks2,
        student.marks3,
        student.marks4,
      ];
      tableRows.push(studentData);
    });
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save("Student_Marks_Report.pdf");
  };

  const handleDownloadSpreadsheet = () => {
    const worksheet = XLSX.utils.json_to_sheet(students.map(student => ({
      "Register Number": student.registerNumber,
      "Assessment 1": student.marks1,
      "Assessment 2": student.marks2,
      "Assessment 3": student.marks3,
      "Total": student.marks4,
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Marks");

    // Save the workbook as an Excel file
    XLSX.writeFile(workbook, "Student_Marks_Report.xlsx");
  };

  return (
    <div>
      <h2>
        Enrolled Students for{" "}
        {students.length > 0 ? students[0].courseName : "Loading..."}
      </h2>

      <table border="1">
        <thead>
          <tr>
            <th>Register Number</th>
            <th>Assessment 1</th>
            <th>Assessment 2</th>
            <th>Assessment 3</th>
            <th>Total</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student, index) => (
              <tr key={index}>
                <td>{student.registerNumber}</td>
                <td>
                  <input
                    type="number"
                    value={student.marks1}
                    onChange={(e) =>
                      handleMarkChange(index, "marks1", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={student.marks2}
                    onChange={(e) =>
                      handleMarkChange(index, "marks2", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={student.marks3}
                    onChange={(e) =>
                      handleMarkChange(index, "marks3", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={student.marks4}
                    onChange={(e) =>
                      handleMarkChange(index, "marks4", e.target.value)
                    }
                  />
                </td>
                <td>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2462/2462719.png"
                    alt="Chat Bubble"
                    width="20"
                    style={{ cursor: "pointer", verticalAlign: "middle" }}
                    onClick={() => setSelectedStudentRegisterNumber(student.registerNumber)} // Use student's registerNumber
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No students enrolled yet</td>
            </tr>
          )}
        </tbody>
      </table>

      <button onClick={handleSaveAllMarks} style={{ marginTop: "10px" }}>
        Save All Marks
      </button>
      <button
        onClick={handleDownloadPDF}
        style={{ marginTop: "10px", marginLeft: "10px" }}
      >
        Download PDF
      </button>
      <button
        onClick={handleDownloadSpreadsheet}
        style={{ marginTop: "10px", marginLeft: "10px" }}
      >
        Download ExcelSheet
      </button>
      {selectedStudentRegisterNumber && (
        <ChatWindow
          currentUser={teacherEmail}
          contactUser={selectedStudentRegisterNumber}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
}

export default TeacherCourses;