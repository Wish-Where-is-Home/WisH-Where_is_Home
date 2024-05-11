import React, { useEffect, useState } from 'react';
import './OwnerPage.css';
import PropertyDetails from '../../Components/OwnerPropDetails/OwnerPropDetails'; 

function OwnerPage({ darkMode }) {
    const [selectedTab, setSelectedTab] = useState('accepted');
    const [properties, setProperties] = useState([]);
    const [rooms, setRooms] = useState([]);


    useEffect(() => { 
        fetchProperties(selectedTab);
    }, [selectedTab]);

    const fetchProperties = (tab) => {
        const endpointMap = {
            accepted: 'http://mednat.ieeta.pt:9009/properties/aproved/',
            on_hold: 'http://mednat.ieeta.pt:9009/owner/denied_on_hold/properties/',
            denied: 'http://mednat.ieeta.pt:9009/owner/denied_on_hold/properties/'
        };
        const endpoint = endpointMap[tab];
    
        const token = localStorage.getItem('token');
    
        const headers = {
            'Content-Type': 'application/json'
        };
    
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    
        fetch(endpoint, {
            headers: headers 
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch properties');
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    let filteredProperties = [];
                    switch (tab) {
                        case 'accepted':
                            filteredProperties = data.filter(property => property.state === 'accepted');
                            break;
                        case 'on_hold':
                            filteredProperties = data.filter(property => property.state === 'on_hold');
                            break;
                        case 'denied':
                            filteredProperties = data.filter(property => property.state === 'denied');
                            break;
                        default:
                            filteredProperties = data;
                            break;
                    }
                    // Set filtered properties to state
                    setProperties(filteredProperties);
                    fetchRooms(data);
                } else {
                    console.error('Invalid data format:', data);
                }
            })
            
            .catch(error => {
                console.error('Error fetching properties:', error);
            });
    };
    
    
    const fetchRooms = (properties) => {
        const propertyIds = properties.map(property => property.id);
        fetch('http://mednat.ieeta.pt:9009/rooms/', {
            method: 'POST', // Assuming you need to send property IDs in the request body
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ propertyIds })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch rooms');
            }
            return response.json();
        })
        .then(data => {
            setRooms(data);
        })
        .catch(error => {
            console.error('Error fetching rooms:', error);
        });
    };
    

    const [showForm, setShowForm] = useState(false); 

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const handleAddPropertyClick = () => {
        setShowForm(!showForm); 
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    
        const formData = new FormData(event.target);
    
        const propertyName = formData.get('propertyName'); 
        const area = parseFloat(formData.get('area')); 
        const pricePerMonth = parseFloat(formData.get('pricePerMonth')); 
        const hasPrivateBathroom = formData.get('hasPrivateBathroom') === 'true'; 
        const isAvailable = formData.get('isAvailable') === 'true'; 
        const typology = formData.get('typology'); 
        const includedExpenses = formData.get('includedExpenses'); 

        if (!propertyName || isNaN(area) || isNaN(pricePerMonth)) {
            console.error('Invalid form data');
            return;
        }
    };

    const handleRoomsClick = (propertyId) => {
        console.log(`Rooms clicked for property ${propertyId}`);
        // Filter rooms based on the clicked property ID
        const roomsForProperty = rooms.filter(room => room.propertyId === propertyId);
    
      };
    

    return (
        <div className={`owner-section ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className='properties-container-owner'>
                <div className='left-panel'>
                    <h2>My Properties</h2>
                    <div className='tabs'>
                        <div
                            className={`tab ${selectedTab === 'accepted' ? 'selected' : ''}`}
                            onClick={() => handleTabClick('accepted')}
                        >
                            Accepted
                        </div>
                        <div
                            className={`tab ${selectedTab === 'onHold' ? 'selected' : ''}`}
                            onClick={() => handleTabClick('on_hold')}
                        >
                            On Hold
                        </div>
                        <div
                            className={`tab ${selectedTab === 'denied' ? 'selected' : ''}`}
                            onClick={() => handleTabClick('denied')}
                        >
                            Denied
                        </div>
                    </div>
                </div>
                <div className='o-show-properties'>
                    {properties.length > 0 && properties.map(property => (
                        <PropertyDetails key={property.id} property={property} onRoomsClick={handleRoomsClick} />
                    ))}
                </div>
            </div>
            <div className="right-panel">
                <button className="add-property-button" onClick={handleAddPropertyClick}>Add Property</button>
                {showForm && (
                    <div className="property-form">
                        {showForm && (
                        <div className="property-form">
                            <h2>Add Property</h2>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="propertyName">Name:</label>
                                <input type="text" id="propertyName" name="propertyName" required />
                                
                                <label htmlFor="propertyArea">Area (m²):</label>
                                <input type="number" id="propertyArea" name="propertyArea" required />
                                
                                <label htmlFor="propertyPrice">Price per Month:</label>
                                <input type="number" id="propertyPrice" name="propertyPrice" required />
                                
                                <label htmlFor="propertyPrivateBathroom">Private Bathroom:</label>
                                <select id="propertyPrivateBathroom" name="propertyPrivateBathroom" required>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                                
                                <label htmlFor="propertyAvailability">Available:</label>
                                <select id="propertyAvailability" name="propertyAvailability" required>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                                
                                <label htmlFor="propertyTypology">Typology:</label>
                                <input type="text" id="propertyTypology" name="propertyTypology" required />
                                
                                <label htmlFor="propertyIncludedExpenses">Included Expenses:</label>
                                <input type="text" id="propertyIncludedExpenses" name="propertyIncludedExpenses" required />
                                
                                <button type="submit">Add Property</button>
                            </form>
                        </div>
                    )}

                    </div>
                )}
            </div>
        </div>
    );
}

export default OwnerPage;
