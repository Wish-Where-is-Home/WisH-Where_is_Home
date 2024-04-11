import React from 'react';
import './PreferencesSection.css';
import { useTranslation } from "react-i18next";

function PreferencesSection({ preferences }) {
    const { t } = useTranslation("common");

    return (
        <div className='preferences-container'>
            {preferences.map((preference, index) => (
                <div key={index}>
                    <h1>{preference.title}</h1>
                    <div className='subtitles-container'>
                        {preference.subtitles.map((subtitle, idx) => (
                            <div key={idx} className='subtitle'>
                                <p>{subtitle.name}</p>
                                {/* Render a rating component here */}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PreferencesSection;
