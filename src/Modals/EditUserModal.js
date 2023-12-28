import React, { useState } from 'react';
import '../styles/EditUserModal.css';
import { updateUser } from '../Api/ManagementApi';
import { useTranslation } from 'react-i18next';

const EditUserModal = ({ isOpen, onClose, onEdit, user }) => {
  const { t } = useTranslation();
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async () => {
    try {
      await updateUser(user.IdUser, editedUser);
      onEdit(editedUser);
      onClose();
    } catch (error) {
      console.error('Error updating user:', error.message);
    }
  };

  return (
    <div className={`modal ${isOpen ? 'open' : 'closed'}`}>
      <div className="modal-content">
        <h2 className="modal-title">{t('editUserTitle')}</h2>

        {['email', 'firstName', 'lastName', 'phoneNumber'].map((field) => (
          <div key={field}>
            <label className="input-label">{t(`${field}`)}:</label>
            <input
              className="styled-input"
              type="text"
              name={field}
              value={editedUser[field]}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="button-container">
          <button className="save-button" onClick={handleEdit}>
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

export default EditUserModal;
