import React from 'react';
import './Login_register.css';

const Login_register =({darkMode})=>{
    return(
        <div className={`login ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        </div>
    );
}
export default Login_register;