import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUser({ _id: decodedToken.id, username: decodedToken.username });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    setUser({ _id: decodedToken.id, username: decodedToken.username });
    console.log('User logged in:', decodedToken.username); // Log the username of the logged-in user
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const authAxios = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  

  return (
    <AuthContext.Provider value={{ user, login, logout, authAxios }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
