import React, { useState, useEffect } from 'react';
import '../styles/EditUserModal.css';
import { updateOrder } from '../Api/OrdersApi';
import { useTranslation } from 'react-i18next';  // Додайте цей імпорт


const EditOrderModal = ({ isOpen, onClose, onEdit, order }) => {
  const [editedOrder, setEditedOrder] = useState({});
  const { t } = useTranslation();  // Отримайте функцію перекладу

  useEffect(() => {
    // Update editedOrder whenever the order prop changes
    setEditedOrder({ ...order });
  }, [order]);

  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    // Retrieve the authentication token from local storage
    const storedToken = localStorage.getItem('authToken');
    setAuthToken(storedToken);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to:`, value);
    setEditedOrder((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleEdit = async () => {
    try {
      console.log('Edited Order:', editedOrder);

      const updatedOrder = await updateOrder(order.IdOrder, editedOrder, authToken);

      onEdit(updatedOrder);
      onClose();
    } catch (error) {
      console.error('Error updating order:', error.message);
    }
  };

  return (
    <div className={`modal ${isOpen ? 'open' : 'closed'}`}>
      <div className="modal-content">
      <h2 className="modal-title">{t('editOrder')}</h2>
        <div>
  <label className="input-label">{t('departureLocation')}</label>
  <input
    className="styled-input"
    type="text"
    name="DepartureLocation"
    value={editedOrder.DepartureLocation || ''}
    onChange={handleChange}
  />
</div>
<div>
  <label className="input-label">{t('destinationLocation')}</label>
  <input
    className="styled-input"
    type="text"
    name="DestinationLocation"
    value={editedOrder.DestinationLocation || ''}
    onChange={handleChange}
  />
</div>
<div>
  <label className="input-label">{t('orderStatus')}</label>
  <input
    className="styled-input"
    type="text"
    name="OrderStatus"
    value={editedOrder.OrderStatus || ''}
    onChange={handleChange}
  />
</div>
<div>
  <label className="input-label">{t('driverId')}</label>
  <input
    className="styled-input"
    type="number"
    name="DriverUserId"
    value={editedOrder.DriverUserId || ''}
    onChange={handleChange}
  />
</div>

        <div className="button-container">
          <button className="save-button" onClick={handleEdit}>
          {t('save')}
          </button>
          <button className="cancel-button" onClick={onClose}>
          {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;
