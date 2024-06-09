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
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token) => {
    if (!token) {
      console.error('No token provided');
      return;
    }
    localStorage.setItem('token', token);
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUser({ _id: decodedToken.id, username: decodedToken.username });
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const loginUser = async (username, password) => {
    try {
      console.log('Attempting to log in');
      const response = await axios.post('/api/users/login', { username, password });
      console.log('Login response:', response);
      const { token } = response.data;
      console.log('Received token:', token);
      if (!token) {
        throw new Error('Token not found in response');
      }
      login(token);
      navigate('/profile');
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const registerUser = async (username, password) => {
    try {
      console.log('Attempting to register');
      const response = await axios.post('/api/users/register', { username, password });
      console.log('Register response:', response);
      const { token } = response.data;
      console.log('Received token:', token);
      if (!token) {
        throw new Error('Token not found in response');
      }
      login(token);
      navigate('/profile');
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loginUser, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
