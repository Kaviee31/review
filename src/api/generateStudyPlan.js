import axios from "axios";

export const generateStudyPlan = async (customPrompt) => {
  try {
    const response = await axios.post("http://localhost:5000/api/study-plan/generate", { prompt: customPrompt });

    return response.data?.result || "No response generated.";
  } catch (err) {
    console.error("Frontend error:", err);
    return "Failed to generate study plan.";
  }
};
