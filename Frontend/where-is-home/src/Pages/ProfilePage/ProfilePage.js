import React, { useRef, useEffect, useState } from 'react';
import './ProfilePage.css';
import { useTranslation } from "react-i18next";
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

function ProfilePage({ darkMode }) {
    const { t } = useTranslation("common");
    const [isExpandedCommerce, setIsExpandedCommerce] = useState(false);
    const [isExpandedSocialLeisure, setIsExpandedSocialLeisure] = useState(false);
    const [isExpandedHealth, setIsExpandedHealth] = useState(false);
    const [isExpandedNatureSports, setIsExpandedNatureSports] = useState(false);
    const [isExpandedServices, setIsExpandedServices] = useState(false);
    const [isExpandedEducation, setIsExpandedEducation] = useState(false);
    const navigate = useNavigate();
    
    const [slidersValues, setSlidersValues] = useState([
        { id: 0, value: 0 },  
        { id: 1, value: 0 },  
        { id: 2, value: 0 }, 
        { id: 3, value: 0 },  
        { id: 4, value: 0 },  
        { id: 5, value: 0 }   
    ]);

    const [isEditMode, setIsEditMode] = useState(false);

    const [userData, setUserData] = useState({
        nome: 'John Doe',
        endereco: '123 Main St',
        telemovel: '555-1234',
        email: 'john@example.com',
        password:'*****'
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetch('http://mednat.ieeta.pt:9009/users/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha ao obter dados do usuário');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setUserData(data);
            })
            .catch(error => {
                console.error(error);
            });
            fetch('http://mednat.ieeta.pt:9009/users/preferences/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha ao obter dados do usuário');
                }
                return response.json();
            })
            .then(data => {
                console.log('Preferences:' ,data);
            })
            .catch(error => {
                console.error(error);
            });
        }
    }, []); 
    // update user info 
    // fetch('http://mednat.ieeta.pt:9009/users/update/', {
    //     method: 'POST',
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //     },
    //     body: JSON.stringify({
    //         "nome": nome_atualizado,
    //         "endereco": endereco_atualizado,
    //         "telemovel": telemovel_atualizado,

    //     })
    // })
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Falha ao obter dados do usuário');
    //     }
    //     return response.json();
    // })
    // .then(data => {
    //     console.log('Preferences:', data);
    // })
    // .catch(error => {
    //     console.error(error);
    // });

    // update preferences info 
    // fetch('http://mednat.ieeta.pt:9009/users/preferences/update/', {
    //     method: 'POST',
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //     },
    //     body: JSON.stringify({
    //        PEDE ESTA PARTE AO VASCO

    //     })
    // })
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Falha ao obter dados do usuário');
    //     }
    //     return response.json();
    // })
    // .then(data => {
    //     console.log('Preferences:', data);
    // })
    // .catch(error => {
    //     console.error(error);
    // });
    const handleSliderChange = (index, value) => {
        if (value === 0) {
            switch (index) {
            
                case 0:
                    setIsExpandedCommerce(false);
                    break;
                case 1:
                    setIsExpandedSocialLeisure(false);
                    break;
                case 2:
                    setIsExpandedHealth(false);
                    break;
                case 3:
                    setIsExpandedNatureSports(false);
                    break;
                case 4:
                    setIsExpandedServices(false);
                    break;
                case 5:
                    setIsExpandedEducation(false);
                    break;
                default:
                    console.error("Invalid index provided to handleSliderChange");
            }
        }
        const updatedSliders = slidersValues.map((slider, idx) => {
            if (idx === index) {
            return { ...slider, value };
            }
            return slider;
        });
        setSlidersValues(updatedSliders);
    };

    const toggleExpansion = (theme) => {
        switch (theme) {
            case "commerce":
                return () => setIsExpandedCommerce(!isExpandedCommerce);
            case "social_leisure":
                return () => setIsExpandedSocialLeisure(!isExpandedSocialLeisure);
            case "health":
                return () => setIsExpandedHealth(!isExpandedHealth);
            case "nature_sports":
                return () => setIsExpandedNatureSports(!isExpandedNatureSports);
            case "services":
                return () => setIsExpandedServices(!isExpandedServices);
            case "education":
                return () => setIsExpandedEducation(!isExpandedEducation);
            default:
                return () =>
                console.error("Invalid theme provided to toggleExpansion");
        }
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    const handleSaveClick = () => {
        setIsEditMode(false); 
        alert('Dados salvos!');
    };

    const handleCancelClick = () => {
        setIsEditMode(false); 
    };


    //Questions

    

    

    const [activeTab, setActiveTab] = useState(0);

    const tabs = [t('commerce'),t('social_leisure'),t('health'), t('nature_sports'),t('services'), t('Education')];

    const filteredTabs = tabs.filter((tab, index) => slidersValues[index].value > 0);

    const sliderGroupings = {
        [t('commerce')]: [
            { name: "Commerce", ids: ['2'] },
            { name: "Bakery", ids: ['3'] },
            { name: "Food Courts", ids: ['4'] },
            { name: "Supermarket", ids: ['9'] }
        ],
        [t('social_leisure')]: [
            { name: "Nightlife", ids: ['5'] },
            { name: "Hotel", ids: ['8'] },
            { name: "Culture", ids: ['10'] },
            { name: "Entertainment", ids: ['17'] }
        ],
        [t('health')]: [
            { name: "Health Services", ids: ['7'] },
            { name: "Pharmacy", ids: ['18'] },
            { name: "Hospital", ids: ['22'] },
            { name: "Clinic", ids: ['23'] },
            { name: "Veterinary", ids: ['24'] }
        ],
        [t('nature_sports')]: [
            { name: "Sports Center", ids: ['1'] },
            { name: "Camp Sites", ids: ['6'] },
            { name: "Parks", ids: ['13'] },
            { name: "Swimming Pool", ids: ['19'] },
            { name: "Beach River", ids: ['25'] },
            { name: "Bicycle Paths", ids: ['27'] },
            { name: "Walking Routes", ids: ['28'] }
        ],
        [t('services')]: [
            { name: "Emergency Services", ids: ['14'] },
            { name: "Banks", ids: ['20'] },
            { name: "Post Offices", ids: ['21'] },
            { name: "Industrial Zones", ids: ['26'] },
            { name: "Car Parks", ids: ['29'] }
        ],
        [t('Education')]: [
            { name: "Schools", ids: ['11'] },
            { name: "Libraries", ids: ['12'] },
            { name: "Kindergartens", ids: ['15'] },
            { name: "Universities", ids: ['16'] }
        ]
    };

    const buildInitialState = () => {
        const values = {};
        Object.values(sliderGroupings).flat(2).forEach(id => {
            values[id] = 0;
        });
        return values;
    };
    const [ sliderValuesCruz, setSliderValuesCruz] = useState(buildInitialState());



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
    };
      const valueLabelFormat = (value) => {
        const labels = [t('notimportant'), t('slightly'), t('moderate'), t('important'), t('very_Important')];
        return labels[Math.round(value * 4)];
    };


    const renderSlidersForTab = (activeTab) => {
        return sliderGroupings[tabs[activeTab]].map((group, index) => (
            <div key={`slider-${activeTab}-${index}`} className="slider-container-profile">
                <label className="label-profile">{group.name}</label>
                <div className='slider-lefties-profile'>
                <Box sx={{ width: 300 }}>
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
                </Box>
                </div>
            </div>
        ));
    };



    return (
        <div className={`ProfilePage ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="left-store2">
                <div className='profile-container2'>
                    <div className="static-text2">
                        <h2>{t('profile')}</h2>
                    </div>
                    
                    <div className='form-container2'>
                        <form>
                        <div className='form-group-row2'>
                                <div className='form-group-label2'>
                                    <label htmlFor='name'>{t('name')}:</label>
                                </div>
                                <div className='form-group-input2'>
                                    {isEditMode ? (
                                        <input type='text' id='name' name='name' value={userData.nome} onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
                                    ) : (
                                        <span>{userData.nome}</span>
                                    )}
                                </div>
                            </div>
                            <div className='form-group-row2'>
                                <div className='form-group-label2'>
                                    <label htmlFor='address'>{t('address')}:</label>
                                </div>
                                <div className='form-group-input2'>
                                    {isEditMode ? (
                                        <input type='text' id='address' name='address' value={userData.endereco} onChange={(e) => setUserData({ ...userData, address: e.target.value })} />
                                    ) : (
                                        <span>{userData.endereco}</span>
                                    )}
                                </div>
                            </div>
                            <div className='form-group-row2'>
                                <div className='form-group-label2'>
                                    <label htmlFor='phone'>{t('phone')}:</label>
                                </div>
                                <div className='form-group-input2'>
                                    {isEditMode ? (
                                        <input type='text' id='phone' name='phone' value={userData.telemovel} onChange={(e) => setUserData({ ...userData, phone: e.target.value })} />
                                    ) : (
                                        <span>{userData.telemovel}</span>
                                    )}
                                </div>
                            </div>
                            <div className='form-group-row2'>
                                <div className='form-group-label2'>
                                    <label htmlFor='email'>{t('email')}:</label>
                                </div>
                                <div className='form-group-input2'>
                                    {isEditMode ? (
                                        <input type='text' id='email' name='email' value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
                                    ) : (
                                        <span>{userData.email}</span>
                                    )}
                                </div>
                            </div>
                            <div className='form-group-row2'>
                                <div className='form-group-label2'>
                                <label htmlFor='password'>{t('password')}:</label>
                                </div>
                                <div className='form-group-input2'>
                                    {isEditMode ? (
                                        <input type='text' id='password' name='password' value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
                                    ) : (
                                        <span>{userData.password}</span>
                                    )}
                                </div>

                            </div>
                            <div className='button-save-div2'>
                                <button className="button-save2" onClick={handleSaveClick}>{t('save')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className='right-container2'>
                <div className='search-filters2'>
                    <div className="static-text-preferences">
                        <h1>{t('preferences')}</h1>
                    </div>
                    <div className="label-scroll-container2">
                        <div className="label-slider-container-first2">
                            <label className="label_metric2" htmlFor="commerce-slider">{t('commerce')}</label>
                            <div className="slider-minmax2">
                                <div className='tool2'>
                                    <Box sx={{ width: 300 }}>
                                    <Slider
                                        aria-label="Importance"
                                        value={slidersValues[0].value}
                                        valueLabelDisplay="auto"
                                        step={25}
                                        id="commerce"
                                        marks
                                        min={0}
                                        max={100}
                                        valueLabelFormat={(value) => {
                                        switch (value) {
                                            case 0:
                                            return t('notimportant');
                                            case 25:
                                            return t('slightly');
                                            case 50:
                                            return t('moderate');
                                            case 75:
                                            return t('important');
                                            case 100:
                                            return t('very_Important');
                                            default:
                                            return '';
                                        }
                                        }}
                                        onChange={(event, value) => handleSliderChange(0, value)}
                                    />

                                    </Box>
                                </div>
                                <div className="min-max-text2">
                                    <span>{t('nothing')}</span>
                                    <span className='very'>{t('very_Important')}</span>
                                </div>

                            </div>
                            {slidersValues[0].value > 0 && (
                                <div className='open-details2'>
                                    <label className="label_metric-slider" htmlFor="commerce-slider">
                                        {isExpandedCommerce ? <BsChevronUp onClick={toggleExpansion("commerce")} /> : <BsChevronDown onClick={toggleExpansion("commerce")} />}
                                    </label>
                                </div>
                            )}


                        </div>
                        {isExpandedCommerce && (
                            <div className="expanded-content2">
                                {renderSlidersForTab(0)}
                            </div>
                        )}

                        <div className="label-slider-container2">
                            <label className="label_metric2" htmlFor="social_leisure-slider">{t('social_leisure')}</label>
                            <div className="slider-minmax2">
                                <div className='tool2'>
                                    <Box sx={{ width: 300 }}>
                                    <Slider
                                        aria-label="Importance"
                                        value={slidersValues[1].value}
                                        valueLabelDisplay="auto"
                                        step={25}
                                        id="social_leisure"
                                        marks
                                        min={0}
                                        max={100}
                                        valueLabelFormat={(value) => {
                                        switch (value) {
                                            case 0:
                                            return t('notimportant');
                                            case 25:
                                            return t('slightly');
                                            case 50:
                                            return t('moderate');
                                            case 75:
                                            return t('important');
                                            case 100:
                                            return t('very_Important');
                                            default:
                                            return '';
                                        }
                                        }}
                                        onChange={(event, value) => handleSliderChange(1, value)}

                                    />

                                    </Box>
                                </div>
                                <div className="min-max-text2">
                                    <span>{t('nothing')}</span>
                                    <span className='very'>{t('very_Important')}</span>
                                </div>
                            </div>
                            {slidersValues[1].value > 0 && (
                                <div className='open-details2'>
                                    <label className="label_metric-slider" htmlFor="commerce-slider">
                                        {isExpandedSocialLeisure ? <BsChevronUp onClick={toggleExpansion("social_leisure")} /> : <BsChevronDown onClick={toggleExpansion("social_leisure")} />}
                                    </label>
                                </div>
                            )}
                        </div>
                        {isExpandedSocialLeisure && (
                            <div className="expanded-content2">
                                {renderSlidersForTab(1)}
                            </div>
                        )}
                        <div className="label-slider-container2">
                            <label className="label_metric2" htmlFor="health-slider">{t('Health')}</label>
                            <div className="slider-minmax2">
                                <div className='tool2'>
                                    <Box sx={{ width: 300 }}>
                                    <Slider
                                        aria-label="Importance"
                                        value={slidersValues[2].value}
                                        valueLabelDisplay="auto"
                                        step={25}
                                        id="health"
                                        marks
                                        min={0}
                                        max={100}
                                        valueLabelFormat={(value) => {
                                        switch (value) {
                                            case 0:
                                            return t('notimportant');
                                            case 25:
                                            return t('slightly');
                                            case 50:
                                            return t('moderate');
                                            case 75:
                                            return t('important');
                                            case 100:
                                            return t('very_Important');
                                            default:
                                            return '';
                                        }
                                        }}
                                        onChange={(event, value) => handleSliderChange(2, value)}

                                    />

                                    </Box>
                                </div>
                                <div className="min-max-text2">
                                    <span>{t('nothing')}</span>
                                    <span className='very'>{t('very_Important')}</span>
                                </div>
                            </div>
                            {slidersValues[2].value > 0 && (
                                <div className='open-details2'>
                                    <label className="label_metric-slider" htmlFor="commerce-slider">
                                        {isExpandedHealth ? <BsChevronUp onClick={toggleExpansion("health")} /> : <BsChevronDown onClick={toggleExpansion("health")} />}
                                    </label>
                                </div>
                            )}
                        </div>
                        {isExpandedHealth && (
                            <div className="expanded-content2">
                                {renderSlidersForTab(2)}
                            </div>
                        )}
                        <div className="label-slider-container2">
                            <label className="label_metric2" htmlFor="nature_sports-slider">{t('nature_sports')}</label>
                            <div className="slider-minmax2">
                                <div className='tool2'>
                                    <Box sx={{ width: 300 }}>
                                    <Slider
                                        aria-label="Importance"
                                        value={slidersValues[3].value}
                                        valueLabelDisplay="auto"
                                        step={25}
                                        id="nature_sports"
                                        marks
                                        min={0}
                                        max={100}
                                        valueLabelFormat={(value) => {
                                        switch (value) {
                                            case 0:
                                            return t('notimportant');
                                            case 25:
                                            return t('slightly');
                                            case 50:
                                            return t('moderate');
                                            case 75:
                                            return t('important');
                                            case 100:
                                            return t('very_Important');
                                            default:
                                            return '';
                                        }
                                        }}
                                        onChange={(event, value) => handleSliderChange(3, value)}

                                    />

                                    </Box>
                                </div>
                                <div className="min-max-text2">
                                    <span>{t('nothing')}</span>
                                    <span className='very'>{t('very_Important')}</span>
                                </div>
                            </div>
                            {slidersValues[3].value > 0 && (
                                <div className='open-details2'>
                                    <label className="label_metric-slider" htmlFor="commerce-slider">
                                        {isExpandedNatureSports ? <BsChevronUp onClick={toggleExpansion("nature_sports")} /> : <BsChevronDown onClick={toggleExpansion("nature_sports")} />}
                                    </label>
                                </div>
                            )}
                        </div>
                        {isExpandedNatureSports && (
                            <div className="expanded-content2">
                                {renderSlidersForTab(3)}
                            </div>
                        )}
                        <div className="label-slider-container2">
                            <label className="label_metric2" htmlFor="service-slider">{t('services')}</label>
                            <div className="slider-minmax2">
                                <div className='tool2'>
                                    <Box sx={{ width: 300 }}>
                                    <Slider
                                        aria-label="Importance"
                                        value={slidersValues[4].value}
                                        valueLabelDisplay="auto"
                                        step={25}
                                        id="service"
                                        marks
                                        min={0}
                                        max={100}
                                        valueLabelFormat={(value) => {
                                        switch (value) {
                                            case 0:
                                            return t('notimportant');
                                            case 25:
                                            return t('slightly');
                                            case 50:
                                            return t('moderate');
                                            case 75:
                                            return t('important');
                                            case 100:
                                            return t('very_Important');
                                            default:
                                            return '';
                                        }
                                        }}
                                        onChange={(event, value) => handleSliderChange(4, value)}

                                    />

                                    </Box>
                                </div>
                                <div className="min-max-text2">
                                    <span>{t('nothing')}</span>
                                    <span className='very'>{t('very_Important')}</span>
                                </div>
                            </div>
                            {slidersValues[4].value > 0 && (
                                <div className='open-details2'>
                                    <label className="label_metric-slider" htmlFor="commerce-slider">
                                        {isExpandedServices ? <BsChevronUp onClick={toggleExpansion("services")} /> : <BsChevronDown onClick={toggleExpansion("services")} />}
                                    </label>
                                </div>
                            )}
                        </div>
                        {isExpandedServices && (
                            <div className="expanded-content2">
                                {renderSlidersForTab(4)}
                            </div>
                        )}
                        <div className="label-slider-container2">
                            <label className="label_metric2" htmlFor="education-slider">{t('Education')}</label>
                            <div className="slider-minmax2">
                                <div className='tool2'>
                                    <Box sx={{ width: 300 }}>
                                    <Slider
                                        aria-label="Importance"
                                        value={slidersValues[5].value}
                                        valueLabelDisplay="auto"
                                        step={25}
                                        id="education"
                                        marks
                                        min={0}
                                        max={100}
                                        valueLabelFormat={(value) => {
                                        switch (value) {
                                            case 0:
                                            return t('notimportant');
                                            case 25:
                                            return t('slightly');
                                            case 50:
                                            return t('moderate');
                                            case 75:
                                            return t('important');
                                            case 100:
                                            return t('very_Important');
                                            default:
                                            return '';
                                        }
                                        }}
                                        onChange={(event, value) => handleSliderChange(5, value)}

                                    />

                                    </Box>
                                </div>
                                <div className="min-max-text2">
                                    <span>{t('nothing')}</span>
                                    <span className='very'>{t('very_Important')}</span>
                                </div>
                            </div>
                            {slidersValues[5].value > 0 && (
                                <div className='open-details2'>
                                    <label className="label_metric-slider" htmlFor="commerce-slider">
                                        {isExpandedEducation ? <BsChevronUp onClick={toggleExpansion("education")} /> : <BsChevronDown onClick={toggleExpansion("education")} />}
                                    </label>
                                </div>
                            )}
                        </div>
                        {isExpandedEducation && (
                            <div className="expanded-content2">
                                {renderSlidersForTab(5)}
                            </div>
                        )}
                        
                    </div>
                    <div className='button-save-div-pref2'>
                        <button className="button-save-pref2" onClick={handleSaveClick}>{t('save')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;