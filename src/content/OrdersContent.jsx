// OrdersContent.js
import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next'; // Add this import
import '../styles/OrdersContent.css';
import EditOrderModal from '../Modals/EditOrderModal';
import { fetchOrders, deleteOrder } from '../Api/OrdersApi';

const OrdersContent = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await fetchOrders(setOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteOrder = async (orderId) => {
    const deletedSuccessfully = await deleteOrder(orderId);
    if (deletedSuccessfully) {
      alert(t('deletedSuccessfully'));
      fetchData();
    }
  };

  const handleUpdateOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setIsEditModalOpen(true);
  };

  return (
    <div className="table-container">
      <div className="orders-title">{t('allOrders')}</div>
      {loading ? (
        <p>{t('loading')}</p>
      ) : (
        <div className="user-table-scroll">
          <table className="user-table">
            <thead>
              <tr>
                <th>{t('orderId')}</th>
                <th>{t('departureLocation')}</th>
                <th>{t('destinationLocation')}</th>
                <th>{t('creationDate')}</th>
                <th>{t('cargoWeight')}</th>
                <th>{t('numberOfUnits')}</th>
                <th>{t('distance')}</th>
                <th>{t('unitsOfMeasurement')}</th>
                <th>{t('orderStatus')}</th>
                <th>{t('driverId')}</th>
                <th>{t('delete')}</th>
                <th>{t('edit')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="10">{t('noOrdersFound')}</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.IdOrder}>
                    <td>{order.IdOrder}</td>
                    <td>{order.DepartureLocation}</td>
                    <td>{order.DestinationLocation}</td>
                    <td>{new Date(order.CreationDate).toLocaleString()}</td>
                    <td>{order.CargoWeight}</td>
                    <td>{order.NumberUnits}</td>
                    <td>{order.Distance}</td>
                    <td>{order.UnitsOfMeasurement}</td>
                    <td>{order.OrderStatus}</td>
                    <td>
                      {order.DriverUserId === 0 ? (
                        <span>{t('driverNotAssigned')}</span>
                      ) : (
                        order.DriverUserId
                      )}
                    </td>
                    <td>
                      <button className="delete-button" onClick={() => handleDeleteOrder(order.IdOrder)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                    <td>
                      <button className="edit-button" onClick={() => handleUpdateOrder(order.IdOrder)}>
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {isEditModalOpen && (
        <EditOrderModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={() => {
            fetchData();
            setIsEditModalOpen(false);
            setSelectedOrderId(null);
          }}
          order={orders.find((order) => order.IdOrder === selectedOrderId)}
        />
      )}
    </div>
  );
};

export default OrdersContent;
