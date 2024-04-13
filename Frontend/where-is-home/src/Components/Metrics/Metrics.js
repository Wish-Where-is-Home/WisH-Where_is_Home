import React, { useState, useEffect } from 'react';
import './Metrics.css';
import { ChevronLeft, ChevronRight } from 'react-feather';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {useTranslation} from "react-i18next";


function Metrics({isOpen, toggleSidebar}){
   
    const [metricValues, setMetricValues] = useState({
        Health: [], // Initialize with empty array for each genre
        Nature: [],
        Entertainment: [],
        Education: [],
    });


    const toggleSidebarInternal = () => {
        toggleSidebar();
    };

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
    const {t} = useTranslation("common");


    return (
        <div className={`sidebar-metrics ${isOpen ? 'sidebar-metrics-open' : ''}`}>
            <div className="sidebar-metrics-toggle" onClick={toggleSidebarInternal}>
                {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />} 
            </div>
            <h1 className='PropText-metrics'>{t('AdjustPref')}</h1>
            
                <div className="box-container-metrics" > 
                    <div className="first-text-metrics"></div>
                    <div className="box-metrics" style={{ display: isOpen ? 'block' : 'none' }}>
                        
                    </div>
                </div>
                    
            
                <div className='navbar-list-metrics'>
                    {secondSetOfMetrics.map((item, index) => (
                        <div key={index} className={`navbar-item-metrics ${selectedGenre === item.genre ? 'active' : ''}`}>
                            <button onClick={() => handleGenreSelect(item.genre)}>{t(item.genre)}</button> 
                        </div>
                    ))}
                </div>
                <div className="metrics-container">
                    {selectedGenre && (
                        Array.from({ length: secondSetOfMetrics.find((item) => item.genre === selectedGenre).metricsCount }).map((_, metricIndex) => (
                            <div key={metricIndex} className="slider-item">
                                <label>{t(selectedGenre)} Metric {metricIndex + 1}:</label>
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