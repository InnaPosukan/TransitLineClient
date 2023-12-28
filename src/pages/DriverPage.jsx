import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchOrdersForDriver } from '../Api/DriverApi';
import { Link } from 'react-router-dom';
import '../styles/DriverPage.css';
import { useTranslation } from 'react-i18next';

const DriverPage = () => {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const responseData = await fetchOrdersForDriver(token);

        if (responseData && responseData.length > 0) {
          setOrders(responseData);
        } else {
          setOrders([]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message || 'Error fetching orders.');
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="driver-container">
      <h1 className="page-title">{t('pageTitle')}</h1>
      {loading && <p className="loading">{t('loadingText')}</p>}
      {error && <p className="error">{t('errorText')} {error}</p>}
      {orders && orders.length > 0 && (
        <div>
          {orders.map((order) => (
            <Link to={`/order/${order.IdOrder}`} key={order.IdOrder} className="order-link">
              <div className="order">
                <p>{t('orderNumberText')} {order.IdOrder}</p>
                <p>{t('creationDate')} {new Date(order.CreationDate).toLocaleString()}</p>
                <p>{t('departureLocation')} {order.DepartureLocation}</p>
                <p>{t('destinationLocation')} {order.DestinationLocation}</p>
                <p>{t('distance')} {order.Distance}</p>
                <p>{t('orderStatus')} {order.OrderStatus}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
      {!loading && !error && (!orders || orders.length === 0) && (
        <p className="no-orders">{t('noOrdersText')}</p>
      )}
    </div>
  );
};

export default DriverPage;
