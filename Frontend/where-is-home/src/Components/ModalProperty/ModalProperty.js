import React from 'react';
import './ModalProperty.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes,faInfoCircle,faCheck  } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

function ModalProperty({ darkMode, propertyData, propertyRooms, closeModal }) {

    console.log(propertyData);
    console.log(propertyRooms);

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

    return (
        <div className={`modal-overlay ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="modal-content">
               <div className='top-modal-property'>
                    <h2>{propertyData.nome}</h2>
                    <button onClick={closeModal}>
                        <FontAwesomeIcon className='icon-close-modal' icon={faTimes} />
                    </button>
               </div>
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
                            <div>
                                {room.estado === 'denied' ? (
                                        <button className='quartos-buttons-modal3'>
                                            <FontAwesomeIcon className='icon-close-modal' icon={faCheck} />
                                        </button>
                                    ) : (
                                        <button className='quartos-buttons-modal2'>
                                            <FontAwesomeIcon className='icon-close-modal' icon={faTimes} />
                                        </button>
                                    )}
                            </div>
                        </div>
                    ))}
                </div>
               </div>
            </div>
        </div>
    );
}

export default ModalProperty;
