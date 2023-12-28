import React, { useEffect, useState } from 'react';
import { getAllDriversWithTrucks } from '../Api/ManagementApi';
import '../styles/DriversContent.css';
import AssignDriverModal from '../Modals/AssignDriverModal';
import { useTranslation } from 'react-i18next';

const DriversContent = () => {
  const { t } = useTranslation(); 

  const [driversWithTrucks, setDriversWithTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const fetchDriversWithTrucks = async () => {
      try {
        const data = await getAllDriversWithTrucks();
        console.log('Data received:', data);
        setDriversWithTrucks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDriversWithTrucks();
  }, []);

  const handleAssignDriverClick = (driver) => {
    setSelectedDriver(driver);
    setOrderId('');
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedDriver(null);
  };

  return (
    <div className="table-container">
<h2 className="user-management-title">{t('driversWithTrucksTitle')}</h2>
      <table className="user-table user-table-scroll">
        <thead>
          <tr>
            <th>{t('driverId')}</th>
            <th>{t('name')}</th>
            <th>{t('phoneNumber')}</th>
            <th>{t('trucks')}</th>
            <th>{t('action')}</th>
          </tr>
        </thead>
        <tbody>
          {driversWithTrucks.map((driver) => (
            <tr key={driver.IdUser}>
              <td>{driver.IdUser}</td>
              <td>{`${driver.FirstName} ${driver.LastName}`}</td>
              <td>{driver.PhoneNumber}</td>
              <td>
                {driver.Trucks.length > 0 ? (
                  <ul>
                    {driver.Trucks.map((truck) => (
                      <li key={truck.TruckId}>
                        <p>{t('model')}: {truck.TruckModel}</p>
                        <p>{t('number')}: {truck.TruckNumber}</p>
                        <p>{t('length')}: {truck.TruckLength}</p>
                        <p>{t('height')}: {truck.TruckHeight}</p>
                        <p>{t('capacity')}: {truck.TruckCapacity}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{t('noTruckInfo')}</p>
                )}
              </td>
              <td>
                <button onClick={() => handleAssignDriverClick(driver)}>
                  {t('assignDriver')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen && (
        <AssignDriverModal
          isOpen={modalOpen}
          onClose={handleModalClose}
          selectedDriver={selectedDriver}
          handleOrderIdChange={(e) => setOrderId(e.target.value)}
        />
      )}
    </div>
  );
};

export default DriversContent;
