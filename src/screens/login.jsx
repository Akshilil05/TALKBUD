 // src/screens/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const validateInputs = (username, password) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(username) && password.length >= 6;
  };

   const loginUser = async (username, password) => {
  try {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      alert('Login successful!');
      navigate('/home');
    } else {
      alert(data.error);
    }
  } catch (err) {
    alert('Error: Unable to connect to server.');
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInputs(username, password)) {
      loginUser(username, password);
    } else {
      alert('Please enter a valid email and password.');
    }
  };

  return (
    <div className="background-image">
      <div className="loginForm">
        <h2>TalkBud</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Log In</button>
        </form>
        <div className="links">
          <a href="#" className="forgot-password">Forgot Password?</a>
          <Link to="/register" className="signup-link">Sign Up</Link>
        </div>
         
      </div>
    </div>
  );
};

export default Login;
