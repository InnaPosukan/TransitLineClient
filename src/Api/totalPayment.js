import axios from 'axios';

export const calculateTotalPayment = (formData, distanceInKm) => {
  const cargoWeight = parseFloat(formData.CargoWeight);
  const numberUnits = parseFloat(formData.NumberUnits);
  const distanceCharge = parseFloat(distanceInKm) * 0.03;
  const unitCharge = numberUnits * 1;
  const weightCharge = cargoWeight * 0.7;
  const baseRate = 0.02;

  return baseRate + distanceCharge + unitCharge + weightCharge;
};

export const convertCurrency = async (formData, calculatedTotalPayment) => {
  try {
    const response = await axios.get(
      `https://open.er-api.com/v6/latest/${formData.Currency}`
    );

    if (response.data && response.data.rates && response.data.rates.USD) {
      const exchangeRate = response.data.rates.USD;
      const convertedTotalPayment = calculatedTotalPayment / exchangeRate;

      return convertedTotalPayment;
    } else {
      console.error('Error converting currency: Invalid API response');
      return null;
    }
  } catch (error) {
    console.error('Error converting currency:', error.message);
    return null;
  }
};
