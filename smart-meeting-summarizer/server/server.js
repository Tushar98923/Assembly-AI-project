require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/process-audio", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "AssemblyAI API key not configured." });
  }

  try {
    // Step 1: Upload audio file to AssemblyAI
    const audioData = fs.readFileSync(req.file.path);
    const uploadRes = await axios.post(
      "https://api.assemblyai.com/v2/upload",
      audioData,
      {
        headers: {
          authorization: apiKey,
          "content-type": "application/octet-stream",
        },
      }
    );
    const audioUrl = uploadRes.data.upload_url;

    // Step 2: Request transcription with features
    const transcriptRes = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      {
        audio_url: audioUrl,
        speaker_labels: true,
        summarization: true,
        summary_model: "informative",
        summary_type: "bullets",
        iab_categories: true,
      },
      {
        headers: {
          authorization: apiKey,
          "content-type": "application/json",
        },
      }
    );
    const transcriptId = transcriptRes.data.id;

    // Step 3: Poll for transcript completion
    let transcriptData;
    let status = transcriptRes.data.status;
    const pollUrl = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;
    while (status !== "completed" && status !== "error") {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const pollRes = await axios.get(pollUrl, {
        headers: {
          authorization: apiKey,
        },
      });
      status = pollRes.data.status;
      transcriptData = pollRes.data;
    }

    // Clean up uploaded file
    fs.unlink(req.file.path, () => {});

    if (status === "completed") {
      return res.json(transcriptData);
    } else {
      return res.status(500).json({ error: "Transcription failed.", details: transcriptData });
    }
  } catch (err) {
    // Clean up uploaded file
    fs.unlink(req.file.path, () => {});
    return res.status(500).json({ error: "Server error.", details: err.message });
  }
});


// Gemini API integration endpoint
app.post("/summarize-with-gemini", async (req, res) => {
  const { text } = req.body;
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    return res.status(500).json({ error: "Gemini API key not configured." });
  }
  if (!text) {
    return res.status(400).json({ error: "No text provided." });
  }
  try {
    // Gemini API call (Google Generative Language API)
    const geminiRes = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        contents: [{ parts: [{ text }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          key: geminiApiKey,
        },
      }
    );
    const summary = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary returned.";
    return res.json({ summary });
  } catch (err) {
    return res.status(500).json({ error: "Gemini API error.", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
