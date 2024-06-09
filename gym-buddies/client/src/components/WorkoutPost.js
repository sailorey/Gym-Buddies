import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CommentSection from './CommentSection';
import '../styles/WorkoutPost.css';

const WorkoutPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [workout, setWorkout] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState('');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchWorkout = async () => {
        try {
          const token = localStorage.getItem('token');
          console.log(`Fetching workout with ID: ${id}`);
          const { data } = await axios.get(`/api/workouts/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('Fetched workout data:', data);
          setWorkout(data);
          setTitle(data.title);
          setDescription(data.description);
          setExercises(data.exercises.join(', '));
        } catch (error) {
          console.error('Error fetching workout:', error);
          setMessage('Error fetching workout');
        }
      };

      fetchWorkout();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/workouts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/workouts');
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/workouts/${id}`,
        {
          title,
          description,
          exercises: exercises.split(','),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Workout updated successfully');
      setIsEditing(false);
    } catch (error) {
      setMessage('Error updating workout');
      console.error('Error updating workout:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/workouts',
        {
          title,
          description,
          exercises: exercises.split(','),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Workout posted successfully');
      setTitle('');
      setDescription('');
      setExercises('');
      navigate(`/workout/${response.data._id}`);
    } catch (error) {
      setMessage('Error posting workout');
      console.error('Error posting workout:', error);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  if (!workout && id) return <div>Loading...</div>;

  return (
    <div className="workout-post container">
      {!id ? (
        <form className="form" onSubmit={handleCreate}>
          <h2>Post Workout</h2>
          {message && <p>{message}</p>}
          <label>
            Title:
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </label>
          <label>
            Exercises (comma separated):
            <input type="text" value={exercises} onChange={(e) => setExercises(e.target.value)} />
          </label>
          <button type="submit">Post Workout</button>
        </form>
      ) : isEditing ? (
        <form className="form" onSubmit={handleEdit}>
          <h2>Edit Workout</h2>
          {message && <p>{message}</p>}
          <label>
            Title:
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </label>
          <label>
            Exercises (comma separated):
            <input type="text" value={exercises} onChange={(e) => setExercises(e.target.value)} />
          </label>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={toggleEdit}>Cancel</button>
        </form>
      ) : (
        <>
          <h1>{workout.username}</h1>
          <h2>{workout.title}</h2>
          <p>Description: {workout.description}</p>
          <div>
            <h3>Exercises</h3>
            {workout.exercises.map((exercise, index) => (
              <p key={index}>{exercise}</p>
            ))}
          </div>
          {user && user.username === workout.user.username && (
            <div>
              <button onClick={toggleEdit}>Edit Workout</button>
              <button onClick={handleDelete}>Delete Workout</button>
            </div>
          )}
          <CommentSection workoutId={id} />
        </>
      )}
    </div>
  );
};

export default WorkoutPost;
