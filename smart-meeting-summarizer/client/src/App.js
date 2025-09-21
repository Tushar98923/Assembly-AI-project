import React, { useState, useRef } from "react";
import axios from "axios";
import "./App.css";


function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [transcriptionData, setTranscriptionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [summarizedText, setSummarizedText] = useState("");
  const urlInputRef = useRef();

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setTranscriptionData(null);
      setUploadStatus("");
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setTranscriptionData(null);
    setUploadStatus("");
  };

  const handleUrlUpload = async () => {
    const url = urlInputRef.current.value;
    if (!url) {
      setUploadStatus("Please enter an audio file URL.");
      return;
    }
    setIsLoading(true);
    setUploadStatus("");
    setTranscriptionData(null);
    try {
      // Backend should support direct URL upload (not implemented yet)
      const response = await axios.post("http://localhost:5000/process-audio-url", { url });
      setTranscriptionData(response.data);
      setUploadStatus("Success!");
    } catch (error) {
      setUploadStatus("Error processing URL. Please try again.");
    }
    setIsLoading(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file.");
      return;
    }
    setIsLoading(true);
    setUploadStatus("");
    setTranscriptionData(null);
    const formData = new FormData();
    formData.append("audio", selectedFile);
    try {
      const response = await axios.post("http://localhost:5000/process-audio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTranscriptionData(response.data);
      setUploadStatus("Success!");
    } catch (error) {
      setUploadStatus("Error processing file. Please try again.");
    }
    setIsLoading(false);
  };

  // Summarize with Gemini API (real integration)
  const handleSummarizeWithAI = async () => {
    // Use all utterances text for summary
    if (!transcriptionData || !transcriptionData.utterances) {
      setSummarizedText("No transcript available to summarize.");
      return;
    }
    setSummarizedText("Summarizing with Gemini AI...");
    const transcriptText = transcriptionData.utterances.map(u => u.text).join("\n");
    try {
      const response = await axios.post("http://localhost:5000/summarize-with-gemini", { text: transcriptText });
      setSummarizedText(response.data.summary);
    } catch (error) {
      setSummarizedText("Error summarizing with Gemini AI.");
    }
  };

  return (
    <div className="App">
      <h1>Smart Meeting Summarizer</h1>
      <div
        className={`upload-area${dragActive ? " drag-active" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <p>Drag & drop audio file here</p>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={isLoading}>
          Upload and Process
        </button>
      </div>
      <div className="url-upload">
        <input type="text" ref={urlInputRef} placeholder="Paste audio file URL here" />
        <button onClick={handleUrlUpload} disabled={isLoading}>
          Upload from URL
        </button>
      </div>
      {isLoading && <p className="loading">Processing... this may take a moment.</p>}
      {uploadStatus && <p className="status">{uploadStatus}</p>}
      <div className="output-area">
        <h2>Transcripted Output</h2>
        {transcriptionData ? (
          <div className="results">
            <h3>Summary</h3>
            <p>{transcriptionData.summary}</p>
            <h3>Key Topics</h3>
            <ul>
              {transcriptionData.iab_categories_result &&
                transcriptionData.iab_categories_result.summary &&
                Object.entries(transcriptionData.iab_categories_result.summary).map(([topic, score]) => (
                  <li key={topic}>
                    <strong>{topic}</strong>: {score.toFixed(2)}
                  </li>
                ))}
            </ul>
            <h3>Full Transcript</h3>
            <ul>
              {transcriptionData.utterances &&
                transcriptionData.utterances.map((utterance, idx) => (
                  <li key={idx}>
                    <strong>Speaker {utterance.speaker}:</strong> {utterance.text}
                  </li>
                ))}
            </ul>
            <button className="summarize-btn" onClick={handleSummarizeWithAI}>
              Summarize with AI
            </button>
            {summarizedText && (
              <div className="ai-summary">
                <h4>Gemini AI Summary</h4>
                <p>{summarizedText}</p>
              </div>
            )}
          </div>
        ) : (
          <p>No output yet. Upload a file or URL to see results.</p>
        )}
      </div>
    </div>
  );
}

export default App;
