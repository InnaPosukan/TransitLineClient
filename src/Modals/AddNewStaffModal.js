import React, { useState } from 'react';
import '../styles/EditUserModal.css';
import { addUser } from '../Api/ManagementApi';
import { useTranslation } from 'react-i18next';

const AddUserModal = ({ isOpen, onClose, onAdd }) => {
  const { t } = useTranslation();

  const [newUser, setNewUser] = useState({
    Email: '',
    FirstName: '',
    LastName: '',
    PhoneNumber: '',
    Password: '',
    Role: '',
  });

  const handleChange = (e) => {
    setNewUser((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleAdd = async () => {
    try {
      const newUserId = await addUser(newUser);
      const addedUser = { IdUser: newUserId, ...newUser };
      onAdd(addedUser); 
      onClose(); 
      console.log('User added successfully');
    } catch (error) {
      console.error('Error adding user:', error);
      console.error('Error details:', error.response);
    }
  };
  return (
    <div className={`modal ${isOpen ? 'open' : 'closed'}`}>
    <div className="modal-content">
    <h2 className="modal-title">{t('addUserTitle')}</h2>
    <label className="input-label">{t('email')}:</label>
        <input
          className="styled-input"
          type="text"
          name="Email"
          value={newUser.Email}
          onChange={handleChange}
        />

        <label>{t('firstName')}:</label>
        <input
          className="styled-input"
          type="text"
          name="FirstName"
          value={newUser.FirstName}
          onChange={handleChange}
        />

        <label>{t('lastName')}:</label>
        <input
          className="styled-input"
          type="text"
          name="LastName"
          value={newUser.LastName}
          onChange={handleChange}
        />

        <label>{t('phoneNumber')}:</label>
        <input
          className="styled-input"
          type="text"
          name="PhoneNumber"
          value={newUser.PhoneNumber}
          onChange={handleChange}
        />

        <label>{t('password')}:</label>
        <input
          className="styled-input"
          type="password"
          name="Password"
          value={newUser.Password}
          onChange={handleChange}
        />

        <label>{t('role')}:</label>
        <input
          className="styled-input"
          type="text"
          name="Role"
          value={newUser.Role}
          onChange={handleChange}
        />
        <div className="button-container">
          <button className="save-button" onClick={handleAdd}>
            {t('save')}
          </button>
          <button className="cancel-button" onClick={onClose}>
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;