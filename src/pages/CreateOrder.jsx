import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { BASE_URL, GOOGLE_MAPS_API_KEY } from '../utils/apiConfig';
import { calculateTotalPayment, convertCurrency } from '../Api/totalPayment';
import '../styles/CreateOrder.css';

const CreateOrder = () => {
  const { t } = useTranslation(); 

  const [formData, setFormData] = useState({
    CargoWeight: '',
    NumberUnits: '',
    DepartureLocation: '',
    DestinationLocation: '',
    Currency: '',
    PaymentMethod: '',
    UnitsOfMeasurement: '',
  });

  const [token, setToken] = useState('');
  const mapRef = useRef(null);
  const [distanceInKm, setDistanceInKm] = useState(0);
  const [distanceOverlay, setDistanceOverlay] = useState(null);
  const [totalPayment, setTotalPayment] = useState(0);
  const [convertedTotalPayment, setConvertedTotalPayment] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    const calculatedTotalPayment = calculateTotalPayment(formData, distanceInKm);
    setTotalPayment(calculatedTotalPayment);

    const handleCurrencyConversion = async () => {
      if (totalPayment !== 0 && formData.Currency !== '') {
        const convertedTotalPayment = await convertCurrency(formData, calculatedTotalPayment);
        if (convertedTotalPayment !== null) {
          setConvertedTotalPayment(convertedTotalPayment);
        }
      }
    };

    handleCurrencyConversion();
  }, [formData, totalPayment, distanceInKm]);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
      script.defer = true;
      document.head.appendChild(script);

      window.initMap = initMap;

      return () => {
        document.head.removeChild(script);
      };
    }

    initMap();
  }, []);

  useEffect(() => {
    return () => {
      if (distanceOverlay) {
        distanceOverlay.close();
      }
    };
  }, [distanceOverlay]);

  const initMap = () => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 0, lng: 0 },
      zoom: 2,
    });

    const departureMarker = new window.google.maps.Marker({ map, draggable: true });
    const destinationMarker = new window.google.maps.Marker({ map, draggable: true });

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({ map });

    const departureAutocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById('departureLocation'),
      { types: ['geocode'] }
    );

    departureAutocomplete.addListener('place_changed', () => {
      const place = departureAutocomplete.getPlace();
      setFormData((prevFormData) => ({
        ...prevFormData,
        DepartureLocation: place.formatted_address,
      }));

      departureMarker.setPosition(place.geometry.location);
      updateRoute();
    });

    const destinationAutocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById('destinationLocation'),
      { types: ['geocode'] }
    );

    destinationAutocomplete.addListener('place_changed', () => {
      const place = destinationAutocomplete.getPlace();
      setFormData((prevFormData) => ({
        ...prevFormData,
        DestinationLocation: place.formatted_address,
      }));

      destinationMarker.setPosition(place.geometry.location);
      updateRoute();
    });

    destinationMarker.addListener('dragend', () => {
      updateRoute();
    });

    const updateRoute = () => {
      const origin = departureMarker.getPosition();
      const destination = destinationMarker.getPosition();

      if (origin && destination) {
        directionsService.route(
          {
            origin: origin,
            destination: destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
            if (status === 'OK') {
              directionsRenderer.setDirections(response);

              const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
                origin,
                destination
              );
              const distanceInKm = distance / 1000;
              setDistanceInKm(distanceInKm);

              if (!distanceOverlay) {
                setDistanceOverlay(new window.google.maps.InfoWindow());
              }

              if (distanceOverlay) {
                const contentString = `Distance: ${distanceInKm.toFixed(2)} km`;
                distanceOverlay.setContent(contentString);
                distanceOverlay.setPosition(destination);
                distanceOverlay.open(map);
              }
            } else {
              console.error('Directions request failed:', status);
            }
          }
        );
      }
    };
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        throw new Error('Authentication token is missing.');
      }
  
      const formDataWithPayment = {
        ...formData,
        Distance: parseFloat(distanceInKm),
        TotalPayment: convertedTotalPayment !== null ? convertedTotalPayment.toFixed(2) : null,
      };
  
      console.log('Form Data with Total Payment:', formDataWithPayment);
  
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
  
      console.log('Order Response:', orderResponse.data);

      const orderId = orderResponse.data.OrderId; 
      console.log('Extracted Order ID:', orderId);

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
  
      console.log('Payment processed successfully:', paymentResponse.data);
  
      setFormData({
        CargoWeight: '',
        NumberUnits: '',
        DepartureLocation: '',
        DestinationLocation: '',
        Currency: '',
        PaymentMethod: '',
        UnitsOfMeasurement: '',
      });
  
      setDistanceInKm(0);
      setTotalPayment(0);
      setConvertedTotalPayment(null);
  
      alert(t('orderCreatedSuccessfully'));
    } catch (error) {
      console.error('Error creating order or processing payment:', error.message);
      if (error.response) {
        console.error('Server Response:', error.response.data);
      }
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('https://open.er-api.com/v6/latest/USD');
        if (response.data && response.data.rates) {
          const availableCurrencies = Object.keys(response.data.rates);
          setCurrencies(availableCurrencies);
        } else {
          console.error('Error fetching currencies: Invalid API response');
        }
      } catch (error) {
        console.error('Error fetching currencies:', error.message);
      }
    };

    fetchCurrencies();
  }, []);

  return (
    <div>
      <h1 className="create-order-title">{t('createOrder')}</h1>
      <div className="container-wrapper">
        <div className="create-order-container">
          <div className="map-container" ref={mapRef}></div>
          <div className="form-container">
            <form onSubmit={handleSubmit} className="order-form">
            <div className="form-group">
  <label>{t('departureLocation')}:</label>
  <input
    type="text"
    name="DepartureLocation"
    value={formData.DepartureLocation}
    onChange={handleInputChange}
    id="departureLocation"
    placeholder={t('enterDepartureLocation')}
  />
</div>

  
              <div className="form-group">
                <label>{t('destinationLocation')}:</label>
                <input
                  type="text"
                  name="DestinationLocation"
                  value={formData.DestinationLocation}
                  onChange={handleInputChange}
                  id="destinationLocation"
                  placeholder={t('enterDestinationLocation')}

                />
              </div>
  
              <div className="form-group">
                <label>{t('cargoWeight')}:</label>
                <input
                  type="number"
                  name="CargoWeight"
                  value={formData.CargoWeight}
                  onChange={handleInputChange}
                  id="cargoWeight"
                  placeholder={t('enterCargoWeight')}

                />
              </div>
  
              <div className="form-group">
                <label>{t('numberUnits')}:</label>
                <input
                  type="number"
                  name="NumberUnits"
                  value={formData.NumberUnits}
                  onChange={handleInputChange}
                  id="numberUnits"
                  placeholder={t('enterNumberUnits')}

                />
              </div>
  
              <div className="form-group">
                <label htmlFor="Currency">{t('currency')}</label>
                <select
                  id="Currency"
                  name="Currency"
                  value={formData.Currency}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>{t('selectCurrency')}</option>
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
  
              <div className="form-group">
                <label htmlFor="unitsOfMeasurement">{t('unitsOfMeasurement')}</label>
                <select
                  id="unitsOfMeasurement"
                  name="UnitsOfMeasurement"
                  value={formData.UnitsOfMeasurement}
                  onChange={handleInputChange}
                  defaultValue=""
                >
                  <option value="" disabled>{t('selectUnitsOfMeasurement')}</option>
                  <option value="kilometers">{t('kilometers')}</option>
    <option value="feet">{t('feet')}</option>
    <option value="miles">{t('miles')}</option>
                </select>
              </div>
  
              <div className="form-group">
                <label htmlFor="PaymentMethod">{t('paymentMethod')}:</label>
                <select
                  id="PaymentMethod"
                  name="PaymentMethod"
                  value={formData.PaymentMethod}
                  onChange={handleInputChange}
                  defaultValue=""
                >
                  <option value="" disabled>{t('selectPaymentMethod')}</option>
                  <option value="Cash">{t('cash')}</option>
    <option value="Card">{t('card')}</option>
                </select>
              </div>
  
            </form>
  
            <div className="order-table-container">
              <h1 className="order-title">{t('yourOrder')}</h1>
  
              <table className="order-table">
                <tbody>
                  <tr>
                    <td className="info-label">{t('distance')}:</td>
                    <td>{distanceInKm.toFixed(2)} {formData.UnitsOfMeasurement}</td>
                  </tr>
  
                  <tr>
                    <td className="info-label">{t('departureLocation')}:</td>
                    <td>{formData.DepartureLocation}</td>
                  </tr>
  
                  <tr>
                    <td className="info-label">{t('destinationLocation')}:</td>
                    <td>{formData.DestinationLocation}</td>
                  </tr>
  
                  <tr>
                    <td className="info-label">{t('cargoWeight')}:</td>
                    <td>{formData.CargoWeight}</td>
                  </tr>
  
                  <tr>
                    <td className="info-label">{t('numberUnits')}:</td>
                    <td>{formData.NumberUnits}</td>
                  </tr>
  
                  <tr>
                    <td className="info-label">{t('paymentMethod')}:</td>
                    <td>{formData.PaymentMethod}</td>
                  </tr>
  
                  <tr>
                    <td className="info-label">{t('totalAmount')}:</td>
                    <td>
                      {convertedTotalPayment !== null
                        ? convertedTotalPayment.toFixed(2) + ' ' + formData.Currency
                        : ''}
                    </td>
                  </tr>
  
                </tbody>
              </table>
  
              <div className="button-container">
                <button className="confirm-button" onClick={handleSubmit}>
                  {t('confirmOrder')}
                </button>
              </div>
  
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 export default CreateOrder;
