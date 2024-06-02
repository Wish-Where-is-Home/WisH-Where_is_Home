import React from 'react';
import './ModalW.css';
import { useTranslation } from "react-i18next";

const ModalW = ({ handleCloseModal, handleKeepMetrics}) => {
    const { t } = useTranslation("common");

  return (
    <div className="modal-background">
      <div className="modal-content3">
        <p>{t('modalp')}</p>
        <div className="button-container">
            <button className="button-small-round"  onClick={handleKeepMetrics}>
                <span className="button-icon">{t('yes')}</span>
            </button>
            <button className="button-small-round" onClick={handleCloseModal}>
                <span className="button-icon">{t('close')}</span>
            </button>
        </div>
      </div>
    </div>
  );
}

export default ModalW;