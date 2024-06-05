import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import ProfilePage from './components/ProfilePage';
import WorkoutFeed from './components/WorkoutFeed';
import WorkoutPost from './components/WorkoutPost';
import { AuthProvider } from './context/AuthContext';
import './styles/App.css'; // Add this line


const App = () => {
  return (
    <Router>

    <AuthProvider>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/workouts" element={<WorkoutFeed />} />
            <Route path="/workout/:id" element={<WorkoutPost />} />
            <Route path="/workout" element={<WorkoutPost />} /> {/* Using the same component for posting new workouts */}
          </Routes>
        
        </div>
        <Footer />
    </AuthProvider>

    </Router>

  );
};

export default App;
