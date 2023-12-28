import React, { useState } from 'react';
import { AssignDriverToOrder } from '../Api/ManagementApi';
import '../styles/AssignDriverModal.css';
import { useTranslation } from 'react-i18next';

const AssignDriverModal = ({ isOpen, onClose, selectedDriver, handleOrderIdChange }) => {
  const { t } = useTranslation();
  const [orderId, setOrderId] = useState('');

  const handleAssignDriver = async () => {
    try {
      if (!orderId || !selectedDriver) {
        console.error('Order ID or selected driver is missing.');
        return;
      }

      console.log('Selected Driver:', selectedDriver);
      console.log('Order ID:', orderId);
      console.log('Driver ID:', selectedDriver.IdUser);

      const assignDriverDTO = {
        IdOrder: orderId,
        DriverUserId: selectedDriver.IdUser,
      };

      await AssignDriverToOrder(assignDriverDTO);
      console.log('Driver assigned successfully');
      onClose(); 
    } catch (error) {
      console.error('Error assigning driver:', error);
    }
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <div className="modal-inner">
          <h2>{t('assignDriverTitle')}</h2>
          <label>{t('enterOrderIdLabel')}</label>
          <input type="number" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
          <button onClick={handleAssignDriver}>{t('save')}</button>
        </div>
      </div>
    </div>
  );
};
    
export default AssignDriverModal;
