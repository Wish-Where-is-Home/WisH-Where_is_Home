import React, { useState, useEffect } from 'react';
import './ModalProperty.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes,faInfoCircle,faCheck  } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

function ModalProperty({ darkMode, propertyData, propertyRooms, closeModal,fetchImageURLsImoveis,fetchImageURLsBedrooms }) {

    const [commentModalAcceptOpen, setCommentModalAcceptOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [confirmDenieModalOpen, setConfirmDenieModalOpen] = useState(false);
    const [roomId,setRoomId] = useState(null);
    const [imageURLs, setImageURLs] = useState([]);
    const [bedroomImageURLs, setBedroomImageURLs] = useState([]);

  useEffect(() => {
    if (propertyData && fetchImageURLsImoveis) {
      const fetchImages = async () => {
        const urls = await fetchImageURLsImoveis(propertyData.id);
        setImageURLs(urls);
        console.log(urls);
      };
      fetchImages();
    }
  }, [propertyData, fetchImageURLsImoveis]);

 

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
    if (propertyData.updated_at) {
        const parsedDate = new Date(propertyData.updated_at);
        if (!isNaN(parsedDate.getTime())) {
            formattedDate = format(parsedDate, 'dd/MM/yyyy HH:mm:ss');
        } else {
            console.error('Invalid time value:', propertyData.updated_at);
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
        })
        .catch(error => {
            console.error('Error accepting comment:', error);
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
        })
        .catch(error => {
            console.error('Error denying room:', error);
        });
    };

    return (
        <div className={`modal-overlay ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="modal-content">
               <div className='top-modal-property'>
                    <h2>{propertyData.nome}</h2>
                    <button onClick={closeModal}>
                        <FontAwesomeIcon className='icon-close-modal' icon={faTimes} />
                    </button>
               </div>
               {Array.isArray(imageURLs) && imageURLs.length > 0 ? (
                    <div className='bedroomspending'>
                        {imageURLs.map((url, index) => (
                            <img key={index} src={url}  />
                        ))}
                    </div>
                ) : (
                    <p>No images available</p>
                )}
               <div className='modal-p-descricao'>
                <p>{propertyData.descricao}</p>
               </div>
               <div className='modal-property-info-div'>
                    <div className='modal-p-left'>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Morada:</strong></p>
                            <p> {propertyData.morada}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Tipologia:</strong></p>
                            <p> {propertyData.tipologia}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Area m2:</strong></p>
                            <p> {propertyData.area}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>N' Quartos:</strong></p>
                            <p> {propertyData.rooms.length}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Selo:</strong></p>
                            <p> {propertyData.selo ? propertyData.selo : 'N/A'}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Last update:</strong></p>
                            <p>{formattedDate}</p>
                        </div>
                    </div>
                    <div className='modal-p-right'>
                    <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Cozinha:</strong></p>
                            <p> {formatBooleanValue(propertyData.cozinha)}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Elevador:</strong></p>
                            <p> {formatBooleanValue(propertyData.elevador)}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Equipado:</strong></p>
                            <p> {formatBooleanValue(propertyData.equipado)}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Estacionamento/garagem:</strong></p>
                            <p> {formatBooleanValue(propertyData.estacionamento_garagem)}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>N' Wcs:</strong></p>
                            <p> {propertyData.wcs}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Wifi:</strong></p>
                            <p> {formatBooleanValue(propertyData.wifi)}</p>
                        </div>
                    </div>
               </div>
               <div>
                <h3>Quartos:</h3>
                <div className="modal-room-container">
                    {propertyRooms.map(room => (
                        <div key={room.id} className="modal-room-card">
                            <div style={{display:"flex",flexDirection:"column",padding:"15px"}}></div>
                            <div style={{display:"flex",flexDirection:"column",padding:"15px"}}>
                                <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                                        <p style={{ marginRight: '0.5rem' }}><strong>Id:</strong></p>
                                        <p>{room.id}</p>
                                </div>
                                <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                                        <p style={{ marginRight: '0.5rem' }}><strong>Area m2:</strong></p>
                                        <p>{room.area}</p>
                                </div>
                                <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                                        <p style={{ marginRight: '0.5rem' }}><strong>Preco por mes:</strong></p>
                                        <p>{room.preco_mes}</p>
                                </div>
                                <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                                        <p style={{ marginRight: '0.5rem' }}><strong>wc privado:</strong></p>
                                        <p>{formatBooleanValue(room.wc_privado)}</p>
                                </div>
                            </div>
                            <div style={{display:"flex",flexDirection:"column",padding:"15px"}}>
                                <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                                        <p style={{ marginRight: '0.5rem' }}><strong>Disponivel:</strong></p>
                                        <p>{formatBooleanValue(room.disponivel)}</p>
                                </div>
                                <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                                        <p style={{ marginRight: '0.5rem' }}><strong>Tipologia:</strong></p>
                                        <p>{room.tipologia}</p>
                                </div>
                                <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row",}}>
                                        <p style={{ marginRight: '0.5rem' }}><strong>Despesas Incluidas:</strong></p>
                                        <p>{room.despesas_incluidas}</p>
                                </div>
                               
                            </div>
                            <div style={{display:"flex",flexDirection:"column"}}>
                                <p><strong>State: </strong> {room.estado}</p>
                                {room.estado === 'denied' ? (
                                     <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:"100%",marginTop:"3rem"}}>
                                        <button className='quartos-buttons-modal3' onClick={() => openConfirmDenieModal(room.id)}>
                                            <FontAwesomeIcon className='icon-close-modal' icon={faCheck} />
                                        </button>
                                        <p>Accept</p>
                                    </div>
                                    ) : (
                                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:"100%",marginTop:"3rem"}}>
                                        <button className='quartos-buttons-modal2' onClick={() => openCommentModal(room.id)}>
                                            <FontAwesomeIcon className='icon-close-modal' icon={faTimes} />
                                        </button>
                                        <p>Deny</p>
                                        </div>
                                    )}
                            </div>
                        </div>
                    ))}
                </div>
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
                            <button className="acceptButtonmodal" onClick={closeCommentModal} >No</button>
                            <button className="NoButtonmodal" onClick={handleAcceptComment}>Deny</button>
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

export default ModalProperty;
