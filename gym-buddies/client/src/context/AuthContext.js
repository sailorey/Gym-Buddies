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
    const payload = { username, password };
    try {
      const response = await axios.post(
        `${window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : `${window.location.origin}/api`}/users/login`,
        payload
      );
      login(response.data.token);
      return { success: true };
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, message: 'Error logging in' };
    }
  };

  const registerUser = async (username, password) => {
    const payload = { username, password };
    try {
      const response = await axios.post(
        `${window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : `${window.location.origin}/api`}/users/register`,
        payload
      );
      login(response.data.token);
      return { success: true };
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, message: 'Error registering user' };
    }
  };

  const authAxios = axios.create({
    baseURL: window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : `${window.location.origin}/api`,
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
