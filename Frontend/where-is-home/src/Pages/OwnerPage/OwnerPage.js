import React, { useEffect, useState } from 'react';
import './OwnerPage.css';
import PropertyDetails from '../../Components/OwnerPropDetails/OwnerPropDetails'; 

function OwnerPage({ darkMode }) {
    const [selectedTab, setSelectedTab] = useState('accepted');
    const [properties, setProperties] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [showForm, setShowForm] = useState(false); 
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [showRoomForm, setShowRoomForm] = useState(false); 
    const [selectedRoomPhotos, setSelectedRoomPhotos] = useState([]);
    const [numRooms, setNumRooms] = useState(1); // Number of rooms to add
    const [currentRoom, setCurrentRoom] = useState(1); // Current room being filled out


    useEffect(() => { 
        fetchProperties(selectedTab);
    }, [selectedTab]);

    const fetchProperties = (tab) => {
        const endpointMap = {
            accepted: 'http://mednat.ieeta.pt:9009/owner/aproved/properties/',
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
                let filteredProperties = data;
                if (tab === 'on_hold' || tab === 'denied') {
                    filteredProperties = data[`${tab}_rooms_properties`];
                } else if (tab === 'accepted') {
                    filteredProperties = data.properties || data;
                }
                setProperties(filteredProperties);
                fetchRooms(filteredProperties);
            })
            .catch(error => {
                console.error('Error fetching properties:', error);
            });
    };
    
    
    const fetchRooms = (properties) => {
        const propertyIds = properties.map(property => property.id);
        const token = localStorage.getItem('token');
        
        // Fetch rooms for approved properties
        fetch('http://mednat.ieeta.pt:9009/owner/approved/rooms/', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ propertyIds })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch approved rooms');
            }
            return response.json();
        })
        .then(approvedRooms => {
            fetch('http://mednat.ieeta.pt:9009/owner/denied_on_hold/rooms/', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ propertyIds })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch denied/on hold rooms');
                }
                return response.json();
            })
            .then(deniedRooms => {
                // Combine both sets of rooms
                const allRooms = [...approvedRooms, ...deniedRooms];
                setRooms(allRooms);
            })
            .catch(error => {
                console.error('Error fetching denied/on hold rooms:', error);
            });
        })
        .catch(error => {
            console.error('Error fetching approved rooms:', error);
        });
    };
    


    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const handleAddPropertyClick = () => {
        setShowForm(!showForm); 
    };
    const handleAddRoomsClick = () => {
        setShowForm(!showForm); 
        setShowRoomForm(!showRoomForm); 
    };
    

    /// ADD PROPERTY FORM ///
    const handleSubmit = (event) => {
        event.preventDefault();
    
        const formData = new FormData(event.target);
        const propertyPhotos = formData.getAll('propertyPhoto');
        if (propertyPhotos.length > 6) {
            console.error('You can upload a maximum of 6 photos.');
            return;
        }
    
        const propertyName = formData.get('propertyName'); 
        const area = parseFloat(formData.get('area')); 
        const pricePerMonth = parseFloat(formData.get('pricePerMonth')); 
        const hasPrivateBathroom = formData.get('hasPrivateBathroom') === 'true'; 
        const isAvailable = formData.get('isAvailable') === 'true'; 
        const typology = formData.get('typology'); 
        const includedExpenses = formData.get('includedExpenses'); 
        const submittedNumRooms = formData.get('numRooms');
        if (submittedNumRooms) {
            setNumRooms(parseInt(submittedNumRooms)); // Convert to integer
        }

        if (!propertyName || isNaN(area) || isNaN(pricePerMonth)) {
            console.error('Invalid form data');
            return;
        }
    };

    const handlePhotoChange = (event) => {
        const files = event.target.files;
        const selected = [];
        for (let i = 0; i < files.length; i++) {
            selected.push(URL.createObjectURL(files[i]));
        }
        setSelectedPhotos(selected);
    };
    /// ADD ROOMS FORM ///
    const handleNumRoomsChange = (event) => {
        setNumRooms(parseInt(event.target.value)); // Parse value as integer and update numRooms
    };
    const handleRoomsSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
    
        const roomName = formData.get('roomName');
        const roomPhotos = formData.getAll('roomPhoto');
    
        // Validate room information
        if (!roomName || roomPhotos.length === 0) {
            console.error('Please provide a room name and select at least one photo.');
            return;
        }
    
        // Process room information (e.g., send to backend, update state, etc.)
    
        // Clear room form fields after submission if needed
        event.target.reset();
    };    
    const handleRoomPhotoChange = (event) => {
        const files = event.target.files;
        const selected = [];
        for (let i = 0; i < files.length; i++) {
            selected.push(URL.createObjectURL(files[i]));
        }
        setSelectedRoomPhotos(selected);
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
                            className={`tab ${selectedTab === 'on_hold' ? 'selected' : ''}`}
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
            {!showForm && !showRoomForm ? (
                <button className="add-property-button" onClick={handleAddPropertyClick}>Add Property</button>
            ) : (
                <p></p>
            )}
                {showForm && (
                    <div className="property-form">
                        <h2>Add Property</h2>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <label htmlFor="propertyName">Name:</label>
                            <input type="text" id="propertyName" name="propertyName" required />
                            
                            <div className="input-group">
                                <div className="input-group1">
                                    <label htmlFor="propertyArea">Area (m²):</label>
                                    <input type="number" id="propertyArea" name="propertyArea" required />
                                </div>
                                                            
                                <div className="input-group2">
                                    <label htmlFor="propertyPrice">Price per Month (€):</label>
                                    <input type="number" id="propertyPrice" name="propertyPrice" required />
                                </div>    
                            </div>                  
                            <div className="select-group">
                                <div>
                                    <label htmlFor="propertyPrivateBathroom">Private Bathroom:</label>
                                    <select id="propertyPrivateBathroom" name="propertyPrivateBathroom" required>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="propertyAvailability">Available:</label>
                                    <select id="propertyAvailability" name="propertyAvailability" required>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                            </div>
                            <div className='how-many-rooms'>
                                <label htmlFor="numRooms">Number of Rooms:</label>
                                <input type="number" id="numRooms" name="numRooms" min="1" required onChange={handleNumRoomsChange} />  
                            </div>
                                                        
                            <label htmlFor="propertyTypology">Typology:</label>
                            <input type="text" id="propertyTypology" name="propertyTypology" required />
                                                        
                            <label htmlFor="propertyIncludedExpenses">Included Expenses:</label>
                            <input type="text" id="propertyIncludedExpenses" name="propertyIncludedExpenses" required />

                            
                            <div>
                                <div className="photoWrapper">
                                    <label htmlFor="propertyPhoto">Photos:</label>
                                    <label className='photoInput' htmlFor="propertyPhoto">Add Photos
                                        <input type="file" id="propertyPhoto" name="propertyPhoto" accept="image/png, image/jpeg" multiple onChange={handlePhotoChange} />
                                    </label>
                                </div>
                                <div className="selectedPhotos">
                                    {selectedPhotos.map((photo, index) => (
                                        <img key={index} src={photo} alt={`Selected Photo ${index + 1}`} />
                                    ))}
                                </div>
                            </div>
                                                        
                            <button className="submitProperty" type="submit" onClick={handleAddRoomsClick}>Add Rooms</button>
                        </form>

                    </div>
                )}
                {showRoomForm && (
                    <div className="room-form">
                        <h2>Add Rooms</h2>
                        <form onSubmit={handleRoomsSubmit} encType="multipart/form-data">
                            {[...Array(numRooms)].map((_, index) => (
                                <div key={index}>
                                    <h3>Room {index + 1}</h3>
                                        <div className="input-rooms">
                                            <label htmlFor="roomArea">Room Area (m²):</label>
                                            <input type="number" id="roomArea" name="roomArea" required />
                                        
                                            <label htmlFor="roomPrice">Room Price per Month (€):</label>
                                            <input type="number" id="roomPrice" name="roomPrice" required />
                                        
                                            <label htmlFor="roomAvailability">Available:</label>
                                            <select id="roomAvailability" name="roomAvailability" required>
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </select>      
                                        </div>                  
                                
                                        <div>
                                            <div className="photoWrapper">
                                                <label htmlFor="roomPhoto">Room Photos:</label>
                                                <label className='photoInput' htmlFor="roomPhoto">Add Room Photos
                                                    <input type="file" id="roomPhoto" name="roomPhoto" accept="image/png, image/jpeg" multiple onChange={handleRoomPhotoChange} />
                                                </label>
                                            </div>
                                            <div className="selectedPhotos">
                                                {selectedRoomPhotos.map((photo, index) => (
                                                    <img key={index} src={photo} alt={`Selected Room Photo ${index + 1}`} />
                                                ))}
                                            </div>
                                        </div>
                                </div>
                            ))}
                            <button className="submitProperty" type="submit">Submit Property</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OwnerPage;
