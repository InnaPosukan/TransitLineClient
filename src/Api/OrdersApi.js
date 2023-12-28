import axios from 'axios';
import { BASE_URL } from '../utils/apiConfig';

export const fetchOrders = async (setOrders) => {
  try {
    const response = await axios.get(`${BASE_URL}/Order/getAllOrders`);
    const data = response.data;

    console.log('Response:', response);

    if (response.status === 200) {
      setOrders(data);
    } else {
      console.error('Failed to fetch orders:', data);
    }
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/Order/delete/${orderId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      return true;
    } else {
      console.error('Failed to delete order:', response);
      return false;
    }
  } catch (error) {
    console.error('Error deleting order:', error.message);
    return false;
  }
};

export const createOrderWithCargoType = async (formDataWithPayment, token) => {
  try {
    const orderResponse = await axios.post(
      `${BASE_URL}/Order/createOrderWithCargoType`,
      formDataWithPayment,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return orderResponse.data;
  } catch (error) {
    throw error;
  }
};
export const updateOrder = async (orderId, updatedOrder, token) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/Order/updateOrder/${orderId}`,
      updatedOrder,
      {
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return true;
    } else {
      console.error('Failed to update order:', response);
      return false;
    }
  } catch (error) {
    console.error('Error updating order:', error.message);
    return false;
  }
};
export const fetchOrdersByUserId = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/Order/getOrdersByUserId/${userId}`);
    const data = response.data;

    console.log('Response:', response);

    if (response.status === 200) {
      return data; 
    } else {
      console.error('Failed to fetch orders:', data);
      throw new Error('Failed to fetch orders');
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};