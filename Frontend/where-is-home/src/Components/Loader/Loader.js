import React, { useState, useEffect } from 'react';
import './Loader.css';

const Loader = ({ visible }) => {
    const [showLoader, setShowLoader] = useState(visible);

    useEffect(() => {
        if (!visible) {
            
            const timeout = setTimeout(() => {
                setShowLoader(false);
            }, 500); 
           
            return () => clearTimeout(timeout);
        } else {
            setShowLoader(true);
        }
    }, [visible]);

    return showLoader ? (
        <div className="loader-container">
            <div className="loader-circle"></div>
            <div className="loader-title">Loading...</div>
            <h2 style={{ position: 'absolute', bottom: '4rem', left: '50%', transform: 'translateX(-50%)' }}>Where Is Home</h2>
        </div>
    ) : null;
}

export default Loader;