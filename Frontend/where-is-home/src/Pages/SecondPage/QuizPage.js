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

import 'proj4leaflet';




function QuizPage({ darkMode, zoneData,scores,updateScores}) {
  
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

    }
  }, [location.state]);

  const sliderOptions = ['Not Important', 'Slightly Important', 'Moderate', 'Important', 'Very Important'];

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
            color: 'black',
            fillOpacity: 0.4
        };
    }
    console.log(districtId);

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
    console.log(sortedScores);
    const fillColor = calculateFillColor(sortedScores.findIndex(entry => entry[0] === id), totalColors);

    return {
        fillColor: fillColor,
        weight: 2,
        color: 'black',
        fillOpacity: 0.4
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
        },
        click: function (e) {
          handleDistrictClick(e);
        }
      });
    }
  };


  const gotothirdpage = () =>{
    navigate('/metricspage', {state: {districtId,IdType,scores,slidersValues,sliderValuesCruz} })
}


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
                  <div className="min-max-text">
                    <span>{t('nothing')}</span>
                    <span>{t('very_Important')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="button-container">
              <button className="button-small-round" onClick={handleSearchClick}>
                <span className="button-icon">{t('next')}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Questions slidersValues={slidersValues} darkMode={darkMode} handlePreviousClick={handlePreviousClick}  gotoThirdPage={gotothirdpage} zoneData={zoneData} IdType={IdType} updateScores={updateScores} sliderValuesCruz={sliderValuesCruz} setSliderValuesCruz={setSliderValuesCruz}  sliderGroupings={sliderGroupings}/>
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
              {t('back')}
            </Button>

          </MapContainer>
        )}
      </div>
    </div >
  );
}

export default QuizPage;
