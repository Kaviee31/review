// TeacherCourses.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ChatWindow from "./ChatWindow"; // Adjust path if needed
import * as XLSX from "xlsx";
import { collection, query, orderBy, limit, where, getDocs } from "firebase/firestore";


const UNSEEN_MESSAGE_ICON_URL = "https://cdn-icons-png.flaticon.com/512/134/134935.png"; // Example red chat bubble
const SEEN_MESSAGE_ICON_URL = "https://cdn-icons-png.flaticon.com/512/2462/2462719.png"; // Original blue chat bubble

function TeacherCourses() {
  const [students, setStudents] = useState([]);
  const [teacherEmail, setTeacherEmail] = useState("");
  const [selectedStudentRegisterNumber, setSelectedStudentRegisterNumber] = useState(null); // Changed to registerNumber
  const [unseenMessagesStatus, setUnseenMessagesStatus] = useState({}); // State to track unseen messages

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
    const courseName = students.length > 0 ? students[0].courseName : "Course Name Not Available";
    doc.setFontSize(18);
    doc.text(`${courseName} Marks Report`, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    const tableColumn = [
      "Register Number",
      "Assess1",
      "Assess2",
      "Assess3",
      "Total",
    ];
    const tableRows = [];
    students.forEach((student) => {
      const studentData = [
        student.registerNumber,
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
    doc.save(`${courseName.replace(/[^a-zA-Z0-9]/g, '_')}_Marks_Report.pdf`); // Sanitize filename
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

  const hasUnseenMessages = async (studentRegisterNumber) => {
    if (!teacherEmail || !studentRegisterNumber) return false;

    const chatKey = teacherEmail < studentRegisterNumber
      ? `${teacherEmail}_${studentRegisterNumber}`
      : `${studentRegisterNumber}_${teacherEmail}`;

    const messagesRef = collection(db, "chats", chatKey, "messages");
    const q = query(messagesRef, orderBy("timestamp", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const lastMessage = querySnapshot.docs[0].data();
      return lastMessage.senderId === studentRegisterNumber; // If the last message was sent by the student, it's unseen by the teacher
    }

    return false; // No messages in the chat
  };

  useEffect(() => {
    const fetchUnseenStatuses = async () => {
      const statuses = {};
      for (const student of students) {
        const hasUnseen = await hasUnseenMessages(student.registerNumber);
        statuses[student.registerNumber] = hasUnseen;
      }
      setUnseenMessagesStatus(statuses);
    };

    if (students.length > 0) {
      fetchUnseenStatuses();
    }
  }, [students, teacherEmail]);

  const openChatWindow = (studentRegisterNumber) => {
    setSelectedStudentRegisterNumber(studentRegisterNumber);
    // Mark messages as seen when the chat window opens
    setUnseenMessagesStatus(prevState => ({
      ...prevState,
      [studentRegisterNumber]: false,
    }));
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
                    src={
                      unseenMessagesStatus[student.registerNumber]
                        ? UNSEEN_MESSAGE_ICON_URL
                        : SEEN_MESSAGE_ICON_URL
                    }
                    alt="Chat Bubble"
                    width="20"
                    style={{ cursor: "pointer", verticalAlign: "middle" }}
                    onClick={() => openChatWindow(student.registerNumber)} // Use student's registerNumber
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