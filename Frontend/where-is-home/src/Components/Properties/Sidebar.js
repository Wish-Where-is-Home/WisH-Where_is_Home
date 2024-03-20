import React, { useState, useEffect } from 'react';
import './Sidebar.css';

import { ChevronLeft, ChevronRight } from 'react-feather';
import data from './data.json'; // Importe os dados do JSON
import bath from './img/bath-1.svg';
import car from './img/car-1.svg';
import selection from './img/selection-1.svg';
import bed from './img/bed-icon.svg';
import map from './img/map-icon.svg';


function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [boxes, setBoxes] = useState([]);

    useEffect(() => {
        // Simula uma requisição assíncrona para carregar os dados do JSON
        // Em um aplicativo real, você buscaria esses dados de um servidor
        setBoxes(data);
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                {isOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />} {/* Usa os ícones de seta */}
            </div>
            <h1>Properties</h1>
            {/* Renderiza as caixas a partir dos dados do JSON */}
            {boxes.map((box) => (
                <div className="box-container" key={box.id}> {/* Envolve cada elemento em um contêiner */}
                    <div className="first-text">{box.id}º</div>
                    <div className="box" style={{ display: isOpen ? 'block' : 'none' }}>
                        <div className="imovel">
                            <div className="overlap-group">
                                <div className="rectangle" />
                                <div className="quantidades">
                                    <div className="qty-elem">
                                        <img className="bed-icon" alt="Bed icon" src={bed} />
                                        <div className="text-wrapper">{box.beds}</div>
                                    </div>
                                    <div className="div">
                                        <div className="text-wrapper-2">{box.baths}</div>
                                        <img className="img" alt="Bath" src={bath} />
                                    </div>
                                    <div className="qty-elem-2">
                                        <div className="text-wrapper-3">{box.carSpaces}</div>
                                        <img className="car" alt="Car" src={car} />
                                    </div>
                                    <div className="qty-elem-3">
                                        <div className="text-wrapper-4">{box.area}</div>
                                        <img className="img" alt="Selection" src={selection} />
                                    </div>
                                </div>
                                <div className="text-wrapper-5">{box.type}</div>
                                <div className="localizacao">
                                    <img className="map-icon" alt="Map icon" src={map} />
                                    <div className="text-wrapper-6">{box.location}</div>
                                </div>
                                <div className="text-wrapper-7">{box.price}</div>
                            </div>
                        </div>
                        {/* Adicione a imagem do imóvel dentro da caixa */}
                        <img className="imovel-img" src={box.image} alt={`Imovel ${box.id}`} />
                    </div>
                </div>
                    
                    
                ))}
            </div>

    );
}

export default Sidebar;
