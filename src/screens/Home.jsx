import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import bgImage from '../assets/home-bg.jpg';  

const Home = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/chat');
  };

  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${bgImage})` }} 
    >
      <h1>Welcome to TalkBud!</h1>
      <button id="button" onClick={handleStart}>
        Start Talking
      </button>
    </div>
  );
};

export default Home;
