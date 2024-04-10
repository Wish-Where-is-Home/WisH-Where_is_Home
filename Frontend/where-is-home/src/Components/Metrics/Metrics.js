import React, { useState, useEffect } from 'react';
import './Metrics.css';

import { ChevronLeft, ChevronRight } from 'react-feather';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function Metrics(){
    const [isOpen, setIsOpen] = useState(false);
    const [metricValues, setMetricValues] = useState({
        Health: [], // Initialize with empty array for each genre
        Nature: [],
        Entertainment: [],
        Education: [],
    });
    const handleSliderChange = (value, metricIndex, genre) => {
        // Update the value of the changed metric
        const updatedMetrics = { ...metricValues };
        updatedMetrics[genre][metricIndex] = value;
        setMetricValues(updatedMetrics);
    };
    const [selectedGenre, setSelectedGenre] = useState(null);

    const secondSetOfMetrics = [
        {
            genre: 'Health',
            metricsCount: 7,
        },
        {
            genre: 'Nature',
            metricsCount: 5,
        },
        {
            genre: 'Entertainment',
            metricsCount: 5,
        },
        {
            genre: 'Education',
            metricsCount: 5,
        },
    ];
    const handleGenreSelect = (genre) => {
        setSelectedGenre(selectedGenre === genre ? null : genre);
    };
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />} 
            </div>
            <h1 className='PropText'>Adjust your preferences:</h1>
            
                <div className="box-container" > 
                    <div className="first-text"></div>
                    <div className="box" style={{ display: isOpen ? 'block' : 'none' }}>
                        
                    </div>
                </div>
                    
            
                <div className='navbar-list'>
                    {secondSetOfMetrics.map((item, index) => (
                        <div key={index} className={`navbar-item ${selectedGenre === item.genre ? 'active' : ''}`}>
                            <button onClick={() => handleGenreSelect(item.genre)}>{item.genre}</button>
                        </div>
                    ))}
                </div>
                <div className="metrics-container">
                    {selectedGenre && (
                        Array.from({ length: secondSetOfMetrics.find((item) => item.genre === selectedGenre).metricsCount }).map((_, metricIndex) => (
                            <div key={metricIndex} className="slider-item">
                                <label>{selectedGenre} Metric {metricIndex + 1}:</label>
                                <div className="slider-container">
                                    <Slider
                                        min={0}
                                        max={5}
                                        value={metricValues[selectedGenre]?.[metricIndex] || 0}
                                        onChange={(value) => handleSliderChange(value, metricIndex, selectedGenre)}
                                    />
                                </div>
                                <span>{metricValues[selectedGenre]?.[metricIndex] || 0}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        

    );
}
export default Metrics;