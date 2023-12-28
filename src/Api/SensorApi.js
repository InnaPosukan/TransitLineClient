// SensorApi.js
import axios from 'axios';
import { BASE_URL } from '../utils/apiConfig';

export const AddSensor = async (idDelivery, sensorData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/TemperatureHumidity/AddSensor/${idDelivery}`,
      sensorData,
      {
        headers: {
          'Content-Type': 'application/json', // Указываем тип контента как JSON
        },
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error('Error adding sensor reading:', error);
  }
};
