// server/server.js

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
// We will NOT import pdfjs-dist here anymore.

// --- Utilities ---
import { parseResumeText } from './utils/resumeParser.js';
import { extractKeywords } from './utils/keywordExtractor.js';
import { calculateSimilarity, rewriteBulletPoint } from './utils/aiHelper.js';

// --- Database Model ---
import Session from './models/Session.js';

// --- Express App Setup ---
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

// --- Database Connection (Self-Contained) ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => {
    console.error('MongoDB initial connection error:', err);
    process.exit(1); 
  });

// --- API Endpoints ---
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  if (!req.file || !req.body.jobDescription) {
    return res.status(400).json({ error: 'Resume file and job description are required.' });
  }

  try {
    // --- DYNAMIC IMPORT ATTEMPT ---
    // const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.js');
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const data = new Uint8Array(req.file.buffer);
    const doc = await pdfjsLib.getDocument(data).promise;
    let resumeText = '';
    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        resumeText += strings.join(' ') + '\n';
    }
    // --- END OF DYNAMIC IMPORT ---

    const { jobDescription } = req.body;
    
    const parsedSections = parseResumeText(resumeText);
    const keywords = extractKeywords(resumeText, jobDescription);

    const overallScore = await calculateSimilarity(resumeText, jobDescription);
    const skillsScore = await calculateSimilarity(parsedSections.skills || '', jobDescription);
    const experienceScore = await calculateSimilarity(parsedSections.experience || '', jobDescription);

    const result = {
      resumeText, jobDescription, parsedSections, keywords,
      scores: { overall: overallScore, skills: skillsScore, experience: experienceScore },
      suggestions: [],
    };

    const newSession = new Session(result);
    await newSession.save();
    
    res.json({ sessionId: newSession._id, message: 'Analysis complete.' });
  } catch (error) {
    console.error("Error during analysis:", error);
    res.status(500).json({ error: "Failed to analyze the resume." });
  }
});

// ... (rest of the API endpoints are unchanged)
// app.post('/api/rewrite', async (req, res) => {
//   const { text } = req.body;
//   if (!text) { return res.status(400).json({ error: 'Text to rewrite is required.' }); }
//   try {
//     const rewrittenText = await rewriteBulletPoint(text);
//     res.json({ rewrittenText });
//   } catch (error) {
//     console.error("Error rewriting text:", error);
//     res.status(500).json({ error: "Failed to rewrite text." });
//   }
// });
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 }).limit(20);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions." });
  }
});
app.get('/api/session/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) { return res.status(404).json({ error: 'Session not found.' }); }
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch session details." });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});