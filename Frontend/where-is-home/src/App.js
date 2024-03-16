import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar/Navbar';
import './App.css';

function App() {

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
}, []);

const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-mode', !darkMode);
};




  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
       <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>
    </div>
  );
}

export default App;
