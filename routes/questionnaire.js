import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();
const { GOOGLE_API_KEY } = process.env;
const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });
const router = express.Router();

// Endpoint to generate quiz questions from submitted text
router.post('/', express.json(), async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'No text provided for question generation' });
    }

    const prompt = `Using the following document content, generate 30 unique quiz questions and answers.\nNumber them from 1 to 30.\nEach question should be on a new line with this format:\nQuestion? Option1|Option2|Option3|Option4|CorrectAnswerNumber\n\nDOCUMENT CONTENT:\n${text}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const questionsText = response.text.trim();
    res.json({ questionsText });
  } catch (err) {
    console.error('Error generating questions:', err);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

export default router;
