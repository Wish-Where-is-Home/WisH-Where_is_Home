import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar/Navbar';
import Homepage from './Pages/Homepage/Homepage';
import Loader from './Components/Loader/Loader';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom'; 
import './App.css';

function App() {

  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
}, []);

const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-mode', !darkMode);
};

useEffect(() => {
  const timer = setTimeout(() => {
      setLoading(false);
  }, 2000);

  return () => clearTimeout(timer);
}, []);



  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Loader visible={loading} /> 
       {!loading && (
        <>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>
        <BrowserRouter>
                          <Routes>
                          <Route exact path="/" element={<Homepage darkMode={darkMode} />} />
                          </Routes>
          </BrowserRouter>
        </>
        )}
    </div>
  );
}

export default App;
