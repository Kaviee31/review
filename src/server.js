import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from 'node-fetch';
import studyPlanRoutes from "./routes/studyPlan.js";



// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/study-plan", studyPlanRoutes);
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


// app.post("/api/study-plan/generate", async (req, res) => {
//   const { courseName, hoursPerWeek, startDate, endDate, syllabus } = req.body;

//   if (!syllabus || !hoursPerWeek || !startDate || !endDate) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   try {
//     const prompt = `
//       You are a study planner bot. Given the course syllabus and time frame, generate a weekly study plan.

//       Course: ${courseName}
//       Study hours per week: ${hoursPerWeek}
//       Duration: ${startDate} to ${endDate}

//       Syllabus:
//       ${syllabus}

//       Format the response as a week-wise plan with clearly structured topics.
//     `;

//     const response = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//     });

//     const studyPlan = response.data.choices[0].message.content;

//     res.json({ syllabus: studyPlan });
//   } catch (error) {
//     console.error("OpenAI Error:", error.message);
//     res.status(500).json({ error: "Failed to generate study plan" });
//   }
// });

// app.post("/api/study-plan/generate", async (req, res) => {
//   const { syllabus, courseName, hoursPerWeek, startDate, endDate } = req.body;

//   const prompt = `Create a detailed weekly study plan for the course "${courseName}" based on the following syllabus: ${syllabus}. The student can study ${hoursPerWeek} hours per week from ${startDate} to ${endDate}.`;

//   try {
//     const response = await axios.post(
//       "https://api-inference.huggingface.co/models/google/flan-t5-base", // or another model
//       { inputs: prompt },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HF_API_KEY}`,
//         },
//       }
//     );

//     const result = response.data;
//     const plan = result?.[0]?.generated_text || "No response generated.";
//     res.json({ syllabus: plan });
//   } catch (err) {
//     console.error("Error calling Hugging Face API:", err.response?.data || err.message);
//     res.status(500).json({ error: "Failed to generate syllabus." });
//   }
// });


app.post("/api/study-plan/generate", async (req, res) => {
  const { syllabus, courseName, hoursPerWeek, startDate, endDate } = req.body;

  if (!syllabus || !courseName || !startDate || !endDate || !hoursPerWeek) {
    return res.status(400).json({ error: "Missing fields in request" });
  }

  const prompt = `
  Create a detailed weekly study plan based on the following:
  - Course Name: ${courseName}
  - Hours per Week: ${hoursPerWeek}
  - Duration: From ${startDate} to ${endDate}
  - Syllabus: ${syllabus}
  Format it in a readable weekly breakdown.
  `;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        // 🔁 Replace this
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error || "Model error" });
    }

    const result = await response.json();
    const generatedPlan = result[0]?.generated_text || "No output from model.";

    res.json({ syllabus: generatedPlan });
  } catch (error) {
    console.error("Hugging Face API error:", error);
    res.status(500).json({ error: "Failed to generate study plan" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
