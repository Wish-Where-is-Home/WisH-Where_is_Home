import React, { useState } from 'react';
import './roomDetails.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft, faCircleArrowRight, faCircleXmark, faArrowLeft, faBath, faRulerCombined, faSackDollar, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from 'react-i18next';

const RoomDetails = ({ darkMode, room, photos, onClose, onBack }) => {
  const { t } = useTranslation("common");

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
    <div className={`modal-overlay ${darkMode ? 'dark-mode' : 'light-mode'}`} onClick={(e) => {
      e.stopPropagation();
      onClose(); // Ensure it closes both modals
    }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="back-button" onClick={(e) => {
            e.stopPropagation();
            onBack();
          }}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h2>{room.tipologia}</h2>
          <button className="close-button" onClick={(e) => {
            e.stopPropagation();
            onClose(); // Ensure it closes both modals
          }}>
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
                <img src={photos[slideNumber]} alt="" className="sliderImg" />
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
                  {photos.map((photo, i) => (
                    <div
                      className={`roomImgWrapper ${i === 0 ? 'main' : ''}`}
                      key={i}
                      onClick={() => handleOpen(i)}
                    >
                      <img
                        src={photo}
                        alt=""
                        className="roomImg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="data-column-container">
                <div className="roomDetails">
                  <div className="roomDetail2">
                    <FontAwesomeIcon icon={faRulerCombined} />
                    <p>{room.area} m²</p>
                  </div>
                  <div className="roomDetail2">
                    <FontAwesomeIcon icon={faSackDollar} />
                    <p>{room.despesas_incluidas}</p>
                  </div>
                  <div className="roomDetail2">
                    <FontAwesomeIcon icon={faClipboardList} />
                    <p>{room.observacoes}</p>
                  </div>
                  <div className="roomDetail2">
                    <FontAwesomeIcon icon={faBath} />
                    <p>{room.wc_privado ? t('private_bathroom') : t('no_private_bathroom')}</p>
                  </div>
                  <div className="roomDetail2">
                    <p>{room.disponivel ? `Available for ${room.preco_mes}€ per month` : 'Not available'}</p>
                  </div>
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
