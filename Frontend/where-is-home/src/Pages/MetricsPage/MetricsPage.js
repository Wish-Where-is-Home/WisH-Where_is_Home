import React, { useState, useEffect,useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './MetricsPage.css';
import {useTranslation} from "react-i18next";
import Properties from '../../Components/Properties/Sidebar';
import Metrics from '../../Components/Metrics/Metrics';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer,GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import Button from '@mui/material/Button';

function MetricsPage(zoneData,updateScores) {
    const {t} = useTranslation("common");
    const location = useLocation();
    const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
    const [isMetricsOpen, setIsMetricsOpen] = useState(false);
    const [geojsonData, setGeojsonData] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [districtId, setDistrictId] = useState('');
    const [IdType,setIdType] =useState('');
    const [mapCenter, setMapCenter] = useState([null, null]);
    const [Zoom, setZoom] = useState(null);
    const [minZoom, setMinZoom] = useState(null);
    const [zoomButtonPosition, setZoomButtonPosition] = useState('10px');
    const [zoom2buttonPosition,setZoom2ButtonPosition] = useState('10px');
    const [scores,setScores] = useState(null);

    const mapRef = useRef(null);
    const geoJsonRef = useRef(null);


  useEffect(() => {
    if (location.state && location.state.districtId && location.state.IdType) {
        setDistrictId(location.state.districtId);
        setIdType(location.state.IdType); 
        setScores(location.state.scores);
    }
}, [location.state]);

const zone = IdType;

// useEffect(() => {
//   function calculateScores(zoneData, sliderValuesThemesupdated, sliderValuesMetricsupdated, zoneType) {
//       if (zoneData !== null) {
//           const scores = {};
//           const data = zoneData;
//           const sliderValuesMetrics = sliderValuesMetricsupdated;  
//           const sliderValuesThemes = sliderValuesThemesupdated;

//           const metricsMapping = {
//               'sports_center': { id: 1, theme: 3 },
//               'commerce': { id: 2, theme: 0 },
//               'bakery': { id: 3, theme: 0 },
//               'food_court': { id: 4, theme: 0 },
//               'nightlife': { id: 5, theme: 1 },
//               'camping': { id: 6, theme: 3 },
//               'health_services': { id: 7, theme: 2 },
//               'hotel': { id: 8, theme: 1 },
//               'supermarket': { id: 9, theme: 0 },
//               'culture': { id: 10, theme: 1 },
//               'school': { id: 11, theme: 5 },
//               'library': { id: 12, theme: 5 },
//               'parks': { id: 13, theme: 3 },
//               'services': { id: 14, theme: 4 },
//               'kindergarten': { id: 15, theme: 5 },
//               'university': { id: 16, theme: 5 },
//               'entretainment': { id: 17, theme: 1 },
//               'pharmacy': { id: 18, theme: 2 },
//               'swimming_pool': { id: 19, theme: 3 },
//               'bank': { id: 20, theme: 4 },
//               'post_office': { id: 21, theme: 4 },
//               'hospital': { id: 22, theme: 2 },
//               'clinic': { id: 23, theme: 2 },
//               'veterinary': { id: 24, theme: 2 },
//               'beach_river': { id: 25, theme: 3 },
//               'industrial_zone': { id: 26, theme: 3 },
//               'bicycle_path': { id: 27, theme: 3 },
//               'walking_routes': { id: 28, theme: 3 },
//               'car_park': { id: 29, theme: 4 }
//           };

//           if (typeof sliderValuesThemes === 'object' && sliderValuesThemes !== null) {
//               for (const id in data[zoneType]) {
//                   if (data[zoneType].hasOwnProperty(id)) {
//                       const modifiedMetrics = {};

//                       for (const metric in data[zoneType][id]) {
//                           if (data[zoneType][id].hasOwnProperty(metric)) {
//                               const metricsMappingEntry = metricsMapping[metric];
//                               if (metricsMappingEntry) {
//                                   const SliderValueMetrics = sliderValuesMetrics[metricsMappingEntry.id];
//                                   if (SliderValueMetrics) {
//                                       const metricScore = parseFloat(data[zoneType][id][metric]) * SliderValueMetrics;
//                                       modifiedMetrics[metric] = metricScore;
//                                   }
//                               } else {
//                                   console.error(`Metrics mapping entry not found for metric ${metric}.`);
//                               }
//                           }
//                       }
                      

//                       let score = 0;
//                       for (const metric in modifiedMetrics) {
//                           if (modifiedMetrics.hasOwnProperty(metric)) {
//                               score += modifiedMetrics[metric];
//                               const themeId = metricsMapping[metric].theme;
//                               const SliderValueTheme = sliderValuesThemes[themeId];
//                               scores[id] = score * SliderValueTheme.value;
//                           }
//                       }
//                   }
//               }

//               console.log("scores2", scores);
//               return scores;
//           } else {
//               console.error("sliderValuesThemes is not an array.");
//               return null;
//           }
//       }
//   }

 
  
//   const calculatedScores=calculateScores(zoneData, slidersValues, sliderValues, zone);
//   updateScores(calculatedScores);
// }, [slidersValues, sliderValues,IdType]);



  const portugalBounds = [
    [36, -10],
    [43, -6]
  ];

    const toggleProperties = () => {
        setIsPropertiesOpen(!isPropertiesOpen);
        setIsMetricsOpen(false); 
        setZoomButtonPosition(isPropertiesOpen ? '10px' : '35%'); 
    };

    const toggleMetrics = () => {
        setIsMetricsOpen(!isMetricsOpen);
        setIsPropertiesOpen(false); 
        setZoom2ButtonPosition(isMetricsOpen ? '10px' : '30%');
        if (zoomButtonPosition==='35%'){
          setZoomButtonPosition('10px');
        }
        
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
  
      if (centerX === null && centerY === null){
        centerX=39.6686;
        centerY=-8.1332;
      }
    
      return [centerY, centerX]; 
    };


  const calculateFillColor = (score, minScore, maxScore) => {
    const minColor = [255, 0, 0]; 
    const midColor = [255, 255, 0]; 
    const maxColor = [0, 255, 0]; 

    if (score === maxScore) {
        return `rgb(${maxColor[0]}, ${maxColor[1]}, ${maxColor[2]})`;
    }

    let color;
    if (score <= (minScore + maxScore) / 3) {
        const proportion = (score - minScore) / ((minScore + maxScore) / 2 - minScore);
        color = minColor.map((channel, i) =>
            Math.round(channel + proportion * (midColor[i] - channel))
        );
    } else {
        const proportion = (score - (minScore + maxScore) / 2) / ((maxScore - minScore) / 2);
        color = midColor.map((channel, i) =>
            Math.round(channel + proportion * (maxColor[i] - channel))
        );
    }

    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
};

const geoJSONStyle = (feature) => {
    if (!feature) return {};




    if (scores === null || scores === undefined) {
        return {
            fillColor: 'transparent',
            weight: 2,
            color: 'black',
            fillOpacity: 0.4
        };
     }


    const filteredScores = {}; 
    if (districtId > 2){
        for (const key in scores) {
          if (key.startsWith(districtId)) {
              filteredScores[key] = scores[key];
          }
      }
    }else{
      for (const key in scores) {
            filteredScores[key] = scores[key];
      }
    }
  
   console.log(filteredScores);

    let minScore = Infinity;
    let maxScore = -Infinity;
    for (const id in scores) {
        const score = filteredScores[id];
        if (score < minScore) minScore = score;
        if (score > maxScore) maxScore = score;
    }

    const id = feature.id.split('.')[1];
    const score = scores[id] || 0;

  
    const fillColor = calculateFillColor(score, minScore, maxScore);

    return {
        fillColor: fillColor,
        weight: 2,
        color: 'black',
        fillOpacity: 0.4
    };
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
  }, [geojsonData,geoJSONStyle]);

  
  
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
        <div className="metrics-page-container">
             <Properties isOpen={isPropertiesOpen} toggleSidebar={toggleProperties} />
            
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
                        <Button variant="contained" style={{ position: 'absolute', top: '10px', right: zoomButtonPosition,zIndex: "400",  backgroundColor: "var(--background-color)",color:"var(--blacktowhite)"}} onClick={goBackPoligon}>
                          Back
                        </Button>
                        
                    </MapContainer>
              )}
            <Metrics isOpen={isMetricsOpen} toggleSidebar={toggleMetrics} />
        </div>
    );
}

export default MetricsPage;
