import { createContext, useContext, useState, useEffect } from 'react';

import { jwtDecode as jwt_decode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('authToken');
    return storedToken || null;
  });
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const extractUserRoleFromToken = (token) => {
      try {
        const decodedToken = jwt_decode(token);
        console.log('Decoded Token:', decodedToken);

        const role = decodedToken ? decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] : null;
        console.log('User Role:', role);

        setUserRole(role);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    };

    if (token) {
      extractUserRoleFromToken(token);
    } else {
      setUserRole(null);
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    console.log('Token set in localStorage:', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setUserRole(null);
    localStorage.removeItem('authToken');
    console.log('Token removed from localStorage.');
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ token, setToken, userRole, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
