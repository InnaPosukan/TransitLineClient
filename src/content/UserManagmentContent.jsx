import React, { useState, useEffect } from 'react';
import '../styles/UserManagmentContent.css';
import EditUserModal from '../Modals/EditUserModal';
import AddUserModal from '../Modals/AddNewStaffModal';
import { getAllUsers, deleteUser } from '../Api/ManagementApi';
import { useTranslation } from 'react-i18next';

const UserManagementContent = () => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('All');
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('Role');
  const { t } = useTranslation();

  const handleEditUser = (userId) => {
    setEditingUserId(userId);
    setEditModalOpen(true);
  };

  const handleEdit = (editedUser) => {
    setEditModalOpen(false);
  
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.IdUser === editedUser.IdUser ? editedUser : user))
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const users = await getAllUsers();
      setUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.IdUser !== userId));
      console.log(`User with ID ${userId} deleted successfully`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(`User with ID ${userId} not found`);
      } else {
        console.error('Error deleting user:', error);
      }
    }
  };
  

  const handleAddUser = (newUser) => {
    const isUserDuplicate = users.some((user) => user.IdUser === newUser.IdUser);
  
    if (!isUserDuplicate) {
      setUsers((prevUsers) => [...prevUsers, newUser]);
    }
  };

  const handleRoleFilterChange = (selectedRole) => {
    setFilterRole(selectedRole);
  };

  const handleSort = (sortByField) => {
    setSortBy(sortByField);
    setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
  };

  const sortedUsers = users
    .filter((user) => filterRole === 'All' || user.Role === filterRole)
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return (
      <div className="user-management-container">
        <div className="user-management-header">
        <div className="user-management-title">{t('userManagement')}</div>
          <div className="filter-and-button-container">
          <div className="filter-container">
  <label className="filter-label">{t('filterByRole')}:</label>
  <select
    className="role-filter-dropdown"
    value={filterRole}
    onChange={(e) => handleRoleFilterChange(e.target.value)}
  >
    <option value="All">{t('all')}</option>
    <option value="Manager">{t('manager')}</option>
    <option value="Driver">{t('driver')}</option>
    <option value="User">{t('user')}</option>
  </select>
</div>

<button className="add-new-staff-button" onClick={() => setAddModalOpen(true)}>
  {t('addNewStaff')}
</button>

          </div>
        </div>
        <div className="addition-management-title">{t('allStaffMembers')}</div>
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
            <th onClick={() => handleSort('Email')}>{t('email')}</th>
<th onClick={() => handleSort('FirstName')}>{t('firstName')}</th>
<th onClick={() => handleSort('LastName')}>{t('lastName')}</th>
<th onClick={() => handleSort('PhoneNumber')}>{t('phoneNumber')}</th>
<th onClick={() => handleSort('Role')}>{t('role')}</th>
<th>{t('delete')}</th>
<th>{t('edit')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={`user_${user.IdUser}`}>
                <td>{user.Email}</td>
                <td>{user.FirstName}</td>
                <td>{user.LastName}</td>
                <td>{user.PhoneNumber}</td>
                <td>{user.Role}</td>
                <td>
                  <button className="delete-button" onClick={() => handleDeleteUser(user.IdUser)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
                <td>
                  <button className="edit-button" onClick={() => handleEditUser(user.IdUser)}>
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onEdit={handleEdit}
        user={users.find((user) => user.IdUser === editingUserId)}
      />
      <AddUserModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onAdd={handleAddUser} />
    </div>
  );
};

export default UserManagementContent;
