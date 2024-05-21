import { useState, useEffect } from 'react';
import './ModalAdminRooms.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes,faCheck  } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"


function ModalAdminRooms({darkMode,roomData,closeModalRoom,fetchImageURLsImoveis,fetchImageURLsBedrooms}) {

    const [commentModalAcceptOpen, setCommentModalAcceptOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [confirmDenieModalOpen, setConfirmDenieModalOpen] = useState(false);
    const [roomId,setRoomId] = useState(null);

    
    const [imageURLs, setImageURLs] = useState([]);

  
    useEffect(() => {
        const fetchImages = async () => {
            if (roomData && fetchImageURLsBedrooms) {
                try {
                    console.log(roomData);
                    const urls = await fetchImageURLsBedrooms(roomData.room_info.room_id);
                    setImageURLs(urls || []);
                    console.log(urls);
                } catch (error) {
                    console.error('Error fetching images:', error);
                }
            }
        };
    
        fetchImages();
        console.log(imageURLs);
    }, [roomData, fetchImageURLsBedrooms]);

    const openCommentModal = (roomid) => {
        setCommentModalAcceptOpen(true);
        setRoomId(roomid)
    };

    const closeCommentModal = () => {
        setCommentModalAcceptOpen(false);
    };

    const openConfirmDenieModal = (roomid) => {
        setConfirmDenieModalOpen(true);
        setRoomId(roomid)
    };

    const closeConfirmDenieModal = () => {
        setConfirmDenieModalOpen(false);
    };

    let formattedDate = '';
    if (roomData.property_info.property_updated_at) {
        const parsedDate = new Date(roomData.property_info.property_updated_at);
        if (!isNaN(parsedDate.getTime())) {
            formattedDate = format(parsedDate, 'dd/MM/yyyy HH:mm:ss');
        } else {
            console.error('Invalid time value:', roomData.property_info.property_updated_at);
        }
    }

    let formattedDate2 = '';
    if (roomData.room_info.updated_at) {
        const parsedDate = new Date(roomData.room_info.updated_at);
        if (!isNaN(parsedDate.getTime())) {
            formattedDate2 = format(parsedDate, 'dd/MM/yyyy HH:mm:ss');
        } else {
            console.error('Invalid time value:', roomData.room_info.updated_at);
        }
    }

    const formatBooleanValue = (value) => {
        return value ? 'Sim' : 'Não';
    };

    const handleAcceptComment = () => {
        console.log('Comment accepted:', comment);
        
        const token = localStorage.getItem('token');
    
        axios.post(`http://mednat.ieeta.pt:9009/admin/update/room/status/${roomId}/`, { status: 'denied', comment: comment }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('Comment accepted successfully');
            closeCommentModal();
            Toastify({
                text: "Comment accepted successfully",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
            }).showToast();
        })
        .catch(error => {
            console.error('Error accepting comment:', error);
            Toastify({
                text: "Error accepting comment",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #FF5F6D, #FFC371)"
            }).showToast();
        });
    };
    
    const handleConfirmDeny = () => {
        console.log('Room denied');
        closeConfirmDenieModal();
    
        const token = localStorage.getItem('token');
        
        axios.post(`http://mednat.ieeta.pt:9009/admin/update/room/status/${roomId}/`, { status: 'accepted' }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('Room denied successfully');
            closeConfirmDenieModal();
            Toastify({
                text: "Room denied successfully",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
            }).showToast();
        })
        .catch(error => {
            console.error('Error denying room:', error);
            Toastify({
                text: "Error denying room",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #FF5F6D, #FFC371)"
            }).showToast();
        });
    };

    return (
        <div className={`modal-overlay ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="modal-content">
                <div className='top-modal-property'>
                    <h2>Bedroom: {roomData.room_info.room_id}</h2>
                    <button onClick={closeModalRoom}>
                        <FontAwesomeIcon className='icon-close-modal' icon={faTimes} />
                    </button>
               </div>
               
                {Array.isArray(imageURLs) && imageURLs.length > 0 ? (
                    <div className='bedroomspending'>
                        {imageURLs.map((url, index) => (
                            <img key={index} src={url} alt={`Image ${index}`} />
                        ))}
                    </div>
                ) : (
                    <p>No images available</p>
                )}
               <div className='modal-p-descricao' style={{display:"flex",flexDirection:"column"}}>
                <h3>
                    Owner: {roomData.owner_info.owner_name}
                </h3>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Phone Number:</strong></p>
                            <p> {roomData.owner_info.owner_phone}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Email:</strong></p>
                            <p> {roomData.owner_info.owner_email}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Description:</strong></p>
                            <p> {roomData.property_info.property_description}</p>
                        </div>
                        
               </div>
               <div className='modal-property-info-div2'>
                    <div className='modal-p-left'>
                        <p style={{color:"#0dddda"}}><strong>Property:</strong></p>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Address:</strong></p>
                            <p> {roomData.property_info.property_address}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Type:</strong></p>
                            <p> {roomData.property_info.property_type}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Area m2:</strong></p>
                            <p> {roomData.property_info.property_area}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Selo:</strong></p>
                            <p> {roomData.property_info.property_seal ? roomData.property_info.property_seal : 'N/A'}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Last update:</strong></p>
                            <p>{formattedDate}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Cozinha:</strong></p>
                            <p>{formatBooleanValue(roomData.property_info.property_kitchen)}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Elevador:</strong></p>
                            <p> {formatBooleanValue(roomData.property_info.property_elevator)}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Equipado:</strong></p>
                            <p> {formatBooleanValue(roomData.property_info.property_equipped)}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Estacionamento/garagem:</strong></p>
                            <p>{formatBooleanValue(roomData.property_info.property_parking)}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>N' Wcs:</strong></p>
                            <p> {roomData.property_info.property_wc}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Wifi:</strong></p>
                            <p> {formatBooleanValue(roomData.property_info.property_wifi)}</p>
                        </div>
                    </div>
                    <div className='modal-p-right'>
                    <p style={{color:"#0dddda"}}><strong>Bedroom:</strong></p>
                    <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Observations:</strong></p>
                            <p> {roomData.room_info.observations}</p>
                        </div>
                    <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Area m2:</strong></p>
                            <p> {roomData.room_info.area}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Available:</strong></p>
                            <p> {formatBooleanValue(roomData.room_info.available)}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Despesas:</strong></p>
                            <p> {roomData.room_info.despesas_incluidas}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Tipologia:</strong></p>
                            <p> {roomData.room_info.tipologia}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Wc privado:</strong></p>
                            <p> {formatBooleanValue(roomData.room_info.wc_privado)}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Update at:</strong></p>
                            <p> {formattedDate2}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Preco/mes  :</strong></p>
                            <p> {roomData.room_info.preco_mes}</p>
                        </div>
                    </div>
               </div>
                <div class="modal-admin-room-div-buttons" >
                    <button className='quartos-buttons-modal3' style={{marginRight:"3rem"}} onClick={() => openConfirmDenieModal(roomData.room_info.room_id)}>
                        <FontAwesomeIcon className='icon-close-modal' icon={faCheck} />
                    </button>
                    <button className='quartos-buttons-modal2' style={{marginLeft:"3rem"}} onClick={() => openCommentModal(roomData.room_info.room_id)}>
                        <FontAwesomeIcon className='icon-close-modal' icon={faTimes} />
                    </button>
                </div>
                <div className='modal-admin-room-div-buttons2'>
                    <h4>Accept</h4>
                    <h4>Deny</h4>
                </div>
            </div>
            {commentModalAcceptOpen && (
                <div className="comment-overlay">
                    <div className="comment-modal">
                        <p><strong>Write your comment here:</strong></p>
                        <textarea
                            rows="4"
                            cols="50"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Type your comment here..."
                            style={{ marginBottom: "10px", width: "100%" }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                            <button className="acceptButtonmodal" onClick={handleAcceptComment}>Deny</button>
                            <button className="NoButtonmodal" onClick={closeCommentModal}>No</button>
                        </div>
                    </div>
                </div>
            )}
            {confirmDenieModalOpen && (
                <div className="confirm-overlay">
                    <div className="confirm-modal">
                        <p>Are you sure you want to confirm this room?</p>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                            <button className="acceptButtonmodal" onClick={handleConfirmDeny}>Yes</button>
                            <button className="NoButtonmodal" onClick={closeConfirmDenieModal}>No</button>
                        </div>
                    </div>
                </div>
            )}

           
        </div>
    );
}

export default ModalAdminRooms;