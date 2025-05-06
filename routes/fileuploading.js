// fileuploading.js
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { createPartFromUri, GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();
const { GOOGLE_API_KEY_FOR_FILEUPLOAD } = process.env;
const router = express.Router();
const upload = multer({ dest: path.join(process.cwd(), 'uploads') });
const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY_FOR_FILEUPLOAD });
router.post('/', upload.single('file'), async (req, res, next) => {
    //check i
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const localPath = req.file.path;
  const displayName = req.file.originalname;

  try {
    // 1. Upload to Gemini
    const file = await ai.files.upload({
      file: localPath,
      config: { 
        displayName,
        mimeType: req.file.mimetype,

       },
    });

    // 2. Poll until processing is complete
    let getFile = await ai.files.get({ name: file.name });
    while (getFile.state === 'PROCESSING') {
      console.log(`File ${displayName} state: ${getFile.state}. Retrying in 5s…`);
      await new Promise((r) => setTimeout(r, 5000));
      getFile = await ai.files.get({ name: file.name });
    }
    if (getFile.state === 'FAILED') {
      throw new Error('File processing failed.');
    }

    // 3. Build prompt
    const contents = ["You are a PDF text extraction assistant. You receive raw PDF bytes and must return only the human-readable text. Extract the full text as plain UTF-8. Preserve paragraph breaks. Remove all images, fonts, markup, headers, footers, and page numbers. Render tables in plain-text form (e.g., columns separated by tabs or pipes). Do not include any metadata or markup—just the readable content."];
    if (getFile.uri && getFile.mimeType) {
      contents.push(createPartFromUri(getFile.uri, getFile.mimeType));
    }

    // 4. Generate summary
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
    });


    // 6. Cleanup
    fs.unlink(localPath, (err) => {
      if (err) console.warn('Failed to delete temp file', err);
    });

    res.json({ text: response.text });
  } catch (err) {
    fs.unlink(localPath, () => {});
    next(err);
  }
});

export default router;
