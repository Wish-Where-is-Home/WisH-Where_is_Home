import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';


function AdminPage( {darkMode}) {

    const [selectedTab, setSelectedTab] = useState('toConfirm');

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };



    return (
        <div className={`admin-section ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className='properties-container-admin'>
                <div className='admin-top-choose'>
                    <div
                            className={`achoose-perconfirm ${selectedTab === 'toConfirm' ? 'selected' : ''}`}
                            onClick={() => handleTabClick('toConfirm')}
                        >
                            <p>Properties to confirm</p>
                        </div>
                        <div
                            className={`achoose-confirmed ${selectedTab === 'confirmed' ? 'selected' : ''}`}
                            onClick={() => handleTabClick('confirmed')}
                        >
                            <p>Properties Confirmed</p>
                        </div>
                    <div className='afilter-div'>
                        <button className='afilter-button'>
                            <FontAwesomeIcon icon={faFilter} style={{color:"var(--blacktowhite)",fontSize:"1.3rem"}} />
                        </button>
                    </div>
                </div>
                <div className='ashow-properties'>
                {selectedTab === 'toConfirm' ? (
                        <p>Content for Properties to confirm</p>
                    ) : selectedTab === 'confirmed' ? (
                        <p>Content for Confirmed Properties</p>
                    ) : null}
                </div>
            </div>
        </div>
    );
}export default AdminPage;