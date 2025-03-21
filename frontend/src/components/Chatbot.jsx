import React, { useState } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Hello! How may I assist you today?", sender: "bot" },
    { text: "Tell me your device type: Mobile or Laptop?", sender: "bot" },
  ]);
  const [query, setQuery] = useState("");
  const [deviceType, setDeviceType] = useState("");

  // Simulate API for device-based responses
  const handleSendQuery = () => {
    if (query.trim() === "") return;

    const userMessage = { text: query, sender: "user" };
    setMessages([...messages, userMessage]);

    if (!deviceType) {
      // Detect device type from initial user query
      if (query.toLowerCase() === "mobile" || query.toLowerCase() === "laptop") {
        setDeviceType(query.toLowerCase());
        setMessages([...messages, userMessage, { text: `You're using a ${query}. Ask me your query!`, sender: "bot" }]);
      } else {
        setMessages([...messages, userMessage, { text: "Please choose either 'Mobile' or 'Laptop' to proceed.", sender: "bot" }]);
      }
      setQuery("");
      return;
    }

    // Hardcoded responses (Replace with Flask API later)
    const response = getResponse(query, deviceType);
    setMessages([...messages, userMessage, { text: response, sender: "bot" }]);
    setQuery("");
  };

  // Dummy FAQ Responses for Mobile and Laptop
  const getResponse = (query, device) => {
    const mobileFAQ = {
      "battery issue": "Disable Background App Refresh to optimize battery.",
      "app not installing": "Check internet connection or clear Play Store cache.",
    };

    const laptopFAQ = {
      "slow performance": "Disable startup programs and clear temporary files.",
      "update driver": "Use Device Manager to update drivers.",
    };

    const faqData = device === "mobile" ? mobileFAQ : laptopFAQ;
    return faqData[query.toLowerCase()] || "Sorry, I couldn't find a solution. Do you want to escalate?";
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your query..."
        />
        <button onClick={handleSendQuery}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
