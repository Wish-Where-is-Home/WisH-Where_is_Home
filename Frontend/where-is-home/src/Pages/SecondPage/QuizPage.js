import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import './QuizPage.css';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import Questions from '../Questions/Questions.js';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { useAuth } from '../../AuthContext/AuthContext';
import ModalW from '../../Components/ModalW/ModalW.js';
import 'proj4leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';


function QuizPage({ darkMode, zoneData,scores,updateScores}) {
  const { isAuthenticated,userInfo} = useAuth();
  const { t } = useTranslation("common");
  const location = useLocation();
  const [geojsonData, setGeojsonData] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [IdType, setIdType] = useState('');
  const [mapCenter, setMapCenter] = useState([null, null]);
  const [Zoom, setZoom] = useState(null);
  const [minZoom, setMinZoom] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const navigate = useNavigate();
  const [hoveredDistrictId, setHoveredDistrictId] = useState(null);
  const [camefromback,setCameFromBack]=useState(false);
  const [OpenPreferencesModal,setOpenPreferencesModal] = useState(true);
  const [metricsSaved, setMetricsSaved] = useState(false);
  const [modalVisibleGradient, setModalVisibleGradient] = useState(false);
  const [averageMetrics,setAverageMetrics] = useState(false);


  const [mostrarInfo, setMostrarInfo] = useState(false);

  const handleInfoHover = () => {
    setMostrarInfo(true);
  };

  const handleInfoLeave = () => {
    setMostrarInfo(false);
  };

  const [slidersValues, setSlidersValues] = useState([
    { id: 0, value: 0 },  
    { id: 1, value: 0 },  
    { id: 2, value: 0 }, 
    { id: 3, value: 0 },  
    { id: 4, value: 0 },  
    { id: 5, value: 0 }   
  ]);
  

const portugalBounds = [
  [34, -12],
  [45, -6]
];

const handleModalButtonClick = () => {
  setModalVisibleGradient(!modalVisibleGradient);
};

useEffect(() => {
  const fetchUserMetrics = async () => {
    try {
      
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://mednat.ieeta.pt:9009/users/preferences/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      

      if (response.ok) {
        const data = await response.json();
        console.log("My data", data);
        const metricsSaved = Object.values(data).some(value => value !== null && value !== "0.0000");
        setMetricsSaved(metricsSaved);

      } else {
        throw new Error('Failed to fetch user metrics');
      }
      }
    } catch (error) {
      console.error('Error fetching user metrics:', error);
    }
  };

  const fetchAverageMetrics = async () => {
    try {
    
      const responseAverage = await fetch('http://mednat.ieeta.pt:9009/preferences/average/', {
        method: 'GET',
      });
     
      if (responseAverage.ok) {
        const dataAverage = await responseAverage.json();
        setAverageMetrics(dataAverage);
        console.log(dataAverage);

        
      
      } else {
        throw new Error('Failed to fetch average preferences');
      }
    } catch (error) {
      console.error('Error fetching average preferences:', error);
    }
  };



  fetchAverageMetrics();
  fetchUserMetrics();
}, []);


  const mapRef = useRef(null);
  const geoJsonRef = useRef(null);

  useEffect(() => {
    if (location.state) {
      setSelectedDistrict(location.state.selectedDistrict.replace(/_/g, ' '));
      setDistrictId(location.state.districtId);
      if (location.state.districtId === "0"){
        setIdType("distritos");
      }else{
        setIdType("municipios");
      }

      if (location.state.slidersValues){
        setSlidersValues(location.state.slidersValues);
      }

      if (location.state.sliderValuesCruz){
        setSliderValuesCruz(location.state.sliderValuesCruz);
      }

      if(location.state.zone){
        setIdType(location.state.zone);
      }

      if (location.state.camefromback){
        setCameFromBack(location.state.camefromback);
      }

    }
  }, [location.state]);

  const sliderOptions = [t('notimportant'), t('slightly'), t('moderate'), t('important'), t('very_Important')];

  const handleSliderChange = (index, value) => {
    const updatedSliders = slidersValues.map((slider, idx) => {
      if (idx === index) {
        return { ...slider, value };
      }
      return slider;
    });
    setSlidersValues(updatedSliders);
  };


  const sliderGroupings = {
    [t('commerce')]: [
        { name: t("commerce"), ids: ['2'] },
        { name: t("Bakery"), ids: ['3'] },
        { name: t("FoodCourts"), ids: ['4'] },
        { name: t("Supermarket"), ids: ['9'] }
    ],
    [t('social_leisure')]: [
        { name: t("Nightlife"), ids: ['5'] },
        { name: t("Hotel"), ids: ['8'] },
        { name: t("Culture"), ids: ['10'] },
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
        { name: t("BicyclePaths"), ids: ['27'] },
        { name: t("WalkingRoutes"), ids: ['28'] }
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



const buildInitialState = () => {
  const values = {};
  Object.values(sliderGroupings).flat(2).forEach(id => {
      values[id] = 0;
  });
  return values;
};



const [ sliderValuesCruz, setSliderValuesCruz] = useState(buildInitialState());



  const handleSearchClick = () => {
  

   
    const allZero = slidersValues.every(slider => slider.value === 0);

    if (allZero) {
        alert('You must be interested in at least one subject.');
    } else {
        setShowQuestions(true);  
    }
};

  const handlePreviousClick = () => {
    
    setShowQuestions(false); 
  };


  const calculateFillColor = (index, totalColors) => {
    const green = [0, 255, 0];
    const yellow = [255, 255, 0];
    const orange = [255, 165, 0];
    const red = [255, 0, 0];

    if(totalColors===1){
      return green
    }

    let color;

    if (index === 0) {
        color = red;
    } else if (index === totalColors - 1) {
        color = green;
    } else {
        const percent = index / (totalColors - 1);
        if (percent < 0.5) {
          
            const ratio = percent / 0.5;
            color = [
                yellow[0] + (orange[0] - yellow[0]) * ratio,
                yellow[1] + (orange[1] - yellow[1]) * ratio,
                yellow[2] + (orange[2] - yellow[2]) * ratio
            ];
        } else {
           
            const ratio = (percent - 0.4) / 0.5;
            color = [
                green[0] + (yellow[0] - green[0]) * ratio,
                green[1] + (yellow[1] - green[1]) * ratio,
                green[2] + (yellow[2] - green[2]) * ratio
            ];
        }
    }

   
    return `rgb(${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(color[2])})`;
};


const geoJSONStyle = (feature) => {
  
    if (!feature || !scores || slidersValues.every(slider => slider.value === 0)) {
        return {
            fillColor: 'transparent',
            weight: 2,
            color: darkMode ? 'white' : 'black',
            fillOpacity: 0.3
        };
    } 


    const filteredScores = {};
    if (districtId.length >= 2) {
        for (const key in scores) {
            if (key.startsWith(districtId)) {
                filteredScores[key] = scores[key];
            }
        }
    } else {
        for (const key in scores) {
            filteredScores[key] = scores[key];
        }
    }

    const id = feature.id.split('.')[1];
   

    const sortedScores = Object.entries(filteredScores).sort((a, b) => a[1] - b[1]); 
    const totalColors = sortedScores.length;
    const fillColor = calculateFillColor(sortedScores.findIndex(entry => entry[0] === id), totalColors);

    return {
        fillColor: fillColor,
        weight: 2,
        color: darkMode ? 'white' : 'black',
        fillOpacity: darkMode ? 0.2 : 0.4
    };
};


  const handleDistrictClick = (event) => {
    const clickedDistrictId = event.target.feature.id.split('.')[1];
    setDistrictId(clickedDistrictId);
    setSelectedDistrict(event.target.feature.properties.dsg);
  };

  const getFirstFeatureCoordinates = (features) => {
    if (features.length === 0) return null;

    const firstFeature = features[0];
    let firstCoordinates = firstFeature.geometry.coordinates[0][0];

    if (Array.isArray(firstCoordinates[0])) {

      firstCoordinates = [firstCoordinates[0][1], firstCoordinates[0][0]];
    } else {

      firstCoordinates = [firstCoordinates[1], firstCoordinates[0]];
    }


    return firstCoordinates;
  };


  const calculateCenterOfFeatures = (features) => {
    let totalX = 0;
    let totalY = 0;
    let totalCount = 0;

    features.forEach(feature => {
      const geometry = feature.geometry;

      if (geometry.type === 'Polygon') {
        const coordinates = geometry.coordinates[0];

        coordinates.forEach(coordinate => {
          totalX += coordinate[0];
          totalY += coordinate[1];
          totalCount++;
        });
      } else if (geometry.type === 'MultiLineString') {
        const lines = geometry.coordinates;

        lines.forEach(line => {
          line.forEach(coordinate => {
            totalX += coordinate[0];
            totalY += coordinate[1];
            totalCount++;
          });
        });
      }
    });


    const centerX = totalX / totalCount;
    const centerY = totalY / totalCount;

    if (centerX === null && centerY === null) {
      centerX = 39.6686;
      centerY = -8.1332;
    }

    return [centerY, centerX];
  };



  useEffect(() => {

    const fetchGeojsonData = async () => {
      try {
        if (districtId === "0") {
          const url = 'http://mednat.ieeta.pt:9009/geoserver/wish/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=wish%3Adistritos&outputFormat=application%2Fjson&srsname=EPSG:4326';
          const response = await fetch(url);
          const data = await response.json();
          setGeojsonData(data);
          setIdType('distritos');
          setMapCenter([39.6686, -8.1332]);
          setZoom(7);
          setMinZoom(7);

        } else if (districtId.length === 4) {
          const url = `http://mednat.ieeta.pt:9009/geoserver/wish/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=wish%3Afreguesias&outputFormat=application%2Fjson&srsname=EPSG:4326&CQL_FILTER=code_municipio='${districtId}'`;
          const response = await fetch(url);
          const data = await response.json();

          setGeojsonData(data);
          setIdType('freguesias');
          const firstFeatureCoordinates = getFirstFeatureCoordinates(data.features);
          if (firstFeatureCoordinates) {
            setMapCenter(firstFeatureCoordinates);
          }
          setZoom(12);


        } else if (districtId.length === 6) {
          const url = `http://mednat.ieeta.pt:9009/geoserver/wish/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=wish%3Asubseccao&outputFormat=application%2Fjson&CQL_FILTER=code_freguesia='${districtId}'`;
          const response = await fetch(url);
          const data = await response.json();

          setGeojsonData(data);
          setIdType('subseccao');
          const centerCoordinates = calculateCenterOfFeatures(data.features);

          if (centerCoordinates) {
            setMapCenter(centerCoordinates);
          }

          setZoom(13);

        } else {
          const url = `http://mednat.ieeta.pt:9009/geoserver/wish/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=wish%3Amunicipios&outputFormat=application%2Fjson&srsname=EPSG:4326&CQL_FILTER=code_distrito='${districtId}'`;
          const response = await fetch(url);
          const data = await response.json();

          setGeojsonData(data);
          const firstFeatureCoordinates = getFirstFeatureCoordinates(data.features);
          if (firstFeatureCoordinates) {
            setMapCenter(firstFeatureCoordinates);
          }
          setIdType('municipios');
          setZoom(10);
          setMinZoom(7);

        }
      } catch (error) {
        console.error('Error fetching GeoJSON data:', error);
      }
    };

    fetchGeojsonData();
  }, [districtId]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(mapCenter, Zoom, minZoom);

    }
  }, [mapCenter, Zoom, minZoom]);


  useEffect(() => {
    if (geoJsonRef.current && geojsonData) {
      geoJsonRef.current.clearLayers();
      L.geoJSON(geojsonData, {
        style: geoJSONStyle,
        onEachFeature: onEachFeature
      }).addTo(geoJsonRef.current);
    }
  }, [geojsonData,geoJSONStyle,slidersValues]);


  const goBackPoligon = () => {


    if (districtId.length > 2) {
      const newDistrictId = districtId.slice(0, -2);
      setDistrictId(newDistrictId);
    } else {
      if (districtId.length == 2 && districtId !== "0") {
        setSelectedDistrict("Portugal")
        setDistrictId("0");
      }
    }
  };


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





  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.dsg) {
      layer.on({
        mouseover: function (e) {
          const districtName = feature.properties.dsg;
          const tooltip = L.tooltip({ direction: 'center', class: 'custom-tooltip' }).setContent(districtName);
          this.bindTooltip(tooltip).openTooltip();
         
        },
        mouseout: function (e) {
          this.unbindTooltip();
          const originalStyle = geoJSONStyle(feature);
        },
        click: function (e) {
          handleDistrictClick(e);
        }
      });
    }
  };


  const gotothirdpage = () =>{
   
    navigate('/metricspage', {state: {selectedDistrict,districtId,IdType,scores,slidersValues,sliderValuesCruz} })
}

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

  const sliderValue = sliderValuesCruz[id];

  if (sliderValue !== undefined) {
      value = sliderValue;
  }
  

  

  const metric = metricsMapping[key]; 
  
  data[key] = value;
});
  
  console.log(data);


  
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


