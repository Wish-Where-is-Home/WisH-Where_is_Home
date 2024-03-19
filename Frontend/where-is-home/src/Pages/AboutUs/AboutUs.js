import React from 'react';
import './AboutUs.css';

function AboutUs ({darkMode}) {
        return (
            <div className={`AboutUs ${darkMode ? 'dark-mode' : 'light-mode'}`}>
                <div className='backline'></div>
                <div className='aboutus-container'>
                    <div className='aboutus-text-container'>

                    </div>
                    <div className='about-us-video'>
                        <div></div>
                    </div>
                </div>
            </div>
        );
    
}

export default AboutUs;