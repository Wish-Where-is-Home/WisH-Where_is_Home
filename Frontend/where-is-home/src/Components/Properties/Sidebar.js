import React, { useState, useEffect } from 'react';
import './Sidebar.css';

import { ChevronLeft, ChevronRight } from 'react-feather';
import data from './data.json'; // Importe os dados do JSON
import bath from './img/bath-1.svg';
import car from './img/car-1.svg';
import selection from './img/selection-1.svg';
import bed from './img/bed-icon.svg';
import map from './img/map-icon.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBathtub, faWarehouse,faSquareShareNodes, faSquareArrowUpRight, faSquareCaretDown, faMapLocation, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faSquareBehance } from '@fortawesome/free-brands-svg-icons';
import { faSquareFull } from '@fortawesome/free-regular-svg-icons';


function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [boxes, setBoxes] = useState([]);

    useEffect(() => {
        setBoxes(data);
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                {isOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />} 
            </div>
            <h1 className='PropText'>Properties</h1>
            {boxes.map((box) => (
                <div className="box-container" key={box.id}> 
                    <div className="first-text">{box.id}º</div>
                    <div className="box" style={{ display: isOpen ? 'block' : 'none' }}>
                        <div className="imovel">
                            <div className="overlap-group">
                                <div className="rectangle" />
                                <div className="quantidades">
                                    <div className="qty-elem">
                                        <FontAwesomeIcon className="bed-icon" icon={faBed} />
                                        <div className="text-wrapper">{box.beds}</div>
                                    </div>
                                    <div className="div">
                                        <div className="text-wrapper-2">{box.baths}</div>
                                        <FontAwesomeIcon className="bath-icon" icon={faBathtub} />
                                    </div>
                                    <div className="qty-elem-2">
                                        <div className="text-wrapper-3">{box.carSpaces}</div>
                                        <FontAwesomeIcon className="garage-icon" icon={faWarehouse} />
                                    </div>
                                    <div className="qty-elem-3">
                                        <div className="text-wrapper-4">{box.area}</div>
                                        <FontAwesomeIcon className="area-icon" icon={faSquareFull} />
                                    </div>
                                </div>
                                <div className="text-wrapper-5">{box.type}</div>
                                <div className="localizacao">
                                    <FontAwesomeIcon className="map-icon" icon={faMapLocationDot} />
                                    <div className="text-wrapper-6">{box.location}</div>
                                </div>
                                <div className="text-wrapper-7">{box.price}</div>
                            </div>
                        </div>
                        <img className="imovel-img" src={box.image} alt={`Imovel ${box.id}`} />
                    </div>
                </div>
                    
                    
                ))}
            </div>

    );
}

export default Sidebar;