const [openModalMap, setOpenModalMap] = useState(false);

const handleOpenModalMap = () => {
  setOpenModalMap(true);
};



const handleCloseModal = () => {
  setOpenPreferencesModal(false);
  setCameFromBack(false);
};

const handleKeepMetrics = async () => {

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
        setOpenPreferencesModal(false);
     
    } else {
      console.error('Failed to fetch preferences data');
    }
  } catch (error) {
    console.error('Error fetching preferences data:', error);
  }
};





  return (
    <div className={`SearchPage ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {!showQuestions ? (
        <div className="left-store">
          <div className='search-filters'>
            <div className="static-text">
              <div className="static-text-container">
                <h1>{selectedDistrict}</h1>
              </div>
              <p>{t('label_metric')} </p>
            </div>
            <div className="label-scroll-container">
              <div className="label-slider-container-first">
                <label className="label_metric" htmlFor="commerce-slider">{t('commerce')}</label>
                <div className="slider-minmax">
                  <div className='tool'>
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
                      {averageMetrics && (
                    <div className="average-line" style={{ left: `${averageMetrics.averages['theme_commerce']}%` }}></div>
                      )}
                    </Box>
                  </div>
                  <div className="min-max-text">
                    <span>{t('nothing')}</span>
                    <span>{t('very_Important')}</span>
                  </div>

                </div>
              </div>

              <div className="label-slider-container">
                <label className="label_metric" htmlFor="social_leisure-slider">{t('social_leisure')}</label>
                <div className="slider-minmax">
                  <div className='tool'>
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
                      {averageMetrics && (
                      <div className="average-line" style={{ left: `${averageMetrics.averages['theme_social_leisure']}%` }}></div>
                      )}
                    </Box>
                  </div>
                  <div className="min-max-text">
                    <span>{t('nothing')}</span>
                    <span>{t('very_Important')}</span>
                  </div>
                </div>
              </div>
              <div className="label-slider-container">
                <label className="label_metric" htmlFor="health-slider">{t('Health')}</label>
                <div className="slider-minmax">
                  <div className='tool'>
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
                      {averageMetrics && (
                    <div className="average-line" style={{ left: `${averageMetrics.averages['theme_health']}%` }}></div>
                      )}
                    </Box>
                  </div>
                  <div className="min-max-text">
                    <span>{t('nothing')}</span>
                    <span>{t('very_Important')}</span>
                  </div>
                </div>
              </div>
              <div className="label-slider-container">
                <label className="label_metric" htmlFor="nature_sports-slider">{t('nature_sports')}</label>
                <div className="slider-minmax">
                  <div className='tool'>
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
                      {averageMetrics && (
                       <div className="average-line" style={{ left: `${averageMetrics.averages['theme_nature_sports']}%` }}></div>
                      )}
                       </Box>
                  </div>
                  <div className="min-max-text">
                    <span>{t('nothing')}</span>
                    <span>{t('very_Important')}</span>
                  </div>
                </div>
              </div>
              <div className="label-slider-container">
                <label className="label_metric" htmlFor="service-slider">{t('services')}</label>
                <div className="slider-minmax">
                  <div className='tool'>
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
                      {averageMetrics && (
                      <div className="average-line" style={{ left: `${averageMetrics.averages['theme_service']}%` }}></div>
                      )}
                      </Box>
                  </div>
                  <div className="min-max-text">
                    <span>{t('nothing')}</span>
                    <span>{t('very_Important')}</span>
                  </div>
                </div>
              </div>
              <div className="label-slider-container">
                <label className="label_metric" htmlFor="education-slider">{t('Education')}</label>
                <div className="slider-minmax">
                  <div className='tool'>
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
                      {averageMetrics && (
                      <div className="average-line" style={{ left: `${averageMetrics.averages['theme_education']}%` }}></div>
                      )}
                      </Box>
                  </div>
                  <div className="min-max-text">
                    <span>{t('nothing')}</span>
                    <span>{t('very_Important')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="button-container" style={{ position: 'relative' }}>
              <button className="button-small-round" onClick={handleSearchClick}>
                <span className="button-icon">{t('next')}</span>
              </button>
              <div style={{marginLeft:"5rem",height: '2rem',display: "flex", flexDirection: "row"}}>
                  
                  <div className='average-line'></div>
                    <p style={{marginLeft:"1rem",fontSize:"0.8rem"}}>{t('textoaverage')}</p>
                </div>
            </div>
          </div>
        </div>
      ) : (
        <Questions slidersValues={slidersValues} darkMode={darkMode} handlePreviousClick={handlePreviousClick}  gotoThirdPage={gotothirdpage} zoneData={zoneData} IdType={IdType} updateScores={updateScores} sliderValuesCruz={sliderValuesCruz} setSliderValuesCruz={setSliderValuesCruz}  sliderGroupings={sliderGroupings}  handleSavePreferences={ handleSavePreferences} metricsMapping={metricsMapping} averageMetrics={averageMetrics}/>
      )
      }


      <div className='right-container'>
        {mapCenter[0] !== null && mapCenter[1] !== null && (
          <MapContainer ref={mapRef} style={{ height: "100%", width: "100%" }}
            center={mapCenter}
            zoom={Zoom}
            minZoom={minZoom}
            maxBounds={portugalBounds}
            maxBoundsViscosity={1}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

            />

          

            {geojsonData && <GeoJSON ref={geoJsonRef} data={geojsonData} style={geoJSONStyle} onEachFeature={onEachFeature} />}
              <Button variant="contained" style={{ position: 'absolute', top: '10px', right: '20px', zIndex: "1000", backgroundColor: "var(--background-color)", color: "var(--blacktowhite)" }} onClick={goBackPoligon}>
              {t('zoomOut')}
              </Button>

              <Button variant="contained" style={{ position: 'absolute', bottom: '120px', right: '20px', zIndex: "1000", backgroundColor: "var(--background-color)", color: "var(--blacktowhite)", borderRadius:"20rem" }}  onClick={handleModalButtonClick}>
              ?
              </Button>

            {modalVisibleGradient && <div className="gradient-modal">
              <p>{t('better')}</p>
              <div className="gradient-vertical"></div>
              <p>{t('worse')}</p>
              </div>
              }
             

          </MapContainer>
        )}
      </div>
      {!camefromback && isAuthenticated &&  metricsSaved && OpenPreferencesModal && (
        <ModalW handleCloseModal={handleCloseModal} handleKeepMetrics={handleKeepMetrics}/>
      )}
    </div >
  );
}

export default QuizPage;
