import React, { useState } from 'react';
import './Metrics.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'; 

const Metrics = ({ isOpen, toggleNavbar }) => {
    const [metricValues, setMetricValues] = useState({
        health: 5,
        nature: 5,
        entertainment: 5,
        education: 5,
        // Add more metrics as needed
    });

    const handleSliderChange = (value, metricName) => {
        setMetricValues({
            ...metricValues,
            [metricName]: value
        });
    };


    return (
        <nav className={`navbar ${isOpen ? 'open' : ''}`}>
            <div className='navbar-div'>
                <div className='navbar-title'>
                    <h3>Adjust your preferences:</h3>
                    <a href="#0" onClick={toggleNavbar}>
                        <FontAwesomeIcon className='close' icon={faTimes} />
                    </a>
                </div>
                <div className='navbar-content'>
                    <ul className='navbar-list'>
                    <li>
                        <label >Health:</label>
                        <div className="slider-container">
                            <Slider
                                min={0}
                                max={5}
                                value={metricValues.health}
                                onChange={(value) => handleSliderChange(value, 'health')}
                            
                            />
                        </div>
                        <span>{metricValues.health}</span>
                    </li>
                    <li>
                        <label >Nature:</label>
                        <div className="slider-container">
                            <Slider
                                min={0}
                                max={5}
                                value={metricValues.nature}
                                onChange={(value) => handleSliderChange(value, 'nature')}
                            
                            />
                        </div>
                        <span>{metricValues.nature}</span>

                    </li>
                    <li>
                        <label >Entertainment:</label>
                        <div className="slider-container">
                            <Slider
                                min={0}
                                max={5}
                                value={metricValues.entertainment}
                                onChange={(value) => handleSliderChange(value, 'entertainment')}
                            
                            />
                        </div>
                        <span>{metricValues.entertainment}</span>
                    </li>
                    <li>
                        <label >Education:</label>
                        <div className="slider-container">
                            <Slider
                                min={0}
                                max={5}
                                value={metricValues.education}
                                onChange={(value) => handleSliderChange(value, 'education')}
                            
                            />
                        </div>
                        <span>{metricValues.education}</span>
                    </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};
export default Metrics;