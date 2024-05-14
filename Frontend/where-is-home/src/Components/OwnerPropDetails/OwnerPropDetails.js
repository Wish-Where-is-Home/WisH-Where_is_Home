import React, { useState } from 'react';
import './OwnerPropDetails.css';

function OwnerPropDetails({ property, onRoomsClick }) {
  const [expanded, setExpanded] = useState(false);
  const [showRooms, setShowRooms] = useState(false);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };
  const toggleRooms = () => {
    setShowRooms(!showRooms);
  };

  return (
    <div className="property-details">
      <div className="summary">
        {/* You can customize the image source */}
        <img src={property.photo} alt="Property Photo" />
        <h3>{property.nome}</h3>
        <button onClick={handleToggleExpand}>{expanded ? 'Less' : 'More'}</button>
        <button onClick={() => onRoomsClick(property.id)}>Rooms</button>
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
          <p>Created At: {property.created_at}</p>
          <p>Updated At: {property.updated_at}</p>
          {/* Include other details here */}
        </div>
      )}
      {showRooms && (
        <div className="room-dropdown">
          <h4>Rooms</h4>
          <ul>
            {property.rooms.map(room => (
              <li key={room.id}>
                <p>Room ID: {room.id}</p>
                <p>Included Expenses: {room.despesas_incluidas}</p>
                <p>Private Bathroom: {room.wc_privado ? 'Yes' : 'No'}</p>
                <p>Available: {room.disponivel ? 'Yes' : 'No'}</p>
                <p>Observations: {room.observacoes}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default OwnerPropDetails;
