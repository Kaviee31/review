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
  registerNumber: String, // ✅ replaced studentEmail with registerNumber
  courseName: String,
  teacherName: String,
  teacherEmail: String,
  Assessment1: { type: Number, default: 0 },
  Assessment2: { type: Number, default: 0 },
  Assessment3: { type: Number, default: 0 },
  Total: { type: Number, default: 0 },
});




const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

// API to handle enrollment
app.post("/enroll", async (req, res) => {
  const { studentName, registerNumber, courseName, teacherName, teacherEmail } = req.body;


  try {
    const existingEnrollment = await Enrollment.findOne({ registerNumber, courseName });
    if (existingEnrollment) {
      return res.status(400).json({ error: "Already enrolled!" });
    }

    const newEnrollment = new Enrollment({ studentName, registerNumber, courseName, teacherName, teacherEmail });


    await newEnrollment.save();

    res.status(200).json({ message: "Enrollment successful!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to enroll" });
  }
});
  

// API to get enrolled courses for a student
app.get("/student-courses/:registerNumber", async (req, res) => {
  try {
    const courses = await Enrollment.find({ registerNumber: req.params.registerNumber });
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


app.post("/update-marks", async (req, res) => {
  try {
    const { students } = req.body;
    console.log("Received Marks Update:", students);

    for (let student of students) {
      const updatedStudent = await Enrollment.findOneAndUpdate(
        { registerNumber: student.registerNumber, courseName: student.courseName },
        {
          $set: {
            Assessment1: student.Assessment1,
            Assessment2: student.Assessment2,
            Assessment3: student.Assessment3,
            Total: student.Total,
          },
        },
        { new: true, upsert: true }
      );

      console.log("Updated Student:", updatedStudent); 
    }

    res.json({ message: "Marks updated successfully!" });
  } catch (error) {
    console.error("Error updating marks:", error);
    res.status(500).json({ error: "Failed to update marks" });
  }
});





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
