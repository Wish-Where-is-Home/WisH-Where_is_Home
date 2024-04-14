import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import './Questions.css';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

function Questions({ slidersValues,darkMode, handlePreviousClick }) {
    const { t } = useTranslation("common");

    const sliderGroupings = {
        'Commerce': [
            { name: "Main Attractions", ids: ['17', '30', '31', '59', '85', '110', '133', '75', '78', '116', '120'] },
            { name: "Food and Drink", ids: ['62', '115'] },
            { name: "Leisure Spots", ids: ['27', '18', '34'] },
            { name: "Local Markets", ids: ['79', '15', '83'] }
        ],
        'Social Leisure': [
            { name: "Nightlife", ids: ['36', '100', '57'] },
            { name: "Outdoor Activities", ids: ['52', '88', '92', '113'] },
            { name: "Cultural Sites", ids: ['7', '56', '66'] },
            { name: "Entertainment Hubs", ids: ['74', '95', '96', '107', '53'] }
        ],
        'Health': [
            { name: "Healthcare Facilities", ids: ['65', '89', '131'] },
            { name: "Pharmacies", ids: ['102'] },
            { name: "Hospitals", ids: ['51'] },
            { name: "Clinics", ids: ['81'] },
            { name: "Wellness Centers", ids: ['80'] }
        ],
        'Nature Sports': [
            { name: "Parks and Recreation", ids: ['5', '9', '24', '106'] },
            { name: "Camping Sites", ids: ['50', '1'] },
            { name: "Adventure Sports", ids: ['29', '68', '90', '101'] },
            { name: "Swimming Pools", ids: ['126'] },
            { name: "Training Grounds", ids: ['140'] }
        ],
        'Service': [
            { name: "Emergency Services", ids: ['32', '98', '137'] },
            { name: "Banking Services", ids: ['134'] },
            { name: "Postal Services", ids: ['136'] }
        ],
        'Education': [
            { name: "Primary Education", ids: ['21'] },
            { name: "Libraries", ids: ['25'] },
            { name: "Higher Education", ids: ['35'] },
            { name: "Vocational Training", ids: ['61', '103'] }
        ]
    };    
    
    const tabs = ['Commerce', 'Social Leisure', 'Health', 'Nature Sports', 'Service', 'Education'];



    const [showSliders, setShowSliders] = useState(true);

    const sliderConfigs = [
        { Id: '1', label: 'caravan_site', min: 0, max: 1 },
        { Id: '5', label: 'sports_centre', min: 0, max: 1 },
        { Id: '7', label: 'museum', min: 0, max: 1 },
        { Id: '8', label: 'wastewater_plant', min: 0, max: 1 },
        { Id: '9', label: 'stadium', min: 0, max: 1 },
        { Id: '13', label: 'recycling_glass', min: 0, max: 1 },
        { Id: '15', label: 'greengrocer', min: 0, max: 1 },
        { Id: '16', label: 'recycling_clothes', min: 0, max: 1 },
        { Id: '17', label: 'kiosk', min: 0, max: 1 },
        { Id: '18', label: 'fast_food', min: 0, max: 1 },
        { Id: '21', label: 'school', min: 0, max: 1 },
        { Id: '24', label: 'golf_course', min: 0, max: 1 },
        { Id: '25', label: 'library', min: 0, max: 1 },
        { Id: '27', label: 'food_court', min: 0, max: 1 },
        { Id: '29', label: 'dog_park', min: 0, max: 1 },
        { Id: '30', label: 'market_place', min: 0, max: 1 },
        { Id: '31', label: 'stationery', min: 0, max: 1 },
        { Id: '32', label: 'police', min: 0, max: 1 },
        { Id: '34', label: 'restaurant', min: 0, max: 1 },
        { Id: '35', label: 'kindergarten', min: 0, max: 1 },
        { Id: '36', label: 'bar', min: 0, max: 1 },
        { Id: '42', label: 'track', min: 0, max: 1 },
        { Id: '44', label: 'car_rental', min: 0, max: 1 },
        { Id: '48', label: 'bicycle_rental', min: 0, max: 1 },
        { Id: '49', label: 'community_centre', min: 0, max: 1 },
        { Id: '50', label: 'camp_site', min: 0, max: 1 },
        { Id: '51', label: 'hospital', min: 0, max: 1 },
        { Id: '52', label: 'motel', min: 0, max: 1 },
        { Id: '53', label: 'mall', min: 0, max: 1 },
        { Id: '55', label: 'waste_basket', min: 0, max: 1 },
        { Id: '56', label: 'castle', min: 0, max: 1 },
        { Id: '57', label: 'pub', min: 0, max: 1 },
        { Id: '59', label: 'furniture_shop', min: 0, max: 1 },
        { Id: '60', label: 'atm', min: 0, max: 1 },
        { Id: '61', label: 'college', min: 0, max: 1 },
        { Id: '62', label: 'bakery', min: 0, max: 1 },
        { Id: '65', label: 'nursing_home', min: 0, max: 1 },
        { Id: '66', label: 'monument', min: 0, max: 1 },
        { Id: '68', label: 'park', min: 0, max: 1 },
        { Id: '72', label: 'arts_centre', min: 0, max: 1 },
        { Id: '74', label: 'zoo', min: 0, max: 1 },
        { Id: '75', label: 'laundry', min: 0, max: 1 },
        { Id: '78', label: 'hairdresser', min: 0, max: 1 },
        { Id: '79', label: 'supermarket', min: 0, max: 1 },
        { Id: '81', label: 'clinic', min: 0, max: 1 },
        { Id: '83', label: 'butcher', min: 0, max: 1 },
        { Id: '85', label: 'sports_shop', min: 0, max: 1 },
        { Id: '86', label: 'car_dealership', min: 0, max: 1 },
        { Id: '88', label: 'hostel', min: 0, max: 1 },
        { Id: '89', label: 'dentist', min: 0, max: 1 },
        { Id: '90', label: 'garden_centre', min: 0, max: 1 },
        { Id: '91', label: 'bicycle_shop', min: 0, max: 1 },
        { Id: '92', label: 'guesthouse', min: 0, max: 1 },
        { Id: '93', label: 'car_wash', min: 0, max: 1 },
        { Id: '95', label: 'theme_park', min: 0, max: 1 },
        { Id: '96', label: 'cinema', min: 0, max: 1 },
        { Id: '97', label: 'recycling', min: 0, max: 1 },
        { Id: '98', label: 'courthouse', min: 0, max: 1 },
        { Id: '100', label: 'nightclub', min: 0, max: 1 },
        { Id: '101', label: 'playground', min: 0, max: 1 },
        { Id: '102', label: 'pharmacy', min: 0, max: 1 },
        { Id: '103', label: 'university', min: 0, max: 1 },
        { Id: '106', label: 'pitch', min: 0, max: 1 },
        { Id: '107', label: 'theatre', min: 0, max: 1 },
        { Id: '108', label: 'prison', min: 0, max: 1 },
        { Id: '110', label: 'outdoor_shop', min: 0, max: 1 },
        { Id: '113', label: 'hotel', min: 0, max: 1 },
        { Id: '115', label: 'cafe', min: 0, max: 1 },
        { Id: '116', label: 'computer_shop', min: 0, max: 1 },
        { Id: '118', label: 'recycling_metal', min: 0, max: 1 },
        { Id: '120', label: 'beauty_shop', min: 0, max: 1 },
        { Id: '122', label: 'florist', min: 0, max: 1 },
        { Id: '123', label: 'doctors', min: 0, max: 1 },
        { Id: '124', label: 'graveyard', min: 0, max: 1 },
        { Id: '126', label: 'swimming_pool', min: 0, max: 1 },
        { Id: '130', label: 'recycling_paper', min: 0, max: 1 },
        { Id: '131', label: 'optician', min: 0, max: 1 },
        { Id: '133', label: 'bookshop', min: 0, max: 1 },
        { Id: '134', label: 'bank', min: 0, max: 1 },
        { Id: '136', label: 'post_office', min: 0, max: 1 },
        { Id: '137', label: 'fire_station', min: 0, max: 1 }
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
      // This effect sets the first available tab where value > 0 as active tab
      const firstAvailableTab = slidersValues.findIndex(slider => slider.value > 0);
      setActiveTab(firstAvailableTab >= 0 ? firstAvailableTab : 0);
    }, [slidersValues]);


    const onSliderChange = (newValue, groupIds) => {
        setSliderValues(prevValues => {
            const updatedValues = groupIds.reduce((acc, id) => ({
                ...acc,
                [id]: newValue
            }), {});

            // Log the changes for debugging
            console.log("Updating Sliders: ");
            groupIds.forEach(id => {
                console.log(`ID: ${id}, New Value: ${newValue}`);
            });

            return {
                ...prevValues,
                ...updatedValues
            };
        });
    };

    const renderSlidersForTab = () => {
        return sliderGroupings[tabs[activeTab]].map((group, index) => (
            <div key={`slider-${activeTab}-${index}`}>
                <label>{group.name}</label>
                <Box sx={{ width: 300 }}>
                    <Slider
                        aria-label={group.name}
                        value={sliderValues[activeTab]}
                        valueLabelDisplay="auto"
                        step={0.25}
                        marks={[{ value: 0, label: 'Not Important' }, { value: 1, label: 'Very Important' }]}
                        min={0}
                        max={1}
                        onChange={(event, newValue) => onSliderChange(newValue, group.ids)}
                    />
                </Box>
            </div>
        ));
    };

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
                <div className="button-container">
                    <button className="button-small-round" onClick={handlePreviousClick}>
                        <span className="button-icon">Previous</span>
                    </button>
                    <button className="button-small-round" onClick={() => console.log('Search button clicked')}>
                        <span className="button-icon">Search🔍</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Questions;