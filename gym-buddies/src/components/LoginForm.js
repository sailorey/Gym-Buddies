import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css'; // Import the CSS file

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted'); // Check if the function is triggered

    const payload = { username, password };
    console.log('Payload:', payload); // Log the payload being sent

    try {
      console.log('Sending login request to server'); // Check if the request is being sent
      const response = await axios.post('http://localhost:5000/api/users/login', payload);
      console.log('Response received:', response.data); // Check the server's response
      login(response.data.token);
      setMessage('User logged in successfully');
      navigate('/profile'); // Redirect to profile page
    } catch (error) {
      console.log('Error:', error.response ? error.response.data : error.message); // Log the error details
      setMessage('Error logging in user');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Log In</h2>
      {message && <p>{message}</p>}
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit">Log In</button>
    </form>
  );
};

export default LoginForm;
