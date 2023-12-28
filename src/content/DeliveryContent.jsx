// DeliveryContent.js
import React, { useEffect, useState } from 'react';
import { getAllDeliveries } from '../Api/ManagementApi';
import { AddSensor } from '../Api/SensorApi';
import '../styles/DeliveryContent.css';

const DeliveryContent = () => {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deliveriesData = await getAllDeliveries();
        setDeliveries(deliveriesData);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div>
      <div className="user-management-header">
        <h2 className="user-management-title">Delivery Content</h2>
      </div>
      <div className="table-container user-table-scroll">
        <table className="user-table">
          <thead>
            <tr>
              <th>Delivery ID</th>
              <th>Order ID</th>
              <th>Status</th>
              <th>Delivery Time</th>
              <th>Temperature/Humidity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery.IdDelivery}>
                <td>{delivery.IdDelivery}</td>
                <td>{delivery.IdOrder}</td>
                <td>{delivery.DeliveryStatus}</td>
                <td>{new Date(delivery.DestinationDate).toLocaleString()}</td>
                <td>
                  {delivery.TemperatureHumidities.length > 0 ? (
                    <ul>
                      {delivery.TemperatureHumidities.map((th, index) => (
                        <li key={index}>
                          ID: {th.IdTemperatureHumidity}, Temperature: {th.Temperature}, Humidity: {th.Humidity}, Timestamp: {new Date(th.Timestamp).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No sensor data provided</p>
                  )}
                </td>
                <td>
                  <button className="add-sensor" onClick={() => AddSensor(delivery.IdDelivery, { Temperature: 0, Humidity: 0 })}>Add Sensor</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryContent;
