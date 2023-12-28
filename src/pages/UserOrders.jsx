import React, { useEffect, useState } from 'react';
import { fetchOrdersByUserId } from '../Api/OrdersApi';
import { useAuth } from '../context/AuthContext';
import { jwtDecode as jwtDecode } from 'jwt-decode';
import '../styles/UserOrders.css';
import { useTranslation } from 'react-i18next';

const UserOrders = () => {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const extractUserIdFromToken = (token) => {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken?.userID || null;
        setUserId(userId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    };

    extractUserIdFromToken(token);
  }, [token]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        if (userId && orders.length === 0) {
          const userOrders = await fetchOrdersByUserId(userId);

          console.log('User Orders:', userOrders);

          setOrders(userOrders);
        }
      } catch (error) {
        console.error('Error fetching user orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [userId, orders]);

  const handlePayNow = async (order) => {
    try {
      console.log('Initiating payment for order:', order.IdOrder);
    } catch (error) {
      console.error('Error initiating payment:', error);
    }
  };
  
  return (
    <div>
      <div className='user-orders-title'>{t('yourOrders')}</div>
      {orders.length > 0 ? (
  <div className="order-details">
    {orders.map((order) => (
      <div className="order-info" key={order.IdOrder}>
        <p>{t('orderId')} {order.IdOrder}</p>
        <p>{t('creationDate')} {new Date(order.CreationDate).toLocaleString()}</p>
        <p>{t('departureLocation')} {order.DepartureLocation}</p>
        <p>{t('destinationLocation')} {order.DestinationLocation}</p>
        <p>{t('distance')} {order.Distance} {order.UnitsOfMeasurement}</p>



        {order.Delivery && (
          <div className="delivery-info">
            <p>{t('deliveryStatus')} {order.Delivery.DeliveryStatus}</p>
            <p>{t('departureDate')} {new Date(order.Delivery.DepartureDate).toLocaleString()}</p>
            <p>{t('destinationDate')} {new Date(order.Delivery.DestinationDate).toLocaleString()}</p>
          </div>
        )}

{order.Payments && order.Payments.length > 0 && (
  <div className="payment-info">
    {order.Payments.map((payment) => (
      <div key={payment.IdPayment}>
        <p>{t('paymentAmount')} {payment.Amount} {payment.Currency}</p>
        <p>{t('paymentStatus')} {payment.PaymentStatus}</p>
        <p>{t('paymentMethod')} {payment.PaymentMethod}</p>
      </div>
    ))}
  </div>
)}

        {!order.Delivery && (
          <p>{t('orderStatus')} {order.OrderStatus}</p>
        )}
        <button className='pay-now-button' onClick={() => handlePayNow(order.IdOrder)}>{t('payNow')}</button>
      </div>
    ))}
  </div>
) : (
  <p>{t('noOrders')}</p>
)}
    </div>
  );
};

export default UserOrders;
