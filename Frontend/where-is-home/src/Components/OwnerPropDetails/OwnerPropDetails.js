import React, { useState } from 'react';

function OwnerPropDetails({ property, onRoomsClick }) {
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="property-details">
      {/* Summary Section */}
      <div className="summary">
        <img src={property.photo} alt="Property Photo" />
        <h3>{property.name}</h3>
        <button onClick={handleToggleExpand}>{expanded ? 'Less' : 'More'}</button>
        <button onClick={() => onRoomsClick(property.id)}>Rooms</button>
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
    </div>
  );
}

export default OwnerPropDetails;
