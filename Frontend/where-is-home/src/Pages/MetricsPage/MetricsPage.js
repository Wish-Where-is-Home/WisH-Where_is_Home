import React from 'react';
import './MetricsPage.css';
import {useTranslation} from "react-i18next";
import Properties from '../../Components/Properties/Sidebar';
import Metrics from '../../Components/Metrics/Metrics';

function MetricsPage() {
    const {t} = useTranslation("common");
    return (
        <div className="metrics-page-container">
            <Properties />
            <Metrics />
        </div>
    );
}

export default MetricsPage;
