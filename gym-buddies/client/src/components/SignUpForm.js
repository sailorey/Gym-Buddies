import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SignUpForm.css'; // Import the CSS file


const SignUpForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted'); // Check if the function is triggered

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    const payload = { username, password };
    console.log('Payload:', payload); // Log the payload being sent

    try {
      console.log('Sending request to server'); // Check if the request is being sent
      const response = await axios.post('http://localhost:5000/api/users/register', payload);
      console.log('Response received:', response); // Check the server's response
      setMessage('User registered successfully');
    } catch (error) {
      console.log('Error:', error.response ? error.response.data : error.message); // Log the error details
      setMessage('Error registering user');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>

      <h2>Sign Up</h2>
      {message && <p>{message}</p>}
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <label>
        Confirm Password:
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </label>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUpForm;
