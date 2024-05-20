import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import './Homepage.css';
import {useTranslation} from "react-i18next";
import videobackground from './../../Assets/Video/videobackground.mp4';
import { FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext/AuthContext';


console.log("Token:", localStorage.getItem('token'));

function Homepage( {darkMode}) {
    const [selectedDistrict, setSelectedDistrict] = useState('Portugal');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const { isAuthenticated,userInfo,logoutUser} = useAuth();


    const navigate = useNavigate();
    const {t} = useTranslation("common");

    const handleInfoMouseEnter = () => {
       
        const content = (
            <div className='modalhh'>
                <p>{t('infotext')}.</p>
            </div>
        );
        
        
        setModalContent(content);
        setModalVisible(true);
    };

    const handleInfoMouseLeave = () => {
        setModalVisible(false);
    };
    

      const handleDistrictClick = (event, districtId) => {
        const isOptionClick = event.target.tagName === 'OPTION';
        
        if (!isOptionClick) {
            const prevSelectedPath = document.getElementById(selectedDistrict);
            if (prevSelectedPath) {
                prevSelectedPath.style.fill = 'white'; 
            }
            
            setSelectedDistrict(districtId);
        
            const selectElement = document.getElementById('districtSelect');
            selectElement.value = districtId;
        }
        
        const selectedPath = document.getElementById(districtId);
        if (selectedPath) {
            selectedPath.style.fill = '#373434';
        }
    };

    useEffect(() => {
        const video = document.querySelector('.video');
        video.addEventListener('webkitpresentationmodechanged', (e) => {
            if (video.webkitPresentationMode === 'picture-in-picture') {
                video.webkitSetPresentationMode('inline');
            }
        });
        return () => {
            video.removeEventListener('webkitpresentationmodechanged', (e) => {
                if (video.webkitPresentationMode === 'picture-in-picture') {
                    video.webkitSetPresentationMode('inline');
                }
            });
        };
    }, []);

    const handleButtonClick = (selectedDistrict) => {
        
        const districtIds = {
            Portugal: "0",
            Aveiro: "01",
            Beja: "02",
            Braga: "03",
            Braganca: "04",
            Castelo_Branco: "05",
            Coimbra: "06",
            Évora: "07",
            Faro: "08",
            Guarda: "09",
            Leiria: "10",
            Lisboa: "11",
            Portalegre: "12",
            Porto: "13",
            Santarem: "14",
            Setúbal: "15",
            Viana_do_Castelo: "16",
            Vila_Real: "17",
            Viseu: "18"
        };
    
        
        const districtId = districtIds[selectedDistrict];
    
        
        navigate('/quiz', { state: { selectedDistrict, districtId } });
    };
    
    

return (
    <div className={`home-section ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="video-container">
                        <video autoPlay muted loop className="video" disablePictureInPicture controlsList="nodownload">
                            <source src={
                                videobackground} type="video/mp4" />
                        </video>
        </div>
        <div className='hometitle2'>
            <h2 className='hometitle2text btn-shine'>
                {t('QuoteHome')}!
            </h2>
        </div>
        <div className='hometitledown'>
            <h2 className='hometitletext2 btn-shine'>
                {t('QuoteHome2')}!
            </h2>
        </div>

        

        <div className='home-container'>
            <div className='left'>
            <p className='selecttitle'>{t('selectedistrict')}:</p>
            <div className='select-district'>
                            <select
                                id="districtSelect"
                                className='select'
                                size={1}
                                onChange={(event) => handleDistrictClick(event, event.target.value)}
                                value={selectedDistrict}
                            >
                                <option value="Portugal" >Portugal</option>
                                <option value="Aveiro">Aveiro</option>
                                <option value="Beja">Beja</option>
                                <option value="Braga">Braga</option>
                                <option value="Braganca">Bragança</option>
                                <option value="Castelo_Branco">Castelo Branco</option>
                                <option value="Coimbra">Coimbra</option>
                                <option value="Évora">Évora</option>
                                <option value="Faro">Faro</option>
                                <option value="Guarda">Guarda</option>
                                <option value="Leiria">Leiria</option>
                                <option value="Lisboa">Lisboa</option>
                                <option value="Portalegre">Portalegre</option>
                                <option value="Porto">Porto</option>
                                <option value="Santarem">Santarém</option>
                                <option value="Setúbal">Setúbal</option>
                                <option value="Viana_do_Castelo">Viana do Castelo</option>
                                <option value="Vila_Real">Vila Real</option>
                                <option value="Viseu">Viseu</option>
                            </select>
            </div>
                <div className='home-info' style={{ position: 'relative',width:'100%',paddingBottom:"3.5rem" }}>
                                <FaInfoCircle 
                                    onMouseEnter={handleInfoMouseEnter} 
                                    onMouseLeave={handleInfoMouseLeave} 
                                    style={{ cursor: 'pointer',color:"white",alignSelf:'center'}} 
                                />
                    <div className={modalVisible ? "modalh visible" : "modalh"}>
                                                <div className="modalh-content">
                                                    {modalContent}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                        <button className='button-homepage' onClick={() => handleButtonClick(selectedDistrict)}>
                            {t('button-homepage-text')}
                        </button>
                        </div>
            </div>
            <div className='right'>
                    <svg className="svg-icon" width="500" height="700" viewBox="0 0 12969 26674">
                        <path id="Viana_do_Castelo"  onClick={(event) => handleDistrictClick(event, 'Viana_do_Castelo')}  data-z="31" className="district z z31" d="M5329 1730c-66-17-64 0-92 15l-110 113c-121 4-292 156-324 162-42-3-181 2-190-1l-63-42-153 42c-101 28-190 153-246 162-51-1-120-63-171 40-4 70-22 172-11 235-20 5-54 13-72 31l-21 36c-2 67 22 43 26 107l-40 111-33 28-36-11-62-98c-65-6-65 3-114 40-67-40-52-40-108-46l-17-34-39 18 1 73c-47-2-31 4-66-28-40 2-230 40-268 53l-15 35c-82 42-170 47-257 69l-98-359-131-228-34-128 2-264 32-98-32-131 32-97 196-262 229-98 33-163 130-98 196-98 65-196 196-98 196 33 65-131 164-32 261 32 196-65 130 33 33-98 294-196 196-98 32 98-32 131 65 228 98-65h131l98 32 32 98v131l-65 98-98 33-33 98-98 65-32 98-98 65-33 98-33 131 196 196v195z"  fill={selectedDistrict===1 ? '#373434' : 'transparent'}stroke="#373434" />
                        <path id="Braga"onClick={(event) => handleDistrictClick(event, 'Braga')} data-z="32" className="district z z32" d="M5329 1730c-66-17-64 0-92 15l-110 113c-121 4-292 156-324 162-42-3-181 2-190-1l-63-42-153 42c-101 28-190 153-246 162-51-1-120-63-171 40-4 70-22 172-11 235-20 5-54 13-72 31l-21 36c-2 67 22 43 26 107l-40 111-33 28-36-11-62-98c-65-6-65 3-114 40-67-40-52-40-108-46l-17-34-39 18 1 73c-47-2-31 4-66-28-40 2-230 40-268 53l-15 35c-82 42-170 47-257 69l65 294v261l66 131v131c58-22 39-9 81-55l27 42c109 12 53-8 132 66l116-33 37 19c30 44 51 107 91 124 77 31 65 60 140 30 45 26 29 11 64 87l-136 68 54 184c22 1 354-18 355-19 43-53 52-56 91-127l199-29 49 55c169 16 391-82 456-69-5 45-7 28 10 72 85-32 174-64 260-95 18-12 31-70 32-70 71-42 91-27 138-55l9-72c200 51 198-5 310 190-62 100 186 171 254 209 28-43 13-30 58-54 34 44 76 73 118 125 13-1 198-149 211-169l33-101c7-14 156-340 157-344 9-53-16-96 14-224l57-58c77 5 27 32 103-17 20-33-6-61 15-92l68 6c18-31 175-267 176-267 47-34 93-52 67-124l-67-130-77-25c-39 47-31 42-60 106-28 5-189 31-190 31-53-16-324-80-356-101-10-157 16-226 65-356-19-23-196-122-214-117-103 32-202 79-336 73 47-93 81-60 123-143 21-42 16-47 19-78 7-67 32-123 89-158-19-156 4-155 96-264l-98-33-163 131-327-66z"  fill={selectedDistrict ? '#373434' : 'transparent'}stroke="#373434"/>
                        <path id="Porto" onClick={(event) => handleDistrictClick(event, 'Porto')} data-z="33" className="district z z33" d="M2979 3657c58-22 39-9 81-55l27 42c109 12 53-8 132 66l116-33 37 19c30 44 51 107 91 124 77 31 65 60 140 30 45 26 29 11 64 87l-136 68 54 184c22 1 354-18 355-19 43-53 52-56 91-127l199-29 49 55c169 16 391-82 456-69-5 45-7 28 10 72 85-32 174-64 260-95 18-12 31-70 32-70 71-42 91-27 138-55l9-72c200 51 198-5 310 190-62 100 186 171 254 209 28-43 13-30 58-54 34 44 76 73 118 125 13-1 198-149 211-169l33-101c16 22 26 37 54 52 45 24 25-8 53 50l-63 72 17 36c22 24 296 61 184 170 8 70 98 202 161 240l-67 180c60 164-59 157-5 260-80 148-101 93-78 206-81-1-47 33-132-15l-63 52c-4 1-330 118-382 134-200 36 0-77-312 49-60 24-159-10-215-29-99-33-95 35-136 75-61-6-43-9-81 9l-80 56c-66-44-124-64-152-46-34 46-183 240-248 197-88-57-84-35-184-62 29 91-23 107 68 163-6 89 13 55-17 111-120-48-33-85-155-107l19-71c-109-48-10-16-110-91-61 62-65 8-143 50 110 52 39 12 47 139-49 42-41 32-112 63l-90-133-33-19c-73 42-75 33-102 107l-76 28c-96-16-95-48-202-36l-32-26-33-130-32-98v-196l-66-196-153-308c-15-180-51-371-108-541v-131l-32-98-66-98-65-195 33-196z"  fill={selectedDistrict ? '#373434' : 'transparent'}stroke="#373434"/>
                        <path id="Vila_Real"onClick={(event) => handleDistrictClick(event, 'Vila_Real')} data-z="34" className="district z z34" d="M9149 1175l151 53 25 74c-46 66-37 103-56 180 9 13 77 225 79 239 40 24 50 46 89 69-4 65-17 71-12 151l-138 131-21 109c-54 191-160 351-198 550l23 30c-2 92-16 47 8 148l83 134-17 34-153 17c-76 62-109 178-114 273l-114 38-56 62-71 30 5 108-24 155 36 64 3 109 135 70 35 16-18 25c-108-12-59 47-149 32-27 47-55 68-70 124l42 32-129 109c22 60 3 97 25 199-40 4-68 3-105-14l-26 12c-37 53-10 72-15 130l-16 39c-15-6-72-34-88-30-23 6-40 52-57 60-17 1-187 49-192 52-26 32-13 80-61 89-127 24-74-11-225 99-68 49-280-14-324 4-107 66-121 151-281 118-80-28-191-69-273-81l-75 73c-59-26-153-39-218-33-42 30-55 79-68 130l-26 2-19 51-55 5c-23-113-2-58 78-206-54-103 65-96 5-260l67-180c-63-38-153-170-161-240 112-109-162-146-184-170l-17-36 63-72c-28-58-8-26-53-50-28-15-38-30-54-52 7-14 156-340 157-344 9-53-16-96 14-224l57-58c77 5 27 32 103-17 20-33-6-61 15-92l68 6c18-31 175-267 176-267 47-34 93-52 67-124l-67-130-77-25c-39 47-31 42-60 106-28 5-189 31-190 31-53-16-324-80-356-101-10-157 16-226 65-356-19-23-196-122-214-117-103 32-202 79-336 73 47-93 81-60 123-143 21-42 16-47 19-78 7-67 32-123 89-158-19-156 4-155 96-264l98-229 98-32h131l65-164 65-98 33 98-33 262 131-33 65-98 555-131 98 66 326 65-32 98-65 163h163l196-65 32-131 98 33 131-33 65 163 33 98 98-32 65-66 65-97 131 32 131-32h32l131-98 65 98 33-98 98-66 65-98 65-98z"  fill={selectedDistrict ? '#373434' : 'transparent'}stroke="#373434"/>
                        <path id="Braganca" onClick={(event) => handleDistrictClick(event, 'Braganca')} data-z="35" className="district z z35" d="M9149 1175l151 53 25 74c-46 66-37 103-56 180 9 13 77 225 79 239 40 24 50 46 89 69-4 65-17 71-12 151l-138 131-21 109c-54 191-160 351-198 550l23 30c-2 92-16 47 8 148l83 134-17 34-153 17c-76 62-109 178-114 273l-114 38-56 62-71 30 5 108-24 155 36 64 3 109 135 70 35 16-18 25c-108-12-59 47-149 32-27 47-55 68-70 124l42 32-129 109c22 60 3 97 25 199-40 4-68 3-105-14l-26 12c-37 53-10 72-15 130l-16 39c39 19 99 48 139 66l12 26c1 1 150 222 153 229 108 18 74 14 188 11l9 25c23 16 32 22 82 19 119-9 36-90 233-11 97 40 175 51 274 23 8-29 8-69 14-102 163-100 79-83 143-156 19-21 32-16 50-13 61 45-5 142-43 186 93 74 152 55 140 111-8 35-94 82-87 140l22 55c121 73 188 50 233 169 14 38 141-11 279 196l196 65 130-32 98-66 98-130v-196l65 65 33-98-38-152-22-114 27 136 164-165 98-97v-130l98-66 65-130h130l98-33 98 66 66-98 98-98 97 65 33-131 131-32 65-98 33-98 98-98 32-98 98-98 98 33 98-66-65-98 98-32v-131l32-98 66-98 98-98 65-130 65-131 98-131-32-97-98-33-131-163-131-131-228 33h-57l57-98h-163l-120-24 55-74h-259l30 130-98 66-196-98-65-229-33-98 33-98 32-98v-130l66-98v-131l32-130-98-33-144-218 112 22V979l-98-65-66-65-162 165-1-2-163 98-98-65-98-33h-98l-65-228-163-33v131l-33 97-98 33-163 33-229-66-130-97-98 97h-131l-98 33-65-98-68-59 3 89-66 35-32-97-52 24-46-57 32 130-130-130-45 67 12 129 65 130z"  fill={selectedDistrict ? '#373434' : 'transparent'}stroke="#373434"/>
                        <path id="Aveiro" onClick={(event) => handleDistrictClick(event, 'Aveiro')} data-z="36" className="district z z36" d="M5023 5577c-66-44-124-64-152-46-34 46-183 240-248 197-88-57-84-35-184-62 29 91-23 107 68 163-6 89 13 55-17 111-120-48-33-85-155-107l19-71c-109-48-10-16-110-91-61 62-65 8-143 50 110 52 39 12 47 139-49 42-41 32-112 63l-90-133-33-19c-73 42-75 33-102 107l-76 28c-96-16-95-48-202-36l-32-26c-34 273-64 483-131 751l-163 686-98 522-65 294c65 39 3 348 57 394 69 49 11 195 76 249l158 178 117 37 36-15c15-89-6-104 17-186 10-37 5-67 66-97 31-16 43-19 74-5 30 15 96 69 115 100 4 22-38 111-38 112-1 1 13 172 14 189 108 62 150-99 284-94 3 189 84 106 91 194 0 0-37 125-41 150-10 15-84 45-99 73-24 108-44 114-25 234 9 6 241 35 309 54 41-59 8-98 12-186 74-43 88-9 142-62-11-55-6-62 32-105l157 12c46-64 7-50 7-130l43-11-16-139c-4-27 66-181 91-207 45-6 77-20 66-76-9-44-64-90-95-123 56-135 218-152 339-185l16-38c-104-79-173-222-210-346 8-170 89-95 221-156l-1-37c-74-37-124-40-176-65-19-79 12-214-21-268-16-26-104-80-115-114-10-31 13-122 18-158 25-2 102-42 118-57 60-51 144-230 225-328 22-59 2-51-1-111-41-55-70-71-30-129 160-69 224 197 290-43 121-14 78 91 199 81 44-3 84-46 88-73l-89-169c12-133-5-146 18-303l111-154 21-75-2-73-38-7c-70 58-141 177-155 186-108 27-252-129-381-139-25-101 41-108 27-193-17-103-70-64-143-106z" fill={selectedDistrict  ? '#373434' : 'transparent'}stroke="#373434"/>
                        <path id="Viseu" onClick={(event) => handleDistrictClick(event, 'Viseu')} data-z="37" className="district z z37" d="M5023 5577c73 42 126 3 143 106 14 85-52 92-27 193 129 10 273 166 381 139 14-9 85-128 155-186l38 7 2 73-21 75-111 154c-23 157-6 170-18 303l89 169c-4 27-44 70-88 73-121 10-78-95-199-81-66 240-130-26-290 43-40 58-11 74 30 129 3 60 23 52 1 111-81 98-165 277-225 328-16 15-93 55-118 57-5 36-28 127-18 158 11 34 99 88 115 114 33 54 2 189 21 268 52 25 102 28 176 65l1 37c-132 61-213-14-221 156 37 124 106 267 210 346l-16 38c-121 33-283 50-339 185 31 33 86 79 95 123 11 56-21 70-66 76-25 26-95 180-91 207l16 139 37-2 41 65c71 8 90-20 161 1 7 6 116 124 131 144 188 125 115-1 169-68 50-24 72 3 144-53 42 29 68 48 122 56 248 37 253-123 377-206 114-50 246-90 339-173 81-70 447-317 459-403 9-71 82-64 152-91l21-48c228-21 415-225 502-247 57-14 367-89 373-93l106-34-32-109 112-200-1-85 66-52-21-111 39-69c-43-40-48-32-105-32-24-7-105-81-127-102 31-79 105-94 84-169l-33-68c-30-35-152-56-165-111-10-44 28-75 58-97l60-101 51-184c39-28 53-56 97-78 74 64 97 1 147 32 53 65 229 281 311 259 51-116 118-216 162-323l-101-111c10-68 3-100 74-119 279 33 92 27 281-68 37-29 44-168 40-214l-22-35c-79-3-131-13-154-95-11-40-5-44 8-79 66 9 91 34 155 14 18-101-38-276 54-481l67-178-9-25c-114 3-80 7-188-11-3-7-152-228-153-229l-12-26c-40-18-100-47-139-66-15-6-72-34-88-30-23 6-40 52-57 60-17 1-187 49-192 52-26 32-13 80-61 89-127 24-74-11-225 99-68 49-280-14-324 4-107 66-121 151-281 118-80-28-191-69-273-81l-75 73c-59-26-153-39-218-33-42 30-55 79-68 130l-26 2-19 51-55 5c-81-1-47 33-132-15l-63 52c-4 1-330 118-382 134-200 36 0-77-312 49-60 24-159-10-215-29-99-33-95 35-136 75-61-6-43-9-81 9l-80 56z"  fill={selectedDistrict ? '#373434' : 'transparent'}stroke="#373434"/>
                        <path id="Guarda" onClick={(event) => handleDistrictClick(event, 'Guarda')} data-z="38" className="district z z38" d="M6780 8452l21-48c228-21 415-225 502-247 57-14 367-89 373-93l106-34-32-109 112-200-1-85 66-52-21-111 39-69c-43-40-48-32-105-32-24-7-105-81-127-102 31-79 105-94 84-169l-33-68c-30-35-152-56-165-111-10-44 28-75 58-97l60-101 51-184c39-28 53-56 97-78 74 64 97 1 147 32 53 65 229 281 311 259 51-116 118-216 162-323l-101-111c10-68 3-100 74-119 279 33 92 27 281-68 37-29 44-168 40-214l-22-35c-79-3-131-13-154-95-11-40-5-44 8-79 66 9 91 34 155 14 18-101-38-276 54-481l67-178c23 16 32 22 82 19 119-9 36-90 233-11 97 40 175 51 274 23 8-29 8-69 14-102 163-100 79-83 143-156 19-21 32-16 50-13 61 45-5 142-43 186 93 74 152 55 140 111-8 35-94 82-87 140l22 55c121 73 188 50 233 169 14 38 141-11 279 196l-33 98 33 98 130 98 33 98 98 130 33 164 65 97 130 131-65 98v163l-33 131v163l57 71 41 223v326l-130 196v131l130 65 33 98 33 131-98 98-98 196 32 130 33 131 98 98 98 65-33 196-98 33-85 56-110 107 32 98-70 143-28-45c-122-274-146-159-369-306l-54 50c-76-3-117 20-195 26l-68-31c3-82-31-136-76-212-124 45-74 183-143 269-180 14-165-50-321-36-39 85-16 59-98 107-49-22-283-62-301-79l16-141 152-183c3-71 17-292 36-334l-61-42c-89 54-68 82-163 18-66 40-62 52-95 128l-133 47c-94 5-240-33-245-134l-51-14c-48 68-62 57-136 93-93 45-139 271-190 385-109 16-290-9-312 13-5 5-119 175-128 194-15 12-390 258-394 260-80 39-80-34-174 41-96-126-90-78-172-145 73-205 28-257 237-316l14-73c-75-72-90-39-156-97 32-137-26-149 30-261-84-45-79 22-151-13-46-22-55-46-57-90 66-58 60-50 145-65 41-79 57-53 43-144-48-29-108-20-123-79-7-29 7-55 18-81z"  fill={selectedDistrict ? '#373434' : 'transparent'}stroke="#373434"/>
                        <path id="Coimbra" onClick={(event) => handleDistrictClick(event, 'Coimbra')} data-z="39" className="district z z39" d="M6952 9816c-96-126-90-78-172-145 73-205 28-257 237-316l14-73c-75-72-90-39-156-97 32-137-26-149 30-261-84-45-79 22-151-13-46-22-55-46-57-90 66-58 60-50 145-65 41-79 57-53 43-144-48-29-108-20-123-79-7-29 7-55 18-81-70 27-143 20-152 91-12 86-378 333-459 403-93 83-225 123-339 173-124 83-129 243-377 206-54-8-80-27-122-56-72 56-94 29-144 53-54 67 19 193-169 68-15-20-124-138-131-144-71-21-90 7-161-1l-41-65-37 2-43 11c0 80 39 66-7 130l-157-12c-38 43-43 50-32 105-54 53-68 19-142 62-4 88 29 127-12 186-68-19-300-48-309-54-19-120 1-126 25-234 15-28 89-58 99-73 4-25 41-150 41-150-7-88-88-5-91-194-134-5-176 156-284 94-1-17-15-188-14-189 0-1 42-90 38-112-19-31-85-85-115-100-31-14-43-11-74 5-61 30-56 60-66 97-23 82-2 97-17 186l-36 15-117-37-158-178c-65-54-7-200-76-249-54-46 8-355-57-394l-261 1077-98 392-100 470-63-13-33 163 130 131 33 98-130 490 24 83 52 60 80-24 143 57 14-37 86-86 79-15c59 33 243 56 315 49 54 22 82 59 144 87l45 94 76-8 67-140 68-40 118 20c-1 95 15 208 20 310l51 59 78-145 122-46 123-117 79 35 33-21-19-65 74 15 69 180 74 98c-17 50-23 64-55 106l-82 33 32 23 38 1 182-85 58-61 69-140 35-14 84 81h44l28-29 18-72-65-35-63-105c41-76 137-190 221-222l57-45 98 50 61-59 45-104 37-6c44 41 83 57 117 106-17 67-48 136-42 206l166 250-3 77-54 12-39 101 50 18-18 76 36-24c112-102-8-40 247-97 56-69 167-182 219-173 75-53 185-135 239-169l108 20 65-48-61-132 49-61c73-35 311 2 400 20-2-117 24-73-24-196 28-17 39-33 65-51 17 4 71 93 79 117l31-10c-22-124 199-68 115-318-45-27-100-50-133-72l-13-70-103-46-33-107 110-238z"  fill={selectedDistrict ? '#373434' : 'transparent'}stroke="#373434"/>
                        <path id="Leiria"onClick={(event) => handleDistrictClick(event, 'Leiria')} data-z="40" className="district z z40" d="M2522 10905l24 83 52 60 80-24 143 57 14-37 86-86 79-15c59 33 243 56 315 49 54 22 82 59 144 87l45 94 76-8 67-140 68-40 118 20c-1 95 15 208 20 310l51 59 78-145 122-46 123-117 79 35 33-21-19-65 74 15 69 180 74 98c-17 50-23 64-55 106l-82 33 32 23 38 1 182-85 58-61 69-140 35-14 84 81h44l28-29 18-72-65-35-63-105c41-76 137-190 221-222l57-45 98 50 61-59 45-104 37-6c44 41 83 57 117 106-17 67-48 136-42 206l166 250-3 77-54 12-39 101 50 18-18 76-21 17-18 105c-30 54-56 61-93 103l-77-15-89 150c-145-29-143 78-273 55l-24 53 34 42-1 26-56 9-2 131-139 11-65-49c7 55 24 159 41 207l-37 3-53-63c-67 16-81 46-128 96l-68-25-113 47c-34 55-53 87-119 92 20-134-45-222-34-359-45-51-40-87-62-150l-40-7c-22 67-54 33-99 111l-52-54c-47 67-68 99-128 164-56 35-119 70-180 95l-66-37c-47 0-177 40-233 55-50 57-39 77-42 153l52 106-46 62 9 37c73 38 117 13 170 85-33 30-244 256-254 273l13 37c15 121 20 141 26 271 38 37 45 43 55 96-91 83-71 141-137 193-77 18-58-29-140-46l-13 124 52 106-17 40c-114 29-396 35-525 31-64 14-126 50-174 94-17 44-35 108-49 154-67 65-70 92-90 181-67 54-74 32-145 58-22 33-108 190-110 211 31 99 82 97 44 223l-4 40-88-2c-94-56-46-68-170-73-118 59-113 99-192 152l-110 227-151 124-65-30-42-105 21-128c-19-54-42-126-73-173l-90-63-56 50-20-32c-79 58-160 96-242 161v-131l-32-98 27-36-92-62v-131l-131-32 65-98 98 65 65-98h131l131-98 196-196 98-163 65-98 130-98 98-98 66-98 98-163 65-98-65-130 98-229 130-457 294-784 229-685zM191 14144c0 56-43 100-96 100-52 0-95-44-95-100 0-131 191-131 191 0z"  fill={selectedDistrict ? '#373434' : 'transparent'}stroke="#373434" />
                        <path id="Castelo_Branco" onClick={(event) => handleDistrictClick(event, 'Castelo_Branco')} data-z="41" className="district z z41" d="M4936 12147l-1 70c40 49 101 36 156 24 63 53 47 419 59 519-24 96-40 80 25 142 132 74 146 7 332 159 45-14 277-54 337-59-67-235-123-94 0-289-17-87 11-261 55-341 100-39 132-28 215 37l90-66 29 26c31 125 50 258 4 381l20 30c319-24 319 81 525 341l10 270 30-14 83-26 174-222 150-82c17-50 10-80 9-131l160-112h41l59 122 56-2c85-61 151-64 183-166l131-32 73 72h327l196 98 326-32 294-98 392 65 98-65h130l98 32 196-65 33-163 98-131-33-130 65-98-65-131 65-130 98-33 33-98 98-65 33-164v-130l32-98 33-98v-131l33-98v-130l-33-98-33-98-98-33-65-130-33-98h-130l-131-33-33-98-32-131-33-97 33-131 98-196 98 33 130-98h196c-122-274-146-159-369-306l-54 50c-76-3-117 20-195 26l-68-31c3-82-31-136-76-212-124 45-74 183-143 269-180 14-165-50-321-36-39 85-16 59-98 107-49-22-283-62-301-79l16-141 152-183c3-71 17-292 36-334l-61-42c-89 54-68 82-163 18-66 40-62 52-95 128l-133 47c-94 5-240-33-245-134l-51-14c-48 68-62 57-136 93-93 45-139 271-190 385-109 16-290-9-312 13-5 5-119 175-128 194-15 12-390 258-394 260-80 39-80-34-174 41l-110 238 33 107 103 46 13 70c33 22 88 45 133 72 84 250-137 194-115 318l-31 10c-8-24-62-113-79-117-26 18-37 34-65 51 48 123 22 79 24 196-89-18-327-55-400-20l-49 61 61 132-65 48-108-20c-54 34-164 116-239 169-52-9-163 104-219 173-255 57-135-5-247 97l-36 24-21 17-18 105c-30 54-56 61-93 103l-77-15-89 150c-145-29-143 78-273 55l-24 53 34 42-1 26-56 9-2 131z"  fill={selectedDistrict ? '#373434' : 'transparent'}stroke="#373434"/>
                        <path id="Santarem" onClick={(event) => handleDistrictClick(event, 'Santarem')} data-z="42" className="district z z42" d="M2036 14813l49 156-9 42 317 102c51-67 100-134 170-77 69 56 117 128 197 236l-31 70-108 47-110-47c-67 34-59 77-125 62l-24 32c136 116 222 269 406 321 97 28 111 161 120 247l-265 166-21 38 66 20-96 132c-3 49-12 302-15 306-73 125-288 360-297 507l-98 164 131 32h-131l-98 98 98 65 208 162c124-32 159-49 264-129 53 4 64 3 101 42l16 37c34 24 129 60 172 60l34-21 72-56c29-58 169-427 178-486l37-13c46 56 154 153 229 147l27-69c41-37 89-79 144-73 1 48-37 223-61 261l25 68 63 43 69-47 111 28 185-194c89-16 198 27 216-11l102-163 97 45 307-175 49 54 38-100c71 6 197 167 240 229 125-80 146 5 273 81l-1 79 139 52 80-171c-117-106-59-73-227-136-33-108 45-84 58-167-138-139-367 6-411-233 114-97 79-120 127-237l-33-65 49-63 73 16c41-41 28-54 58-101l-178-29c-132-130 13-184-168-234-38-60-13-76-19-143-70-37-157-65-223-107 8-57 17-64 70-87 16-39 84-191 110-229 312-140 425-387 609-466-2-47-12-72-9-121l96-83 126 66c78-56 225-285 289-377l-18-75c112-44 153-123 222-136 37-44 91-115 122-162-22-89-201-112-272-257l35-73 9-116 63-47c41-64 57-132 85-200 66-4 151 1 188-4 66 68 143 67 222 139l31 65c26-19 39-36 63-56l46-86 23-17-10-270c-206-260-206-365-525-341l-20-30c46-123 27-256-4-381l-29-26-90 66c-83-65-115-76-215-37-44 80-72 254-55 341-123 195-67 54 0 289-60 5-292 45-337 59-186-152-200-85-332-159-65-62-49-46-25-142-12-100 4-466-59-519-55 12-116 25-156-24l1-70-139 11-65-49c7 55 24 159 41 207l-37 3-53-63c-67 16-81 46-128 96l-68-25-113 47c-34 55-53 87-119 92 20-134-45-222-34-359-45-51-40-87-62-150l-40-7c-22 67-54 33-99 111l-52-54c-47 67-68 99-128 164-56 35-119 70-180 95l-66-37c-47 0-177 40-233 55-50 57-39 77-42 153l52 106-46 62 9 37c73 38 117 13 170 85-33 30-244 256-254 273l13 37c15 121 20 141 26 271 38 37 45 43 55 96-91 83-71 141-137 193-77 18-58-29-140-46l-13 124 52 106-17 40c-114 29-396 35-525 31-64 14-126 50-174 94-17 44-35 108-49 154-67 65-70 92-90 181-67 54-74 32-145 58-22 33-108 190-110 211 31 99 82 97 44 223l-4 40z"  fill={selectedDistrict ? '#373434' : 'white'}stroke="#373434"/>
                        <path id="Portalegre" onClick={(event) => handleDistrictClick(event, 'Portalegre')} data-z="43" className="district z z43" d="M7941 12798l163 392 131 65 65 131 164 98 98 196 98 65h130l131 98-33 98v131l-75 186 42 42v163l131 98 65 98 131 98-65 131 32 98v130l131 131h65l131 33 98 32v131l-33 98 163 131 164-66 97-32 196 98 98 163v130l66 98-131 229-131 196-32 98-98 65 65 98v131l-98 32-65 131-65 98h-131l-98 98-33 98-97 34-220-85c-38-107 4-128 72-202l8-145-192-67-105 87c-186-147-168 154-169 155-197 30-94 6-264-7-10-67-53-176-121-194l56-49-73-73c-18-83 1-122-17-199l-138-98c-94-51-68-7 42-180-86-50-226-132-303-191l-89 45 37 139c-125 56-253 70-317 120l-98 162-359-110-34 113c-124 111-321 133-473 73-103-72-181-236-254-339-196 38-61 147-419 160l43-176c-183-151-198-189-434-230l-62 51-213 30-45 65-178-29c-132-130 13-184-168-234-38-60-13-76-19-143-70-37-157-65-223-107 8-57 17-64 70-87 16-39 84-191 110-229 312-140 425-387 609-466-2-47-12-72-9-121l96-83 126 66c78-56 225-285 289-377l-18-75c112-44 153-123 222-136 37-44 91-115 122-162-22-89-201-112-272-257l35-73 9-116 63-47c41-64 57-132 85-200 66-4 151 1 188-4 66 68 143 67 222 139l31 65c26-19 39-36 63-56l46-86 23-17 30-14 83-26 174-222 150-82c17-50 10-80 9-131l160-112h41l59 122 56-2c85-61 151-64 183-166l131-32 73 72z"  fill={selectedDistrict ? '#373434' : 'transparent'}stroke="#373434"/>
                        <path id="Lisboa" onClick={(event) => handleDistrictClick(event, 'Lisboa')}  data-z="44" className="district z z44" d="M2260 17173c9-147 224-382 297-507 3-4 12-257 15-306l96-132-66-20 21-38 265-166c-9-86-23-219-120-247-184-52-270-205-406-321l24-32c66 15 58-28 125-62l110 47 108-47 31-70c-80-108-128-180-197-236-70-57-119 10-170 77l-317-102 9-42-49-156-88-2c-94-56-46-68-170-73-118 59-113 99-192 152l-110 227-151 124-65-30-42-105 21-128c-19-54-42-126-73-173l-90-63-56 50-20-32c-79 58-160 96-242 161l-32 98 32 97-32 98-65 164-131 294-98 195v164l65 98h-65l-33 130 33 98-33 98 33 98-65 163-33 98-33 163-65 131-33 98-65 98v163l65 98 164-33-164 98-65 131 131 65h163l98-32 98 65 130 65 131-32 163-66h131l65 33 261-65 98-33 98-98 33-131v-228l98-98 98-65 65-98 98 163 33 131 130-164z"  fill={selectedDistrict ? '#373434' : 'transparent'}stroke="#373434"/>
                        <path id="Setúbal" onClick={(event) => handleDistrictClick(event, 'Setúbal')}  data-z="45" className="district z z45" d="M2162 17532l208 162c124-32 159-49 264-129 53 4 64 3 101 42l16 37c34 24 129 60 172 60l34-21 72-56c29-58 169-427 178-486l37-13c46 56 154 153 229 147l27-69c41-37 89-79 144-73 1 48-37 223-61 261l25 68 63 43 69-47 111 28 46 24 150-9 34 23-86 134 41 104-70 31-77 135c-130 20-480 320-501 426 13 56 30 52 64 96 8 62 27 126 28 185l116-21c39 26 120 84 160 102 105-15 142 0 199 77l58-42-44-94 14-35 76 5 27 27-16 36 64 82c103-40 119-41 228-23l139-140 75-4 154 232 71 224-45 71c50 6 66 19 117 11 34 41 35 97 26 148-25 53-84 102-118 156l16 36c135-44 197 97 426 122l136 79 52 59 60 88c45 106 91 260 64 379-139 139-267-1-435 266-77 14-87-44-185-29l-36 231c-70 29-76-35-154-74l-83 59-41 210c-70-9-21-43-114-40 2 67 1 155-59 197 73 178 174 240 346 247 241 355-4 428 83 656l-121 262c-257-159-592-121-860 6-50 52-48 104-35 176l-107 38c-41 132-67 140-44 278 11 65-66 78-131 47-71-35-136-99-190-115l-42 98-36 7c-48-115-158-213-172-274l-97-62-109 68 33-195 33-98-33-262-33-97-130-66-98-32-98-33 32-98 66-131 98-163 65-196 98-294 65-326v-425l-32-326-66-229-32-130-98-163-164-164-97-98-66-163-65 131h-131l-98 65-65 98-98 65-98 33h-130l-98-33-98 66h-131l-98 65-130 33 65-131 33-98 32-98 33-98v-163l-33-163-130-294-33-98-65-98-17-49 196-33 229-65-17 82 98 32 98 33 98-65 66-98 65-164 98-65v-131h130z"  fill={selectedDistrict ? '#373434' : 'none'}stroke="#373434"/>
                        <path id="Évora" onClick={(event) => handleDistrictClick(event, 'Évora')}  data-z="46" className="district z z46" d="M9411 17371l-98 129-131 65-33 98-32 98-33 294 98 65-33 98-32 98-98 163-33 164-65 163-33 98 98-33-33 98-98 98 98 33 98 65 66 163 98 131 195 196 66 163 65 98 98 33 33 195 65 98c-165 12-155 140-278 73-84-202-452-652-460-787-68-5-72 0-130 36l-157 67c-95 182-276-35-210 144-88 133-372 447-389 491-193 8-574-105-689-15-251-60-330-283-600-196-230-112-443-241-671-344l-83 72-116-5-99-123-59 47c-30-7-375 32-385 41l-52-59-136-79c-229-25-291-166-426-122l-16-36c34-54 93-103 118-156 9-51 8-107-26-148-51 8-67-5-117-11l45-71-71-224-154-232-75 4-139 140c-109-18-125-17-228 23l-64-82 16-36-27-27-76-5-14 35 44 94-58 42c-57-77-94-92-199-77-40-18-121-76-160-102l-116 21c-1-59-20-123-28-185-34-44-51-40-64-96 21-106 371-406 501-426l77-135 70-31-41-104 86-134-34-23-150 9-46-24 185-194c89-16 198 27 216-11l102-163 97 45 307-175 49 54 38-100c71 6 197 167 240 229 125-80 146 5 273 81l-1 79 139 52 80-171c-117-106-59-73-227-136-33-108 45-84 58-167-138-139-367 6-411-233 114-97 79-120 127-237l-33-65 49-63 73 16c41-41 28-54 58-101l45-65 213-30 62-51c236 41 251 79 434 230l-43 176c358-13 223-122 419-160 73 103 151 267 254 339 152 60 349 38 473-73l34-113 359 110 98-162c64-50 192-64 317-120l-37-139 89-45c77 59 217 141 303 191-110 173-136 129-42 180l138 98c18 77-1 116 17 199l73 73-56 49c68 18 111 127 121 194 170 13 67 37 264 7 1-1-17-302 169-155l105-87 192 67-8 145c-68 74-110 95-72 202l220 85z"  fill={selectedDistrict ? '#373434' : 'transparent'}stroke="#373434"/>
                        <path id="Beja"  onClick={(event) => handleDistrictClick(event, 'Beja')} data-z="47" className="district z z47" d="M2913 24421v-130l33-98v-131l33-98v-130l-33-131-33-98-65-130 33-98 32-98 33-98v-425l-33-130v-164l109-68 97 62c14 61 124 159 172 274l36-7 42-98c54 16 119 80 190 115 65 31 142 18 131-47-23-138 3-146 44-278l107-38c-13-72-15-124 35-176 268-127 603-165 860-6l121-262c-87-228 158-301-83-656-172-7-273-69-346-247 60-42 61-130 59-197 93-3 44 31 114 40l41-210 83-59c78 39 84 103 154 74l36-231c98-15 108 43 185 29 168-267 296-127 435-266 27-119-19-273-64-379l-60-88c10-9 355-48 385-41l59-47 99 123 116 5 83-72c228 103 441 232 671 344 270-87 349 136 600 196 115-90 496 23 689 15 17-44 301-358 389-491-66-179 115 38 210-144l157-67c58-36 62-41 130-36 8 135 376 585 460 787 123 67 113-61 278-73l65 98 98 131 65-98h164l65-98 131-33 98-32 98 32-98 131-33 98v130l-33 131-65 294-33 131-98 32-98 65-98-97-97-33-98 33-33 130-131 98-98-33h-130l-131 33v131l-32 98v130l-33 98-65 131-33 98-33 98-98 130-98 66-65 97-98 66-98 65-32 98-33 98-33 98-65 131 33 97-66 98-65 98-33 98-65 98-33 98v131l-368 5-31-21-35 70-36-4-129 138h-36l-9-37-74 10-28-35c-77 6-150 1-223 32-22 33-93 43-163 95l-35-15c-124 70-274 140-390 216l9 37-82 11-69 39 20 75-38-1-52 53c-53-24-172 5-227 27l-75-17 3 39-74 25-3 79 63 51 1 37-186 60 1 37c-78 33-27 92-165 117-53-48-207-39-267-21-89-27-130-32-208-84-3-7-188-154-233-199h-82c-8-29-28-182-30-217l-184-18-11 44c-88-53-312 36-397 82l21 104-58 58-31-20c-49 20-45 38-87 72-183-61-136-15-251-32-47-47-99-87-141-135-52-4-211 35-273 49l-48 106-43-8-67-99c-73 21-219 48-285 8l-73-145-34-16-76 33z"  fill={selectedDistrict ? '#373434' : 'none'}stroke="#373434"/>
                        <path id="Faro" onClick={(event) => handleDistrictClick(event, 'Faro')} data-z="48" className="district z z48" d="M2913 24421l76-33 34 16 73 145c66 40 212 13 285-8l67 99 43 8 48-106c62-14 221-53 273-49 42 48 94 88 141 135 115 17 68-29 251 32 42-34 38-52 87-72l31 20 58-58-21-104c85-46 309-135 397-82l11-44 184 18c2 35 22 188 30 217h82c45 45 230 192 233 199 78 52 119 57 208 84 60-18 214-27 267 21 138-25 87-84 165-117l-1-37 186-60-1-37-63-51 3-79 74-25-3-39 75 17c55-22 174-51 227-27l52-53 38 1-20-75 69-39 82-11-9-37c116-76 266-146 390-216l35 15c70-52 141-62 163-95 73-31 146-26 223-32l28 35 74-10 9 37h36l129-138 36 4 35-70 31 21 368-5 33 98 98 98 65 98 33 163 65 163 33 131v326l33 196 32 98-32 131 65 98 33 228 14 84-178-51-228 65-392 196-196 196-261 130-327 262-98 98-195 130h-327v-65l-555-359-131-66-293-97h-131l-98 32-98 33-163 32-163-130-98-33-98 33-196 65-98-32-98-33-98-33-98-32-131-66h-130l-229 33-98 65-31 70-34-70-98 98-163 65-131 33-228 33-98 98h-131l-72 103-58 24-60 8-71-37-98-33v-163l131-98v-131l98-163 32-98 33-98-33-131 98-32 98-196 33-131-33-130-33-98 98-163 66-131 130-229z"  fill={selectedDistrict ? '#373434' : 'transparent'}stroke="#373434"/>
                    </svg>
                    </div>

        </div>
    </div>
);

}export default Homepage;