import React, { useState, useEffect } from 'react';
import './residenceDetails.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft, faCircleArrowRight, faCircleXmark, faLocationDot, faBath, faRulerCombined, faSackDollar, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import WalkScoreWidget from './WalkScoreWidget';
import TravelTimeCalculator from './TravelTimeCalculator';
import categoryMapping from './categoryMapping';
import CategoryRatings from './CategoryRatings';
import { useTranslation } from 'react-i18next';
import RoomDetails from './RoomDetails';
import { constructNow } from 'date-fns';

const ResidenceDetails = ({ darkMode, propertyId, onClose,fetchImageURLsImoveis,fetchImageURLsBedrooms, fetchImageURLsByImovelId  }) => {
  const { t } = useTranslation("common");
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [yelpData, setYelpData] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);
  const [showOwnerDetails, setShowOwnerDetails] = useState(false);
  const [categoryAverages, setCategoryAverages] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomPhotos, setRoomPhotos] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);
  const [imagesBedrooms,setImagesBedrooms] = useState([]);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      const url = `http://mednat.ieeta.pt:9009/properties/${propertyId}/`;
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
        getYelpData(data.property.geom[0], data.property.geom[1]);
        fetchLocationData(data.property.geom[0], data.property.geom[1]);
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      }
    };
    fetchPropertyDetails();
  }, [propertyId]);

  const getYelpData = (lat, long) => {
    const targetUrl = `http://mednat.ieeta.pt:9009/api/yelp/search/?latitude=${lat}&longitude=${long}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    };
  
    fetch(targetUrl, options)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setYelpData(data);
        const averages = calculateCategoryAverages(data);
        console.log("Category Averages: ", averages);
        setCategoryAverages(averages);
      })
      .catch(err => console.error(err));
  };
  

  function calculateCategoryAverages(data) {
    const categorySums = {};
    const categoryCounts = {};
    const categoryReviewCounts = {};

    data.businesses.forEach(business => {
      business.categories.forEach(category => {
        const broadCategory = categoryMapping[category.alias] || category.alias;

        if (categorySums[broadCategory]) {
          categorySums[broadCategory] += business.rating;
          categoryCounts[broadCategory] += 1;
          categoryReviewCounts[broadCategory] += business.review_count;
        } else {
          categorySums[broadCategory] = business.rating;
          categoryCounts[broadCategory] = 1;
          categoryReviewCounts[broadCategory] = business.review_count;
        }
      });
    });

    const categoryAverages = {};
    for (const category in categorySums) {
      categoryAverages[category] = {
        averageRating: categorySums[category] / categoryCounts[category],
        totalReviewCount: categoryReviewCounts[category]
      };
    }

    return categoryAverages;
  }

  const fetchLocationData = async (latitude, longitude) => {
    const accessToken = "pk.eyJ1IjoiY3Jpc3RpYW5vbmljb2xhdSIsImEiOiJjbHZmZnFoaXUwN2R4MmlxbTdsdGlreDEyIn0.-vhnpIfDMVyW04ekPBhQlg";
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      const locationData = await response.json();
      const features = locationData.features;

      const address = features.find(feature => feature.place_type.includes('address'))?.text || 'No address available';
      const region = features.find(feature => feature.place_type.includes('region'))?.text || 'No region available';
      const country = features.find(feature => feature.place_type.includes('country'))?.text || 'No country available';

      const combinedLocationDetails = `${address}, ${region}, ${country}`;
      console.log("Combined Location Details:", combinedLocationDetails);
      setLocationDetails(combinedLocationDetails);
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  useEffect(() => {
    if (propertyId && fetchImageURLsImoveis && fetchImageURLsBedrooms) {
        const fetchImages = async () => {
            const urls = await fetchImageURLsImoveis(propertyId);
            setImageURLs(urls);


            const urls2 = await fetchImageURLsByImovelId(propertyId);

            setImagesBedrooms(urls2);
            console.log(urls2);



        };
        fetchImages();
    }
}, [propertyId, fetchImageURLsImoveis, fetchImageURLsBedrooms]);

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;
    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? imageURLs.length - 1 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === imageURLs.length - 1 ? 0 : slideNumber + 1;
    }

    // Set opacity to 0 before changing the image
    const sliderImg = document.querySelector('.sliderImg');
    sliderImg.style.opacity = '0';

    setTimeout(() => {
      setSlideNumber(newSlideNumber);
      sliderImg.style.opacity = '1'; // Trigger the fade-in effect
    }, 200); // Match this duration with the CSS transition time
  };


  if (!propertyDetails) return <div>{t('loading')}</div>;

  const prices = propertyDetails.quartos.map(room => parseFloat(room.preco_mes));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceDisplay = minPrice === maxPrice
    ? `<span class="price-display">${minPrice}€</span>`
    : `${t('between')} <span class="price-display">${minPrice}€</span> ${t('and')} <span class="price-display">${maxPrice}€</span>`;

  const toggleOwnerDetails = () => {
    setShowOwnerDetails(!showOwnerDetails);

    if (!showOwnerDetails) {
      setTimeout(() => {
        document.querySelector('.ownerDetails').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);
    }
  };

  const scrollToSection = (section) => {
    document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
  };

  const handleRoomClick = (room, photos) => {
    setSelectedRoom(room);
    setRoomPhotos(photos);
  };

  const handleCloseRoomDetails = () => {
    setSelectedRoom(null);
  };

  return (
    <div className={`modal-overlay ${darkMode ? 'dark-mode' : 'light-mode'}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{propertyDetails.property.nome}</h2>
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
                <img src={imageURLs[slideNumber]} alt="" className="sliderImg" />
              </div>
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="arrow"
                onClick={() => handleMove("r")}
              />
            </div>
          )}

          {!open && !selectedRoom && (
            <>
              <div className="media-column-container">
                <div className="residenceImages">
                  {imageURLs.map((photos, i) => (
                    <div
                      className={`residenceImgWrapper ${i === 0 ? 'main' : ''}`}
                      key={i}
                      onClick={() => handleOpen(i)}
                    >
                      <img
                        src={imageURLs[i]}
                        alt=""
                        className="residenceImg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="data-column-container">
                <div className="fixed-header">
                  <h1 className="residenceTitle">
                    {propertyDetails.property.nome}, {t('floor')} {propertyDetails.property.piso}
                  </h1>
                  <div className="residenceInfo">
                    <div className="residenceAddress">
                      <FontAwesomeIcon icon={faLocationDot} />
                      <span>{propertyDetails.property.morada}</span>
                    </div>
                    <span className="residencePriceHighlight">
                      {propertyDetails.property.tipologia} {propertyDetails.property.equipado ? t('fully_equipped') : t('not_equipped')}
                    </span>
                  </div>

                  <div className="navbar2">
                    <button onClick={() => scrollToSection('description')}>{t('description')}</button>
                    <button onClick={() => scrollToSection('rooms')}>{t('rooms')}</button>
                    <button onClick={() => scrollToSection('widgets')}>{t('widgets')}</button>
                  </div>
                </div>

                <div className="scrollable-content">
                  <div id="description" className="section">
                    <h2>{t('description')}</h2>
                    <div className="details-and-price">
                      <div className="residenceDetailsTexts">
                        <p className="residenceDesc">
                          {propertyDetails.property.descricao}
                          <br />
                          <br />
                          {t('property_details')}:
                          <ul>
                            <li>{t('area')}: {propertyDetails.property.area} m²</li>
                            <li>{t('wcs')}: {propertyDetails.property.wcs}</li>
                            <li>{t('kitchen')} {propertyDetails.property.cozinha ? t('fully_equipped') : t('not_equipped')}</li>
                            <li>{t('internet')} {propertyDetails.property.internet ? t('included') : t('not_included')}</li>
                            <li>{t('expenses')} {propertyDetails.property.despesas ? t('included') : t('not_included')}</li>
                          </ul>
                        </p>
                        <div className='ratings'>
                          <CategoryRatings categoryAverages={categoryAverages} />
                        </div>
                      </div>
                      <div className="residenceDetailsPrice">
                        <h2>{t('take_advantage_of_this_opportunity')}</h2>
                        <span>
                          {propertyDetails.property.estacionamento_garagem ? t('garage_parking_available') : t('parking_not_included')}
                        </span>
                        <h2>
                          <span className='priceAll' dangerouslySetInnerHTML={{ __html: priceDisplay }} /> {t('per_month')}
                        </h2>
                        <button onClick={toggleOwnerDetails}>{t('reserve_or_book_now')}</button>
                        <div className={`ownerDetails ${showOwnerDetails ? 'visible' : ''}`}>
                          <h3>{t('contact_the_owner')}:</h3>
                          <p>{t('name')}: {propertyDetails.owner_info.nome}</p>
                          <p>{t('email')}: {propertyDetails.owner_info.email}</p>
                          <p>{t('phone')}: {propertyDetails.owner_info.telemovel}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="rooms" className="section">
                    <h2>{t('rooms')}</h2>
                    <div className="roomList">
                      {propertyDetails && propertyDetails.quartos.map((room, index) => (
                        <div key={index} className={`roomListItem ${!room.disponivel ? 'unavailable' : ''}`} onClick={() => handleRoomClick(room, imageURLs)}>
                          <div className="roomImageContainer">
                            <img src={room.image || imagesBedrooms[0]} alt="Room" className="roomListImage" />
                            <h3 className="roomName">{room.tipologia}</h3>
                          </div>
                          <div className="roomDetails2">
                            <div className="roomDetail">
                              <FontAwesomeIcon icon={faRulerCombined} />
                              <p>{room.area} m²</p>
                            </div>
                            <div className="roomDetail">
                              <FontAwesomeIcon icon={faSackDollar} />
                              <p>{room.despesas_incluidas}</p>
                            </div>
                            <div className="roomDetail">
                              <FontAwesomeIcon icon={faClipboardList} />
                              <p>{room.observacoes}</p>
                            </div>
                            <div className="roomDetail">
                              <FontAwesomeIcon icon={faBath} />
                              <p>{room.wc_privado ? t('private_bathroom') : t('no_private_bathroom')}</p>
                            </div>
                          </div>

                          <div className="roomPrice">
                            {room.disponivel ? `${room.preco_mes}€ ${t('per_month')}` : t('not_available')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div id="widgets" className="section">
                    <h2>{t('widgets')}</h2>
                    <div className="residenceDetails2">
                      <div className="walkDetails">
                        <TravelTimeCalculator propertyLat={propertyDetails.property.geom[0]} propertyLng={propertyDetails.property.geom[1]} />
                        <div className='walkWidget'>
                          <WalkScoreWidget
                            apiKey="g73c0420989bc43f79d00fa60cd4df386"
                            address={propertyDetails.property.morada}
                            width="300"
                            height="421"
                            backgroundColor="#FFFFFF"
                          />
                          <div className="source-text">Source: Walkscore API</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {selectedRoom && (
          <RoomDetails
            darkMode={darkMode}
            room={selectedRoom}
            photos={imagesBedrooms}
            onClose={onClose} // Ensure it closes both modals
            onBack={() => setSelectedRoom(null)} // Go back to the residence details
          />
        )}
      </div>
    </div>
  );
};

export default ResidenceDetails;