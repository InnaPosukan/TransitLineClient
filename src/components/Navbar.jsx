// NavBar.js
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/Navbar.css';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { t, i18n } = useTranslation();
  const { handleLogout, userRole } = useAuth();
  const [token, setToken] = useState('');
  const [language, setLanguage] = useState('en');
  const location = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const isOnAdminPage = location.pathname === '/admin';

  const handleLogoutClick = () => {
    handleLogout();
    window.location.href = '/';
  };

  return (
    <div>
      {isOnAdminPage ? null : (
        <header className="header">
          <div className="header-1">
            <Link to="/" className="logo">
              <i className="fas fa-truck"></i> TransitLine
            </Link>
            <div className="language-buttons">
              <button
                className={language === 'en' ? 'active' : ''}
                onClick={() => {
                  setLanguage('en');
                  i18n.changeLanguage('en');
                }}
              >
                EN
              </button>
              <button
                className={language === 'ua' ? 'active' : ''}
                onClick={() => {
                  setLanguage('ua');
                  i18n.changeLanguage('ua');
                }}
              >
                UA
              </button>
            </div>

            <div className="icons">
              {token ? (
                <>
                  {(userRole === 'Admin' || userRole === 'Manager') && (
                    <Link to="/admin" className="fas fa-briefcase"></Link>
                  )}
                  {userRole === 'Driver' && (
                    <Link to="/driver" className="fas fa-car"></Link>
                  )}
                  <Link
                    to="/"
                    onClick={handleLogoutClick}
                    className="fas fa-sign-out-alt"
                  ></Link>
                </>
              ) : (
                <Link to="/login" className="fas fa-user"></Link>
              )}
            </div>
          </div>
          <div className="header-2">
            <nav className="navbar">
              <Link to="/">{t('home')}</Link>
              <Link to="/UserOrders">{t('orders')}</Link>
              <Link to="/contact">{t('contact')}</Link>
            </nav>
          </div>
        </header>
      )}
      <nav className="bottom-navbar">
        <nav className="navbar">
          <Link to="/" className="fas fa-home"></Link>
          <Link to="/UserOrders" className="fas fa-list"></Link>
          <Link to="/contact" className="fas fa-phone"></Link>
          {(userRole === 'Admin' || userRole === 'Manager') && !isOnAdminPage && (
            <Link to="/admin" className="fas fa-briefcase"></Link>
          )}
        </nav>
      </nav>
    </div>
  );
};

export default NavBar;
