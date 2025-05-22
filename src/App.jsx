 // src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './screens/splashScreen';  // 👈 Import this
import Login from './screens/login';
import Register from './screens/Registration';
import Home from './screens/Home';
import Talkbud from './screens/ChatInteface';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />           {/* 👈 Splash screen first */}
        <Route path="/Login" element={<Login />} />       {/* 👈 Real login route */}
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Talkbud />} />
      </Routes>
    </Router>
  );
};

export default App;
