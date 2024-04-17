import React, { useState } from 'react';
import './residenceDetails.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

const ResidenceDetails = ({ darkMode }) => {
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);

  const photos = [{
    src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707778.jpg?k=56ba0babbcbbfeb3d3e911728831dcbc390ed2cb16c51d88159f82bf751d04c6&o=&hp=1",
  },
  {
    src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707367.jpg?k=cbacfdeb8404af56a1a94812575d96f6b80f6740fd491d02c6fc3912a16d8757&o=&hp=1",
  },
  {
    src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261708745.jpg?k=1aae4678d645c63e0d90cdae8127b15f1e3232d4739bdf387a6578dc3b14bdfd&o=&hp=1",
  },
  {
    src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707776.jpg?k=054bb3e27c9e58d3bb1110349eb5e6e24dacd53fbb0316b9e2519b2bf3c520ae&o=&hp=1",
  },
  {
    src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261708693.jpg?k=ea210b4fa329fe302eab55dd9818c0571afba2abd2225ca3a36457f9afa74e94&o=&hp=1",
  },
  {
    src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707389.jpg?k=52156673f9eb6d5d99d3eed9386491a0465ce6f3b995f005ac71abc192dd5827&o=&hp=1",
  },
];

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber = direction === "l" 
      ? (slideNumber === 0 ? photos.length - 1 : slideNumber - 1)
      : (slideNumber === photos.length - 1 ? 0 : slideNumber + 1);
    setSlideNumber(newSlideNumber);
  };

  return (
    <div className={`residenceDetails ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="residenceContainer">
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
        <div className="residenceWrapper">
          <h1 className="residenceTitle">Apartamento Perto do Glicínias</h1>
          <div className="residenceAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>Avenida do Glicínias, Apartamento Y</span>
          </div>
          <span className="residencePriceHighlight">
            Despesas não incluídas.
          </span>
          <div className="residenceImages">
            {photos.map((photo, i) => (
              <div className="residenceImgWrapper" key={i}>
                <img
                  onClick={() => handleOpen(i)}
                  src={photo.src}
                  alt=""
                  className="residenceImg"
                />
              </div>
            ))}
          </div>
          <div className="residenceDetails">
            <div className="residenceDetailsTexts">
              <p className="residenceDesc">
                Aqui vou descrever porque é que este apartamento é tão perfeito para alunos estudantes da Universidade de Aveiro.
              </p>
            </div>
            <div className="residenceDetailsPrice">
              <h2>Aproveite esta oportunidade!</h2>
              <span>
                Alunos até agora adoraram o apartamento!!              
              </span>
              <h2>
                <b>350€</b> Mês
              </h2>
              <button>Reserve or Book Now!</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidenceDetails;
