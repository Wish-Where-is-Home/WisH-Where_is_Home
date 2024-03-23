import React, { createContext, useState, useContext, useEffect,useCallback  } from 'react';
import axios from 'axios';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const jwt_decode = require('jwt-decode');


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [userInfo, setUserInfo] = useState(null);

  const isAuthenticated = !!authToken;

  const fetchUserInfo = useCallback(async (token) => {
    try {
      const decodedToken = jwt_decode(token);
      setUserInfo(decodedToken);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }, []);

  const updateAuthToken = (token) => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem('authToken', token);
      fetchUserInfo(token);
    } else {
      localStorage.removeItem('authToken');
      setUserInfo(null);
    }
  };

  const loginUser = async (credentials) => {
    try {
        // Get the Firebase authentication instance
        const auth = getAuth();
        
        // Send the email and password to Firebase for authentication
        const response = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
        console.log('Login successful:', response.user);
        
        // Authentication successful, call backend to generate JWT token
        const tokenResponse = await fetch('http://localhost:8000/loginusers/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, name: credentials.name }),
            credentials: 'include' // Include credentials (cookies) in the request
        });

        // Parse tokenResponse as needed
        const tokenData = await tokenResponse.json();
        
        // Store the JWT token securely (e.g., in local storage)
        localStorage.setItem('token', tokenData.token);
    
        console.log('Token received:', tokenData.token);
        // Perform any additional actions after successful login
        
    } catch (error) {
        // Handle authentication errors
        console.error('Login error:', error.message);
        // Perform any error handling or display error messages to the user
    }
};
  
  const logoutUser = () => {
    updateAuthToken(null);
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
