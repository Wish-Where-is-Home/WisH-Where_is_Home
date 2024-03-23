import React, { createContext, useState, useContext, useEffect,useCallback  } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

import { jwtDecode as jwt_decode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [userInfo, setUserInfo] = useState(null);


  const isAuthenticated = !!authToken;

  const fetchUserInfo = useCallback(async (token) => {
    try {
        const decodedToken = jwt_decode(token);
        
        const { email, name } = decodedToken;

        setUserInfo({ email, name });
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
        
       
        const tokenResponse = await fetch('http://localhost:8000/loginusers/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, name: userName }),
            credentials: 'include' 
        });

        const tokenData = await tokenResponse.json();
        
        
        localStorage.setItem('token', tokenData.token);
        localStorage.setItem('tokenExpiration', tokenData.exp); 
        
        
    } catch (error) {
        
        console.error('Login error:', error.message);
        
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
