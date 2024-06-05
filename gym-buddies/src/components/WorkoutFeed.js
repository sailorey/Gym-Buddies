import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/WorkoutFeed.css'; // Import the CSS file

const WorkoutFeed = () => {
  const { authAxios } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const { data } = await authAxios.get('/workouts');
        setWorkouts(data);
      } catch (error) {
        console.error('Error fetching workouts', error);
      }
    };

    fetchWorkouts();
  }, [authAxios]);

  return (
    <div className="workout-feed container">
      <h2>Workout Feed</h2>
      {workouts.map((workout) => (
        <div key={workout._id} className="workout">
          {workout.username && <h1> {workout.username} </h1>}
          <h3>{workout.title}</h3>
          <p>{workout.description}</p>
          <Link to={`/workout/${workout._id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
};

export default WorkoutFeed;
