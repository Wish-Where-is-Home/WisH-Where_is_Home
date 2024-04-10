import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar/Navbar';
import Homepage from './Pages/Homepage/Homepage';
import Loader from './Components/Loader/Loader';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import './App.css';
import Login_register from './Pages/Login-register/Login_register';
import AboutUs from './Pages/AboutUs/AboutUs';
import PropertiesPage from './Pages/PropertiesPage/PropertiesPage';
import Metrics from './Components/Metrics/Metrics';
import QuizPage from './Pages/SecondPage/QuizPage';


function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

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
          <Route exact path="/login" element={<Login_register  darkMode={darkMode} />} />
          <Route exact path="/properties" element={<PropertiesPage darkMode={darkMode} />} />
          <Route exact path="/metrics" element={<Metrics  darkMode={darkMode} />} />
          <Route exact path="/quiz" element={<QuizPage darkMode={darkMode} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
