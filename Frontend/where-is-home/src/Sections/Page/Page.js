import React, { useState } from 'react';
import './Page.css';
import Metrics from '../../Components/Metrics/Metrics';
import MetricsButton from '../../Components/MetricsButton/MetricsButton';

function Page() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
    <div className="Metrics">
        <header className="Metrics-header">
            <h1>Metrics</h1>
        
        </header>
        <div>
            <MetricsButton onClick={toggleNavbar} />
                <Metrics isOpen={isOpen} toggleNavbar={toggleNavbar}/>
        </div>
        
    </div>
    );
}
export default Page;