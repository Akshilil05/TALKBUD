import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './splash.css';
import logo from '../assets/logo.png'; 

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);  

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <img
        src={logo}  
        alt="App Icon"
        className="splash-logo"
      />
      <h1 className="splash-title">TalkBud</h1>
    </div>
  );
};

export default Splash;
