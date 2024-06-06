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
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUser({ _id: decodedToken.id, username: decodedToken.username });
      } catch (error) {
        console.error('Invalid token:', error);
        // Optionally, clear the token if it's invalid
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUser({ _id: decodedToken.id, username: decodedToken.username });
    } catch (error) {
      console.error('Invalid token:', error);
      // Optionally, clear the token if it's invalid
      localStorage.removeItem('token');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const authAxios = axios.create({
    baseURL: window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : `${window.location.origin}/api`,
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
