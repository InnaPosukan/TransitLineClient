// Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/background.jpg';
import board from '../assets/board.webp'
import allMetal from '../assets/allMetal.webp'
import tilt from '../assets/tilt.webp'
import boxVan from '../assets/boxVan.webp'

import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next'; 
import '../styles/Home.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
const Home = () => {
  const { token } = useAuth();
  const { t } = useTranslation(); 

  const handleOrderClick = () => {
    if (!token) {
      alert(t('pleaseLogIn')); 
    }
  };

  return (
    <div className='home container'>
      <div className='banner-container'>
        <div
          className='background-image-container'
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className='overlay-content'>
            <div className='centered-content'>
              <Link
                to={token ? '/createOrder' : '#'}
                onClick={handleOrderClick}
                className='order-link'
              >
                {t('button_orders')}
              </Link>
            </div>
          </div>
        </div>

        <div className='overlay-text'>
          {t('cargo_transport_near_you')}
        </div>
        <div className='description-text'>
          {t('cargo_transport_requirements')}
        </div>
        <div className='order-text'>
          {t('order_cargo_transport_services')}
        </div>
        <div className='order-container'>
          <div className='inner-container'>
            <i className='fas fa-circle-user fa-5x blue-icon'></i>
            <p className='text-with-icon'>{t('register_and_login')}</p>
          </div>
          <div className='inner-container'>
            <i className='fas fa-pen-to-square fa-5x blue-icon'></i>
            <p className='text-with-icon'>{t('create_order')}</p>
          </div>
          <div className='inner-container'>
            <i className='fas fa-check fa-5x blue-icon'></i>
            <p className='text-with-icon'>{t('wait_for_order_confirmation')}</p>
          </div>
          <div className='inner-container'>
            <i className='fas fa-laptop fa-5x blue-icon'></i>
            <p className='text-with-icon'>{t('track_orders')}</p>
          </div>
        </div>
        <div className='type-cargo'>
          <div className='type-cargo-label'>{t('truck_types')}</div>
          <div className='type-cargo-desc'>{t('choose_truck_description')}</div>
          <div className='all-cargo'>
            <div className='cargo-container'>
              <div className='board-image-container'>
                <img src={board} alt='Board Truck' className='cargo-image' />
              </div>
              <div className='cargo-description'>
                <div className='type-cargo-title'>{t('flatbed_truck')}</div>
                <div className='type-cargo-descript'>
                  {t('flatbed_truck_description')}
                </div>
              </div>
            </div>
            <div className='cargo-container'>
              <div className='board-image-container'>
                <img
                  src={allMetal}
                  alt='All Metal Truck'
                  className='cargo-image'
                />
              </div>
              <div className='cargo-description'>
                <div className='type-cargo-title'>{t('all_metal_van')}</div>
                <div className='type-cargo-descript'>
                  {t('all_metal_van_description')}
                </div>
              </div>
            </div>
            <div className='cargo-container'>
              <div className='board-image-container'>
                <img src={tilt} alt='Tilt Truck' className='cargo-image' />
              </div>
              <div className='cargo-description'>
                <div className='type-cargo-title'>{t('tilt_truck')}</div>
                <div className='type-cargo-descript'>
                  {t('tilt_truck_description')}
                </div>
              </div>
            </div>
            <div className='cargo-container'>
              <div className='board-image-container'>
                <img
                  src={boxVan}
                  alt='Box Van Truck'
                  className='cargo-image'
                />
              </div>
              <div className='cargo-description'>
                <div className='type-cargo-title'>{t('box_van')}</div>
                <div className='type-cargo-descript'>
                  {t('box_van_description')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;