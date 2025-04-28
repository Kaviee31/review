import axios from "axios";

export const generateStudyPlan = async (formData, token) => {
  const response = await axios.post("/api/study-plan/generate", formData, {
    headers: {
      "Authorization": `Bearer ${token}`, // if you want token security
      "Content-Type": "application/json",
    }
  });

  return response.data.syllabus;
};
