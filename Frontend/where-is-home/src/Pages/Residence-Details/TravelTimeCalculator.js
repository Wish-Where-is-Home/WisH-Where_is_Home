import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faWalking, faBicycle } from '@fortawesome/free-solid-svg-icons';
import './TravelTimeCalculator.css';

const TravelTimeCalculator = ({ propertyLat, propertyLng }) => {
    const [destinationAddress, setDestinationAddress] = useState('');
    const [travelMode, setTravelMode] = useState('driving'); // default to driving
    const [travelDetails, setTravelDetails] = useState({ time: null, distance: null });

    const fetchCoordinates = async (address) => {
        const accessToken = "pk.eyJ1IjoiY3Jpc3RpYW5vbmljb2xhdSIsImEiOiJjbHZmZnFoaXUwN2R4MmlxbTdsdGlreDEyIn0.-vhnpIfDMVyW04ekPBhQlg";
        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${accessToken}`;
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

    const fetchTravelDetails = async () => {
        const coordinates = await fetchCoordinates(destinationAddress);
        if (!coordinates) {
            console.error('No coordinates found for the given address.');
            return;
        }
        const [destinationLng, destinationLat] = coordinates;
        const accessToken = "pk.eyJ1IjoiY3Jpc3RpYW5vbmljb2xhdSIsImEiOiJjbHZmZnFoaXUwN2R4MmlxbTdsdGlreDEyIn0.-vhnpIfDMVyW04ekPBhQlg";
        const url = `https://api.mapbox.com/directions/v5/mapbox/${travelMode}/${propertyLng},${propertyLat};${destinationLng},${destinationLat}?access_token=${accessToken}&overview=full`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            const route = data.routes[0]; // assuming the first route is the preferred one
            setTravelDetails({
                time: route.duration / 60, // convert seconds to minutes
                distance: route.distance / 1000 // convert meters to kilometers
            });
        } catch (error) {
            console.error('Failed to fetch travel details:', error);
        }
    };

    return (
        <div className="travel-time-calculator">
            <div className="input-group">
                <input
                    type="text"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    placeholder="Enter destination address"
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
            <button className="calculate-button" onClick={fetchTravelDetails}>Calculate</button>
            {travelDetails.time && (
                <div className="results">
                    <p className="travel-time">{Math.round(travelDetails.time)} min ({travelDetails.distance.toFixed(1)} km)</p>
                    <p className="distance-label">Distance to institution</p>
                </div>
            )}
        </div>
    );
};

export default TravelTimeCalculator;