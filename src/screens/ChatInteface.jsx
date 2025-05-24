import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatInterface.css';

const Talkbud = () => {
  const [isListening, setIsListening] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [result, setResult] = useState({ original: '', corrected: '' });
  const dropdownRef = useRef(null);
  const menuIconRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(prev => !prev);

  const logout = () => {
    alert("You're logged out!");
    setShowDropdown(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        menuIconRef.current &&
        !menuIconRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

   const startRecording = () => {
  return new Promise(async (resolve, reject) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('getUserMedia is not supported in your browser.');
      return reject('getUserMedia not supported');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.wav');

           const response = await fetch('http://localhost:5001/analyze', {
              method: 'POST',
              body: formData,
            });


          if (!response.ok) {
            try {
              const errorData = await response.json();
              alert('Error from server: ' + (errorData.error || 'Unknown error'));
              } catch (jsonErr) {
                  alert('Unknown server error. Status: ' + response.status);
              }
              return;
          }


          // **Audio** blob as response
          const audioData = await response.blob();
          const audioURL = URL.createObjectURL(audioData);
          const audio = new Audio(audioURL);
          audio.play();

        } catch (error) {
          alert('Error sending audio: ' + error.message);
        }

        resolve();
      };

      mediaRecorderRef.current.start();
      setTimeout(() => mediaRecorderRef.current.stop(), 4000); // Record 4 sec

    } catch (err) {
      alert('Could not start recording: ' + err.message);
      reject(err);
    }
  });
};

const toggleMic = () => {
  if (isListening) return;

  setIsListening(true);
  startRecording().finally(() => setIsListening(false));
};

  return (
    <div>
      <div className="bg-image" id="frequencyBg"></div>

      <div className="header">
        <h2>Talkbud</h2>
      </div>

      <div className="menu-icon" ref={menuIconRef} onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
        &#9776;
      </div>

      {showDropdown && (
        <div className="dropdown" ref={dropdownRef}>
          <a href="#" onClick={e => { e.preventDefault(); logout(); }}>Logout</a>
        </div>
      )}

      <div className="mic-container">
        <div className="mic-btn" onClick={toggleMic} style={{ cursor: 'pointer' }}>
          <img
            src="https://cdn-icons-png.freepik.com/256/800/800309.png?semt=ais_hybrid"
            alt="Mic Icon"
            style={{ filter: isListening ? 'drop-shadow(0 0 8px #0f0)' : 'none' }}
          />
        </div>
        <div className="frequency-bars" style={{ display: isListening ? 'flex' : 'none' }}>
          {[...Array(5)].map((_, i) => <div className="bar" key={i}></div>)}
        </div>
      </div>

      <div className="result-container" style={{ marginTop: '20px', padding: '0 20px' }}>
        {result.original && (
          <>
            <h3>Original Text:</h3>
            <p>{result.original}</p>
          </>
        )}
        {result.corrected && (
          <>
            <h3>Corrected Text:</h3>
            <p>{result.corrected}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Talkbud;

