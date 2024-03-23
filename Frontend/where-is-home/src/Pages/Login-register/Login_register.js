import React, { useState } from 'react';
import './Login_register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {useTranslation} from "react-i18next";
import { useAuth } from '../../AuthContext/AuthContext';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const Login_register = ({ darkMode,firebaseConfig }) => {
    
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordVisible2, setPasswordVisible2] = useState(false);
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const {t} = useTranslation("common");

    const[emailLogin,setEmailLogin] = useState('');
    const[passwordLogin,setPasswordLogin] = useState('');


    const [nameRegister,setNameRegister] = useState('');
    const [emailRegister, setEmailRegister] = useState('');
    const [passwordRegister, setPasswordRegister] = useState('');
    const [passwordConfirmRegister, setPasswordConfirmRegister] = useState('');

    
    const { loginUser } = useAuth();


    const handleLogin = (e) => {
        e.preventDefault(); 
        loginUser({
          email: emailLogin,
          password: passwordLogin
        });
      };


    const handleRegister = (e) => {
        e.preventDefault(); 
        if (passwordRegister !== passwordConfirmRegister) {
          console.error("Passwords do not match");
          return;
        }
    
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, emailRegister, passwordRegister)
          .then((userCredential) => {
            const user = userCredential.user;
            updateProfile(user, {
              displayName: nameRegister
            }).then(() => {
              console.log("User registered with name:", nameRegister);
              setIsLoginForm(true);
            }).catch((error) => {
              console.error("Error updating profile:", error.message);
            });
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Registration error:", errorMessage);
          });
      };


      const handleGoogleLogin = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("User signed in with Google:", user);
    
            // Create token
            const tokenResponse = await fetch('http://localhost:8000/loginusers/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: user.email, name: user.displayName, id: user.uid }),
                credentials: 'include'
            });
    
            const tokenData = await tokenResponse.json();
    
            localStorage.setItem('token', tokenData.token);
            localStorage.setItem('tokenExpiration', tokenData.exp);
            window.location.href ="/"
        } catch (error) {
            console.error("Google login error:", error.message);
        }
    };
    
      const handleFacebookLogin = () => {
        const auth = getAuth();
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider)
          .then((result) => {
            
            const user = result.user;
            console.log("User signed in with Facebook:", user);
          })
          .catch((error) => {
            console.error("Facebook login error:", error.message);
          });
      };


    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const togglePasswordVisibility2 = () => {
        setPasswordVisible2(!passwordVisible2);
    };

    const toggleForm = () => {
        setIsLoginForm(!isLoginForm);
    };

    const toggleForgotPassword = () => {
        setShowForgotPassword(!showForgotPassword);
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        console.log("Password reset requested!");
    };


    return (
        <div className={`login ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className='container'>
                {isLoginForm && !showForgotPassword ? (
                    <div className='login-forms'>
                        <h2>Login</h2>
                        <div className='space'>
                        </div>
                        <form className="login-f">
                            <div className='inputs-login'>
                                <div className="field input-field">
                                    <input type="email" placeholder="Email" className="input"  onChange={(e) => setEmailLogin(e.target.value)}/>
                                </div>
                                <div className='pass-vis'>
                                 <div className="field input-field">
                                        <input
                                            type={passwordVisible ? 'text' : 'password'}
                                            placeholder= {t('password')}
                                            className="password"
                                            onChange={(e) => setPasswordLogin(e.target.value)}
                                        />
                                    </div>
                                    <FontAwesomeIcon
                                            icon={passwordVisible ? faEyeSlash : faEye}
                                            className="eye-icon"
                                            onClick={togglePasswordVisibility}
                                        />
                                </div>
                            </div>
                            <div className="form-link">
                                <a href="#" className="forgot-pass" onClick={toggleForgotPassword}>{t('forgotpass')}</a>
                            </div>

                        <div className="field button-field">
                            <button onClick={handleLogin}>Login</button>
                        </div>
                        </form>
                        <div className="form-link">
                        <span>{t('donthave')} <a href="#" className="link login-link" onClick={toggleForm}>Sign Up</a></span>
                        </div>
                        <div className='icons-login'>
                            <svg style={{ display: 'none' }}>
                                <symbol id="svg--facebook" viewBox="0 -7 16 30">
                                    <path d="M12 3.303h-2.285c-0.27 0-0.572 0.355-0.572 0.831v1.65h2.857v2.352h-2.857v7.064h-2.698v-7.063h-2.446v-2.353h2.446v-1.384c0-1.985 1.378-3.6 3.269-3.6h2.286v2.503z" />
                                </symbol>
                                <symbol id="svg--google" viewBox="-13 -13 72 72">
                                    <path d="M48,22h-5v-5h-4v5h-5v4h5v5h4v-5h5 M16,21v6.24h8.72c-0.67,3.76-3.93,6.5-8.72,6.5c-5.28,0-9.57-4.47-9.57-9.75
                                        s4.29-9.74,9.57-9.74c2.38,0,4.51,0.82,6.19,2.42v0.01l4.51-4.51C23.93,9.59,20.32,8,16,8C7.16,8,0,15.16,0,24s7.16,16,16,16
                                        c9.24,0,15.36-6.5,15.36-15.64c0-1.17-0.11-2.29-0.31-3.36C31.05,21,16,21,16,21z" />
                                </symbol>
                            </svg>

                            <button onClick={handleGoogleLogin} className="share google">
                                <svg role="presentation" className="svg--icon">
                                    <use xlinkHref="#svg--google" />
                                    <span className="clip">GOOGLE</span>
                                </svg>
                            </button>

                            <button onClick={handleFacebookLogin} className="share facebook">
                                <svg role="presentation" className="svg--icon">
                                    <use xlinkHref="#svg--facebook" />
                                    <span className="clip">FACEBOOK</span>
                                </svg>
                            </button>
                        </div>
                    </div>
                ): !isLoginForm && !showForgotPassword ?(
                    <div className='register-forms'>
                        <h2>{t('register')}</h2>
                        <div className='space'>
                        </div>
                        <form>
                        <div className='inputs-login'>
                                <div className="field input-field">
                                    <input type="text" placeholder="Name" className="input" onChange={(e) => setNameRegister(e.target.value)}/>
                                </div>
                                <div className="field input-field">
                                    <input type="email" placeholder="Email" className="input" onChange={(e) => setEmailRegister(e.target.value)} />
                                </div>
                                <div className='pass-vis'>
                                 <div className="field input-field">
                                        <input
                                            type={passwordVisible ? 'text' : 'password'}
                                            placeholder={t('password')}
                                            className="password"
                                            onChange={(e) => setPasswordRegister(e.target.value)}
                                        />
                                    </div>
                                    <FontAwesomeIcon
                                            icon={passwordVisible ? faEyeSlash : faEye}
                                            className="eye-icon"
                                            onClick={togglePasswordVisibility}
                                        />
                                </div>
                                <div className='pass-vis'>
                                 <div className="field input-field">
                                        <input
                                            type={passwordVisible2 ? 'text' : 'password'}
                                            placeholder={t('confirmpass')}
                                            className="password"
                                            onChange={(e) => setPasswordConfirmRegister(e.target.value)}
                                        />
                                    </div>
                                    <FontAwesomeIcon
                                            icon={passwordVisible2 ? faEyeSlash : faEye}
                                            className="eye-icon"
                                            onClick={togglePasswordVisibility2}
                                        />
                                </div>
                                
                            </div>

                        <div className="field button-field">
                            <button onClick={handleRegister}>{t('register')}</button>
                        </div>
                        </form>
                        <div className="form-link">
                        <span>{t('jatemconta')} <a href="#" className="link login-link" onClick={toggleForm}>Login</a></span>
                        </div>
                        <div className='icons-login'>
                            <svg style={{ display: 'none' }}>
                                <symbol id="svg--facebook" viewBox="0 -7 16 30">
                                    <path d="M12 3.303h-2.285c-0.27 0-0.572 0.355-0.572 0.831v1.65h2.857v2.352h-2.857v7.064h-2.698v-7.063h-2.446v-2.353h2.446v-1.384c0-1.985 1.378-3.6 3.269-3.6h2.286v2.503z" />
                                </symbol>
                                <symbol id="svg--google" viewBox="-13 -13 72 72">
                                    <path d="M48,22h-5v-5h-4v5h-5v4h5v5h4v-5h5 M16,21v6.24h8.72c-0.67,3.76-3.93,6.5-8.72,6.5c-5.28,0-9.57-4.47-9.57-9.75
                                        s4.29-9.74,9.57-9.74c2.38,0,4.51,0.82,6.19,2.42v0.01l4.51-4.51C23.93,9.59,20.32,8,16,8C7.16,8,0,15.16,0,24s7.16,16,16,16
                                        c9.24,0,15.36-6.5,15.36-15.64c0-1.17-0.11-2.29-0.31-3.36C31.05,21,16,21,16,21z" />
                                </symbol>
                            </svg>

                            <button onClick={handleGoogleLogin} className="share google">
                                <svg role="presentation" className="svg--icon">
                                    <use xlinkHref="#svg--google" />
                                    <span className="clip">GOOGLE</span>
                                </svg>
                            </button>

                            <button onClick={handleFacebookLogin} className="share facebook">
                                <svg role="presentation" className="svg--icon">
                                    <use xlinkHref="#svg--facebook" />
                                    <span className="clip">FACEBOOK</span>
                                </svg>
                            </button>
                        </div>
                                   
                    </div>
                ): showForgotPassword ?(
                    <div className="forget-forms">
                        <h2>{t('resetpass')}</h2>
                        <div className='space'>
                        </div>
                        <p>{t('jatemconta')}</p>
                        <form>
                        <div className='inputs-login'>
                                <div className="field input-field">
                                    <input type="email" placeholder="Email" className="input"/>
                                </div>
                        </div>
                        <div className="field button-field">
                            <button>{t('register')}</button>
                        </div>
                        </form>
                        <div className="form-link">
                        <span>{t('backlogin')} <a href="#" className="link login-link" onClick={toggleForgotPassword}>Login</a></span>
                        </div>
                                   
                    </div>

                ):null}
            </div>
        </div>
    );
};

export default Login_register;