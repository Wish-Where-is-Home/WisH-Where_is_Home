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

function MetricsPage() {
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

    const mapRef = useRef(null);
  const geoJsonRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.districtId && location.state.IdType) {
        setDistrictId(location.state.districtId);
        setIdType(location.state.IdType); 
    }
}, [location.state]);


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
