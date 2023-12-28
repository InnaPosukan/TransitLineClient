import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; 
import '../styles/AdminPage.css';
import UserManagementContent from '../content/UserManagmentContent';
import OrdersContent from '../content/OrdersContent';
import DriversContent from '../content/DriversContent';
import { useAuth } from '../context/AuthContext';
import DeliveryContent from '../content/DeliveryContent';

const AdminPage = ({ role }) => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState('orders');
  const { userRole } = useAuth();

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'orders':
        return <OrdersContent />;
      case 'userManagement':
        return <UserManagementContent />;
      case 'drivers':
        return <DriversContent />;
      case 'delivery':
        return <DeliveryContent />;
      default:
        return null;
    }
  };

  const renderDashboardTitle = () => {
    switch (userRole) {
      case 'Admin':
        return t('adminDashboard');
      case 'Manager':
        return t('managerDashboard');
      default:
        return t('dashboard');
    }
  };

  return (
    <div className="container">
      <div className="navigation">
        <ul>
          <li onClick={() => handleTabClick('orders')}>
            <a href="#">
              <span className="icon">
                <i className="fas fa-gear"></i>
              </span>
              <span className="title">{renderDashboardTitle()}</span>
            </a>
          </li>
          <li onClick={() => handleTabClick('orders')}>
            <a href="#">
              <span className="icon">
                <i className="fas fa-list"></i>
              </span>
              <span className="title">{t('orders')}</span>
            </a>
          </li>
          <li onClick={() => handleTabClick('userManagement')}>
            <a href="#">
              <span className="icon">
                <i className="fas fa-users"></i>
              </span>
              <span className="title">{t('userManagement')}</span>
            </a>
          </li>
          {userRole === 'Manager' && (
            <li onClick={() => handleTabClick('drivers')}>
              <a href="#">
                <span className="icon">
                  <i className="fas fa-car"></i>
                </span>
                <span className="title">{t('drivers')}</span>
              </a>
            </li>
          )}
           <li onClick={() => handleTabClick('delivery')}> 
            <a href="#">
              <span className="icon">
                <i className="fas fa-truck"></i>
              </span>
              <span className="title">{t('delivery')}</span>
            </a>
          </li>
          <li onClick={() => handleTabClick('home')}>
            <a href="/">
              <span className="icon">
                <i className="fas fa-home"></i>
              </span>
              <span className="title">{t('home')}</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default AdminPage;
