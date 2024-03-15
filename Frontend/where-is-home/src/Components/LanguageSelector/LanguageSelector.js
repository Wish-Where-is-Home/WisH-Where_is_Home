import './LanguageSelector.css';
import { useTranslation } from "react-i18next";

import PTFlag from './../../Assets/Flags/PTflag.png';
import ENFlag from './../../Assets/Flags/UKflag.png';

export const LanguageSelector = ({ style }) => {
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    const [t, i18n] = useTranslation('common');
    const currentLanguage = i18n.language;

    const isActiveLanguage = (langCode) => {
        return currentLanguage === langCode ? "active-language" : "";
    };

    return (
        <div className="LanguageSelector" style={style}>
            <a href="#" onClick={() => changeLanguage('pt')} className={isActiveLanguage('pt')}>
                <img src={PTFlag} alt="PT Flag" style={{ width: '20px', height: 'auto', marginRight:'10px' }} />
                PT
            </a>
            <span className="vertical-bar">|</span>
            <a href="#" onClick={() => changeLanguage('en')} className={isActiveLanguage('en')}>
                <img src={ENFlag} alt="EN Flag" style={{ width: '20px', height: 'auto', marginRight:'10px' }} />
                EN
            </a>
        </div>
    );
};