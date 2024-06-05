import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <Link to="/">Gym Buddies</Link>
      {user ? (
        <>
          <Link to="/workouts">Workout Feed</Link>
          <Link to="/workout">Post Workout</Link>
          <Link to="/profile">Profile</Link>
          <button className="button" onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/signup">Sign Up</Link>
          <Link to="/login">Login</Link>
        </>
      )}
    </div>
  );
};

export default Navbar;
