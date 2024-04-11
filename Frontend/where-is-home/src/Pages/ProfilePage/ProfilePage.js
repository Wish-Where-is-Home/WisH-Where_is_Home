import React from 'react';
import './ProfilePage.css';
import PreferencesSection from '../../Components/PreferencesSection/PreferencesSection';
import { useTranslation } from "react-i18next";

function ProfilePage({ darkMode }) {
    const { t } = useTranslation("common");

    // Example preferences data
    const preferences = [
        {
            title: t('Preference1'),
            subtitles: [
                { name: t('Subtitle1'), rating: 4 },
                { name: t('Subtitle2'), rating: 3 },
            ]
        },
        {
            title: t('Preference2'),
            subtitles: [
                { name: t('Subtitle3'), rating: 5 },
                { name: t('Subtitle4'), rating: 2 },
            ]
        },
    ];


    return (
        <div className={`ProfilePage ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className='backline'></div>
            <div className='profile-container'>
                <div className='profile-text-container'>
                    <h2>{t('Profile')}</h2>
                    <div className='form-container'>
                        <form>
                            <div className='form-group-row'>
                                <div className='form-group'>
                                    <label htmlFor='name'>{t('Name')}</label>
                                    <input type='text' id='name' name='name' />
                                </div>
                            </div>
                            <div className='form-group-row'>
                                <div className='form-group'>
                                    <label htmlFor='address'>{t('Address')}</label>
                                    <input type='text' id='address' name='address' />
                                </div>
                            </div>
                            <div className='form-group-row'>
                                <div className='form-group'>
                                    <label htmlFor='email'>{t('Email')}</label>
                                    <input type='email' id='email' name='email' />
                                </div>
                            </div>
                            <div className='form-group-row'>
                                <div className='form-group'>
                                    <label htmlFor='password'>{t('Password')}</label>
                                    <input type='password' id='password' name='password' />
                                </div>
                            </div>
                        </form>
                    </div>
                    <hr className='divider' />
                    {/* <PreferencesSection preferences={preferences} /> */}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;