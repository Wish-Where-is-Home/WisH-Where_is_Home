import React, { useRef, useEffect, useState } from 'react';
import './ProfilePage.css';
import { useTranslation } from "react-i18next";
import Slider from '@mui/material/Slider';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { Modal, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function ProfilePage({ darkMode }) {
    const { t } = useTranslation("common");
    const [isExpandedCommerce, setIsExpandedCommerce] = useState(false);
    const [isExpandedSocialLeisure, setIsExpandedSocialLeisure] = useState(false);
    const [isExpandedHealth, setIsExpandedHealth] = useState(false);
    const [isExpandedNatureSports, setIsExpandedNatureSports] = useState(false);
    const [isExpandedServices, setIsExpandedServices] = useState(false);
    const [isExpandedEducation, setIsExpandedEducation] = useState(false);
    const navigate = useNavigate();

    const [metricsSaved, setMetricsSaved] = useState(false);
    

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);

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
        nome: '',
        endereco: '',
        telemovel: '',
        email: '',
        password:''
    });
    
    const openConfirmationModal = () => setShowConfirmationModal(true);
    const closeConfirmationModal = () => setShowConfirmationModal(false);

    const closeResetModal = () => setShowResetModal(false);
    const openResetModal = () => setShowResetModal(true);



    const handleSaveClick = () => {
        openConfirmationModal(); 
      };



    const handleCancelSave = () => {
        closeConfirmationModal();
    };

    const handleConfirmResetModal = () => {
        closeResetModal();
        handleResetSliders();
    };

    const handleCancelResetModal = () => {
        closeResetModal();
    };
    



    const handleConfirmSave = () => {
        closeConfirmationModal();
        setIsEditMode(false);

        const token = localStorage.getItem('token');
        setIsEditMode(false); 

        const updatedUserData = {
            nome: document.getElementById('name').value,
            endereco: document.getElementById('address').value,
            telemovel: document.getElementById('phone').value,
            email: userData.email, 
            password: userData.password
        };
        setUserData(updatedUserData);
        
      
        // Make a fetch request to update user data
        fetch('http://mednat.ieeta.pt:9009/users/update/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            nome: updatedUserData.nome,
            endereco: updatedUserData.endereco,
            telemovel: updatedUserData.telemovel,
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Falha ao atualizar dados do usuário');
          }
          return response.json();
        })
        .then(data => {
          console.log('User data updated:', data);
          alert('Dados salvos!');
          // Você pode opcionalmente atualizar o estado local de userData, se necessário
        })
        .catch(error => {
          console.error(error);
          // Manipule os erros adequadamente, como mostrando uma mensagem de erro ao usuário
        });
    };

    
    
    

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
            
        }
    }, []); 

    
   
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

    const buildInitialStateSliders = () => {
        const initialState = {};
        Object.keys(sliderValuesCruz).forEach(id => {
            initialState[id] = 0;
        });
        return initialState;
    };

    useEffect(() => {
     
      const firstAvailableTab = slidersValues.findIndex(slider => slider.value > 0);
      setActiveTab(firstAvailableTab >= 0 ? firstAvailableTab : 0);
      console.log("SlidersValues",slidersValues);
    }, [slidersValues]);

    useEffect(() => {
        const fetchUserMetrics = async () => {
            const locationMappings = {
                1: 'sports_center',
                2: 'commerce',
                3: 'bakery',
                4: 'food_court',
                5: 'nightlife',
                6: 'camping',
                7: 'health_services',
                8: 'hotel',
                9: 'supermarket',
                10: 'culture',
                11: 'school',
                12: 'library',
                13: 'parks',
                14: 'services',
                15: 'kindergarten',
                16: 'university',
                17: 'entertainment',
                18: 'pharmacy',
                19: 'swimming_pool',
                20: 'bank',
                21: 'post_office',
                22: 'hospital',
                23: 'clinic',
                24: 'veterinary',
                25: 'beach_river',
                26: 'industrial_zone',
                27: 'bicycle_path',
                28: 'walking_routes',
                29: 'car_park'
              };
            
              try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://mednat.ieeta.pt:9009/users/preferences/', {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
            
                if (response.ok) {
                  const backendData = await response.json();
                  
                    const nature_sportsValue = parseFloat(backendData['theme_nature_sports']) || 0;
                    const commerceValue =  parseFloat(backendData['theme_commerce']) || 0;
                    const educationValue =  parseFloat(backendData['theme_education']) || 0;
                    const healthValue =  parseFloat(backendData['theme_health']) || 0;
                    const serviceValue =  parseFloat(backendData['theme_service']) || 0;
                    const social_leisureValue =  parseFloat(backendData['theme_social_leisure']) || 0;                  
            
                    delete backendData['theme_nature_sports'];
                    delete backendData['theme_commerce'];
                    delete backendData['theme_education'];
                    delete backendData['theme_health'];
                    delete backendData['theme_service'];
                    delete backendData['theme_social_leisure'];
                   
                    const updatedSlidersValues = slidersValues.map(slider => {
                      switch (slider.id) {
                        case 3:
                          return { ...slider, value: nature_sportsValue };
                        case 0:
                          return { ...slider, value: commerceValue };
                        case 5:
                          return { ...slider, value: educationValue };
                        case 2:
                          return { ...slider, value: healthValue };
                        case 4:
                          return { ...slider, value: serviceValue };
                        case 1:
                          return { ...slider, value: social_leisureValue };
                        default:
                          return slider;
                      }
                    });
            
            
                    Object.entries(locationMappings).forEach(([id, key]) => {
                      const value = parseFloat(backendData[key]) || 0;
                      if (value !== 0) {
                        setSliderValuesCruz(prevState => ({
                          ...prevState,
                          [id]: value
                        }));
                      }
                    });
            
                    
                    setSlidersValues(updatedSlidersValues);
                    
                 
                } else {
                  console.error('Failed to fetch preferences data');
                }
              } catch (error) {
                console.error('Error fetching preferences data:', error);
              }
            };
            fetchUserMetrics();
            }, []);

      
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
    const handleSavePreferences = () => {

        const token = localStorage.getItem('token');
        const data = {
          
          theme_commerce: slidersValues[0].value,
          theme_social_leisure: slidersValues[1].value,
          theme_health: slidersValues[2].value,
          theme_nature_sports: slidersValues[3].value,
          theme_service: slidersValues[4].value,
          theme_education: slidersValues[5].value,
      
        };
      
      
        const locationMappings = {
          1: 'sports_center',
          2: 'commerce',
          3: 'bakery',
          4: 'food_court',
          5: 'nightlife',
          6: 'camping',
          7: 'health_services',
          8: 'hotel',
          9: 'supermarket',
          10: 'culture',
          11: 'school',
          12: 'library',
          13: 'parks',
          14: 'services',
          15: 'kindergarten',
          16: 'university',
          17: 'entertainment',
          18: 'pharmacy',
          19: 'swimming_pool',
          20: 'bank',
          21: 'post_office',
          22: 'hospital',
          23: 'clinic',
          24: 'veterinary',
          25: 'beach_river',
          26: 'industrial_zone',
          27: 'bicycle_path',
          28: 'walking_routes',
          29: 'car_park'
        };
      
      
      Object.keys(locationMappings).forEach(id => {
        const key = locationMappings[id];
        let value = 0;
        console.log("SLIDERS CRUZ",sliderValuesCruz);
      
        const sliderValue = sliderValuesCruz[id];
      
        if (sliderValue !== undefined) {
            value = sliderValue;
        }
        
      
        
      
        
        data[key] = value;
      });
        
        console.log("DATA TO UPDATE",data);
      
      
        
        fetch('http://mednat.ieeta.pt:9009/users/preferences/update/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
        })
        .then(response => {
          if (response.ok) {
            alert("Data sucessfully saved")
            console.log('Preferences saved successfully');
          } else {
            throw new Error('Failed to save preferences');
          }
        })
        .catch(error => {
          console.error('Error saving preferences:', error);
        });
      };

    const handleResetSliders = () => {
        const token = localStorage.getItem('token');
        const data = {
          
          theme_commerce: 0,
          theme_social_leisure: 0,
          theme_health: 0,
          theme_nature_sports: 0,
          theme_service: 0,
          theme_education: 0,
      
        };
      
      
        const locationMappings = {
          1: 'sports_center',
          2: 'commerce',
          3: 'bakery',
          4: 'food_court',
          5: 'nightlife',
          6: 'camping',
          7: 'health_services',
          8: 'hotel',
          9: 'supermarket',
          10: 'culture',
          11: 'school',
          12: 'library',
          13: 'parks',
          14: 'services',
          15: 'kindergarten',
          16: 'university',
          17: 'entertainment',
          18: 'pharmacy',
          19: 'swimming_pool',
          20: 'bank',
          21: 'post_office',
          22: 'hospital',
          23: 'clinic',
          24: 'veterinary',
          25: 'beach_river',
          26: 'industrial_zone',
          27: 'bicycle_path',
          28: 'walking_routes',
          29: 'car_park'
        };

        const nature_sportsValue = 0;
        const commerceValue = 0;
        const educationValue = 0;
        const healthValue = 0;
        const serviceValue =   0;
        const social_leisureValue = 0;
        
        const updatedSlidersValues = slidersValues.map(slider => {
            switch (slider.id) {
            case 3:
                return { ...slider, value: nature_sportsValue };
            case 0:
                return { ...slider, value: commerceValue };
            case 5:
                return { ...slider, value: educationValue };
            case 2:
                return { ...slider, value: healthValue };
            case 4:
                return { ...slider, value: serviceValue };
            case 1:
                return { ...slider, value: social_leisureValue };
            default:
                return slider;
            }
        });

        
        
        Object.entries(locationMappings).forEach(([id, key]) => {
            const value =  0;
              setSliderValuesCruz(prevState => ({
                ...prevState,
                [id]: value
              }));
          });
  
          
          setSlidersValues(updatedSlidersValues);

          setIsExpandedCommerce(false);

          setIsExpandedSocialLeisure(false);

          setIsExpandedHealth(false);

          setIsExpandedNatureSports(false);

          setIsExpandedServices(false);
 
          setIsExpandedEducation(false);
        
      
      
        Object.keys(locationMappings).forEach(id => {
            const key = locationMappings[id];
            let value = 0;         
            
            data[key] = value;
          });
            
            console.log("DATA TO UPDATE",data);
      
        
        fetch('http://mednat.ieeta.pt:9009/users/preferences/update/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
        })
        .then(response => {
          if (response.ok) {
            console.log('Preferences saved successfully');
          } else {
            throw new Error('Failed to save preferences');
          }
        })
        .catch(error => {
          console.error('Error saving preferences:', error);
        });
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
                                        <input 
                                            type='text' 
                                            id='name' 
                                            name='name' 
                                            value={userData.nome} 
                                            onChange={(e) => setUserData(prevUserData => ({ ...prevUserData, nome: e.target.value }))} 
                                        />                                    
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
                                        <input 
                                            type='text' 
                                            id='address' 
                                            name='address' 
                                            value={userData.endereco} 
                                            onChange={(e) => setUserData(prevUserData => ({ ...prevUserData, endereco: e.target.value }))} 
                                        />
                                    
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
                                        <input 
                                            type='text' 
                                            id='phone' 
                                            name='phone' 
                                            value={userData.telemovel} 
                                            onChange={(e) => setUserData(prevUserData => ({ ...prevUserData, telemovel: e.target.value }))} 
                                        />
                                    
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
                                    <span>{userData.email}</span>
                                </div>
                            </div>
                            {/* <div className='form-group-row2'>
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
                            </div> */}
                            <div className='button-group2'>
                                {!isEditMode ? (
                                    <button type="button" className="button-edit" onClick={toggleEditMode}>{t('edit')}</button>
                                ) : (
                                    <>
                                        <button type="button" className="button-cancel" onClick={handleCancelClick}>{t('cancel')}</button>
                                        <button type="button" className="button-save" onClick={handleSaveClick}>{t('save')}</button>
                                    </>
                                )}
                            </div>
                            {/* Modal de confirmação */}
                            
                            <Modal
                                open={showConfirmationModal}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box className={`box_Profile ${darkMode ? 'dark-mode' : 'light-mode'}`} >        

                                    <CloseIcon onClick={closeConfirmationModal} sx={{ position: 'absolute', top: 0, right: 0, margin: 1, cursor: 'pointer' }} />
                                    
                                    <Typography id="modal-modal-title" variant="h6" component="h5">
                                        {t('confirmModal')}
                                    </Typography>
                                    
                                    <div className='div-btn-modal-profile' >
                                        <button className="btn-confirmation-editProfile" onClick={handleCancelSave}>{t('cancel')}</button>
                                        <button className="btn-confirmation-editProfile" onClick={handleConfirmSave}>{t('save')}</button>
                                    </div>

                                </Box>
                            </Modal>



                        </form>
                    </div>
                </div>
            </div>



            {/*Preferences*/}
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
                                        step={0.25}
                                        id="commerce"
                                        marks
                                        min={0}
                                        max={1}
                                        valueLabelFormat={(value) => {
                                        switch (value) {
                                            case 0:
                                            return t('notimportant');
                                            case 0.25:
                                            return t('slightly');
                                            case 0.5:
                                            return t('moderate');
                                            case 0.75:
                                            return t('important');
                                            case 1:
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
                                        step={0.25}
                                        id="social_leisure"
                                        marks
                                        min={0}
                                        max={1}
                                        valueLabelFormat={(value) => {
                                        switch (value) {
                                            case 0:
                                            return t('notimportant');
                                            case 0.25:
                                            return t('slightly');
                                            case 0.5:
                                            return t('moderate');
                                            case 0.75:
                                            return t('important');
                                            case 1:
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
                                        step={0.25}
                                        id="health"
                                        marks
                                        min={0}
                                        max={1}
                                        valueLabelFormat={(value) => {
                                        switch (value) {
                                            case 0:
                                            return t('notimportant');
                                            case 0.25:
                                            return t('slightly');
                                            case 0.5:
                                            return t('moderate');
                                            case 0.75:
                                            return t('important');
                                            case 1:
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
                                        step={0.25}
                                        id="nature_sports"
                                        marks
                                        min={0}
                                        max={1}
                                        valueLabelFormat={(value) => {
                                        switch (value) {
                                            case 0:
                                            return t('notimportant');
                                            case 0.25:
                                            return t('slightly');
                                            case 0.5:
                                            return t('moderate');
                                            case 0.75:
                                            return t('important');
                                            case 1:
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
                                        step={0.25}
                                        id="service"
                                        marks
                                        min={0}
                                        max={1}
                                        valueLabelFormat={(value) => {
                                        switch (value) {
                                            case 0:
                                            return t('notimportant');
                                            case 0.25:
                                            return t('slightly');
                                            case 0.5:
                                            return t('moderate');
                                            case 0.75:
                                            return t('important');
                                            case 1:
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
                                        step={0.25}
                                        id="education"
                                        marks
                                        min={0}
                                        max={1}
                                        valueLabelFormat={(value) => {
                                        switch (value) {
                                            case 0:
                                            return t('notimportant');
                                            case 0.25:
                                            return t('slightly');
                                            case 0.5:
                                            return t('moderate');
                                            case 0.75:
                                            return t('important');
                                            case 1:
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
                        <button className="button-reset-pref2" onClick={openResetModal}>{t('reset')}</button>
                        <button className="button-save-pref2" onClick={handleSavePreferences}>{t('save')}</button>
                    </div>

                    <Modal
                                open={showResetModal}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box className={`box_Profile ${darkMode ? 'dark-mode' : 'light-mode'}`} >        

                                    <CloseIcon onClick={closeResetModal} sx={{ position: 'absolute', top: 0, right: 0, margin: 1, cursor: 'pointer' }} />
                                    
                                    <Typography id="modal-modal-title" variant="h6" component="h5">
                                        {t('confirmResetModal')}
                                    </Typography>
                                    
                                    <div className='div-btn-modal-profile' >
                                        <button className="btn-confirmation-editProfile" onClick={handleCancelResetModal}>{t('cancel')}</button>
                                        <button className="btn-confirmation-editProfile" onClick={handleConfirmResetModal}>{t('reset')}</button>
                                    </div>

                                </Box>
                            </Modal>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;