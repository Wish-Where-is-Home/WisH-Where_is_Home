import React from 'react';
import './ModalAdminRooms.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes,faCheck  } from '@fortawesome/free-solid-svg-icons';

function ModalAdminRooms({darkMode,roomData,closeModalRoom}) {

    console.log(roomData);

    return (
        <div className={`modal-overlay ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="modal-content">
                <div className='top-modal-property'>
                    <h2>Bedroom: {roomData.room_info.room_id}</h2>
                    <button onClick={closeModalRoom}>
                        <FontAwesomeIcon className='icon-close-modal' icon={faTimes} />
                    </button>
               </div>
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
               <div className='modal-property-info-div'>
                    <div className='modal-p-left'>
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
                            <p style={{ marginRight: '0.5rem' }}><strong>N' Quartos:</strong></p>
                            <p> {roomData.property_info.property_area}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Selo:</strong></p>
                            <p> {roomData.property_info.property_area}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Last update:</strong></p>
                            <p>{roomData.property_info.property_area}</p>
                        </div>
                    </div>
                    <div className='modal-p-right'>
                    <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Cozinha:</strong></p>
                            <p> {roomData.property_info.property_area}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Elevador:</strong></p>
                            <p> {roomData.property_info.property_area}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Equipado:</strong></p>
                            <p> {roomData.property_info.property_area}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Estacionamento/garagem:</strong></p>
                            <p> {roomData.property_info.property_area}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>N' Wcs:</strong></p>
                            <p> {roomData.property_info.property_area}</p>
                        </div>
                        <div style={{display:"flex",width:"100%", justifyContent:"center",flexDirection:"row"}}>
                            <p style={{ marginRight: '0.5rem' }}><strong>Wifi:</strong></p>
                            <p> {roomData.property_info.property_area}</p>
                        </div>
                    </div>
               </div>
                <div>
                    <button className='quartos-buttons-modal3'>
                        <FontAwesomeIcon className='icon-close-modal' icon={faCheck} />
                    </button>
                    <button className='quartos-buttons-modal2'>
                        <FontAwesomeIcon className='icon-close-modal' icon={faTimes} />
                    </button>
                </div>
            </div>
           
        </div>
    );
}

export default ModalAdminRooms;