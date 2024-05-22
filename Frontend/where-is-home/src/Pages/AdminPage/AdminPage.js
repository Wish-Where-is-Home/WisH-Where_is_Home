import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from "react-i18next";
import { faEye } from '@fortawesome/free-solid-svg-icons';
import ModalProperty from '../../Components/ModalProperty/ModalProperty';
import ModalAdminRooms from '../../Components/ModalAdminRooms/ModalAdminRooms';
import { useAuth } from '../../AuthContext/AuthContext';

function AdminPage({ darkMode,fetchImageURLsImoveis,fetchImageURLsBedrooms }) {
    const { t } = useTranslation("common");
    const { isAuthenticated,userInfo} = useAuth();
    
    const [selectedTab, setSelectedTab] = useState('toConfirm');
    const [properties, setProperties] = useState([]);
    const [approvedProperties, setApprovedProperties] = useState([]);
    const [deniedProperties, setDeniedProperties] = useState([]);
    const [filterOptions, setFilterOptions] = useState({ approved: true, denied: true });
    const [showFilters, setShowFilters] = useState(false);
    const [pendingRooms, setPendingRooms] = useState([]);
    const [allRooms, setAllRooms] = useState([]);
    const [propertyRooms, setPropertyRooms] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isModalRoom,setIsModalRoom] = useState(false);
    const [selectedRoom,setSelectedRoom] = useState(null);


    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };


    
    useEffect(() => {
        if (!isAuthenticated) {
            window.location.href = '/';
        }
        if ((userInfo) && (userInfo.role !== 'admin')) {
            window.location.href = '/'
        }
    }, [isAuthenticated, userInfo]);


    useEffect(() => {
        
        const fetchProperties = async () => {
            try {
                const response1 = await fetch('http://mednat.ieeta.pt:9009/properties/aproved/');
                if (!response1.ok) {
                    throw new Error('Failed to fetch properties from first endpoint');
                }
                const data1 = await response1.json();

                const response2 = await fetch('http://mednat.ieeta.pt:9009/properties/denied/');
                if (!response2.ok) {
                    throw new Error('Failed to fetch properties from second endpoint');
                }
                const data2 = await response2.json();

                const approvedProps = data1.properties || [];
                const deniedProps = data2.properties || [];

                setApprovedProperties(approvedProps);
                setDeniedProperties(deniedProps);
                setProperties([...approvedProps, ...deniedProps]);
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        const fetchPendingRooms = async () => {
            try {
                const response = await fetch('http://mednat.ieeta.pt:9009/admin/pending/rooms/');
                if (!response.ok) {
                    throw new Error('Failed to fetch pending rooms');
                }
                const data = await response.json();
                setPendingRooms(data.pending_rooms || []);
            } catch (error) {
                console.error('Error fetching pending rooms:', error);
            }
        };

        const fetchAllRooms = async () => {
            try {
                const response = await fetch('http://mednat.ieeta.pt:9009/properties/rooms/all/');
                if (!response.ok) {
                    throw new Error('Failed to fetch all rooms');
                }
                const data = await response.json();
                setAllRooms(data.rooms || []);
                console.log(data);

            } catch (error) {
                console.error('Error fetching all rooms:', error);
            }
        };

        fetchPendingRooms();
        fetchProperties();
        fetchAllRooms();
    }, []);

    const handleFilterChange = (option) => {
        setFilterOptions(prevOptions => ({
            ...prevOptions,
            [option]: !prevOptions[option]
        }));
    };

    const openModal = (propertyId) => {
        const property = properties.find(prop => prop.id === propertyId);
        const roomsForProperty = allRooms.filter(room => room.imovel_id === propertyId);
        setSelectedProperty({ ...property, rooms: roomsForProperty });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProperty(null);
    };


    const openModalRoom = (room) => {
        setSelectedRoom(room);
        setIsModalRoom(true);
    };

    const closeModalRoom = () => {
        setIsModalRoom(false);
        setSelectedRoom(null);
    };

    const displayProperties = () => {
        let propertiesToDisplay = properties;
        
        if (!filterOptions.approved && !filterOptions.denied) {
            propertiesToDisplay = [];
        } else if (!filterOptions.approved) {
            propertiesToDisplay = deniedProperties;
        } else if (!filterOptions.denied) {
            propertiesToDisplay = approvedProperties;
        }
    
        if (propertiesToDisplay.length === 0) {
            return <p>No properties to display</p>;
        } else {
            return (
                <>
                    <div className='propertie-div propertie-labels'>
                        <div><strong>ID</strong></div>
                        <div><strong>Name</strong></div>
                        <div><strong>Address</strong></div>
                        <div></div>
                        <div><strong>State</strong></div>
                    </div>
                    {propertiesToDisplay.map(property => (
                        <div className='propertie-div' key={property.id}>
                            <div><p>{property.id}</p></div>
                            <div><p>{property.nome}</p></div>
                            <div><p>{property.morada}</p></div>
                            <div className="button-container">
                                <button className="button-small-round" onClick={() => openModal(property.id)}>
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                            </div>
                            <div>{property.estado}</div>
                        </div>
                    ))}
                </>
            );
        }
    };

    const displayPendingRooms = () => {
        if (pendingRooms.length === 0) {
            return <p>No pending rooms to display</p>;
        } else {
            return (
                <>
                    <div className='propertie-div propertie-labels'>
                        <div><strong>ID</strong></div>
                        <div><strong>Name</strong></div>
                        <div><strong>Address</strong></div>
                        <div></div>
                    </div>
                    {pendingRooms.map(room => (
                        <div className='propertie-div' key={room.id}>
                            <div><p>{room.room_info.room_id}</p></div>
                            <div><p>{room.property_info.property_name}</p></div>
                            <div><p>{room.property_info.property_address}</p></div>
                            <div className="button-container">
                                <button className="button-small-round" onClick={() => openModalRoom(room)}>
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            );
        }
    };

    return (
        <div className={`admin-section ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className='properties-container-admin'>
                <div className='admin-top-choose'>
                    <div
                        className={`achoose-perconfirm ${selectedTab === 'toConfirm' ? 'selected' : ''}`}
                        onClick={() => handleTabClick('toConfirm')}
                    >
                        <p>Bedrooms to confirm</p>
                    </div>
                    <div
                        className={`achoose-confirmed ${selectedTab === 'confirmed' ? 'selected' : ''}`}
                        onClick={() => handleTabClick('confirmed')}
                    >
                        <p>Properties</p>
                    </div>
                    <div className='afilter-div' style={{ display: selectedTab === 'confirmed' ? 'block' : 'none' }}>
                        <button className='afilter-button' onClick={() => setShowFilters(!showFilters)}>
                            <FontAwesomeIcon icon={faFilter} style={{ color: "var(--blacktowhite)", fontSize: "1.3rem" }} />
                        </button>
                        {showFilters && (
                            <div className="afilter-options">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={filterOptions.approved}
                                        onChange={() => handleFilterChange('approved')}
                                    />
                                    {t('Approved')}
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={filterOptions.denied}
                                        onChange={() => handleFilterChange('denied')}
                                    />
                                    {t('Denied')}
                                </label>
                            </div>
                        )}
                    </div>
                </div>
                <div className='ashow-properties'>
                    {selectedTab === 'toConfirm' ? (
                        displayPendingRooms()
                    ) : selectedTab === 'confirmed' ? (
                        displayProperties()
                    ) : null}
                </div>
            </div>
            {isModalOpen && selectedProperty && (
                <ModalProperty
                    darkMode={darkMode}
                    propertyData={selectedProperty}
                    propertyRooms={selectedProperty.rooms}
                    closeModal={closeModal}
                    fetchImageURLsImoveis={fetchImageURLsImoveis} 
                    fetchImageURLsBedrooms={fetchImageURLsBedrooms} 
                />
            )}

            {isModalRoom && selectedRoom && (
                <ModalAdminRooms
                    darkMode={darkMode}
                    roomData={selectedRoom}
                    closeModalRoom={closeModalRoom}
                    fetchImageURLsImoveis={fetchImageURLsImoveis} 
                    fetchImageURLsBedrooms={fetchImageURLsBedrooms} 
                />
            )}

        </div>
    );
}

export default AdminPage;