import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar/Navbar';
import Homepage from './Pages/Homepage/Homepage';
import Loader from './Components/Loader/Loader';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login_register from './Pages/Login-register/Login_register';
import AboutUs from './Pages/AboutUs/AboutUs';
import MetricsPage from './Pages/MetricsPage/MetricsPage';
import QuizPage from './Pages/SecondPage/QuizPage';
import { useAuth } from './AuthContext/AuthContext';
import ProfilePage from './Pages/ProfilePage/ProfilePage';
import AdminPage from './Pages/AdminPage/AdminPage';




import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';


function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [zoneData, setZoneData] = useState(null);
  const [scores, setScores] = useState(null);
  const { isAuthenticated, userInfo } = useAuth();


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

  const storage = getStorage(app);
  const db = getFirestore(app);



  async function handleSubmitImagesImoveis(photos, imovel_Id) {
    const collectionRef = doc(db, "imoveis", imovel_Id);
    if (!photos || photos.length === 0) return;

    const docSnap = await getDoc(collectionRef);
      if (!docSnap.exists()) {
        await setDoc(collectionRef, {});
      }


    const uploadTasks = Array.from(photos).map((photo, index) =>{

      const storageRef = ref(storage, `images/${photo.name}`);
      const uploadTask = uploadBytesResumable(storageRef, photos);
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            
            reject(error);
          },
          () => {
            
            getDownloadURL(uploadTask.snapshot.ref).then( async(downloadURL) => {
              const docSnapshot = await getDoc(collectionRef);
              const data = docSnapshot.data();
              const updatedImageURLs = [...(data.imageurl || []), downloadURL];
              await updateDoc(collectionRef, {
                imageurl: updatedImageURLs,
              });
              console.log('File available at', downloadURL);
              resolve(downloadURL);
            });
          }
        );
      });
      
    });

    try {
      const downloadURLs = await Promise.all(uploadTasks);
      console.log('All files uploaded', downloadURLs);
      return downloadURLs;
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };


  async function handleSubmitImagesBedrooms(photos, bedroom_Id,imovel_Id) {
    const collectionRef = doc(db, "quartos", bedroom_Id);
    if (!photos || photos.length === 0) return;

    const docSnap = await getDoc(collectionRef);
      if (!docSnap.exists()) {
        const collectionRef2 = doc(db,"quartos",bedroom_Id);
        await setDoc(collectionRef2);
      }

    const uploadTasks = Array.from(photos).map((photo, index) =>{

      const storageRef = ref(storage, `images/${photo.name}`);
      const uploadTask = uploadBytesResumable(storageRef, photos);
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            
            reject(error);
          },
          () => {
            
            getDownloadURL(uploadTask.snapshot.ref).then( async(downloadURL) => {
              const docSnapshot = await getDoc(collectionRef);
              const data = docSnapshot.data();
              const updatedImageURLs = [...(data.imageurl || []), downloadURL];


              await updateDoc(collectionRef, {
                imageurl: updatedImageURLs,
                imovel_id:imovel_Id,
              });
              console.log('File available at', downloadURL);
              resolve(downloadURL);
            });
          }
        );
      });
    });
    
    try {
      const downloadURLs = await Promise.all(uploadTasks);
      console.log('All files uploaded', downloadURLs);
      return downloadURLs;
    } catch (error) {
      console.error('Error uploading files:', error);
    }

  };


  async function fetchImageURLsImoveis(imovel_Id) {
    try{
      const imid = String(imovel_Id);
      const collectionRef = doc(db, "imoveis", imid);
      const docSnap = await getDoc(collectionRef);
      
    if (docSnap.exists()) {
      const data = docSnap.data();
      const imageUrls = data.imageurl || []; 
      return imageUrls;
    } else {
      console.log("No such document!");
      return [];
    }
  }catch(error){
    console.error("Error fetching bedroom images:", error);
    return [];
  }
  }

  async function fetchImageURLsBedrooms(bedroom_Id) {
    try {
      const bedroomIdString = String(bedroom_Id);
      const collectionRef = doc(db, "quartos", bedroomIdString);
      const docSnap = await getDoc(collectionRef);

      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const imageUrls = data.imageurl || []; 
        return imageUrls;
      } else {
        console.log("No such document!");
        return [];
      }
    } catch (error) {
      console.error("Error fetching bedroom images:", error);
      return [];
    }
  }
  



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


  function updateuserpreferences() {

  }

  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Loader visible={loading} />
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Router>
        <Routes>
          <Route exact path="/" element={<Homepage darkMode={darkMode} />} />
          <Route exact path="/aboutus" element={<AboutUs darkMode={darkMode} />} />
          <Route exact path="/login" element={<Login_register darkMode={darkMode} firebaseConfig={firebaseConfig} />} />
          <Route exact path="/quiz" element={<QuizPage darkMode={darkMode} zoneData={zoneData} scores={scores} updateScores={updateScores} />} />
          <Route exact path="/metricspage" element={<MetricsPage darkMode={darkMode} zoneData={zoneData} scores={scores} updateScores={updateScores} />} />
          <Route exact path="/profilepage" element={<ProfilePage darkMode={darkMode} zoneData={zoneData} scores={scores} updateScores={updateScores} />} />
          <Route exact path="/admin" element={<AdminPage darkMode={darkMode} fetchImageURLsImoveis={fetchImageURLsImoveis} fetchImageURLsBedrooms={fetchImageURLsBedrooms} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
