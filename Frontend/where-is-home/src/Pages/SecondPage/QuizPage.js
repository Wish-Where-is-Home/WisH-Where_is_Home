import React, { useRef, useEffect } from 'react';
import 'toolcool-range-slider';
import { useTranslation } from "react-i18next";
import './QuizPage.css';

function QuizPage({ darkMode }) {
  const { t } = useTranslation("common");
  
  const onSliderChange = (event) => {
    const value = Math.round(event.detail.value);
    console.log(`${event.target.name} value: ${value}`);
    // possible to update the state or context with the new value as needed
  };

  const handlePreviousClick = () => {
    // Logic to handle the previous button click
    console.log('Previous button clicked');
    // Potentially navigate to a previous page or step in your application
  };

  const handleSearchClick = () => {
    // Logic to handle the search button click
    console.log('Search button clicked');
    // Trigger the search functionality
  };

  useEffect(() => {
    const sliders = document.querySelectorAll('toolcool-range-slider');

    sliders.forEach(slider => {
      slider.addEventListener('change', onSliderChange);
    });

    return () => {
      sliders.forEach(slider => {
        slider.removeEventListener('change', onSliderChange);
      });
    };
  }, []);

  return (
    <div className={`SearchPage ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="left-store">
            <div className='search-filters'>
                <div className="label-slider-container">
                    <label className="label_metric" htmlFor="security-slider">{t('security')}</label>
                    <toolcool-range-slider
                    id="security-slider"
                    name="security"
                    min="0"
                    max="100"
                    value="50"
                    theme="rect"></toolcool-range-slider>
                </div>
                <div className="label-slider-container">
                    <label className="label_metric" htmlFor="health-slider">{t('health')}</label>
                    <toolcool-range-slider
                    id="health-slider"
                    name="health"
                    min="0"
                    max="100"
                    value="50"
                    theme="rect"></toolcool-range-slider>
                </div>
                <div className="label-slider-container">
                    <label className="label_metric" htmlFor="nature-slider">{t('nature')}</label>
                    <toolcool-range-slider
                    id="nature-slider"
                    name="nature"
                    min="0"
                    max="100"
                    value="50"
                    theme="rect"></toolcool-range-slider>
                </div>
                <div className="label-slider-container">
                    <label className="label_metric" htmlFor="sports-slider">{t('sports')}</label>
                    <toolcool-range-slider
                    id="sports-slider"
                    name="sports"
                    min="0"
                    max="100"
                    value="50"
                    theme="rect"></toolcool-range-slider>
                </div>
                <div className="label-slider-container">
                    <label className="label_metric" htmlFor="life-slider">{t('life')}</label>
                    <toolcool-range-slider
                    id="life-slider"
                    name="life"
                    min="0"
                    max="100"
                    value="50"
                    theme="rect"></toolcool-range-slider>
                </div>

            <div className="button-container">
            <button className="button-small-round" onClick={handlePreviousClick}>
                <span className="button-icon">Previous</span> {/* Replace with actual icon */}
            </button>
            <button className="button-small-round" onClick={handleSearchClick}>
                <span className="button-icon">Search🔍</span> {/* Replace with actual icon */}
            </button>
            </div>
            </div>

        </div>
        <div className='right-store'>

        </div>    
    </div>
  );
}

export default QuizPage;
