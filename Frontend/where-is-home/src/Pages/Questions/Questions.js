
import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import './Questions.css';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { useAuth } from '../../AuthContext/AuthContext';


function Questions({ slidersValues,darkMode, handlePreviousClick,gotoThirdPage,zoneData, IdType,updateScores,sliderValuesCruz,setSliderValuesCruz,sliderGroupings, handleSavePreferences,metricsMapping,averageMetrics}) {
    const { isAuthenticated} = useAuth();
    const zone = IdType;


    const { t } = useTranslation("common");

   
    
    const tabs = [t('commerce'),t('social_leisure'),t('health'), t('nature_sports'),t('services'), t('Education')];
 



    const filteredTabs = tabs.filter((tab, index) => slidersValues[index].value > 0);

    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
     
      const firstAvailableTab = slidersValues.findIndex(slider => slider.value > 0);
      setActiveTab(firstAvailableTab >= 0 ? firstAvailableTab : 0);
    }, [slidersValues]);


    const onSliderChange = (newValue, groupIds) => {
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

        console.log(sliderValuesCruz);
    };

    const valueLabelFormat = (value) => {
        const labels = [t('notimportant'), t('slightly'), t('moderate'), t('important'), t('very_Important')];
        return labels[Math.round(value * 4)];
    };

    const renderSlidersForTab = () => {
        return sliderGroupings[tabs[activeTab]].map((group, index) => (
            <div key={`slider-${activeTab}-${index}`} className="slider-container" style={{ marginTop: index === 0 ? '30px' : '0' }}>
                <label className="label">{group.name}</label>
                <div className='slider-lefties'>
                    <Box sx={{ width: 300, marginRight: "50px", position: 'relative' }}>
                        <Slider
                            aria-label={group.name}
                            value={sliderValuesCruz[group.ids[0]]}
                            valueLabelDisplay="auto"
                            step={0.25}
                            marks={[{ value: 0, label: t('notimportant') }, { value: 1, label: t('very_Important') }]}
                            min={0}
                            max={1}
                            onChange={(event, newValue) => onSliderChange(newValue, group.ids)}
                            valueLabelFormat={valueLabelFormat}
                        />
                        <div className="average-line" style={{ position: 'absolute', top: 0, left: `${averageMetrics.averages[group.name]}%`, width: '2px', height: '2rem', backgroundColor: 'red', zIndex: 1 }}></div>
                    </Box>
                </div>
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
    }, [slidersValues, sliderValuesCruz,IdType]);
    


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
                <div className='sidebar-content'>
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
                        {isAuthenticated && (
                        <button className="button-small-round" type="button" onClick={ handleSavePreferences}>
                            {t('guardar')}
                        </button>
                    ) }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Questions;