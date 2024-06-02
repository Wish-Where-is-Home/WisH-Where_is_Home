import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faWalking, faBicycle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import mapboxgl from 'mapbox-gl';
import './TravelTimeCalculator.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiY3Jpc3RpYW5vbmljb2xhdSIsImEiOiJjbHZmZnFoaXUwN2R4MmlxbTdsdGlreDEyIn0.-vhnpIfDMVyW04ekPBhQlg';

const TravelTimeCalculator = ({ propertyLat, propertyLng }) => {
    const { t } = useTranslation("common");
    const [destinationAddress, setDestinationAddress] = useState('');
    const [travelMode, setTravelMode] = useState('driving'); // default to driving
    const [travelDetails, setTravelDetails] = useState({ time: null, distance: null });
    const [coordinates, setCoordinates] = useState(null);
    const mapContainer = useRef(null);
    const map = useRef(null);

    const fetchCoordinates = async (address) => {
        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`;
        try {
            const response = await fetch(geocodeUrl);
            const data = await response.json();
            if (data.features.length > 0) {
                return data.features[0].geometry.coordinates; // returns [longitude, latitude]
            }
            return null;
        } catch (error) {
            console.error('Geocoding failed:', error);
            return null;
        }
    };

    const fetchTravelDetails = async (mode) => {
        if (!coordinates) {
            console.error('No coordinates found for the given address.');
            return;
        }
        const [destinationLng, destinationLat] = coordinates;
        const url = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${propertyLng},${propertyLat};${destinationLng},${destinationLat}?access_token=${mapboxgl.accessToken}&overview=full&geometries=geojson`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            const route = data.routes[0]; // assuming the first route is the preferred one
            setTravelDetails({
                time: route.duration / 60, // convert seconds to minutes
                distance: route.distance / 1000 // convert meters to kilometers
            });

            // Update the map with the new route
            if (map.current) {
                map.current.getSource('route').setData(route.geometry);
                map.current.flyTo({
                    center: [(propertyLng + destinationLng) / 2, (propertyLat + destinationLat) / 2],
                    zoom: 12
                });
            }
        } catch (error) {
            console.error('Failed to fetch travel details:', error);
        }
    };

    const handleCalculateClick = async () => {
        const coords = await fetchCoordinates(destinationAddress);
        if (coords) {
            setCoordinates(coords);
            fetchTravelDetails(travelMode);
        }
    };

    useEffect(() => {
        if (coordinates) {
            fetchTravelDetails(travelMode);
        }
    }, [travelMode, coordinates]);

    useEffect(() => {
        if (map.current) return; // Initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [propertyLng, propertyLat],
            zoom: 12
        });

        map.current.on('load', () => {
            map.current.addSource('route', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: []
                    }
                }
            });

            map.current.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#888',
                    'line-width': 6
                }
            });
        });
    }, []);

    return (
        <div className="travel-time-calculator">
            <div className="input-group">
                <input
                    type="text"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    placeholder={t('enter_destination')}
                    className="destination-input"
                />
                <div className="mode-icons">
                    <button className={`mode-icon ${travelMode === 'driving' ? 'active' : ''}`} onClick={() => setTravelMode('driving')}>
                        <FontAwesomeIcon icon={faCar} />
                    </button>
                    <button className={`mode-icon ${travelMode === 'walking' ? 'active' : ''}`} onClick={() => setTravelMode('walking')}>
                        <FontAwesomeIcon icon={faWalking} />
                    </button>
                    <button className={`mode-icon ${travelMode === 'cycling' ? 'active' : ''}`} onClick={() => setTravelMode('cycling')}>
                        <FontAwesomeIcon icon={faBicycle} />
                    </button>
                </div>
            </div>
            <button className="calculate-button" onClick={handleCalculateClick}>{t('calculate')}</button>
            {travelDetails.time && (
                <div className="results">
                    <p className="distance-label">{t('distance_to_institution')} :</p>
                    <p className="travel-time">{Math.round(travelDetails.time)} min ({travelDetails.distance.toFixed(1)} km)</p>
                </div>
            )}
            <div ref={mapContainer} className="map-container" />
        </div>
    );
};

export default TravelTimeCalculator;
