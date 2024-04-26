import React, { useState } from 'react';
import './OwnerPage.css';
import PropertyDetails from '../../Components/OwnerPropDetails/OwnerPropDetails'; 

function OwnerPage({ darkMode }) {
    const [selectedTab, setSelectedTab] = useState('accepted');

    const [showForm, setShowForm] = useState(false); 

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const handleAddPropertyClick = () => {
        setShowForm(!showForm); // Toggle the showForm state
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    
        const formData = new FormData(event.target);
    
        const propertyName = formData.get('propertyName'); // Extracts the property name from the form data
        const area = parseFloat(formData.get('area')); // Extracts the area and converts it to a floating-point number
        const pricePerMonth = parseFloat(formData.get('pricePerMonth')); // Extracts the price per month and converts it to a floating-point number
        const hasPrivateBathroom = formData.get('hasPrivateBathroom') === 'true'; // Extracts the value of hasPrivateBathroom and converts it to a boolean
        const isAvailable = formData.get('isAvailable') === 'true'; // Extracts the value of isAvailable and converts it to a boolean
        const typology = formData.get('typology'); // Extracts the typology from the form data
        const includedExpenses = formData.get('includedExpenses'); // Extracts the included expenses from the form data

        if (!propertyName || isNaN(area) || isNaN(pricePerMonth)) {
            console.error('Invalid form data');
            return;
        }
    };

    const handleRoomsClick = (propertyId) => {
        console.log(`Rooms clicked for property ${propertyId}`);
      };

    const acceptedProperties = [
        { 
            id: 1, 
            photo: 'https://www.betar.pt/cms/wp-content/uploads/2022/04/AmoreirasResidence-01.jpg',
            name: 'Property 1',
            area: 100, 
            preco_mes: 800, 
            wc_privado: true, 
            disponivel: true, 
            tipologia: 'T1', 
            despesas_incluidas: 'Água e Eletricidade' 
        },
        { 
            id: 2, 
            photo: 'https://www.betar.pt/cms/wp-content/uploads/2022/04/AmoreirasResidence-01.jpg',
            name: 'Property 2',
            area: 120, 
            preco_mes: 900, 
            wc_privado: false, 
            disponivel: false, 
            tipologia: 'T2', 
            despesas_incluidas: 'Água' 
        },
        { 
            id: 7, 
            photo: 'https://www.betar.pt/cms/wp-content/uploads/2022/04/AmoreirasResidence-01.jpg',
            name: 'Property 7',
            area: 120, 
            preco_mes: 900, 
            wc_privado: false, 
            disponivel: false, 
            tipologia: 'T2', 
            despesas_incluidas: 'Água' 
        },
        
    ];
    

    const onHoldProperties = [
        { 
            id: 3, 
            photo: 'https://www.betar.pt/cms/wp-content/uploads/2022/04/AmoreirasResidence-01.jpg',
            name: 'Property 3', 
            area: 80, 
            preco_mes: 700, 
            wc_privado: false, 
            disponivel: true, 
            tipologia: 'T1', 
            despesas_incluidas: 'Água' 
        },
        { 
            id: 4, 
            photo: 'https://www.betar.pt/cms/wp-content/uploads/2022/04/AmoreirasResidence-01.jpg',
            name: 'Property 4', 
            area: 100, 
            preco_mes: 900, 
            wc_privado: true, 
            disponivel: false, 
            tipologia: 'T2', 
            despesas_incluidas: 'Água e Eletricidade' 
        },
    ];
    
    const deniedProperties = [
        { 
            id: 5, 
            photo: 'https://www.betar.pt/cms/wp-content/uploads/2022/04/AmoreirasResidence-01.jpg',
            name: 'Property 5', 
            area: 120, 
            preco_mes: 850, 
            wc_privado: true, 
            disponivel: false, 
            tipologia: 'T3', 
            despesas_incluidas: 'Nenhuma' 
        },
        { 
            id: 6, 
            photo: 'https://www.betar.pt/cms/wp-content/uploads/2022/04/AmoreirasResidence-01.jpg',
            name: 'Property 6', 
            area: 90, 
            preco_mes: 750, 
            wc_privado: false, 
            disponivel: false, 
            tipologia: 'T1', 
            despesas_incluidas: 'Nenhuma' 
        },
    ];

    const getPropertiesByTab = () => {
        switch (selectedTab) {
            case 'accepted':
                return acceptedProperties;
            case 'onHold':
                return onHoldProperties;
            case 'denied':
                return deniedProperties;
            default:
                return [];
        }
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
                            onClick={() => handleTabClick('onHold')}
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
                    {getPropertiesByTab().map(property => (
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