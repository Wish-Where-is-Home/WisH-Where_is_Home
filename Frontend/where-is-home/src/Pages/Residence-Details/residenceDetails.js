import React, { useState, useEffect } from 'react';
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
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [showOwnerDetails, setShowOwnerDetails] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      const imovelId = "20";
      const url = `http://mednat.ieeta.pt:9009/properties/${imovelId}/`;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        setPropertyDetails(data);
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      }
    };

    fetchData();
  }, []);



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
    let newSlideNumber;
    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? photos.length - 1 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === photos.length - 1 ? 0 : slideNumber + 1;
    }
    setSlideNumber(newSlideNumber);
  };

  if (!propertyDetails) return <div>Loading...</div>;

  const prices = propertyDetails.quartos.map(room => parseFloat(room.preco_mes));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceDisplay = minPrice === maxPrice ? `${minPrice}€` : `Entre ${minPrice}€ a ${maxPrice}€`;

  const toggleOwnerDetails = () => {
    setShowOwnerDetails(!showOwnerDetails);
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
          <h1 className="residenceTitle">
            {propertyDetails.property.nome}, piso {propertyDetails.property.piso}
          </h1>
          <div className="residenceAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{propertyDetails.property.morada}</span>
          </div>
          <span className="residencePriceHighlight">
            {propertyDetails.property.tipologia} {propertyDetails.property.equipado ? "totalmente equipado." : "por equipar."}
          </span>
          <div className="residenceImages">
            {photos.map((photos, i) => (
              <div className="residenceImgWrapper" key={i}>
                <img
                  onClick={() => handleOpen(i)}
                  src={photos.src}
                  alt=""
                  className="residenceImg"
                />
              </div>
            ))}
          </div>
          <div className="residenceDetails2">
            <div className="residenceDetailsTexts">
              <p className="residenceDesc">
                {propertyDetails.property.descricao}

              </p>
            </div>
            <div className="residenceDetailsPrice">
              <h2>Aproveite esta oportunidade!</h2>
              <span>
                {propertyDetails.property.estacionamento_garagem ? "Estacionamento na garagem disponível." : "Estacionamento não incluído."}

              </span>
              <h2>
                <b>{priceDisplay}</b> por Mês
              </h2>
              <button onClick={toggleOwnerDetails}>Reserve or Book Now!</button>
              {showOwnerDetails && propertyDetails.owner_info && (
                <div className="ownerDetails">
                  <h3>Contact the Owner:</h3>
                  <p>Name: {propertyDetails.owner_info.nome}</p>
                  <p>Email: {propertyDetails.owner_info.email}</p>
                  <p>Phone: {propertyDetails.owner_info.telemovel}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidenceDetails;
