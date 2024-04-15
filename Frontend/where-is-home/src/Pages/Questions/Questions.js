
import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import './Questions.css';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

function Questions({ slidersValues,darkMode, handlePreviousClick,gotoThirdPage,zoneData, IdType,updateScores }) {

    const zone = IdType;


    const { t } = useTranslation("common");

    const sliderGroupings = {
        'Commerce': [
            { name: "Commerce", ids: ['2'] },
            { name: "Bakery", ids: ['3'] },
            { name: "Food Courts", ids: ['4'] },
            { name: "Supermarket", ids: ['9'] }
        ],
        'Social Leisure': [
            { name: "Nightlife", ids: ['5'] },
            { name: "Hotel", ids: ['8'] },
            { name: "Culture", ids: ['10'] },
            { name: "Entertainment", ids: ['17'] }
        ],
        'Health': [
            { name: "Health Services", ids: ['7'] },
            { name: "Pharmacy", ids: ['18'] },
            { name: "Hospital", ids: ['22'] },
            { name: "Clinic", ids: ['23'] },
            { name: "Veterinary", ids: ['24'] }
        ],
        'Nature Sports': [
            { name: "Sports Center", ids: ['1'] },
            { name: "Camp Sites", ids: ['6'] },
            { name: "Parks", ids: ['13'] },
            { name: "Swimming Pool", ids: ['19'] },
            { name: "Beach River", ids: ['25'] },
            { name: "Bicycle Paths", ids: ['27'] },
            { name: "Walking Routes", ids: ['28'] }
        ],
        'Service': [
            { name: "Emergency Services", ids: ['14'] },
            { name: "Banks", ids: ['20'] },
            { name: "Post Offices", ids: ['21'] },
            { name: "Industrial Zones", ids: ['26'] },
            { name: "Car Parks", ids: ['29'] }
        ],
        'Education': [
            { name: "Schools", ids: ['11'] },
            { name: "Libraries", ids: ['12'] },
            { name: "Kindergartens", ids: ['15'] },
            { name: "Universities", ids: ['16'] }
        ]
    };
    
    
    const tabs = ['Commerce', 'Social Leisure', 'Health', 'Nature Sports', 'Service', 'Education'];



    const [showSliders, setShowSliders] = useState(true);

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


    const buildInitialState = () => {
        const values = {};
        Object.values(sliderGroupings).flat(2).forEach(id => {
            values[id] = 0;
        });
        return values;
    };

    const [ sliderValues, setSliderValues] = useState(buildInitialState());

    const filteredTabs = tabs.filter((tab, index) => slidersValues[index].value > 0);

    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
     
      const firstAvailableTab = slidersValues.findIndex(slider => slider.value > 0);
      setActiveTab(firstAvailableTab >= 0 ? firstAvailableTab : 0);
    }, [slidersValues]);


    const onSliderChange = (newValue, groupIds) => {
        setSliderValues(prevValues => {
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

    const valueLabelFormat = (value) => {
        const labels = ['Not Important', 'Slightly Important', 'Moderate', 'Important', 'Very Important'];
        return labels[Math.round(value * 4)];
    };

    const renderSlidersForTab = () => {
        return sliderGroupings[tabs[activeTab]].map((group, index) => (
            <div key={`slider-${activeTab}-${index}`}>
                <label>{group.name}</label>
                <Box sx={{ width: 300 }}>
                    <Slider
                        aria-label={group.name}
                        value={sliderValues[group.ids[0]]}
                        valueLabelDisplay="auto"
                        step={0.25}
                        marks={[{ value: 0, label: 'Not Important' }, { value: 1, label: 'Very Important' }]}
                        min={0}
                        max={1}
                        onChange={(event, newValue) => onSliderChange(newValue, group.ids)}
                        valueLabelFormat={valueLabelFormat}

                    />
                </Box>
            </div>
        ));
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

       
        
        const calculatedScores=calculateScores(zoneData, slidersValues, sliderValues, zone);
        updateScores(calculatedScores);
    }, [slidersValues, sliderValues,IdType]);
    


    return (
        <div className={`SearchPage2 ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className='search-filters'>
                <div className='tab-buttons'>
                    {filteredTabs.map((tabName, index) => (
                        <button
                            key={index}
                            className={activeTab === tabs.indexOf(tabName) ? 'active' : ''}
                            onClick={() => setActiveTab(tabs.indexOf(tabName))}
                        >{tabName}</button>
                    ))}
                </div>
                <div className='tab-content'>
                    {renderSlidersForTab()}
                </div>
                <div className={`button-container2 ${tabs[activeTab] === 'Nature Sports' ? ' nature-sports-margin' : ''}`}>
                    <button className="button-small-round" onClick={handlePreviousClick}>
                        <span className="button-icon">Previous</span>
                    </button>
                    <button className="button-small-round" onClick={gotoThirdPage} >
                        <span className="button-icon">Search <span style={{padding:"50px 0px"}}> </span>🔍</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Questions;