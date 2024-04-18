import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar/Navbar';
import Homepage from './Pages/Homepage/Homepage';
import Loader from './Components/Loader/Loader';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import './App.css';
import Login_register from './Pages/Login-register/Login_register';
import AboutUs from './Pages/AboutUs/AboutUs';
import MetricsPage from './Pages/MetricsPage/MetricsPage';
import PropertiesPage from './Pages/PropertiesPage/PropertiesPage';
import Metrics from './Components/Metrics/Metrics';
import QuizPage from './Pages/SecondPage/QuizPage';
import Questions from './Pages/Questions/Questions';
import { useAuth } from './AuthContext/AuthContext';



import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";


function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [zoneData, setZoneData] = useState(null);
  const [scores, setScores] = useState(null);
  const { isAuthenticated,userInfo} = useAuth();


  const updateScores = (newScores) => {
    setScores(newScores);
    console.log(scores);
};


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
    const fetchData = async () => {
      try {
        const response = await fetch('http://mednat.ieeta.pt:9009/api/zone/', { timeout: 2000 });
        const data = await response.json();
        console.log(data);
        setZoneData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
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


  function updateuserpreferences(){
    
  }

  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Loader visible={loading} />
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>
      <Router>
        <Routes>
          <Route exact path="/" element={<Homepage darkMode={darkMode} />} />
          <Route exact path="/aboutus" element={<AboutUs darkMode={darkMode}/>}/>
          <Route exact path="/login" element={<Login_register  darkMode={darkMode} firebaseConfig={firebaseConfig} />} />
          <Route exact path="/quiz" element={<QuizPage darkMode={darkMode} zoneData={zoneData} scores={scores} updateScores={updateScores} />} />
          <Route exact path="/metricspage" element={<MetricsPage  darkMode={darkMode} zoneData={zoneData} scores={scores} updateScores={updateScores} />} />
          <Route exact path="/profilepage" element={<ProfilePage darkMode={darkMode} zoneData={zoneData} scores={scores} updateScores={updateScores} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
