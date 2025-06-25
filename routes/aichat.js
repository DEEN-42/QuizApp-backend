import express from 'express';
import { GoogleGenAI } from '@google/genai';

const { GOOGLE_API_KEY } = process.env;
const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });
const router = express.Router();

// Endpoint to generate quiz questions from submitted text
router.post('/', express.json(), async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'No text provided' });
    }
    // console.log('Received text:', message);
    const prompt = `${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a helpful ai assistant in the Testify app, you are asked to solve academic doubts, and help in creative works, no fun related stuff.',
        maxOutputTokens: 500,
        temperature: 0.8,
      },
    });

    const aianswer = response.candidates[0].content.parts[0].text;
    res.json({ aianswer });
    // console.log(aianswer);
  } catch (err) {
    console.error('Error getting replies', err);
    res.status(500).json({ error: 'Failed to get a reply from ai, try again later' });
  }
});

export default router;
