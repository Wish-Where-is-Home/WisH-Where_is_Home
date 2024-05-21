import React, { useState } from 'react';
import './OwnerPropDetails.css';

function OwnerPropDetails({ property, allRooms, token, onRoomAvailabilityChange, onDeleteProperty }) {
    const [expanded, setExpanded] = useState(false);
    const [showRooms, setShowRooms] = useState(false);
    const handleToggleExpand = () => {
        setExpanded(!expanded);
    };

    const toggleRooms = () => {
        setShowRooms(!showRooms);
    };

    const handleRoomAvailabilityChange = async (roomId, currentAvailability) => {
        try {
            const response = await fetch(`http://mednat.ieeta.pt:9009/owner/update/room/availability/${roomId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ disponivel: !currentAvailability })
            });

            if (!response.ok) {
                throw new Error('Failed to update room availability');
            }

            onRoomAvailabilityChange(roomId, !currentAvailability);
        } catch (error) {
            console.error('Error updating room availability:', error);
        }
    };

    const handleDeleteProperty = async () => {
        try {
            const response = await fetch(`http://mednat.ieeta.pt:9009/owner/delete/property/${property.id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete property');
            }

            onDeleteProperty(property.id);
        } catch (error) {
            console.error('Error deleting property:', error);
        }
    };

    const propertyRooms = allRooms.filter(room => room.property_id === property.id);

    
    return (
        <div className="property-details">
            <div className="summary">
                {/* You can customize the image source */}
                <img src={property.photo} alt="Property Photo" />
                <h3>{property.nome}</h3>
                <button onClick={handleToggleExpand}>{expanded ? 'Less' : 'More'}</button>
                <button onClick={toggleRooms}>Rooms</button>
                <button onClick={handleDeleteProperty}>Delete Property</button>
            </div>
            
            {expanded && (
                <div className="detailed-info">
                    <p>Address: {property.morada}</p>
                    <p>Typology: {property.tipologia}</p>
                    <p>Area: {property.area} m<sup>2</sup></p>
                    <p>Floor: {property.piso}</p>
                    <p>Elevator: {property.elevador ? 'Yes' : 'No'}</p>
                    <p>Number of Bathrooms: {property.wcs}</p>
                    <p>Parking/Garage: {property.estacionamento_garagem ? 'Yes' : 'No'}</p>
                    <p>Equipped: {property.equipado ? 'Yes' : 'No'}</p>
                    <p>Kitchen: {property.cozinha ? 'Yes' : 'No'}</p>
                    <p>WiFi: {property.wifi ? 'Yes' : 'No'}</p>
                    <p>Description: {property.descricao}</p>
                    <p>Stamp: {property.selo}</p>
                </div>
            )}
            {showRooms  && (
                <div className="room-dropdown">
                    <ul className='room-contain'>
                        {propertyRooms.map((room,index) => (
                            <li key={room.id}>
                                <p><span>Room {index + 1}:</span> </p>
                                <p><span>Included Expenses:</span> {room.despesas_incluidas}</p>
                                <p><span>Private Bathroom:</span> {room.wc_privado ? 'Yes' : 'No'}</p>
                                <p><span>Price:</span> {room.preco} €</p>
                                <p>
                                    <span>Available:</span> {room.disponivel ? 'Yes' : 'No'}
                                    <button onClick={() => handleRoomAvailabilityChange(room.id, room.disponivel)}>
                                    {room.disponivel ? 'Unavailable' : 'Available'}
                                    </button>
                                </p>
                                <p><span>Observations:</span> {room.observacoes}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default OwnerPropDetails;
