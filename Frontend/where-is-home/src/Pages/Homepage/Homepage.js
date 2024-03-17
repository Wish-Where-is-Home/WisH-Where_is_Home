import React from "react";
import './Homepage.css';
import {useTranslation} from "react-i18next";
import videobackground from './../../Assets/Video/videobackground.mp4';


function Homepage( {darkMode}) {

    const {t} = useTranslation("common");

return (
    <div className={`home-section ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="video-container">
                        <video autoPlay muted loop className="video" disablePictureInPicture controlsList="nodownload">
                            <source src={videobackground} type="video/mp4" />
                        </video>
        </div>
        <h2 className='hometitle'>
               {t('QuoteHome')}!
        </h2>
    </div>
);

}export default Homepage;