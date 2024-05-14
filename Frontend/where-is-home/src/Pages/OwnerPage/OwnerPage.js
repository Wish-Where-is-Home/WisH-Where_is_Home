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
    const [numRooms, setNumRooms] = useState(1); 
    const [token, setToken] = useState('');

    useEffect(() => {
        // Fetch token from local storage or wherever it is stored
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        fetchProperties(selectedTab);
    }, [selectedTab]);


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
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const propertyPhotos = formData.getAll('propertyPhoto');
        if (propertyPhotos.length > 6) {
            console.error('You can upload a maximum of 6 photos.');
            return;
        }

        const propertyName = formData.get('propertyName');
        const area = parseFloat(formData.get('propertyArea'));
        const typology = formData.get('propertyTypology');
        const address = formData.get('propertyAddress'); 
        const geom = formData.get('propertyGeom');
        const floor = parseInt(formData.get('propertyFloor'));
        const hasElevator = formData.get('propertyElevator') === 'true';
        const numWcs = parseInt(formData.get('propertyWcs'));
        const hasGarageParking = formData.get('propertyParkingGarage') === 'true';
        const isEquipped = formData.get('propertyEquipped') === 'true';
        const hasKitchen = formData.get('propertyKitchen') === 'true';
        const hasWifi = formData.get('propertyWifi') === 'true';
        const description = formData.get('propertyDescription');
        const seal = formData.get('propertySeal');
        const createdAt = formData.get('propertyCreatedAt');
        const updatedAt = formData.get('propertyUpdatedAt');

        const submittedNumRooms = formData.get('numRooms');
        if (submittedNumRooms) {
            setNumRooms(parseInt(submittedNumRooms)); // Convert to integer
        }

        // Get the currently logged-in user's ID
        // const currentUser = firebase.auth().currentUser;
        // if (!currentUser) {
        //     console.error('No user is currently logged in.');
        //     return;
        // }
        // const ownerId = currentUser.uid;

        // Check if all required fields are filled
        const isValid = !(
            propertyName &&
            !isNaN(area) &&
            typology &&
            address &&
            !isNaN(floor) &&
            !isNaN(numWcs) &&
            description 
            );

        if (!isValid) {
            console.error('Invalid form data');
            return;
        } else {
            handleAddRoomsClick();
        }

        const roomPhotos = [];
        for (let i = 0; i < numRooms; i++) {
            const roomPhoto = formData.getAll(`roomPhoto${i}`);
            roomPhotos.push(roomPhoto);
        }

        const propertyData = {
            id: null, // Assuming the database generates the ID
            owner: null,// ownerId, // Use the ID of the currently logged-in user
            nome: propertyName,
            morada: address, 
            tipologia: typology,
            area: area,
            geom: geom,
            piso: floor,
            elevador: hasElevator,
            wcs: numWcs,
            estacionamento_garagem: hasGarageParking,
            equipado: isEquipped,
            cozinha: hasKitchen,
            wifi: hasWifi,
            descricao: description,
            selo: seal,
            created_at: createdAt,
            updated_at: updatedAt,
            photos: propertyPhotos,
            rooms: roomPhotos
        };

        try {
            // Send property data to the database
            const response = await fetch('http://mednat.ieeta.pt:9009/owner/create/property/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Assuming you have the token available
                },
                body: JSON.stringify(propertyData)
            });

            if (!response.ok) {
                throw new Error('Failed to create property');
            }
            handleAddRoomsClick();
        } catch (error) {
            console.error('Error creating property:', error);
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
    const handleRoomsSubmit = async (event) => {
        event.preventDefault();
    
        const formData = new FormData(event.target);
    
        const roomDataArray = [];
    
        // Iterate through each room to collect its data
        for (let i = 0; i < numRooms; i++) {
            const roomArea = parseFloat(formData.get(`roomArea${i}`));
            const despesasIncluidas = formData.get(`despesasIncluidas${i}`);
            const wcPrivado = formData.get(`wcPrivado${i}`) === 'true';
            const disponivel = formData.get(`disponivel${i}`) === 'true';
            const roomPhotos = selectedRoomPhotos[i] || []; // Selected photos for this room
    
            // Check if room area is valid
            if (isNaN(roomArea) || roomArea <= 0) {
                console.error(`Invalid room area for Room ${i + 1}`);
                return;
            }
    
            // Push room data to the array
            roomDataArray.push({
                area: roomArea,
                despesas_incluidas: despesasIncluidas,
                wc_privado: wcPrivado,
                disponivel: disponivel,
                photos: roomPhotos
            });
        }
    
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token not available');
            // Handle the absence of token, such as redirecting to login or displaying an error message
            return;
        }

        try {
            // Send room data to the database
            const response = await fetch('http://mednat.ieeta.pt:9009/owner/create/room/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(roomDataArray)
            });

            if (!response.ok) {
                throw new Error('Failed to create rooms');
            }

            // Handle success
            // For example, show a success message or redirect to another page
        } catch (error) {
            console.error('Error creating rooms:', error);
            // Handle error
            // For example, display an error message to the user
        }
    };
    
    const handleRoomPhotoChange = (event, roomIndex) => {
        const files = event.target.files;
        const selected = [];
        for (let i = 0; i < files.length; i++) {
            selected.push(URL.createObjectURL(files[i]));
        }
    
        // Update the selected room photos array in state
        const updatedSelectedRoomPhotos = [...selectedRoomPhotos];
        updatedSelectedRoomPhotos[roomIndex] = selected;
        setSelectedRoomPhotos(updatedSelectedRoomPhotos);
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
                        <PropertyDetails key={property.id} property={property}/>
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
                                <label htmlFor="propertyFloor">Floor:</label>
                                <input type="text" id="propertyFloor" name="propertyFloor" required />
                            </div>    
                        </div>                  

                        <label htmlFor="propertyTypology">Typology:</label>
                        <input type="text" id="propertyTypology" name="propertyTypology" required />
                        
                        <div>
                            <label htmlFor="numRooms">Number of Rooms:</label>
                            <input type="number" id="numRooms" name="numRooms" min="1" required onChange={handleNumRoomsChange} />
                        </div>

                        <label htmlFor="propertyWcs">Number of Bathrooms:</label>
                        <input type="number" id="propertyWcs" min="1" required />
                        
                        <label htmlFor="propertyDescription">Description:</label>
                        <textarea id="propertyDescription" name="propertyDescription" required />

                        <label htmlFor="propertyAddress">Address:</label>
                        <textarea id="propertyAddress" name="propertyAddress" required />
                        
                        <div className="checkbox-group">
                            <label htmlFor="propertyElevator">Elevator:</label>
                            <input type="checkbox" id="propertyElevator" name="propertyElevator" />
                        </div>

                        <div className="checkbox-group">
                            <label htmlFor="propertyParking">Parking:</label>
                            <input type="checkbox" id="propertyParking" name="propertyParking" />
                        </div>

                        <div className="checkbox-group">
                            <label htmlFor="propertyEquipped">Equipped:</label>
                            <input type="checkbox" id="propertyEquipped" name="propertyEquipped" />
                        </div>

                        <div className="checkbox-group">
                            <label htmlFor="propertyKitchen">Kitchen:</label>
                            <input type="checkbox" id="propertyKitchen" name="propertyKitchen" />
                        </div>

                        <div className="checkbox-group">
                            <label htmlFor="propertyWifi">WiFi:</label>
                            <input type="checkbox" id="propertyWifi" name="propertyWifi" />
                        </div>

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
                                                                    
                        <button className="submitProperty" type="submit" >Add Rooms</button>
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
                                    <label htmlFor={`roomArea${index}`}>Room Area (m²):</label>
                                    <input type="number" id={`roomArea${index}`} name={`roomArea${index}`} required />
                                
                                    <label htmlFor={`roomPrice${index}`}>Room Price per Month (€):</label>
                                    <input type="number" id={`roomPrice${index}`} name={`roomPrice${index}`} required />
                                
                                    <label htmlFor={`despesasIncluidas${index}`}>Included Expenses:</label>
                                    <input type="text" id={`despesasIncluidas${index}`} name={`despesasIncluidas${index}`} required />

                                    
                                        <label htmlFor={`wcPrivado${index}`}>Private Bathroom:</label>
                                        <select id={`wcPrivado${index}`} name={`wcPrivado${index}`} required>
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>      
                                    
                                        <label htmlFor={`disponivel${index}`}>Available:</label>
                                        <select id={`disponivel${index}`} name={`disponivel${index}`} required>
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>      
                                    
                                </div>                  

                                <div>
                                    <div className="photoWrapper">
                                        <label htmlFor={`roomPhoto${index}`}>Room Photos:</label>
                                        <label className='photoInput' htmlFor={`roomPhoto${index}`}>Add Room Photos
                                        <input
                                            type="file"
                                            id={`roomPhoto${index}`}
                                            name={`roomPhoto${index}`}
                                            accept="image/png, image/jpeg"
                                            multiple
                                            onChange={(event) => handleRoomPhotoChange(event, index)} // Pass roomIndex
                                        />                                        
                                        </label>
                                    </div>

                                    <div className="selectedPhotos">
                                        {selectedRoomPhotos[index] && selectedRoomPhotos[index].map((photo, photoIndex) => (
                                            <img key={photoIndex} src={photo} alt={`Selected Room Photo ${photoIndex + 1}`} />
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
