
<div align="center">
  <img src="https://img.shields.io/badge/React-18.2-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18.x-green?logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.18-lightgrey?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/AssemblyAI-API-orange" alt="AssemblyAI" />
  <img src="https://img.shields.io/badge/Gemini-API-purple" alt="Gemini" />
</div>

# 🚀 Smart Meeting Summarizer

<p align="center">
  <b>Transform your meetings into actionable, AI-powered summaries, topics, and transcripts.</b>
</p>

---

## ✨ Features

- 🎤 <b>Multi-Method Audio Upload:</b> Drag & drop, file picker, or paste a URL
- 🔒 <b>Secure Backend:</b> API keys and polling handled server-side
- 📝 <b>Structured Output:</b> Summary, key topics, and full transcript with speaker labels
- 🤖 <b>Gemini AI Summarization:</b> Instantly summarize transcripts with Google Gemini

---

## 🗂️ Project Structure

```text
smart-meeting-summarizer/
├── client/              # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── App.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/              # Node.js Backend
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚡ Quick Start

### 1️⃣ Clone the repository

```bash
git clone <repo-url>
cd smart-meeting-summarizer
```

### 2️⃣ Install dependencies

#### Frontend
```bash
cd client
npm install
```

#### Backend
```bash
cd ../server
npm install
```

### 3️⃣ Configure API Keys

- Copy `server/.env.example` to `server/.env`
- Add your AssemblyAI and Gemini API keys:
  ```env
  ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
  GEMINI_API_KEY=your_gemini_api_key_here
  ```

### 4️⃣ Start the backend server
```bash
cd server
npm start
```

### 5️⃣ Start the frontend React app
```bash
cd ../client
npm start
```

### 6️⃣ Usage
- Open [http://localhost:3000](http://localhost:3000) in your browser
- Upload an audio file or URL, view the summary, topics, and transcript
- Click <b>Summarize with AI</b> for instant Gemini-powered insights

---

## 📝 Example Output

<details>
  <summary>Click to expand sample output</summary>

  <b>Summary:</b>
  <blockquote>• Project kickoff meeting covered goals, timelines, and responsibilities.<br>• Key topics included budget, deliverables, and team roles.<br>• Speaker 1 led the discussion, Speaker 2 provided feedback.</blockquote>

  <b>Key Topics:</b>
  <ul>
    <li>Budget (0.92)</li>
    <li>Deliverables (0.87)</li>
    <li>Team Roles (0.85)</li>
  </ul>

  <b>Full Transcript:</b>
  <pre>
Speaker 1: Welcome everyone to the project kickoff.
Speaker 2: Thanks! Let's review the timeline.
...</pre>
</details>

---

## 🚧 Potential Future Features

- 📅 <b>Calendar Integration:</b> Automatically link meeting summaries to Google Calendar events
- 🌎 <b>Multi-Language Support:</b> Transcribe and summarize meetings in multiple languages
- 📊 <b>Analytics Dashboard:</b> Visualize meeting trends, speaker activity, and topic frequency

---

## 🛡️ Notes

- The backend runs on port 5000 by default. If you change this, update the API URL in `client/src/App.js`.
- <b>Never expose your API keys on the frontend.</b>
- For production, secure the backend and handle large files appropriately.

---

<div align="center">
  <sub>Made with ❤️ by your team. Contributions welcome!</sub>
</div>
