import React, { useState } from 'react';
import './AccordionItem.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const AccordionItem = ({ genre, sliders }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="accordion-item">
            <button className="accordion-header" onClick={toggleAccordion}>
                <span>{genre}</span>
                <FontAwesomeIcon icon={faChevronDown} className={`arrow-icon ${isOpen ? 'open' : ''}`} />
            </button>
            {isOpen && (
                <div className="accordion-content">
                    {sliders.map((slider, index) => (
                        <div className="slider-container" key={index}>
                            <label>{slider.label}</label>
                            <Slider
                                min={0}
                                max={100}
                                defaultValue={50}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AccordionItem;
