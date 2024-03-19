import React, { useState, useEffect } from 'react';
import './MetricsButton.css'; 

const MetricsButton = ({ onClick }) => {

  const [showMenuText, setShowMenuText] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowMenuText(scrollTop < 400); 
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <div className="navbar-open-button" onClick={onClick}>
      <button>
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 6H21V7H3V6ZM3 12H21V13H3V12ZM3 18H21V19H3V18Z"
            fill="currentColor"
          />
        </svg>
      </button>
      {showMenuText && (
        <p>
          Menu
        </p>
      )}
    </div>
  );
};

export default MetricsButton;