import React, { useEffect, useState } from "react";
import "./OwnerPage.css";
import PropertyDetails from "../../Components/OwnerPropDetails/OwnerPropDetails";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

function OwnerPage({ darkMode , handleSubmitImagesImoveis, handleSubmitImagesBedrooms}) {
  const [properties, setProperties] = useState([]);
  const [selectedTab, setSelectedTab] = useState("accepted");
  const [showForm, setShowForm] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [selectedRoomPhotos, setSelectedRoomPhotos] = useState([]);
  const [numRooms, setNumRooms] = useState(1);
  const [wcs, setWcs] = useState(1);
  const [token, setToken] = useState("");
  const [id_propriedade, set_id_propriedade] = useState(null);

  useEffect(() => {
    // Fetch token from local storage or wherever it is stored
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    fetchProperties(selectedTab);
  }, [selectedTab]);

  useEffect(() => {
    fetchProperties(selectedTab);
    fetchRooms();
  }, [selectedTab]);

  const fetchProperties = (tab) => {
    const endpointMap = {
      accepted: "http://mednat.ieeta.pt:9009/owner/approved/properties/",
      on_hold: "http://mednat.ieeta.pt:9009/owner/denied_on_hold/properties/",
      denied: "http://mednat.ieeta.pt:9009/owner/denied_on_hold/properties/",
    };
    const endpoint = endpointMap[tab];

    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    fetch(endpoint, {
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        let filteredProperties = data;
        if (tab === "on_hold" || tab === "denied") {
          filteredProperties = data[`${tab}_rooms_properties`];
        } else if (tab === "accepted") {
          filteredProperties = data['approved_rooms_properties']
        }
        setProperties(filteredProperties);
        fetchRooms(filteredProperties);
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
      });
  };

  const [allRooms, setAllRooms] = useState([]);
  const fetchRooms = () => {
    const token = localStorage.getItem("token");

    // Fetch all rooms from both approved and denied/on hold properties
    const fetchApprovedRooms = fetch(
      "http://mednat.ieeta.pt:9009/owner/approved/rooms/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const fetchDeniedOnHoldRooms = fetch(
      "http://mednat.ieeta.pt:9009/owner/denied_on_hold/rooms/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Promise.all([fetchApprovedRooms, fetchDeniedOnHoldRooms])
      .then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      )
      .then((data) => {
        // Combine rooms from both endpoints
        const allRoomsData = [
          ...data[0].rooms,
          ...data[1].denied_rooms,
          ...data[1].onHold_rooms,
        ];
        setAllRooms(allRoomsData);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
      });
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handleAddPropertyClick = () => {
    setShowForm(!showForm);
  };
  const handleAddRoomsClick = () => {
    setShowForm(!showForm);
    setShowRoomForm(!showRoomForm);
  };

  

  /// ADD PROPERTY FORM ///
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const propertyPhotos = formData.getAll("propertyPhoto");
    if (propertyPhotos.length > 6) {
      console.error("You can upload a maximum of 6 photos.");
      return;
    }

    const propertyName = formData.get("propertyName");
    const area = parseFloat(formData.get("propertyArea"));
    const typology = formData.get("propertyTypology");
    const address = formData.get("propertyAddress");
    const zipCode = formData.get("propertyZipCode");
    const floor = parseInt(formData.get("propertyFloor"));
    const hasElevator = formData.get("propertyElevator") === "true";
    const numWcs = parseInt(formData.get("propertyWcs"));
    setWcs(parseInt(formData.get("propertyWcs")));
    const hasGarageParking = formData.get("propertyParkingGarage") === "true";
    const isEquipped = formData.get("propertyEquipped") === "true";
    const hasKitchen = formData.get("propertyKitchen") === "true";
    const hasWifi = formData.get("propertyWifi") === "true";
    const description = formData.get("propertyDescription");
    const seal = formData.get("propertySeal");
    const createdAt = formData.get("propertyCreatedAt");
    const updatedAt = formData.get("propertyUpdatedAt");

    // garante que o zip code esta correto
    if (
      zipCode.length !== 8 &&
      zipCode.split("-")[0].length !== 4 &&
      zipCode.split("-")[1].length !== 2
    ) {
      console.error("Invalid zip code");
      return;
    }

    const submittedNumRooms = formData.get("numRooms");
    if (submittedNumRooms) {
      setNumRooms(parseInt(submittedNumRooms)); // Convert to integer
    }

    // Get the currently logged-in user's ID
    // const currentUser = firebase.auth().currentUser;
    // if (!currentUser) {
    //     console.error('No user is currently logged in.');
    //     return;
    // }
    // const ownerId = currentUser.uid;

    // Check if all required fields are filled

    const isValid = !(
      propertyName &&
      !isNaN(area) &&
      typology &&
      address &&
      !isNaN(floor) &&
      !isNaN(numWcs) &&
      description
    );

    if (!isValid) {
      console.error("Invalid form data");
      return;
    } else {
      handleAddRoomsClick();
    }

    const roomPhotos = [];
    const fullAddress = address + ", " + zipCode;

    let geom = null;
    try {
      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        fullAddress
      )}.json?access_token=pk.eyJ1IjoiY3Jpc3RpYW5vbmljb2xhdSIsImEiOiJjbHZmZnFoaXUwN2R4MmlxbTdsdGlreDEyIn0.-vhnpIfDMVyW04ekPBhQlg`;
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data.features.length === 0) {
        console.error("No results found for the given address");
        return;
      }
      const [lat, long] = data.features[0].center;
      geom = {
        type: "Point",
        coordinates: [long, lat], // GeoJSON format: [longitude, latitude]
      };
    } catch (error) {
      console.error("Error geocoding address:", error);
      return;
    }

    try {
      const downloadURLs = await handleSubmitImagesImoveis(
        propertyPhotos,
        id_propriedade
      );
      console.log(downloadURLs);
    } catch (error) {
      console.error("Error uploading property photos:", error);
    }

    const propertyData = {
      id: null,
      owner: null, // Use the ID of the currently logged-in user
      nome: propertyName,
      morada: fullAddress,
      tipologia: typology,
      area: area,
      geom: geom,
      piso: floor,
      elevador: hasElevator,
      wcs: wcs,
      estacionamento_garagem: hasGarageParking,
      equipado: isEquipped,
      cozinha: hasKitchen,
      wifi: hasWifi,
      descricao: description,
      selo: seal,
      created_at: createdAt,
      updated_at: updatedAt,
      photos: propertyPhotos,
      rooms: roomPhotos,
    };

    try {
      set_id_propriedade(null);
      const response = await fetch(
        "http://mednat.ieeta.pt:9009/owner/create/property/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(propertyData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create property");
      }

      const responseData = await response.json();
      console.log(responseData);
      const propertyId = responseData.id;
      set_id_propriedade(propertyId);
      handleSubmitImagesImoveis(propertyPhotos, String(propertyId));
      
      handleAddRoomsClick();

      Toastify({
        text: "Property created successfully!",
        duration: 3000, // 3 seconds
        close: true,
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      }).showToast();

    } catch (error) {
      console.error("Error creating property:", error);
      Toastify({
        text: "Error creating property: " + error.message,
        duration: 5000, // 5 seconds
        close: true,
        backgroundColor: "#ff4444",
      }).showToast();
    }
  };
  const handlePhotoChange = (event) => {
    const files = event.target.files;
    const selected = [];
    for (let i = 0; i < files.length; i++) {
      selected.push(URL.createObjectURL(files[i]));
    }
    setSelectedPhotos(selected);
  };

  /// ADD ROOMS FORM ///
  const handleNumRoomsChange = (event) => {
    setNumRooms(parseInt(event.target.value)); // Parse value as integer and update numRooms
  };
  const handleNumWcsChange = (event) => {
    setWcs(parseInt(event.target.value)); // Parse value as integer and update numRooms
  };
  const handleRoomsSubmit = async (event) => {
    event.preventDefault();
    const propertyId = id_propriedade;

    const formData = new FormData(event.target);

    const roomDataArray = [];

    // Iterate through each room to collect its data
    for (let i = 0; i < numRooms; i++) {
      const roomArea = parseFloat(formData.get(`roomArea${i}`));
      const despesasIncluidas = formData.get(`despesasIncluidas${i}`);
      const wcPrivado = formData.get(`wcPrivado${i}`) === "true";
      const disponivel = formData.get(`disponivel${i}`) === "true";
      const preco_mes = parseFloat(formData.get(`roomPrice${i}`));
      const tipologia = formData.get(`tipologia${i}`);
      const observaçoes = formData.get(`observaçoes${i}`);
      const roomPhotos = selectedRoomPhotos[i] || []; // Selected photos for this room

      if (isNaN(roomArea) || roomArea <= 0) {
        console.error(`Invalid room area for Room ${i + 1}`);
        return;
      }

      roomDataArray.push({
        imovel_id: propertyId,
        area: roomArea,
        despesas_incluidas: despesasIncluidas,
        wc_privado: wcPrivado,
        disponivel: disponivel,
        photos: roomPhotos,
        tipologia: tipologia,
        observacoes: observaçoes,
        preco_mes: preco_mes,
      });
      console.log(roomDataArray);
    }

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token not available");
      // Handle the absence of token, such as redirecting to login or displaying an error message
      return;
    }

    for (const roomData of roomDataArray) {
      try {
        const response = await fetch(
          "http://mednat.ieeta.pt:9009/owner/create/room/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(roomData),
          }

        );
        if (!response.ok) {
          throw new Error("Failed to create room");
        }

        const responseData = await response.json();

        handleSubmitImagesBedrooms(roomData.photos, String(responseData.room_id) ,String(responseData.imovel_id));
        Toastify({
          text: "Room created successfully!",
          duration: 3000,
          close: true,
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        }).showToast();
      } catch (error) {
        console.error("Error creating room:", error);
        Toastify({
          text: "Error creating room.",
          duration: 3000,
          close: true,
          backgroundColor: "#ff4444",
        }).showToast();
      }
    }
    setShowRoomForm(!showRoomForm);

  };

  const handleRoomPhotoChange = (event, roomIndex) => {
    const files = event.target.files;
    const selected = [];
    for (let i = 0; i < files.length; i++) {
      selected.push(URL.createObjectURL(files[i]));
    }

    const updatedSelectedRoomPhotos = [...selectedRoomPhotos];
    updatedSelectedRoomPhotos[roomIndex] = selected;
    setSelectedRoomPhotos(updatedSelectedRoomPhotos);
  };

  const handleRoomAvailabilityChange = (roomId, newAvailability) => {
    setAllRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId ? { ...room, disponivel: newAvailability } : room
      )
    );
  };

  const handleDeleteProperty = (propertyId) => {
    setProperties((prevProperties) =>
      prevProperties.filter((property) => property.id !== propertyId)
    );
    setAllRooms((prevRooms) =>
      prevRooms.filter((room) => room.property_id !== propertyId)
    );
  };

  return (
    <div className={`owner-section ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className="properties-container-owner">
        <div className="left-panel">
          <h2>My Properties</h2>
          <div className="tabs">
            <div
              className={`tab ${selectedTab === "accepted" ? "selected" : ""}`}
              onClick={() => handleTabClick("accepted")}
            >
              Accepted
            </div>
            <div
              className={`tab ${selectedTab === "on_hold" ? "selected" : ""}`}
              onClick={() => handleTabClick("on_hold")}
            >
              On Hold
            </div>
            <div
              className={`tab ${selectedTab === "denied" ? "selected" : ""}`}
              onClick={() => handleTabClick("denied")}
            >
              Denied
            </div>
          </div>
        </div>
        <div className="o-show-properties">
          {properties.length > 0 &&
            properties.map((property) => (
              <PropertyDetails
                key={property.id}
                property={property}
                allRooms={allRooms}
                token={token}
                onRoomAvailabilityChange={handleRoomAvailabilityChange}
                onDeleteProperty={handleDeleteProperty}
              />
            ))}
        </div>
      </div>

      <div className="right-panel">
        {!showForm && !showRoomForm ? (
          <button
            className="add-property-button"
            onClick={handleAddPropertyClick}
          >
            Add Property
          </button>
        ) : (
          <p></p>
        )}
        {showForm && (
          <div className="property-form">
            <h2>Add Property</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <label htmlFor="propertyName">Name:</label>
              <input
                type="text"
                id="propertyName"
                name="propertyName"
                required
              />

              <div>
                <label htmlFor="propertyAddress">Address:</label>
                <input
                  type="text"
                  id="propertyAddress"
                  name="propertyAddress"
                  required
                />
              </div>

              <div>
                <label htmlFor="propertyZipCode">Zip Code:</label>
                <input
                  type="text"
                  id="propertyZipCode"
                  name="propertyZipCode"
                  required
                />
              </div>

              <div className="input-group">
                <div>
                  <label htmlFor="propertyArea">Area (m²):</label>
                  <input
                    type="number"
                    id="propertyArea"
                    name="propertyArea"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="propertyFloor">Floor:</label>
                  <input
                    type="number"
                    id="propertyFloor"
                    name="propertyFloor"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="propertyTypology">Typology:</label>
                <input
                  type="text"
                  id="propertyTypology"
                  name="propertyTypology"
                  required
                />
              </div>

              <div className="input-group">
                <div>
                  <label htmlFor="numRooms">Number of Rooms:</label>
                  <input
                    type="number"
                    id="numRooms"
                    name="numRooms"
                    min="1"
                    required
                    onChange={handleNumRoomsChange}
                  />
                </div>

                <div>
                  <label htmlFor="propertyWcs">Number of Bathrooms:</label>
                  <input
                    type="number"
                    id="propertyWcs"
                    min="1"
                    required
                    onChange={handleNumWcsChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="propertyDescription">Description:</label>
                <input
                  type="text"
                  id="propertyDescription"
                  name="propertyDescription"
                  required
                />
              </div>

              <div className="checkbox-group">
                <div>
                  <label htmlFor="propertyElevator">Elevator:</label>
                  <input
                    type="checkbox"
                    id="propertyElevator"
                    name="propertyElevator"
                  />
                </div>

                <div>
                  <label htmlFor="propertyParking">Parking:</label>
                  <input
                    type="checkbox"
                    id="propertyParking"
                    name="propertyParking"
                  />
                </div>

                <div>
                  <label htmlFor="propertyEquipped">Equipped:</label>
                  <input
                    type="checkbox"
                    id="propertyEquipped"
                    name="propertyEquipped"
                  />
                </div>

                <div>
                  <label htmlFor="propertyKitchen">Kitchen:</label>
                  <input
                    type="checkbox"
                    id="propertyKitchen"
                    name="propertyKitchen"
                  />
                </div>

                <div>
                  <label htmlFor="propertyWifi">WiFi:</label>
                  <input
                    type="checkbox"
                    id="propertyWifi"
                    name="propertyWifi"
                  />
                </div>
              </div>

              <div>
                <div className="photoWrapper">
                  <label htmlFor="propertyPhoto">Photos:</label>
                  <label className="photoInput" htmlFor="propertyPhoto">
                    Add Photos
                    <input
                      type="file"
                      id="propertyPhoto"
                      name="propertyPhoto"
                      accept="image/png, image/jpeg"
                      multiple
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
                <div className="selectedPhotos">
                  {selectedPhotos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Selected Photo ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              <button className="submitProperty" type="submit">
                Add Rooms
              </button>
            </form>
          </div>
        )}

        {showRoomForm && (
          <div className="room-form">
            <h2>Add Rooms</h2>
            <form onSubmit={handleRoomsSubmit} encType="multipart/form-data">
              {[...Array(numRooms)].map((_, index) => (
                <div key={index} className="room-input-container">
                  <h3>Room {index + 1}:</h3>
                  <div className="input-rooms">
                    <div className="input-rooms-nums">
                      <div>
                        <label htmlFor={`roomArea${index}`}>
                          Room Area (m²):
                        </label>
                        <input
                          type="number"
                          id={`roomArea${index}`}
                          name={`roomArea${index}`}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor={`roomPrice${index}`}>
                          Room Price per Month (€):
                        </label>
                        <input
                          type="number"
                          id={`roomPrice${index}`}
                          name={`roomPrice${index}`}
                          required
                        />
                      </div>
                    </div>

                    <div className="included-expenses">
                      <label htmlFor={`tipologia${index}`}>Type of room:</label>
                      <input
                        type="text"
                        id={`tipologia${index}`}
                        name={`tipologia${index}`}
                        required
                      />
                    </div>

                    <div className="included-expenses">
                      <label htmlFor={`observaçoes${index}`}>
                        Description:
                      </label>
                      <input
                        type="text"
                        id={`observaçoes${index}`}
                        name={`observaçoes${index}`}
                        required
                      />
                    </div>

                    <div className="included-expenses">
                      <label htmlFor={`despesasIncluidas${index}`}>
                        Included Expenses:
                      </label>
                      <input
                        type="text"
                        id={`despesasIncluidas${index}`}
                        name={`despesasIncluidas${index}`}
                        required
                      />
                    </div>

                    <div className="input-rooms-checkbox">
                      <div className="input-rooms-checkbox-col">
                        <label htmlFor={`wcPrivado${index}`}>
                          Private Bathroom:
                        </label>
                        <input
                          type="checkbox"
                          id={`wcPrivado${index}`}
                          name={`wcPrivado${index}`}
                        ></input>
                      </div>

                      <div className="input-rooms-checkbox-col">
                        <label htmlFor={`disponivel${index}`}>Available:</label>
                        <input
                          type="checkbox"
                          id={`disponivel${index}`}
                          name={`disponivel${index}`}
                        ></input>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="photoWrapper">
                      <label htmlFor={`roomPhoto${index}`}>Room Photos:</label>
                      <label
                        className="photoInput"
                        htmlFor={`roomPhoto${index}`}
                      >
                        Add Room Photos
                        <input
                          type="file"
                          id={`roomPhoto${index}`}
                          name={`roomPhoto${index}`}
                          accept="image/png, image/jpeg"
                          multiple
                          onChange={(event) =>
                            handleRoomPhotoChange(event, index)
                          } // Pass roomIndex
                        />
                      </label>
                    </div>

                    <div className="selectedPhotos">
                      {selectedRoomPhotos[index] &&
                        selectedRoomPhotos[index].map((photo, photoIndex) => (
                          <img
                            key={photoIndex}
                            src={photo}
                            alt={`Selected Room Photo ${photoIndex + 1}`}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              ))}
              <button className="submitProperty" type="submit">
                Submit Property
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerPage;
