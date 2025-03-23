import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
console.log("API Key from .env:", genAI); // Replace with your API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro"});

app.post('/api/generate-syllabus', async (req, res) => {
    const { courseName, hoursPerWeek, startDate, endDate } = req.body;
    const prompt = `Generate a week-by-week syllabus for a ${courseName} course. The course will be taught for ${hoursPerWeek} hours per week, starting on ${startDate} and ending on ${endDate}.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.json({ syllabus: text });
    } catch (error) {
        console.error('Gemini API error:', error);
        res.status(500).json({ error: 'Failed to generate syllabus' });
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});