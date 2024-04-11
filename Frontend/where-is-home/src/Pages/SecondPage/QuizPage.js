import React, { useRef, useEffect,useState} from 'react';
import 'toolcool-range-slider';
import { useTranslation } from "react-i18next";
import './QuizPage.css';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';

function QuizPage({ darkMode }) {
  const { t } = useTranslation("common");
  const [geojsonData, setGeojsonData] = useState(null);

 

  const onSliderChange = (event) => {
    const value = Math.round(event.detail.value);
    console.log(`${event.target.name} value: ${value}`);
    // possible to update the state or context with the new value as needed
  };

  const handlePreviousClick = () => {
    // Logic to handle the previous button click
    console.log('Previous button clicked');
    // Potentially navigate to a previous page or step in your application
  };

  const handleSearchClick = () => {
    // Logic to handle the search button click
    console.log('Search button clicked');
   
  };

  useEffect(() => {
    
    const fetchWfsData = async () => {
      try {
        const response = await fetch('http://mednat.ieeta.pt:9009/geoserver/wish/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=wish%3Adistritos&maxFeatures=50&outputFormat=application%2Fjson');
        const data = await response.json();
        console.log(data);

        setGeojsonData(data);
      } catch (error) {
        console.error('Error fetching WFS data:', error);
      }
    };

    fetchWfsData();
  }, []);

 

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

  return (
    <div className={`SearchPage ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="left-store">
            <div className='search-filters'>
                <div className="static-text">
                    <p>Texto estático acima das labels</p>
                </div>
                <div className="label-scroll-container">
                    <div className="label-slider-container">
                        <label className="label_metric" htmlFor="commerce-slider">{t('Commerce')}</label>
                        <div className="slider-minmax">
                            <div className='tool'>
                                <toolcool-range-slider
                                    id="commerce-slider"
                                    name="commerce"
                                    min="0"
                                    max="100"
                                    value="50"
                                    theme="rect"
                                ></toolcool-range-slider>
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
                            <toolcool-range-slider
                            id="social_leisure-slider"
                            name="social_leisure"
                            min="0"
                            max="100"
                            value="50"
                            theme="rect"></toolcool-range-slider>
                            <div className="min-max-text">
                                <span>Nothing</span>
                                <span>Very Important</span>
                            </div>
                        </div>
                    </div>
                    <div className="label-slider-container">
                        <label className="label_metric" htmlFor="health-slider">{t('Health')}</label>
                        <div className="slider-minmax">
                            <toolcool-range-slider
                            id="health-slider"
                            name="health"
                            min="0"
                            max="100"
                            value="50"
                            theme="rect"></toolcool-range-slider>
                            <div className="min-max-text">
                                <span>Nothing</span>
                                <span>Very Important</span>
                            </div>
                        </div>
                    </div>
                    <div className="label-slider-container">
                        <label className="label_metric" htmlFor="nature_sports-slider">{t('Nature sports')}</label>
                        <div className="slider-minmax">
                            <toolcool-range-slider
                            id="nature_sports-slider"
                            name="nature_sports"
                            min="0"
                            max="100"
                            value="50"
                            theme="rect"></toolcool-range-slider>
                            <div className="min-max-text">
                                <span>Nothing</span>
                                <span>Very Important</span>
                            </div>
                        </div>
                    </div>
                    <div className="label-slider-container">
                        <label className="label_metric" htmlFor="service-slider">{t('Service')}</label>
                        <div className="slider-minmax">
                            <toolcool-range-slider
                            id="service-slider"
                            name="service"
                            min="0"
                            max="100"
                            value="50"
                            theme="rect"></toolcool-range-slider>
                            <div className="min-max-text">
                                <span>Nothing</span>
                                <span>Very Important</span>
                            </div>
                        </div>
                    </div>
                    <div className="label-slider-container">
                        <label className="label_metric" htmlFor="education-slider">{t('Education')}</label>
                        <div className="slider-minmax">
                            <toolcool-range-slider
                            id="education-slider"
                            name="education"
                            min="0"
                            max="100"
                            value="50"
                            theme="rect"></toolcool-range-slider>
                            <div className="min-max-text">
                                <span>Nothing</span>
                                <span>Very Important</span>
                            </div>
                        </div>
                    </div>
                </div>    
                <div className="button-container">
                    <button className="button-small-round" onClick={handlePreviousClick}>
                        <span className="button-icon">Previous</span> {/* Replace with actual icon */}
                    </button>
                    <button className="button-small-round" onClick={handleSearchClick}>
                        <span className="button-icon">Search🔍</span> {/* Replace with actual icon */}
                    </button>
                </div>
            </div>

        </div>
        <div className='right-container'>
          <MapContainer style={{ height: "100%", width: "100%" }} center={[42.505, -8.09]} zoom={5} scrollWheelZoom={false}>
                  <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      
                  />
                  {geojsonData && 
                 <GeoJSON data={geojsonData} />
                    }
              </MapContainer>
        </div>    
    </div>
  );
}

export default QuizPage;
