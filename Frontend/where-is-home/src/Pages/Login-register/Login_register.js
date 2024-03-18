import React, { useState } from 'react';
import './Login_register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login_register = ({ darkMode }) => {
    
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordVisible2, setPasswordVisible2] = useState(false);
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

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
                                <div class="field input-field">
                                    <input type="email" placeholder="Email" className="input"/>
                                </div>
                                <div className='pass-vis'>
                                 <div class="field input-field">
                                        <input
                                            type={passwordVisible ? 'text' : 'password'}
                                            placeholder="Password"
                                            className="password"
                                        />
                                    </div>
                                    <FontAwesomeIcon
                                            icon={passwordVisible ? faEyeSlash : faEye}
                                            className="eye-icon"
                                            onClick={togglePasswordVisibility}
                                        />
                                </div>
                            </div>
                            <div class="form-link">
                                <a href="#" class="forgot-pass" onClick={toggleForgotPassword}>Forgot password?</a>
                            </div>

                        <div class="field button-field">
                            <button>Login</button>
                        </div>
                        </form>
                        <div class="form-link">
                        <span>Don't have an account? <a href="#" className="link login-link" onClick={toggleForm}>Sign Up</a></span>
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

                            <a href="" rel="author" className="share google">
                                <svg role="presentation" className="svg--icon">
                                    <use xlinkHref="#svg--google" />
                                    <span className="clip">GOOGLE +</span>
                                </svg>
                            </a>

                            <a href="" rel="author" className="share facebook">
                                <svg role="presentation" className="svg--icon">
                                    <use xlinkHref="#svg--facebook" />
                                    <span className="clip">FACEBOOK</span>
                                </svg>
                            </a>
                        </div>
                    </div>
                ): !isLoginForm && !showForgotPassword ?(
                    <div className='register-forms'>
                        <h2>Register</h2>
                        <div className='space'>
                        </div>
                        <form>
                        <div className='inputs-login'>
                                <div class="field input-field">
                                    <input type="email" placeholder="Email" className="input"/>
                                </div>
                                <div className='pass-vis'>
                                 <div class="field input-field">
                                        <input
                                            type={passwordVisible ? 'text' : 'password'}
                                            placeholder="Password"
                                            className="password"
                                        />
                                    </div>
                                    <FontAwesomeIcon
                                            icon={passwordVisible ? faEyeSlash : faEye}
                                            className="eye-icon"
                                            onClick={togglePasswordVisibility}
                                        />
                                </div>
                                <div className='pass-vis'>
                                 <div class="field input-field">
                                        <input
                                            type={passwordVisible2 ? 'text' : 'password'}
                                            placeholder="Confirm Password"
                                            className="password"
                                        />
                                    </div>
                                    <FontAwesomeIcon
                                            icon={passwordVisible2 ? faEyeSlash : faEye}
                                            className="eye-icon"
                                            onClick={togglePasswordVisibility2}
                                        />
                                </div>
                                
                            </div>

                        <div class="field button-field">
                            <button>Register</button>
                        </div>
                        </form>
                        <div class="form-link">
                        <span>Already have an account? <a href="#" className="link login-link" onClick={toggleForm}>Login</a></span>
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

                            <a href="" rel="author" className="share google">
                                <svg role="presentation" className="svg--icon">
                                    <use xlinkHref="#svg--google" />
                                    <span className="clip">GOOGLE +</span>
                                </svg>
                            </a>

                            <a href="" rel="author" className="share facebook">
                                <svg role="presentation" className="svg--icon">
                                    <use xlinkHref="#svg--facebook" />
                                    <span className="clip">FACEBOOK</span>
                                </svg>
                            </a>
                        </div>
                                   
                    </div>
                ): showForgotPassword ?(
                    <div className="forget-forms">
                        <h2>Reset Password</h2>
                        <div className='space'>
                        </div>
                        <p>What is your email?</p>
                        <form>
                        <div className='inputs-login'>
                                <div class="field input-field">
                                    <input type="email" placeholder="Email" className="input"/>
                                </div>
                        </div>
                        <div class="field button-field">
                            <button>Submit</button>
                        </div>
                        </form>
                        <div class="form-link">
                        <span>Go back to login? <a href="#" className="link login-link" onClick={toggleForgotPassword}>Login</a></span>
                        </div>
                                   
                    </div>

                ):null}
            </div>
        </div>
    );
};

export default Login_register;