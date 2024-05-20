import React, { useState, useEffect } from 'react';
import './Sidebar.css';

import { ChevronLeft, ChevronRight } from 'react-feather';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBathtub, faWarehouse,faSquareShareNodes, faSquareArrowUpRight, faSquareCaretDown, faMapLocation, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faSquareBehance } from '@fortawesome/free-brands-svg-icons';
import { faSquareFull } from '@fortawesome/free-regular-svg-icons';
import {useTranslation} from "react-i18next";
import { useNavigate } from 'react-router-dom';
import imovel1 from './imovel1.png';
import { use } from 'i18next';




function Sidebar({ darkMode, isOpen, toggleSidebar, properties, openModal }) {


    const toggleSidebarInternal = () => {
        toggleSidebar();
    };

    const {t} = useTranslation("common");

    const handlePropertyClick = (propertyId) => {
        openModal(propertyId);
    };

    return (
        <div className={`sidebar ${isOpen ? 'sidebar-open' : ''} ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="sidebar-toggle"  onClick={toggleSidebarInternal}>
                {isOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />} 
            </div>
            <h1 className='PropText'>{t('Properties')}</h1>
            <div className='sidebar-content-right'>
                {properties.map((box,index) => (

                    <div className="box-container" key={index} id={`property-${box.id}`} onClick={() => handlePropertyClick(box.id)}>
                        <div className="first-text">{index+1}º</div>
                        <div className="box">
                            <div className="imovel" id={`imovel-${box.id}`}>
                                <div className="overlap-group">
                                    <div className="quantidades">
                                        <div className="container-elem-quanti">
                                            <div className="qty-elem">
                                                <FontAwesomeIcon className="bed-icon" icon={faBed} />
                                                <div className="text-wrapper">{box.tipologia.substring(1)}</div>
                                            </div>
                                            <div className="div">
                                                <div className="text-wrapper-2">{box.wcs}</div>
                                                <FontAwesomeIcon className="bath-icon" icon={faBathtub} />
                                            </div>
                                            <div className="qty-elem-2">
                                                <div className="text-wrapper-3">{box.estacionamento_garagem ? 1 : 0}</div>
                                                <FontAwesomeIcon className="garage-icon" icon={faWarehouse} />
                                            </div>
                                            <div className="qty-elem-3">
                                                <div className="text-wrapper-4">{box.area}m2</div>
                                                <FontAwesomeIcon className="area-icon" icon={faSquareFull} />
                                            </div> 
                                        </div>
                                    </div>
                                    <div className="text-wrapper-5">{box.nome} {box.tipologia}</div>
                                    <div className="localizacao">
                                        <div className="local">
                                            <FontAwesomeIcon className="map-icon" icon={faMapLocationDot} />
                                            <div className="text-wrapper-6">{box.morada}, Aveiro</div>
                                        </div>
                                    </div>
                                    <div className="text-wrapper-7">{box.intervaloPreco}€</div>
                                </div>
                            </div>
                            <div className="photos">
                                <img className="imovel-img" src={imovel1} alt={`Imovel ${box.id}`} />

                            </div>
                        </div>
                    </div>
                    
                        
                        
                    ))}
                </div>
            </div>

    );
}

export default Sidebar;