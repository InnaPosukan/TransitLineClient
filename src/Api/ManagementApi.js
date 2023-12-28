import axios from 'axios';

const BASE_URL = 'https://localhost:7074/api/Management';

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/GetAllUsers`);
    return response.data.Users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status !== 200) {
        throw new Error(`Error deleting user: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };
  
export const addUser = async (newUser) => {
    try {
      const authToken = localStorage.getItem('authToken');
  
      const response = await axios.post(
        `https://localhost:7074/api/Management/AssignDriverToOrder`,
        newUser,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status >= 200 && response.status < 300) {
        console.log('User added successfully');
        return response.data;
      } else {
        throw new Error('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };
  
export const updateUser = async (userId, updatedUser) => {
    try {
      const response = await axios.put(`${BASE_URL}/update/${userId}`, updatedUser);
  
      if (response.status >= 200 && response.status < 300) {
        console.log('User updated successfully');
        return response.data;
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  export const getAllDriversWithTrucks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/GetAllDriversWithTrucks`);
      return response.data.Users;
    } catch (error) {
      console.error('Error fetching users with trucks:', error);
      throw error;
    }
  };
  export const AssignDriverToOrder = async (assignDriverDTO) => {
    try {
      const authToken = localStorage.getItem('authToken');
  
      const response = await axios.put(
        `${BASE_URL}/AssignDriverToOrder`,
        assignDriverDTO,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );  
      if (response.status === 200) {
        console.log('Driver assigned successfully');
        return response.data;
      } else {
        throw new Error(`Failed to assign driver. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error assigning driver:', error);
      throw error;
    }
  };
  export const getAllDeliveries = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/GetAllDeliveries`);
      return response.data.Deliveries;
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      throw error;
    }
  };