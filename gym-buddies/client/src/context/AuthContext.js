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
      const response = await axios.post('https://gym-buddies.onrender.com/api/users/login', { username, password });
      console.log('Login response:', response);
      if (response.data && response.data.token) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUser({ _id: decodedToken.id, username: decodedToken.username });
        navigate('/profile');
      } else {
        console.error('Token not found in response');
        throw new Error('Token not found in response');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const registerUser = async (username, password) => {
    try {
      const response = await axios.post('https://gym-buddies.onrender.com/api/users/register', { username, password });
      console.log('Register response:', response);
      if (response.data && response.data.token) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUser({ _id: decodedToken.id, username: decodedToken.username });
        navigate('/profile');
      } else {
        console.error('Token not found in response');
        throw new Error('Token not found in response');
      }
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  };

  const authAxios = axios.create({
    baseURL: 'https://gym-buddies.onrender.com/api',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return (
    <AuthContext.Provider value={{ user, login, logout, loginUser, registerUser, authAxios }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
