import React, { createContext, useState, useContext, useEffect,useCallback  } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

import { jwtDecode as jwt_decode } from 'jwt-decode';

import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [userInfo, setUserInfo] = useState(null);
  
  const isAuthenticated = !!authToken;

  const fetchUserInfo = useCallback(async (token) => {
    try {
        const decodedToken = jwt_decode(token);
        
        const { email, name, id,role } = decodedToken;

        setUserInfo({ email, name, id,role });
    } catch (error) {
        console.error('Error decoding token:', error);
    }
}, []);

  useEffect(() => {
    const checkTokenExpiration = () => {
        const token = localStorage.getItem('token');
        const tokenExpiration = localStorage.getItem('tokenExpiration');
        if (token && tokenExpiration) {
            const expirationTime = new Date(parseInt(tokenExpiration) * 1000); 
            const currentTime = new Date();
            if (currentTime >= expirationTime) {
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpiration');
                setUserInfo(null);
            }
        }
    };

  
    checkTokenExpiration();

 
    const interval = setInterval(checkTokenExpiration, 60000);

  
    return () => clearInterval(interval);
}, []);

const loginUser = async (credentials) => {
  try {
    const auth = getAuth();
    const response = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    const userName = response.user.displayName;
    const userId = response.user.uid;

    const tokenResponse = await fetch('http://mednat.ieeta.pt:9009/loginusers/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: credentials.email, name: userName, id: userId }),
      credentials: 'include'
    });

    const tokenData = await tokenResponse.json();

    localStorage.setItem('token', tokenData.token);
    localStorage.setItem('tokenExpiration', tokenData.exp);
    window.location.href = "/";

    Toastify({
      text: "Login successful",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "linear-gradient(to right, #4CAF50, #8BC34A)", 
    }).showToast();

  } catch (error) {
    console.error('Login error:', error.message);

    
    if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-email') {
      Toastify({
        text: "Login failed: Invalid email or password",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #F44336, #F57C00)", 
      }).showToast();
    } else {
      
      Toastify({
        text: "Login failed: An error occurred. Please try again later.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #FF9800, #FFCC99)", 
      }).showToast();
    }
  }
};



const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiration');
  setUserInfo(null);
};

  useEffect(() => {
    if (authToken) {
      fetchUserInfo(authToken);
    }
  }, [authToken, fetchUserInfo]);

  const value = {
    authToken,
    userInfo,
    isAuthenticated,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
