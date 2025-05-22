import React, { useState, useEffect, useRef } from 'react';
import { useNavigate} from 'react-router-dom';
import './ChatInterface.css';

const Talkbud = () => {
  const [isListening, setIsListening] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const menuIconRef = useRef(null);

  const navigate = useNavigate();
   
  const toggleMic = () => {
    setIsListening(prev => !prev);
    console.log(!isListening ? '🎤 Listening...' : '🛑 Stopped listening.');
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const logout = () => {
    alert("You're logged out!");
    console.log('🔒 Logging out...');
    setShowDropdown(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !menuIconRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div>
      <div className="bg-image" id="frequencyBg"></div>

      <div className="header">
        <h2>Talkbud</h2>
      </div>

      <div className="menu-icon" ref={menuIconRef} onClick={toggleDropdown}>
        &#9776;
      </div>

      {showDropdown && (
        <div className="dropdown" ref={dropdownRef}>
          <a href="#" onClick={logout}>Logout</a>
        </div>
      )}

      <div className="mic-container">
        <div className="mic-btn" onClick={toggleMic}>
          <img
            src="https://cdn-icons-png.freepik.com/256/800/800309.png?semt=ais_hybrid"
            alt="Mic Icon"
          />
        </div>
        <div
          className="frequency-bars"
          style={{ display: isListening ? 'flex' : 'none' }}
        >
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
    </div>
  );
};

export default Talkbud;
