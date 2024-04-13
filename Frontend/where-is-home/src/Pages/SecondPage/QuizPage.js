import React, {  useRef,useEffect,useState} from 'react';
import { useLocation } from 'react-router-dom';
import 'toolcool-range-slider';
import { useTranslation } from "react-i18next";
import './QuizPage.css';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON,Tooltip } from 'react-leaflet';
import L from 'leaflet';
import Button from '@mui/material/Button';

import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

import 'proj4leaflet';




function QuizPage({ darkMode }) {
  const { t } = useTranslation("common");
  const location = useLocation();
  const [geojsonData, setGeojsonData] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [mapCenter, setMapCenter] = useState([null, null]);
  const [Zoom, setZoom] = useState(null);
  const [minZoom, setMinZoom] = useState(null);
 

  const portugalBounds = [
    [36.9, -9.5], 
    [42.2, -6.5]  
  ];

  const mapRef = useRef(null);
  const geoJsonRef = useRef(null);

  useEffect(() => {
    if (location.state) {
      setSelectedDistrict(location.state.selectedDistrict.replace(/_/g, ' '));
      setDistrictId(location.state.districtId);
      
    }
  }, [location.state]);

  const sliderOptions = ['Not Important', 'Slightly Important', 'Moderate', 'Important', 'Very Important'];
  const [sliderValues, setSliderValues] = useState([
    { id: 0, value: 0 },
    { id: 1, value: 0 },
    { id: 2, value: 0 },
    { id: 3, value: 0 },
    { id: 4, value: 0 },
    { id: 5, value: 0 }
    
  ]);

  const onSliderChange = (value, id) => {
    console.log('Slider value:', value);
    const updatedValues = sliderValues.map(slider => {
      if (slider.id === id) {
        console.log('ENTREI:', id);
        return { ...slider, value: value / 100 };
      } else {
        return slider;
      }
    });
    setSliderValues(updatedValues);
    console.log("Slider values:", updatedValues);
  };



  const handlePreviousClick = () => {
    console.log('Previous button clicked');
  };

  const handleSearchClick = () => {
    console.log('Search button clicked');
   
  };

  
  const geoJSONStyle = (feature) => {
    if (!feature) return {}; 
  
    const id = feature.id.split('.')[1]; 
    const fillColor = id % 2 === 0 ? 'green' : 'red';
  
    return {
      color: 'black', 
      weight: 3,
      fillColor: fillColor,
      fillOpacity: 0.5
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
    const firstCoordinates = firstFeature.geometry.coordinates[0][0];
    const correctedCoordinates = [firstCoordinates[1], firstCoordinates[0]];
 
    return correctedCoordinates;
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
          
          setMapCenter([39.6686,-8.1332]);
          setZoom(7);
          setMinZoom(7);

        }else if (districtId.length === 4){
          const url = `http://mednat.ieeta.pt:9009/geoserver/wish/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=wish%3Afreguesias&outputFormat=application%2Fjson&srsname=EPSG:4326&CQL_FILTER=code_municipio='${districtId}'`;
          const response = await fetch(url);
          const data = await response.json();
         
          setGeojsonData(data);
          const firstFeatureCoordinates = getFirstFeatureCoordinates(data.features);
          if (firstFeatureCoordinates) {
            setMapCenter(firstFeatureCoordinates);
          }
          setZoom(12);
          
      
        }else if (districtId.length === 6){
            const url = `http://mednat.ieeta.pt:9009/geoserver/wish/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=wish%3Asubseccao&outputFormat=application%2Fjson&CQL_FILTER=code_freguesia='${districtId}'`;
            const response = await fetch(url);
            const data = await response.json(); 
           
            setGeojsonData(data);
            const centerCoordinates = calculateCenterOfFeatures(data.features);

            if (centerCoordinates){
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
      mapRef.current.setView(mapCenter,Zoom,minZoom);
      
    }
  }, [mapCenter, Zoom,minZoom]);


  useEffect(() => {
    if (geoJsonRef.current && geojsonData) {
      geoJsonRef.current.clearLayers();
      L.geoJSON(geojsonData, {
        style: geoJSONStyle,
        onEachFeature: onEachFeature
      }).addTo(geoJsonRef.current);
    }
  }, [geojsonData]);


  const goBackPoligon = () => {
   

    if (districtId.length > 2) {
      const newDistrictId = districtId.slice(0, -2);
      setDistrictId(newDistrictId);
    }else{
      if (districtId.length==2 && districtId!=="0" ){
        setSelectedDistrict("Portugal")
        setDistrictId("0");
      }
    }
  };

 
  

  useEffect(() => {
    const sliders = document.querySelectorAll('toolcool-range-slider');

    sliders.forEach(slider => {
      slider.addEventListener('change', onSliderChange);
    });

    return () => {
      sliders.forEach(slider => {
        slider.removeEventListener('change', onSliderChange);
      });
    };
  }, []);


  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.dsg) {
      layer.on({
        mouseover: function (e) {
          const districtName = feature.properties.dsg; 
          const tooltip = L.tooltip({ direction: 'center',class: 'custom-tooltip' }).setContent(districtName);
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
  

  return (
    <div className={`SearchPage ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="left-store">
            <div className='search-filters'>
                <div className="static-text">
                    <div className="static-text-container">
                        <h1>{selectedDistrict}</h1>
                    </div>
                    <p>What are you looking for? </p>
                </div>
                <div className="label-scroll-container">
                    <div className="label-slider-container-first">
                        <label className="label_metric" htmlFor="commerce-slider">{t('Commerce')}</label>
                        <div className="slider-minmax">
                            <div className='tool'>
                                <Box sx={{ width: 300 }}>
                                <Slider
                                    aria-label="Importance"
                                    defaultValue={0}
                                    valueLabelDisplay="auto"
                                    step={25}
                                    id= "commerce"
                                    marks
                                    min={0}
                                    max={100}
                                    valueLabelFormat={(value) => {
                                        switch (value) {
                                        case 0:
                                            return 'Not Important';
                                        case 25:
                                            return 'Slightly Important';
                                        case 50:
                                            return 'Moderate';
                                        case 75:
                                            return 'Important';
                                        case 100:
                                            return 'Very Important';
                                        default:
                                            return '';
                                        }
                                    }}
                                    onChange={(event, value) => onSliderChange(value, 0)}
                                    
                                    />

                                </Box>
                            </div>
                            <div className="min-max-text">
                                <span>Nothing</span>
                                <span>Very Important</span>
                            </div>
                            
                        </div>
                    </div>

                    <div className="label-slider-container">
                        <label className="label_metric" htmlFor="social_leisure-slider">{t('Social leisure')}</label>
                        <div className="slider-minmax">
                            <div className='tool'>
                                <Box sx={{ width: 300 }}>
                                    <Slider
                                        aria-label="Importance"
                                        defaultValue={0}
                                        valueLabelDisplay="auto"
                                        step={25}
                                        id= "social_leisure"
                                        marks
                                        min={0}
                                        max={100}
                                        valueLabelFormat={(value) => {
                                            switch (value) {
                                            case 0:
                                                return 'Not Important';
                                            case 25:
                                                return 'Slightly Important';
                                            case 50:
                                                return 'Moderate';
                                            case 75:
                                                return 'Important';
                                            case 100:
                                                return 'Very Important';
                                            default:
                                                return '';
                                            }
                                        }}
                                        onChange={(event, value) => onSliderChange(value, 1)}
                                        
                                    />

                                </Box>
                            </div>
                            <div className="min-max-text">
                                <span>Nothing</span>
                                <span>Very Important</span>
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
                                            defaultValue={0}
                                            valueLabelDisplay="auto"
                                            step={25}
                                            id= "health"
                                            marks
                                            min={0}
                                            max={100}
                                            valueLabelFormat={(value) => {
                                                switch (value) {
                                                case 0:
                                                    return 'Not Important';
                                                case 25:
                                                    return 'Slightly Important';
                                                case 50:
                                                    return 'Moderate';
                                                case 75:
                                                    return 'Important';
                                                case 100:
                                                    return 'Very Important';
                                                default:
                                                    return '';
                                                }
                                            }}
                                            onChange={(event, value) => onSliderChange(value, 2)}
                                            
                                        />

                                    </Box>
                            </div>
                            <div className="min-max-text">
                                <span>Nothing</span>
                                <span>Very Important</span>
                            </div>
                        </div>
                    </div>
                    <div className="label-slider-container">
                        <label className="label_metric" htmlFor="nature_sports-slider">{t('Nature sports')}</label>
                        <div className="slider-minmax">
                            <div className='tool'>
                                <Box sx={{ width: 300 }}>
                                    <Slider
                                        aria-label="Importance"
                                        defaultValue={0}
                                        valueLabelDisplay="auto"
                                        step={25}
                                        id= "nature_sports"
                                        marks
                                        min={0}
                                        max={100}
                                        valueLabelFormat={(value) => {
                                            switch (value) {
                                            case 0:
                                                return 'Not Important';
                                            case 25:
                                                return 'Slightly Important';
                                            case 50:
                                                return 'Moderate';
                                            case 75:
                                                return 'Important';
                                            case 100:
                                                return 'Very Important';
                                            default:
                                                return '';
                                            }
                                        }}
                                        onChange={(event, value) => onSliderChange(value, 3)}
                                        
                                    />

                                </Box>
                            </div>
                            <div className="min-max-text">
                                <span>Nothing</span>
                                <span>Very Important</span>
                            </div>
                        </div>
                    </div>
                    <div className="label-slider-container">
                        <label className="label_metric" htmlFor="service-slider">{t('Service')}</label>
                        <div className="slider-minmax">
                            <div className='tool'>
                                <Box sx={{ width: 300 }}>
                                    <Slider
                                        aria-label="Importance"
                                        defaultValue={0}
                                        valueLabelDisplay="auto"
                                        step={25}
                                        id= "service"
                                        marks
                                        min={0}
                                        max={100}
                                        valueLabelFormat={(value) => {
                                            switch (value) {
                                            case 0:
                                                return 'Not Important';
                                            case 25:
                                                return 'Slightly Important';
                                            case 50:
                                                return 'Moderate';
                                            case 75:
                                                return 'Important';
                                            case 100:
                                                return 'Very Important';
                                            default:
                                                return '';
                                            }
                                        }}
                                        onChange={(event, value) => onSliderChange(value, 4)}
                                        
                                    />

                                </Box>
                            </div>
                            <div className="min-max-text">
                                <span>Nothing</span>
                                <span>Very Important</span>
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
                                        defaultValue={0}
                                        valueLabelDisplay="auto"
                                        step={25}
                                        id= "education"
                                        marks
                                        min={0}
                                        max={100}
                                        valueLabelFormat={(value) => {
                                            switch (value) {
                                            case 0:
                                                return 'Not Important';
                                            case 25:
                                                return 'Slightly Important';
                                            case 50:
                                                return 'Moderate';
                                            case 75:
                                                return 'Important';
                                            case 100:
                                                return 'Very Important';
                                            default:
                                                return '';
                                            }
                                        }}
                                        onChange={(event, value) => onSliderChange(value, 5)}
                                        
                                    />

                                </Box>
                            </div>
                            <div className="min-max-text">
                                <span>Nothing</span>
                                <span>Very Important</span>
                            </div>
                        </div>
                    </div>
                </div>    
                <div className="button-container">
                    <button className="button-small-round" onClick={handleSearchClick}>
                        <span className="button-icon">Search 🔍</span> 
                    </button>
                </div>
            </div>

        </div>
        <div className='right-container'>
        {mapCenter[0] !== null && mapCenter[1] !== null && (
          <MapContainer  ref={mapRef}  style={{ height: "100%", width: "100%" }} 
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
                  
                  {geojsonData && <GeoJSON ref={geoJsonRef} data={geojsonData}  style={geoJSONStyle}  onEachFeature={onEachFeature}  />}
                  <Button variant="contained" style={{ position: 'absolute', top: '10px', right: '20px',zIndex: "1000",  backgroundColor: "var(--background-color)",color:"var(--blacktowhite)"}} onClick={goBackPoligon}>
                    Back
                  </Button>
                  
              </MapContainer>
        )}
        </div>    
    </div>
  );
}

export default QuizPage;
