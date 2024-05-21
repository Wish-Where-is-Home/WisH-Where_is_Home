import React, { useState } from 'react';
import './roomDetails.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft, faCircleArrowRight, faCircleXmark, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const RoomDetails = ({ darkMode, room, photos, onClose, onBack }) => {
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;
    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? photos.length - 1 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === photos.length - 1 ? 0 : slideNumber + 1;
    }
    setSlideNumber(newSlideNumber);
  };

  return (
    <div className={`modal-overlay ${darkMode ? 'dark-mode' : 'light-mode'}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="back-button" onClick={onBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h2>{room.tipologia}</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        </div>
        <div className={`layout-container ${darkMode ? 'dark-mode' : 'light-mode'} ${open ? 'slider-open' : ''}`}>
          {open && (
            <div className="slider">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="close"
                onClick={() => setOpen(false)}
              />
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="arrow"
                onClick={() => handleMove("l")}
              />
              <div className="sliderWrapper">
                <img src={photos[slideNumber].src} alt="" className="sliderImg" />
              </div>
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="arrow"
                onClick={() => handleMove("r")}
              />
            </div>
          )}

          {!open && (
            <>
              <div className="media-column-container">
                <div className="roomImages">
                  {photos.map((photos, i) => (
                    <div
                      className={`roomImgWrapper ${i === 0 ? 'main' : ''}`}
                      key={i}
                      onClick={() => handleOpen(i)}
                    >
                      <img
                        src={photos.src}
                        alt=""
                        className="roomImg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="data-column-container">
                <div className="roomDetails">
                  <p>{room.area} m²</p>
                  <p>{room.despesas_incluidas}</p>
                  <p>{room.observacoes}</p>
                  <p>{room.wc_privado ? 'Private bathroom' : 'No private bathroom'}</p>
                  <p>{room.disponivel ? `Available for ${room.preco_mes}€ per month` : 'Not available'}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
