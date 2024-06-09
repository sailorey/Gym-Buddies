import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUser(username, password);
      if (result.success) {
        setMessage('User logged in successfully');
        navigate('/profile'); // Redirect to profile page
      } else {
        setMessage(result.message || 'Login failed');
      }
    } catch (error) {
      setMessage('Login failed');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
