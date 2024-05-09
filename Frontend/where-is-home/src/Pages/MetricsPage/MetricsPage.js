import React, { useState, useEffect,useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './MetricsPage.css';
import {useTranslation} from "react-i18next";
import Properties from '../../Components/Properties/Sidebar';
import Metrics from '../../Components/Metrics/Metrics';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer,GeoJSON } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext/AuthContext';
import L from 'leaflet';
import Button from '@mui/material/Button';
import { use } from 'i18next';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { icon } from 'leaflet';


function MetricsPage({darkMode,zoneData,scores,updateScores}) {
    const { isAuthenticated} = useAuth();
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
    const [slidersValues,setSlidersValues] = useState(null);
    const [sliderValuesCruz,setSliderValuesCruz] = useState(null);
    const [modalVisibleGradient, setModalVisibleGradient] = useState(false);
    const [averageMetrics,setAverageMetrics] = useState(false);

    const navigate = useNavigate();
    const mapRef = useRef(null);
    const geoJsonRef = useRef(null);
    const [properties, setProperties] = useState([]);



  useEffect(() =>{
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

  },[])


const handleModalButtonClick = () => {
  setModalVisibleGradient(!modalVisibleGradient);
};


  useEffect(() => {
    if (location.state && location.state.districtId && location.state.IdType) {
        setDistrictId(location.state.districtId);
        setIdType(location.state.IdType); 
        setSlidersValues(location.state.slidersValues);
        setSliderValuesCruz(location.state.sliderValuesCruz);
        setSelectedDistrict(location.state.selectedDistrict);
    }
}, [location.state]);

const zone = IdType;



  const portugalBounds = [
    [34, -12],
    [45, -6]
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


    const calculateFillColor = (index, totalColors) => {
      const green = [0, 255, 0];
      const yellow = [255, 255, 0];
      const orange = [255, 165, 0];
      const red = [255, 0, 0];
  
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
      if (!feature || !scores) {
          return {
              fillColor: 'transparent',
              weight: 2,
              color: darkMode ? 'white' : 'black',
              fillOpacity: 0.4
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
      const score = scores[id] || 0;
  
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


      function handleGoBackPage() {
        const camefromback=true;
        navigate('/quiz', {state: {selectedDistrict,districtId,IdType,scores,slidersValues,sliderValuesCruz,camefromback} })
    }


    

    const fetchRooms = (properties) => {
      const token = localStorage.getItem('token');
     
          if (properties.length > 0) {
              Promise.all(properties.map(property => {
                  return fetch(`http://mednat.ieeta.pt:9009/properties/${property.id}/`, {
                      method: 'GET',
                      
                  })
                  .then(response => {
                      if (!response.ok) {
                          throw new Error('Falha ao obter dados da propriedade');
                      }
                      return response.json();
                  })
                  .then(data => {
                      const precos = data.quartos.map(quarto => parseFloat(quarto.preco_mes));
                      const menorPreco = Math.min(...precos);
                      const maiorPreco = Math.max(...precos);
                      const intervaloPreco = `${menorPreco}-${maiorPreco}`;
  
                     
                      property.intervaloPreco = intervaloPreco;
                      return property;
                  });
              }))
              .then(updatedProperties => {
                 
                  setProperties(updatedProperties);

              })
              .catch(error => {
                  console.error(error);
              });
          }
      
  };

  function findSubsectionForProperty(property, subSections) {
    const [lat, lng] = property.geom; 
   
    for (const subSection of subSections.features) {
        const [minLng, minLat, maxLng, maxLat] = subSection.bbox; // Obtém os limites do bbox da subseção
       
       
        if (lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat) {
            return subSection; 
        }
    }

    return null; 
}

// marker.bindPopup(`<b>${item.property.nome}</b>`).openPopup();
const addMarkers = (sortedProperties) => {
  const revertBackground = () => {
    const allImovelElements = document.querySelectorAll('.imovel');
    allImovelElements.forEach(element => {
      element.style.backgroundColor = 'var(--background-color3)';
    });
  };
  
  // Configurar um intervalo para chamar a função revertBackground a cada segundo (1000 milissegundos)
  

  sortedProperties.forEach(item => {
    const [lng, lat] = item.property.geom; 
    const customIcon = icon({
      iconUrl: markerIcon,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34] 
    });
    const marker = L.marker([lng, lat], { icon: customIcon }).addTo(mapRef.current); 

    marker.on('mouseover', function (e) {
      const tooltip = L.tooltip({ direction: 'center', class: 'custom-tooltip' }).setContent(item.property.nome);
      this.bindTooltip(tooltip).openTooltip();
    });
    
    
    
    marker.on('click', function () {
      console.log("CLIQUEI: ", item.property.id);
      const clickedPropertyId = item.property.id;

      const sidebarItem = document.getElementById(`property-${clickedPropertyId}`);
      if (sidebarItem) {
        console.log("ENTREI NO SCROLL")
        sidebarItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      const imovelElement = document.getElementById(`imovel-${clickedPropertyId}`);
      if (imovelElement) {
        imovelElement.style.backgroundColor = 'var(--background-color4)';
        // Add event listener to revert background color
        setTimeout(revertBackground, 1500);
      }

    });
  });
};


useEffect(() => {
    const token = localStorage.getItem('token');
    
    fetch('http://mednat.ieeta.pt:9009/properties/aproved/', {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return response.json();
    })
    .then(data => {
      console.log(scores);
      console.log(geojsonData);
        if (geojsonData && geojsonData.bbox && geojsonData.bbox.length === 4) {
            const [minLng, minLat, maxLng, maxLat] = geojsonData.bbox;
            const filteredProperties = data.properties.filter(property => {
                const [lat, lng] = property.geom;
                return lng >= minLng && lng <= maxLng &&
                       lat >= minLat && lat <= maxLat;
            });

           
            const propertiesWithScores = filteredProperties.map(property => {
                const subSection = findSubsectionForProperty(property, geojsonData); 
               
                const sectionId = subSection ? subSection.id.split('.')[1] : null;
                
               
                const score =scores[sectionId] || 0;
                console.log(sectionId);

               
                return { property, score };
            });

            const sortedProperties = propertiesWithScores.sort((a, b) => b.score - a.score);

            console.log(sortedProperties);

            setProperties(sortedProperties.map(item => item.property)); 
            fetchRooms(sortedProperties.map(item => item.property)); 

            mapRef.current.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    mapRef.current.removeLayer(layer);
                }
            });

            addMarkers(sortedProperties);

            
            
        } else {
            console.error("GeojsonData or its bbox is not available or not properly defined");
        }
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
}, [geojsonData,scores]);


    return (
        <div className="metrics-page-container">
             <Properties  darkMode={darkMode} isOpen={isPropertiesOpen} toggleSidebar={toggleProperties} properties={properties} />
            
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
                          {t('zoomOut')}
                        </Button>
                        <Button variant="contained" style={{ position: 'absolute', bottom: '120px', right: '20px', zIndex: "1000", backgroundColor: "var(--background-color)", color: "var(--blacktowhite)", borderRadius:"20rem" }}  onClick={handleModalButtonClick}>
                          ?
                          </Button>

                        {modalVisibleGradient && <div className="gradient-modal2">
                          <p>{t('better')}</p>
                          <div className="gradient-vertical"></div>
                          <p>{t('worse')}</p>
                          </div>
                          }
                        
                    </MapContainer>
              )}
            {(slidersValues !== null && sliderValuesCruz !== null) && (
            <Metrics isOpen={isMetricsOpen} toggleSidebar={toggleMetrics} darkMode={darkMode} zone={zone} zoneData={zoneData} slidersValues={slidersValues} sliderValuesCruz={sliderValuesCruz} updateScores={updateScores} setSliderValuesCruz={setSliderValuesCruz} handleGoBackPage={handleGoBackPage} averageMetrics={averageMetrics}/>
          )}
        </div>
    );
}

export default MetricsPage;
