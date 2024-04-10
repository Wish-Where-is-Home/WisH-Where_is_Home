import React, { useState } from 'react';
import Properties from '../../Components/Properties/Sidebar'; // Supondo que você tenha criado e exportado o componente Slider

function PropertiesPage() {
    const [sliderOpen, setSliderOpen] = useState(false);

    const toggleSlider = () => {
        setSliderOpen(!sliderOpen);
    };

    return (
        <div className='Properties-Section'>

            <Properties />

        </div>
    );
}

export default PropertiesPage;
