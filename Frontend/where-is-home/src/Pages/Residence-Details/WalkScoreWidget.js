import React, { useEffect } from 'react';

const WalkScoreWidget = ({
  apiKey,
  address,
  width = '300',
  height = '421',
  format = 'wide',
  backgroundColor = '#fff'
}) => {
  useEffect(() => {
    // Inject the required styles directly
    const style = document.createElement('style');
    style.textContent = `
      #ws-walkscore-tile { 
        position: relative; 
        text-align: left; 
        background-color: ${backgroundColor}; 
      }
      #ws-walkscore-tile * { 
        float: none; 
      }
      #walkscore-widget-container {
        width: ${width}px;
        height: ${height}px;
      }
    `;
    document.head.appendChild(style);

    // Define the necessary variables for the Walk Score script
    window.ws_wsid = apiKey;
    window.ws_address = address;
    window.ws_format = format;
    window.ws_width = width;
    window.ws_height = height;

    // Set color parameters
    window.ws_background_color = backgroundColor;

    // Create the script tag
    const script = document.createElement('script');
    script.src = 'https://www.walkscore.com/tile/show-walkscore-tile.php';
    script.async = true;

    // Check if the widget container already exists
    const existingDiv = document.getElementById('ws-walkscore-tile');
    if (!existingDiv) {
      // Append the div that will hold the widget
      const div = document.createElement('div');
      div.id = 'ws-walkscore-tile';
      document.getElementById('walkscore-widget-container').appendChild(div);

      // Append the script to load the widget
      div.appendChild(script);
    }

    return () => {
      // Cleanup script and style on component unmount
      document.head.removeChild(style);
    };
  }, [apiKey, address, format, width, height, backgroundColor]); // Re-run effect if any props change

  return (
    <div id="walkscore-widget-container"></div>
  );
};

export default WalkScoreWidget;
