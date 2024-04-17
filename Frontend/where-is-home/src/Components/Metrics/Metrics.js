import React, { useState, useEffect } from 'react';
import './Metrics.css';
import { ChevronLeft, ChevronRight } from 'react-feather';
import Slider from 'rc-slider';
import Handle from 'rc-slider/lib/Handles/Handle';
import 'rc-slider/assets/index.css';
import { useTranslation } from "react-i18next";
import { Tooltip } from '@mui/material';


function Metrics({ darkMode, isOpen, toggleSidebar }) {

    const [metricValues, setMetricValues] = useState({
        "Health": [],
        "Nature and Environment": [],
        "Culture": [],
        "Educational": [],
        "Sport": [],
        "Commerce": [],
        "Social and Leisure": [],
        "Service": []

    });


    const toggleSidebarInternal = () => {
        toggleSidebar();
    };

    /*const handleSliderChange = (value, metricIndex, genre) => {
        const updatedMetrics = { ...metricValues };
        updatedMetrics[genre][metricIndex] = value;
        setMetricValues(updatedMetrics);
    };*/
    const [selectedGenre, setSelectedGenre] = useState('Health');


    const metricNames = {
        Health: ['Hospital', 'Nursing Home', 'Clinic', 'Pharmacy', 'Dentist'],
        "Nature and Environment": ['Park', 'Playground', 'Fluvial Beach', 'Hiking Trail'],
        Culture: ['Museum', 'Library', 'Art Gallery', 'Monument', 'Theater'],
        Educational: ['University', 'Primary School', 'Middle School', 'Secondary School', 'Pre-School'],
        Sport: ['Gym', 'Swimming Pool', 'Tennis Court', 'Football Field', 'Basketball Court'],
        Commerce: ['Supermarket', 'Bakery', 'Butchery', 'Fish Market', 'Bookstore'],
        "Social and Leisure": ['Restaurant', 'Cafe', 'Night Club', 'Cinema'],
        Service: ['Bank', 'Post Office', 'Police Station', 'Fire Station']
    };


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
    const { t } = useTranslation("common");


    const handleSliderChange = (value, metricIndex, genre) => {
        const updatedMetrics = { ...metricValues };
        updatedMetrics[genre][metricIndex] = value;
        setMetricValues(updatedMetrics);
    };

    const handle = (props) => {
        const { value, dragging, index, ...restProps } = props;
        return (
            <Tooltip
                prefixCls="rc-slider-tooltip"
                overlay={valueLabelFormat(value)}
                visible={dragging}
                placement="top"
                key={index}
            >
                <Handle value={value} {...restProps} />
            </Tooltip>
        );
    };

    const valueLabelFormat = (value) => {
        const labels = [t('notimportant'), t('slightly'), t('moderate'), t('important'), t('very_Important')];
        return labels[Math.floor(value / 25)]; // Assuming the slider range is still 0-100
    };

    const marks = {
        0: t('notimportant'),
        100: t('very_Important'),
    };

    return (
        <div className={`sidebar-metrics ${isOpen ? 'sidebar-metrics-open' : ''} ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="sidebar-metrics-toggle" onClick={toggleSidebar}>
                {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
            </div>
            <h1 className='PropText-metrics'>{t('AdjustPref')}</h1>
            <div className='navbar-list-metrics'>
                {secondSetOfMetrics.map((item, index) => (
                    <div key={index} className={`navbar-item-metrics ${selectedGenre === item.genre ? 'active' : ''}`}>
                        <button onClick={() => setSelectedGenre(item.genre === selectedGenre ? null : item.genre)}>
                            {t(item.genre)}
                        </button>
                    </div>
                ))}
            </div>
            <div className="metrics-container">
                {selectedGenre && (
                    metricNames[selectedGenre].map((name, metricIndex) => (
                        <div key={metricIndex} className="slider-item">
                            <label>{name}:</label>
                            <div className="slider-container2">
                                <Slider
                                    min={0}
                                    max={100}
                                    value={metricValues[selectedGenre]?.[metricIndex] || 0}
                                    onChange={(value) => handleSliderChange(value, metricIndex, selectedGenre)}
                                    handle={handle}
                                    marks={marks}
                                    step={25}
                                />
                            </div>
                            <span>{valueLabelFormat(metricValues[selectedGenre]?.[metricIndex] || 0)}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Metrics;