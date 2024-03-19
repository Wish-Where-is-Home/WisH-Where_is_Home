import React, { useState } from 'react';
import './Metrics.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'; 
import AccordionItem from './AccordionItem';

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

    const [acceptedMetrics, setAcceptedMetrics] = useState(false); // State to track if metrics have been accepted

    const handleAcceptMetrics = () => {
        setAcceptedMetrics(true);
    };

    const handleGoBack = () => {
        setAcceptedMetrics(false);
    };

    const secondSetOfMetrics = [
        {
            genre: 'Health',
            sliders: [
                { label: 'Metric 1' },
                { label: 'Metric 2' },
            ]
        },
        {
            genre: 'Nature',
            sliders: [
                { label: 'Metric 3' },
                { label: 'Metric 4' },
            ]
        },
        {
            genre: 'Entertainment',
            sliders: [
                { label: 'Metric 5' },
                { label: 'Metric 6' },
            ]
        },
        {
            genre: 'Education',
            sliders: [
                { label: 'Metric 7' },
                { label: 'Metric 8' },
            ]
        },
    ];

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

                {!acceptedMetrics ? (
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
                    ) : (
                        secondSetOfMetrics.map((item, index) => (
                            <AccordionItem key={index} genre={item.genre} sliders={item.sliders} />
                        ))
                    )}
                    {!acceptedMetrics && (
                        // Display accept button if metrics haven't been accepted yet
                        <button onClick={handleAcceptMetrics}>Accept Metrics</button>
                    )}
                    {acceptedMetrics && (
                        // Display button to go back to the initial set of sliders
                        <button onClick={handleGoBack}>Go Back</button>
                    )}
                    
                </div>
            </div>
        </nav>
    );
};
export default Metrics;