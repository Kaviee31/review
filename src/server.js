import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));


// Define Schema
const enrollmentSchema = new mongoose.Schema({
  studentName: String,
  courseName: String,
  teacherName: String,
  teacherEmail: String,  // Ensure email is stored
});


const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

// API to handle enrollment
app.post("/enroll", async (req, res) => {
  const { studentName, courseName, teacherName, teacherEmail } = req.body;

  try {
    const existingEnrollment = await Enrollment.findOne({ studentName, courseName });
    if (existingEnrollment) {
      return res.status(400).json({ error: "Already enrolled!" });
    }

    const newEnrollment = new Enrollment({ studentName, courseName, teacherName, teacherEmail });
    await newEnrollment.save();

    res.status(200).json({ message: "Enrollment successful!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to enroll" });
  }
});
  

// API to get enrolled courses for a student
app.get("/student-courses/:studentName", async (req, res) => {
  try {
    const courses = await Enrollment.find({ studentName: req.params.studentName });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching courses" });
  }
});

// API to get students enrolled in a specific teacher's course
app.get("/teacher-courses/:teacherEmail", async (req, res) => {
  try {
    const students = await Enrollment.find({ teacherEmail: req.params.teacherEmail });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Error fetching students" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
