import React from 'react';
import './AboutUs.css';
import {useTranslation} from "react-i18next";


function AboutUs ({darkMode}) {
    const {t} = useTranslation("common");
        return (
            <div className={`AboutUs ${darkMode ? 'dark-mode' : 'light-mode'}`}>
                <div className='backline'></div>
                <div className='aboutus-container'>
                    <div className='aboutus-text-container'>

                    <h2>About Us</h2>

                    <div className='text'>
                        <p>{t('textaboutus')}</p>
                    </div>

                    </div>
                    <div className='about-us-video'>
                        <div></div>
                    </div>
                </div>
            </div>      
        );
    
}

export default AboutUs;