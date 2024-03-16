import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo from '../../Assets/Logos/logo1.png';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { LanguageSelector } from '../LanguageSelector/LanguageSelector';

function Navbar({ darkMode, toggleDarkMode }) {

    const { t } = useTranslation("common");

    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1700);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1500);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <nav className={`navbar ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className='navbar-container'>
                <div className="logo">
                    <a href='/'>
                    <img src={logo} alt="logo" />
                    </a>
                </div>
                <div className='navbar-options'>
                    {isMobile ? (
                        <div className="hamburger" onClick={toggleMenu}>
                            <div className={`hamburger-lines ${menuOpen ? 'open' : ''}`}>
                                <span className="line line1"></span>
                                <span className="line line2"></span>
                                <span className="line line3"></span>
                            </div>
                        </div>
                    ) : (
                        <div className="menu-items2">
                            <ul>
                                <li><a href="/aboutus">{t('aboutus')}</a></li>
                                <li><a href="/login">Login</a></li>
                                <li><LanguageSelector style={{"marginleft":"3rem"}}/></li>
                            </ul>
                        </div>
                    )}
                    <div className="theme-toggle-container">
                        <FontAwesomeIcon icon={faSun} className="sun-icon" />
                        <FontAwesomeIcon icon={faMoon} className="moon-icon" />
                        <input type="checkbox" className="theme-toggle" checked={darkMode} onChange={toggleDarkMode} />
                    </div>
                </div>
            </div>
            {menuOpen && isMobile && (
                <div className="menu-items">
                    <ul>
                        <li><a href="/aboutus">{t('aboutus')}</a></li>
                        <li><a href="/login">Login</a></li>
                        <li><LanguageSelector style={{margin:0}}/></li>
                    </ul>
                </div>
            )}
        </nav>
    );
}

export default Navbar;

