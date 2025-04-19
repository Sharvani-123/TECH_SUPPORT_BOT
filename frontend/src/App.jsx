import React, { useState } from 'react';
import './App.css';
import Chatbot from './components/Chatbot.jsx';

function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="app-container">
      {/* Background Shapes */}
      <div className="background-shapes">
        <div className="shape" style={{ top: '10%', left: '20%' }}></div>
        <div className="shape" style={{ top: '40%', left: '70%' }}></div>
        <div className="shape" style={{ top: '70%', left: '30%' }}></div>
        <div className="shape" style={{ top: '20%', left: '80%' }}></div>
      </div>

      <div className="content">
        <h1>Welcome to TechEase</h1>
        <p>Your one-stop solution for quick tech support!</p>
        <p>Made by</p>
        <p>Vanshika Gupta 37</p>
        <p>Sharvani 59</p>
      </div>

      {/*Always render*/}
      {<Chatbot />}
    </div>
  );
}

export default App;
