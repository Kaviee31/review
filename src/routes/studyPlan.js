import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
console.log("HF_API_KEY:", process.env.HF_API_KEY);

router.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  // Log the received prompt to check if it's valid
  console.log("Received prompt:", prompt);

  // Validate prompt to ensure it's not empty
  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Prompt cannot be empty.",
    });
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      { inputs: prompt }, // Send the custom prompt
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract and send the result back to the frontend
    const text = response.data?.[0]?.generated_text || "No response generated.";
    res.json({ success: true, result: text });

  } catch (error) {
    // Log detailed error information for debugging
    console.error("Error generating study plan:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
  
    // Send error response
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || "Internal Server Error",
    });
  }
});

export default router;
