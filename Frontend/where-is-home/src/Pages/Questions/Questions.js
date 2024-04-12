import React, { useEffect, useState } from 'react';
import 'toolcool-range-slider';
import { useTranslation } from "react-i18next";
import './Questions.css';

function Questions({ darkMode }) {
    const { t } = useTranslation("common");

    // Initial slider values
    const initialSliderValues = {
        lock: 50, alarm: 50, camera: 50, guard: 50,
        hospital: 50, pharmacy: 50, doctor: 50, gym: 50,
        park: 50, lake: 50, forest: 50, mountain: 50,
        stadium: 50, court: 50, pool: 50, golf: 50
    };

    const [sliderValues, setSliderValues] = useState(initialSliderValues);
    const [activeTab, setActiveTab] = useState(0);

    const sliderConfigs = [
        { name: 'lock', label: 'Lock Strength', min: 0, max: 100 },
        { name: 'alarm', label: 'Alarm Sensitivity', min: 0, max: 100 },
        { name: 'camera', label: 'Camera Coverage', min: 0, max: 100 },
        { name: 'guard', label: 'Guard Availability', min: 0, max: 100 },
        { name: 'hospital', label: 'Hospital Distance', min: 0, max: 100 },
        { name: 'pharmacy', label: 'Pharmacy Distance', min: 0, max: 100 },
        { name: 'doctor', label: 'Doctor Availability', min: 0, max: 100 },
        { name: 'gym', label: 'Gym Availability', min: 0, max: 100 },
        { name: 'park', label: 'Park Distance', min: 0, max: 100 },
        { name: 'lake', label: 'Lake Distance', min: 0, max: 100 },
        { name: 'forest', label: 'Forest Coverage', min: 0, max: 100 },
        { name: 'mountain', label: 'Mountain Distance', min: 0, max: 100 },
        { name: 'stadium', label: 'Stadium Distance', min: 0, max: 100 },
        { name: 'court', label: 'Court Distance', min: 0, max: 100 },
        { name: 'pool', label: 'Pool Distance', min: 0, max: 100 },
        { name: 'golf', label: 'Golf Course Distance', min: 0, max: 100 },
    ];

    const onSliderChange = (event, sliderName) => {
        const newSliderValue = Math.round(event.detail.value);
        setSliderValues(prevValues => ({
            ...prevValues,
            [sliderName]: newSliderValue,
        }));
        console.log(`Slider '${sliderName}' changed to value: ${newSliderValue}`);
    };

    useEffect(() => {
        const sliders = document.querySelectorAll('toolcool-range-slider');
        sliders.forEach(slider => {
            slider.addEventListener('change', event => {
                const name = slider.getAttribute('name');
                onSliderChange(event, name);
            });
        });

        return () => {
            sliders.forEach(slider => {
                slider.removeEventListener('change', (event) => {});
            });
        };
    }, [activeTab]); // Now dependent on activeTab

    const renderSlidersForTab = () => {
        const startIndex = activeTab * 4;
        const endIndex = startIndex + 4;
        return sliderConfigs.slice(startIndex, endIndex).map((slider, index) => (
            <div key={`${slider.name}-${activeTab}`}>
                <label htmlFor={`${slider.name}-slider`}>{t(slider.label)}</label>
                <toolcool-range-slider
                    id={`${slider.name}-slider`}
                    name={slider.name}
                    min={slider.min}
                    max={slider.max}
                    value={sliderValues[slider.name]}
                    theme="rect"
                ></toolcool-range-slider>
            </div>
        ));
    };

    return (
        <div className={`SearchPage ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className='search-filters'>
                <div className='tab-buttons'>
                    {['Security', 'Health', 'Nature', 'Sports'].map((tabName, index) => (
                        <button
                            key={index}
                            className={activeTab === index ? 'active' : ''}
                            onClick={() => setActiveTab(index)}
                        >{tabName}</button>
                    ))}
                </div>
                <div className='tab-content'>
                    {renderSlidersForTab()}
                </div>
                <div className="button-container">
                    <button className="button-small-round" onClick={() => console.log('Previous button clicked')}>
                        <span className="button-icon">Previous</span>
                    </button>
                    <button className="button-small-round" onClick={() => console.log('Search button clicked')}>
                        <span className="button-icon">Search🔍</span>
                    </button>
                </div>
            </div>
            <div className='map-container'>
                {/* Map would be included here */}
            </div>
        </div>
    );
}

export default Questions;
