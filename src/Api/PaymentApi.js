import axios from 'axios';
import { BASE_URL } from '../utils/apiConfig';

const processPayment = async (orderId, convertedTotalPayment, formData, token) => {
  try {
    const paymentResponse = await axios.post(
      `${BASE_URL}/Payment/processPayment`,
      {
        IdOrder: orderId,
        Amount: convertedTotalPayment,
        PaymentMethod: formData.PaymentMethod,
        Currency: formData.Currency,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return paymentResponse.data;
  } catch (error) {
    throw error;
  }
};
const fetchCurrencies = async () => {
    try {
      const response = await axios.get('https://open.er-api.com/v6/latest/USD');
      if (response.data && response.data.rates) {
        const availableCurrencies = Object.keys(response.data.rates);
        return availableCurrencies;
      } else {
        console.error('Error fetching currencies: Invalid API response');
        return [];
      }
    } catch (error) {
      console.error('Error fetching currencies:', error.message);
      return [];
    }
  };
  
  
  
export { processPayment , fetchCurrencies };
