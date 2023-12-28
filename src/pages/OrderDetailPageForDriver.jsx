import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchOrderById, updateDeliveryStatus } from '../Api/DriverApi';
import { GOOGLE_MAPS_API_KEY } from '../utils/apiConfig';
import '../styles/OrderDetailsPageForDriver.css';
import { useTranslation } from 'react-i18next';

const OrderDetailsPageForDriver = () => {
  const { token } = useAuth();
  const { orderId } = useParams();
  const { t } = useTranslation();
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderDetails = async () => {
    try {
      const orderData = await fetchOrderById(token, orderId);
      setOrderDetails(orderData);
      setLoading(false);
    } catch (error) {
      console.error(`Error fetching order details for ID ${orderId}:`, error);
      setError(error.message || 'Error fetching order details.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && orderId) {
      fetchOrderDetails();
    }
  }, [token, orderId]);

  const handleAcceptOrder = async () => {
    try {
      await updateDeliveryStatus(token, orderDetails.Deliveries.$values[0].IdDelivery, 'Accepted');
      await fetchOrderDetails();
      alert(t('orderDetailsPageForDriver.acceptedSuccessfully'));
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleMarkAsDelivered = async () => {
    try {
      await updateDeliveryStatus(token, orderDetails.Deliveries.$values[0].IdDelivery, 'Delivered');
      await fetchOrderDetails();
      alert(t('markedAsDeliveredSuccessfully'));
    } catch (error) {
      console.error('Error marking order as delivered:', error);
    }
  };

  return (
    <div className="order-details-container">
      <h1 className="order-details-title">{t('orderDetails')}</h1>
      <div className="map-container">
        <iframe
          title="Google Map"
          width="100%"
          height="450"
          style={{ border: 0 }}
          src={`https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_API_KEY}
            &origin=${orderDetails.DepartureLocation}
            &destination=${orderDetails.DestinationLocation}
            &mode=driving`}
          allowFullScreen
        ></iframe>
      </div>
      {loading && <p className="loading">{t('loadingText')}</p>}
      {error && <p className="error">{t('errorText')} {error}</p>}
      {Object.keys(orderDetails).length > 0 && (
        <div className="order-details">
          <div className="order-info">
            <p>{t('orderId')} {orderDetails.IdOrder}</p>
            <p>{t('creationDate')} {new Date(orderDetails.CreationDate).toLocaleString()}</p>
            <p>{t('departureLocation')} {orderDetails.DepartureLocation}</p>
            <p>{t('destinationLocation')} {orderDetails.DestinationLocation}</p>
            <p>{t('orderStatus')} {orderDetails.OrderStatus}</p>
            {orderDetails.Payments && orderDetails.Payments.$values && orderDetails.Payments.$values.length > 0 && (
              <div className="payments-info">
                {orderDetails.Payments.$values.map((payment, index) => (
                  <p key={index}>
                    {t('amountText')} {payment.Amount} <br />
                    {t('currencyText')} {payment.Currency} <br />
                    {t('paymentMethodText')} {payment.PaymentMethod}<br />
                    {t('paymentStatus')} {payment.PaymentStatus}
                  </p>
                ))}
              </div>
            )}
          </div>
          {orderDetails.Deliveries && orderDetails.Deliveries.$values && orderDetails.Deliveries.$values.length > 0 && (
            <div className="deliveries-info">
              <h2>{t('deliveriesText')}</h2>
              <ul>
                {orderDetails.Deliveries.$values.map((delivery, index) => (
                  <li key={index}>
                    {t('deliveryId')} {delivery.IdDelivery} - {t('deliveryStatus')} {delivery.DeliveryStatus}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="accept-button-container">
            <button className="accept-button" onClick={handleAcceptOrder} >
              {t('acceptButtonText')}
            </button>
            <button className="delivered-button" onClick={handleMarkAsDelivered}>
              {t('deliveredButtonText')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPageForDriver;
