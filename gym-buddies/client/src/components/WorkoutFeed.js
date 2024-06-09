import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/WorkoutFeed.css';

const WorkoutFeed = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/workouts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWorkouts(data);
      } catch (error) {
        console.error('Error fetching workouts', error);
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <div className="workout-feed container">
      <h2>Workout Feed</h2>
      {workouts.map((workout) => (
        <div key={workout._id} className="workout">
          {workout.username && <h1>{workout.username}</h1>}
          <h3>{workout.title}</h3>
          <p>{workout.description}</p>
          <Link to={`/workout/${workout._id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
};

export default WorkoutFeed;
