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
      {/* Summary Section */}
      <div className="summary">
        <img src={property.photo} alt="Property Photo" />
        <h3>{property.name}</h3>
        <button onClick={handleToggleExpand}>{expanded ? 'Less' : 'More'}</button>
        <button onClick={toggleRooms}>Rooms</button>
      </div>
      
      {/* Detailed Section (hidden if not expanded) */}
      {expanded && (
        <div className="detailed-info">
          <p>Area: {property.area} m<sup>2</sup></p>
          <p>Price per Month: {property.preco_mes}</p>
          <p>Private Bathroom: {property.wc_privado ? 'Yes' : 'No'}</p>
          <p>Available: {property.disponivel ? 'Yes' : 'No'}</p>
          <p>Typology: {property.tipologia}</p>
          <p>Included Expenses: {property.despesas_incluidas}</p>
          {/* Include other details here */}
        </div>
      )}
      {showRooms && (
        <div className="room-dropdown">
          <h4>Rooms</h4>
          <ul>
            {/* Map through rooms and render them */}
            {property.rooms.map(room => (
              <li key={room.id}>{room.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default OwnerPropDetails;
