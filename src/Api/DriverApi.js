import axios from 'axios';
import { BASE_URL } from '../utils/apiConfig';

export const fetchOrdersForDriver = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/Driver/GetOrdersForDriver`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Error fetching orders: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};
export const fetchOrderById = async (token, orderId) => {
  try {
    const response = await axios.get(`${BASE_URL}/Driver/GetOrderById/${orderId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Error fetching order: ${response.statusText}`);
    }

    console.log('Order API Response:', response.data);

    return response.data;
  } catch (error) {
    console.error(`Error fetching order with ID ${orderId}:`, error);
    throw error;
  }
};

export const updateDeliveryStatus = async (token, deliveryId, deliveryStatus) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/Driver/UpdateDeliveryStatus/${deliveryId}`,
      { DeliveryStatus: deliveryStatus },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Error updating delivery status: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error(`Error updating delivery status for ID ${deliveryId}:`, error);
    throw error;
  }
};
