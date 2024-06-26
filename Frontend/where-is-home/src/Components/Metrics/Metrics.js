import React, { useState, useEffect } from 'react';
import './Metrics.css';
import { ChevronLeft, ChevronRight } from 'react-feather';
import Slider from '@mui/material/Slider';
import 'rc-slider/assets/index.css';
import { useTranslation } from "react-i18next";
import { useAuth } from '../../AuthContext/AuthContext';


function Metrics({ darkMode, isOpen, toggleSidebar, zone, zoneData, slidersValues, sliderValuesCruz, updateScores, setSliderValuesCruz,handleGoBackPage,averageMetrics}) {

    const { t } = useTranslation("common");
    const { isAuthenticated} = useAuth();

    const toggleSidebarInternal = () => {
        toggleSidebar();
    };


    const tabs = [t('commerce'),t('social_leisure'),t('health'), t('nature_sports'),t('services'), t('Education')];

   
   
    const sliderConfigs = [
        { Id: '1', label: 'sports_center', min: 0, max: 1 },
        { Id: '2', label: 'commerce', min: 0, max: 1 },
        { Id: '3', label: 'bakery', min: 0, max: 1 },
        { Id: '4', label: 'food_court', min: 0, max: 1 },
        { Id: '5', label: 'nightlife', min: 0, max: 1 },
        { Id: '6', label: 'camping', min: 0, max: 1 },
        { Id: '7', label: 'health_services', min: 0, max: 1 },
        { Id: '8', label: 'hotel', min: 0, max: 1 },
        { Id: '9', label: 'supermarket', min: 0, max: 1 },
        { Id: '10', label: 'culture', min: 0, max: 1 },
        { Id: '11', label: 'school', min: 0, max: 1 },
        { Id: '12', label: 'library', min: 0, max: 1 },
        { Id: '13', label: 'parks', min: 0, max: 1 },
        { Id: '14', label: 'services', min: 0, max: 1 },
        { Id: '15', label: 'kindergarten', min: 0, max: 1 },
        { Id: '16', label: 'university', min: 0, max: 1 },
        { Id: '17', label: 'entertainment', min: 0, max: 1 },
        { Id: '18', label: 'pharmacy', min: 0, max: 1 },
        { Id: '19', label: 'swimming_pool', min: 0, max: 1 },
        { Id: '20', label: 'bank', min: 0, max: 1 },
        { Id: '21', label: 'post_office', min: 0, max: 1 },
        { Id: '22', label: 'hospital', min: 0, max: 1 },
        { Id: '23', label: 'clinic', min: 0, max: 1 },
        { Id: '24', label: 'veterinary', min: 0, max: 1 },
        { Id: '25', label: 'beach_river', min: 0, max: 1 },
        { Id: '26', label: 'industrial_zone', min: 0, max: 1 },
        { Id: '27', label: 'bicycle_path', min: 0, max: 1 },
        { Id: '28', label: 'walking_routes', min: 0, max: 1 },
        { Id: '29', label: 'car_park', min: 0, max: 1 }
    ];    



    const sliderGroupings = {
        [t('commerce')]: [
            { name: t("commerce"), ids: ['2'] },
            { name: t("Bakery"), ids: ['3'] },
            { name: t("FoodCourts"), ids: ['4'] },
            { name: t("Supermarket"), ids: ['9'] }
        ],
        [t('social_leisure')]: [
            { name: t("NightLife"), ids: ['5'] },
            { name: t("Hotel"), ids: ['8'] },
            { name: t("culture"), ids: ['10'] },
            { name: t("Entertainment"), ids: ['17'] }
        ],
        [t('health')]: [
            { name: t("HealthServices"), ids: ['7'] },
            { name: t("Pharmacy"), ids: ['18'] },
            { name: t("Hospital"), ids: ['22'] },
            { name: t("Clinic"), ids: ['23'] },
            { name: t("Veterinary"), ids: ['24'] }
        ],
        [t('nature_sports')]: [
            { name: t("SportsCenter"), ids: ['1'] },
            { name: t("CampSites"), ids: ['6'] },
            { name: t("Parks"), ids: ['13'] },
            { name: t("SwimmingPool"), ids: ['19'] },
            { name: t("BeachRiver"), ids: ['25'] },
            { name: t("Bicycle Paths"), ids: ['27'] },
            { name: t("Walking Routes"), ids: ['28'] }
        ],
        [t('services')]: [
            { name: t("EmergencyServices"), ids: ['14'] },
            { name: t("Banks"), ids: ['20'] },
            { name: t("PostOffices"), ids: ['21'] },
            { name: t("IndustrialZones"), ids: ['26'] },
            { name: t("CarParks"), ids: ['29'] }
        ],
        [t('Education')]: [
            { name: t("Schools"), ids: ['11'] },
            { name: t("Libraries"), ids: ['12'] },
            { name: t("Kindergartens"), ids: ['15'] },
            { name: t("Universities"), ids: ['16'] }
        ]
      };
      


    const [selectedGenre, setSelectedGenre] = useState('Health');


    const filteredTabs = tabs.filter((tab, index) => slidersValues[index].value > 0);

    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
     
      const firstAvailableTab = slidersValues.findIndex(slider => slider.value > 0);
      setActiveTab(firstAvailableTab >= 0 ? firstAvailableTab : 0);
    }, [slidersValues]);


    const valueLabelFormat = (value) => {
        const labels = [t('notimportant'), t('slightly'), t('moderate'), t('important'), t('very_Important')];
        return labels[Math.round(value * 4)];
    };

    const onSliderChange = (newValue, groupIds) => {
        console.log(newValue);
        setSliderValuesCruz(prevValues => {
            const updatedValues = groupIds.reduce((acc, id) => ({
                ...acc,
                [id]: newValue
            }), {});

            groupIds.forEach(id => {
                console.log(`ID: ${id}, New Value: ${newValue}`);
            });
            console.log("Updated Values: ", updatedValues);
            return {
                ...prevValues,
                ...updatedValues
            };
        });
    };




    useEffect(() => {
        function calculateScores(zoneData, sliderValuesThemesupdated, sliderValuesMetricsupdated, zoneType) {
            if (zoneData !== null) {
                const scores = {};
                const data = zoneData;
                const sliderValuesMetrics = sliderValuesMetricsupdated;  
                const sliderValuesThemes = sliderValuesThemesupdated;
    
                const metricsMapping = {
                    'sports_center': { id: 1, theme: 3 },
                    'commerce': { id: 2, theme: 0 },
                    'bakery': { id: 3, theme: 0 },
                    'food_court': { id: 4, theme: 0 },
                    'nightlife': { id: 5, theme: 1 },
                    'camping': { id: 6, theme: 3 },
                    'health_services': { id: 7, theme: 2 },
                    'hotel': { id: 8, theme: 1 },
                    'supermarket': { id: 9, theme: 0 },
                    'culture': { id: 10, theme: 1 },
                    'school': { id: 11, theme: 5 },
                    'library': { id: 12, theme: 5 },
                    'parks': { id: 13, theme: 3 },
                    'services': { id: 14, theme: 4 },
                    'kindergarten': { id: 15, theme: 5 },
                    'university': { id: 16, theme: 5 },
                    'entretainment': { id: 17, theme: 1 },
                    'pharmacy': { id: 18, theme: 2 },
                    'swimming_pool': { id: 19, theme: 3 },
                    'bank': { id: 20, theme: 4 },
                    'post_office': { id: 21, theme: 4 },
                    'hospital': { id: 22, theme: 2 },
                    'clinic': { id: 23, theme: 2 },
                    'veterinary': { id: 24, theme: 2 },
                    'beach_river': { id: 25, theme: 3 },
                    'industrial_zone': { id: 26, theme: 3 },
                    'bicycle_path': { id: 27, theme: 3 },
                    'walking_routes': { id: 28, theme: 3 },
                    'car_park': { id: 29, theme: 4 }
                };
    
                if (typeof sliderValuesThemes === 'object' && sliderValuesThemes !== null) {
                    for (const id in data[zoneType]) {
                        if (data[zoneType].hasOwnProperty(id)) {
                            const modifiedMetrics = {};
    
                            for (const metric in data[zoneType][id]) {
                                if (data[zoneType][id].hasOwnProperty(metric)) {
                                    const metricsMappingEntry = metricsMapping[metric];
                                    if (metricsMappingEntry) {
                                        const SliderValueMetrics = sliderValuesMetrics[metricsMappingEntry.id];
                                        if (SliderValueMetrics) {
                                            const metricScore = parseFloat(data[zoneType][id][metric]) * SliderValueMetrics;
                                            modifiedMetrics[metric] = metricScore;
                                        }
                                    } else {
                                        console.error(`Metrics mapping entry not found for metric ${metric}.`);
                                    }
                                }
                            }
                            

                            let score = 0;
                            for (const metric in modifiedMetrics) {
                                if (modifiedMetrics.hasOwnProperty(metric)) {
                                    score += modifiedMetrics[metric];
                                    const themeId = metricsMapping[metric].theme;
                                    const SliderValueTheme = sliderValuesThemes[themeId];
                                    scores[id] = score * SliderValueTheme.value;
                                }
                            }
                        }
                    }
    
                   
                    return scores;
                } else {
                    return null;
                }
            }
        }

       
        
        const calculatedScores=calculateScores(zoneData, slidersValues, sliderValuesCruz, zone);
        updateScores(calculatedScores);
    }, [slidersValues, sliderValuesCruz,zone]);


    
  

    return (
        <div className={`sidebar-metrics ${isOpen ? 'sidebar-metrics-open' : ''} ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="sidebar-metrics-toggle" onClick={toggleSidebar}>
                {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
            </div>
            <h1 className='PropText-metrics'>{t('AdjustPref')}</h1>
            <div className='sidebar-content'>
                <div className='navbar-list-metrics'>
                {filteredTabs.map((item, index) => (
                    <div key={index} className={`navbar-item-metrics ${activeTab === index ? 'active' : ''}`}>
                        <button onClick={() => setActiveTab(activeTab === index ? null : index)}>
                            {t(item)}
                        </button>
                    </div>
                ))}
                </div>
                <div className="metrics-container">
                {selectedGenre && (
                    sliderGroupings[tabs[activeTab]].map((group, groupIndex) => (
                            <div key={groupIndex} className='metrics-pref'>
                                <h2>{group.name}</h2>
                                {group.ids.map((id) => {
                                    const sliderConfig = sliderConfigs.find((config) => config.Id === id);
                                    return (
                                        <div key={id} className="slider-item">
                                            <div className="slider-container2" style={{position: 'relative' }}>
                                                
                                                <Slider
                                                    style={{ width: '300px' }}
                                                    min={0}
                                                    max={1}
                                                    value={sliderValuesCruz[group.ids[0]]}
                                                    valueLabelDisplay="auto"
                                                    onChange={(event, newValue) => onSliderChange(newValue, group.ids)}
                                                    marks={[{ value: 0, label: t('notimportant') }, { value: 1, label: t('very_Important') }]}
                                                    step={0.25}
                                                    valueLabelFormat={valueLabelFormat}
                                                    aria-label={group.name}
                                                />
                                                {averageMetrics && (
                                                <div className="average-line" style={{ position: 'absolute', top: 0, left: `calc(${averageMetrics.averages[group.ids[0]]*100}% + 100px)`, width: '2px', height: '2rem', backgroundColor: 'red', zIndex: -1,marginTop:"0.5rem" }}></div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>
                <div className='metricspage-buttons-sections'>
                    <button type="button" onClick={handleGoBackPage}>
                        {t('back')}
                    </button>
                    {isAuthenticated && (
                        <button type="button" onClick={handleGoBackPage}>
                            {t('guardar')}
                        </button>
                    ) }
                </div>
                <div style={{width:"100%",height: '2rem',display: "flex", flexDirection: "row",alignItems:"center",justifyContent:"center"}}>
                            <div style={{display:"flex", flexDirection:"row"}}>
                                <div className='average-line2'></div>
                                <p style={{marginLeft:"1rem",fontSize:"0.8rem"}}>{t('textoaverage')}</p>
                            </div>
                        </div>
            </div>
        </div>
    );
}

export default Metrics;