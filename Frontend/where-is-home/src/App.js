import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar/Navbar';
import Homepage from './Pages/Homepage/Homepage';
import Loader from './Components/Loader/Loader';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import './App.css';
import Login_register from './Pages/Login-register/Login_register';
import AboutUs from './Pages/AboutUs/AboutUs';

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";


function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const firebaseConfig = {

    apiKey: "AIzaSyDGcTX2Ry6N0IUgPDRxiu0iJZanmfi41Dw",
  
    authDomain: "wish-9b245.firebaseapp.com",
  
    projectId: "wish-9b245",
  
    storageBucket: "wish-9b245.appspot.com",
  
    messagingSenderId: "364387023023",
  
    appId: "1:364387023023:web:bf11ec82e5c252c44cfc5a",
  
    measurementId: "G-CZ6JHQCLWR"
  
  };

  const app = initializeApp(firebaseConfig);

  const analytics = getAnalytics(app);
  
  

  

  useEffect(() => {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-mode', !darkMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Loader visible={loading} />
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>
      <Router>
        <Routes>
          <Route exact path="/" element={<Homepage darkMode={darkMode} />} />
          <Route exact path="/aboutus" element={<AboutUs darkMode={darkMode}/>}/>
          <Route exact path="/login" element={<Login_register  darkMode={darkMode} firebaseConfig={firebaseConfig} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
