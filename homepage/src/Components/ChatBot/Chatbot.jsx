import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatbot.css";

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser does not support microphone access.");
    }
  }, []);

  const startRecording = async () => {
    try {
      setListening(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        sendAudioToBackend(audioBlob);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    setListening(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const sendAudioToBackend = async (audioBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result.split(",")[1];

      try {
        const response = await axios.post("http://localhost:8000/api/speech-to-text-chatbot", {
          audioData: base64Audio,
          language: language,
        });

        const { transcript, chatbotReply, audioContent } = response.data;

        setChatHistory((prev) => [
          ...prev,
          { sender: "You", message: transcript },
          { sender: "Bot", message: chatbotReply },
        ]);

        // Auto-scroll
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }, 100);

        // Play response audio
        const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
        audio.play();

      } catch (error) {
        console.error("Error sending audio:", error);
      }
    };
  };

  return (
    <div className="chatbot-container">
      <h2>Language Chatbot</h2>
      <select value={language} onChange={(e) => setLanguage(e.target.value)} className="language-select">
        <option value="en-US">English</option>
        <option value="es-ES">Spanish</option>
        <option value="fr-FR">French</option>
      </select>

      <div className="chat-history" ref={chatContainerRef}>
        {chatHistory.map((chat, index) => (
          <div key={index} className={chat.sender === "You" ? "user-message" : "bot-message"}>
            <strong>{chat.sender}:</strong> {chat.message}
          </div>
        ))}
      </div>

      <button onMouseDown={startRecording} onMouseUp={stopRecording} className="record-button">
        {listening ? "Recording..." : "Hold to Talk"}
      </button>
    </div>
  );
};

export default Chatbot;
