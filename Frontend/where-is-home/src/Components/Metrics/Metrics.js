import React, { useState, useEffect } from 'react';
import './Metrics.css';
import { ChevronLeft, ChevronRight } from 'react-feather';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useTranslation } from "react-i18next";


function Metrics({isOpen, toggleSidebar,sliderValuesCruz,setSliderValuesCruz}){
   
   


    const toggleSidebarInternal = () => {
        toggleSidebar();
    };

    const handleSliderChange = (value, metricIndex, genre) => {
        const updatedMetrics = { ...sliderValuesCruz };
        updatedMetrics[genre][metricIndex] = value;
        setSliderValuesCruz(updatedMetrics);
    };
    const [selectedGenre, setSelectedGenre] = useState('Health');

    

    const secondSetOfMetrics = [
        {
            genre: 'Health',
            metricsCount: metricNames.Health.length,
        },
        {
            genre: 'Nature and Environment',
            metricsCount: metricNames["Nature and Environment"].length,
        },
        {
            genre: 'Culture',
            metricsCount: metricNames.Culture.length,
        },
        {
            genre: 'Educational',
            metricsCount: metricNames.Educational.length,
        },
        {
            genre: 'Sport',
            metricsCount: metricNames.Sport.length,
        },
        {
            genre: 'Commerce',
            metricsCount: metricNames.Commerce.length,
        },
        {
            genre: 'Social and Leisure',
            metricsCount: metricNames["Social and Leisure"].length,
        },
        {
            genre: 'Service',
            metricsCount: metricNames.Service.length,
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
                            <label> {metricNames[selectedGenre][metricIndex]}:</label>
                            <div className="slider-container">
                                <Slider
                                    min={0}
                                    max={5}
                                    value={[selectedGenre]?.[metricIndex] || 0}
                                    onChange={(value) => handleSliderChange(value, metricIndex, selectedGenre)}
                                />
                            </div>
                            <span>{sliderValuesCruz[selectedGenre]?.[metricIndex] || 0}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Metrics;
