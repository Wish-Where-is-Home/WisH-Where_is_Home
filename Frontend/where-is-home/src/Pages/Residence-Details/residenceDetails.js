import React, { useState, useEffect } from 'react';
import './residenceDetails.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import WalkIcon from '@mui/icons-material/DirectionsWalk';
import TransitIcon from '@mui/icons-material/DirectionsTransit';
import BikeIcon from '@mui/icons-material/DirectionsBike';


const ResidenceDetails = ({ darkMode }) => {
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState(null);
  //const [yelpData, setYelpData] = useState(null);
  const [showOwnerDetails, setShowOwnerDetails] = useState(false);
  const [expanded, setExpanded] = useState(false);



  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  
//   <script type='text/javascript'>
// var ws_wsid = 'g73c0420989bc43f79d00fa60cd4df386';
// var ws_address = 'C. Madrid, 126, 28903 Getafe, Madrid, Espanha';
// var ws_format = 'wide';
// var ws_width = '690';
// var ws_height = '525';
// </script><style type='text/css'>#ws-walkscore-tile{position:relative;text-align:left}#ws-walkscore-tile *{float:none;}</style><div id='ws-walkscore-tile'></div><script type='text/javascript' src='http://www.walkscore.com/tile/show-walkscore-tile.php'></script>

// curl "https://api.mapbox.com/directions/v5/mapbox/cycling/-122.42,37.78;-77.03,38.91?access_token=pk.eyJ1IjoiY3Jpc3RpYW5vbmljb2xhdSIsImEiOiJjbHZmZnFoaXUwN2R4MmlxbTdsdGlreDEyIn0.-vhnpIfDMVyW04ekPBhQlg"
// cycling / driving / walking

// curl "https://api.mapbox.com/geocoding/v5/mapbox.places/-8.820237304110279,41.70055911994133.json?access_token=pk.eyJ1IjoiY3Jpc3RpYW5vbmljb2xhdSIsImEiOiJjbHZmZnFoaXUwN2R4MmlxbTdsdGlreDEyIn0.-vhnpIfDMVyW04ekPBhQlg"
// primeiro longitude e depois latitude (-8...., 41....)

   

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
         //getYelpData(data.property.geom[0], data.property.geom[1]);
       } catch (error) {
         console.error('There was a problem with your fetch operation:', error);
       }
     };
    fetchData();
   }, []);

  //  const getYelpData = (lat, long) => {
  //   const options = {
  //     method: 'GET',
  //     headers: {
  //       accept: 'application/json',
  //       Authorization: 'Bearer rmASuj9Y6LDlFu8i9kVBDlQNlKs7Zadb4l2QJXAhht756P8vDXOWK5smuV55p5vzeprQnizMWffMYcQnHMGdRQZ3oBGZPVMQwaM2icUCScsROp84sLTc47cUMG4qZnYx'
  //     }
  //   };
  
  //   fetch(`https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${long}&radius=40000&sort_by=best_match&limit=20`, options)
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log(data);
  //       setYelpData(data); 
  //     })
  //     .catch(err => console.error(err));
  // };

  const useAnimatedScore = (isVisible, score, duration = 800) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
      let start;
      let frame;

      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const currentValue = Math.min(score * (progress / duration), score);
        setValue(currentValue);
        if (progress < duration) {
          frame = requestAnimationFrame(step);
        }
      };

      if (isVisible) {
        frame = requestAnimationFrame(step);
      } else {
        setValue(0);
      }

      return () => {
        cancelAnimationFrame(frame);
      };
    }, [isVisible, score, duration]);

    return value;
  };




  const walkScore = useAnimatedScore(expanded === 'panel1', 74);
  const transitScore = useAnimatedScore(expanded === 'panel1', 65);
  const bikeScore = useAnimatedScore(expanded === 'panel1', 90);


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

    if (!showOwnerDetails) {
      setTimeout(() => {
        document.querySelector('.ownerDetails').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300); 
    }
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
            <Accordion
              square
              expanded={expanded === 'panel1'}
              onChange={handleChange('panel1')}
              className="accordion"
            >

              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1d-content"
                id="panel1d-header"
                className="accordionSummary"
              >
                <Typography className="accordionSummaryContent">Score Details</Typography>
              </AccordionSummary>
              <AccordionDetails className="accordionDetails">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
                  {/* Walk Score */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 2px' }}>

                    <WalkIcon sx={{ fontSize: '2rem' }} />
                    <Typography variant="caption">Walk Score</Typography>
                    <Box position="relative" display="inline-flex">
                      <CircularProgress variant="determinate" value={walkScore} size={80} thickness={4} />
                      <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Typography variant="subtitle1" component="div" color="textPrimary">
                          {Math.round(walkScore)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Transit Score */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 2px' }}>

                    <TransitIcon sx={{ fontSize: '2rem' }} />
                    <Typography variant="caption">Transit Score</Typography>
                    <Box position="relative" display="inline-flex">
                      <CircularProgress variant="determinate" value={transitScore} size={80} color="secondary" thickness={4} />
                      <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Typography variant="subtitle1" component="div" color="textPrimary">
                          {Math.round(transitScore)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Bike Score */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 2px' }}>

                    <BikeIcon sx={{ fontSize: '2rem' }} />
                    <Typography variant="caption">Bike Score</Typography>
                    <Box position="relative" display="inline-flex">
                      <CircularProgress variant="determinate" value={bikeScore} size={80} color="secondary" thickness={4} />
                      <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Typography variant="subtitle1" component="div" color="textPrimary">
                          {Math.round(bikeScore)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </AccordionDetails>


            </Accordion>
            <div className="residenceDetailsTexts">
              <p className="residenceDesc">
                {propertyDetails.property.descricao}
                <br />
                <br />
                Detalhes da propriedade:
                <ul>
                  <li>Área: {propertyDetails.property.area} m²</li>
                  <li>WCs: {propertyDetails.property.wcs}</li>
                  <li>Cozinha {propertyDetails.property.cozinha ? "totalmente equipada" : "por equipar"}</li>
                  <li>Internet {propertyDetails.property.internet ? "incluída" : "não incluída"}</li>
                  <li>Despesas {propertyDetails.property.despesas ? "incluídas" : "não incluídas"}</li>
                </ul>
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
              <div className={`ownerDetails ${showOwnerDetails ? 'visible' : ''}`}>
                <h3>Contact the Owner:</h3>
                <p>Name: {propertyDetails.owner_info.nome}</p>
                <p>Email: {propertyDetails.owner_info.email}</p>
                <p>Phone: {propertyDetails.owner_info.telemovel}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="roomList">
          {propertyDetails && propertyDetails.quartos.map((room, index) => (
            <div key={index} className={`roomListItem ${!room.disponivel ? 'unavailable' : ''}`}>
              <div className="roomImageContainer">
                <img src={room.image || photos[0].src} alt="Room" className="roomListImage" />
                <h3 className="roomName">{room.tipologia}</h3>
              </div>
              <div className="roomDetails">
                <p className="roomDetail">{room.area} m²</p>
                <p className="roomDetail">{room.despesas_incluidas}</p>
                <p className="roomDetail">{room.observacoes}</p>
                <p className="roomDetail">{room.wc_privado ? "Private bathroom" : "No private bathroom"}</p>
              </div>

              <div className="roomPrice">
                {room.disponivel ? `${room.preco_mes}€ per month` : "Indisponível"}
              </div>
            </div>
          ))}
        </div>


      </div>
    </div>
  );
};

export default ResidenceDetails;
