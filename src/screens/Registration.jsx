 // src/screens/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Registration.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const validateInputs = (username, password, confirmPassword) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(username)) {
      alert('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInputs(username, password, confirmPassword)) {
      console.log('Registering user:', username);
      alert('Signup successful!');
      navigate('/');  
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
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Signup</button>
        </form>
        <p className="signup-link">
          Already a user? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
