import React from 'react';
import './LoadingModal.css';

const LoadingModal = ({ darkMode }) => {
    return (
        <div>
            {/* Overlay */}
            <div className="overlay"></div>
            
            {/* Loading Modal */}
            <div className={`loadingModal ${darkMode ? 'dark-mode' : 'light-mode'}`}>
                <div className="loader-circle2"></div>
                <div className="loader-title2">Loading...</div>
            </div>
        </div>
    )
}

export default LoadingModal;