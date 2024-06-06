import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/SignUpForm.css';

const SignUpForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    const result = await registerUser(username, password);
    if (result.success) {
      setMessage('User registered successfully');
    } else {
      setMessage(result.message);
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
