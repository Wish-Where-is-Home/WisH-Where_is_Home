import React from 'react';
import './AboutUs.css';
import {useTranslation} from "react-i18next";
import video from './../../Assets/Video/promovideo.mp4';


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
                        <div>
                        <video width="100%" height="100%" className="video2" autoPlay loop muted disablePictureInPicture controlsList="nodownload">                            
                            <source src={video} type="video/mp4"/>
                            Seu navegador não suporta a tag de vídeo.
                        </video>
                        </div>
                    </div>
                </div>
            </div>      
            );
    
}

export default AboutUs;