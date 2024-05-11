import React, { useEffect } from 'react';

const WalkScoreWidget = ({ apiKey, address, width = '690', height = '525', format = 'wide' }) => {
  useEffect(() => {
    // Inject the required styles
    const style = document.createElement('style');
    style.textContent = `#ws-walkscore-tile { position: relative; text-align: left; }
                         #ws-walkscore-tile * { float: none; }`;
    document.head.appendChild(style);

    // Define the necessary variables for the Walk Score script
    window.ws_wsid = apiKey;
    window.ws_address = address;
    window.ws_format = format;
    window.ws_width = width;
    window.ws_height = height;

    // Create the script tag
    const script = document.createElement('script');
    script.src = 'https://www.walkscore.com/tile/show-walkscore-tile.php';
    script.async = true;

    // Append the div that will hold the widget
    const div = document.createElement('div');
    div.id = 'ws-walkscore-tile';
    document.getElementById('walkscore-widget-container').appendChild(div);

    // Append the script to load the widget
    div.appendChild(script);

    return () => {
      // Cleanup script and style on component unmount
      document.head.removeChild(style);
      div.removeChild(script);
    };
  }, [apiKey, address, format, width, height]); // Re-run effect if any props change

  return (
    <div id="walkscore-widget-container" style={{ width: `${width}px`, height: `${height}px` }}></div>
  );
};

export default WalkScoreWidget;
