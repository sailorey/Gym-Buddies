import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Chart from 'chart.js/auto';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [measurements, setMeasurements] = useState([]);
  const [weight, setWeight] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const chartRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const measurementsPerPage = 10;

  useEffect(() => {
    const fetchMeasurements = async () => {
      if (!user || !user._id) return;
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`/api/measurements/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched measurements:', data);
        setMeasurements(data);
        setChart(data);
      } catch (error) {
        console.error('Error fetching measurements', error);
      }
    };

    fetchMeasurements();
  }, [user]);

  const handleAddMeasurement = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('/api/measurements', { weight }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Measurement added:', data);
      setMeasurements((prevMeasurements) => {
        const newMeasurements = [...prevMeasurements, data];
        setChart(newMeasurements);
        return newMeasurements;
      });
      setWeight('');
    } catch (error) {
      console.error('Error adding measurement', error);
    }
  };

  const handleEditMeasurement = (measurement) => {
    setEditingMeasurement(measurement);
    setEditWeight(measurement.weight);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(`/api/measurements/${editingMeasurement._id}`, { weight: editWeight }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Measurement updated:', data);
      setMeasurements((prevMeasurements) => {
        const newMeasurements = prevMeasurements.map((m) => (m._id === editingMeasurement._id ? data : m));
        setChart(newMeasurements);
        return newMeasurements;
      });
      setEditingMeasurement(null);
      setEditWeight('');
    } catch (error) {
      console.error('Error updating measurement', error);
    }
  };

  const handleDeleteMeasurement = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/measurements/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Measurement deleted:', id);
      setMeasurements((prevMeasurements) => {
        const newMeasurements = prevMeasurements.filter((m) => m._id !== id);
        setChart(newMeasurements);
        return newMeasurements;
      });
    } catch (error) {
      console.error('Error deleting measurement', error);
    }
  };

  const setChart = (data) => {
    const ctx = document.getElementById('progressChart').getContext('2d');
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((m) => new Date(m.date).toLocaleDateString()),
        datasets: [{
          label: 'Weight',
          data: data.map((m) => m.weight),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  const indexOfLastMeasurement = currentPage * measurementsPerPage;
  const indexOfFirstMeasurement = indexOfLastMeasurement - measurementsPerPage;
  const currentMeasurements = measurements.slice(indexOfFirstMeasurement, indexOfLastMeasurement);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h1>{user.username}'s Profile</h1>
      <div className="progress-tracker">
        <h2>Progress Tracker</h2>
        <form onSubmit={handleAddMeasurement}>
          <label>
            Weight:
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
          </label>
          <button type="submit">Add Measurement</button>
        </form>
        <div className="measurements">
          {currentMeasurements.map((measurement) => (
            <div key={measurement._id} className="measurement">
              <p>{new Date(measurement.date).toLocaleDateString()}: {measurement.weight} lbs</p>
              <button className="edit" onClick={() => handleEditMeasurement(measurement)}>Edit</button>
              <button className="delete" onClick={() => handleDeleteMeasurement(measurement._id)}>Delete</button>
            </div>
          ))}
        </div>
        {editingMeasurement && (
          <form onSubmit={handleSaveEdit}>
            <label>
              Edit Weight:
              <input type="number" value={editWeight} onChange={(e) => setEditWeight(e.target.value)} required />
            </label>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingMeasurement(null)}>Cancel</button>
          </form>
        )}
        <div className="pagination">
          {[...Array(Math.ceil(measurements.length / measurementsPerPage)).keys()].map(number => (
            <button key={number + 1} onClick={() => paginate(number + 1)}>
              {number + 1}
            </button>
          ))}
        </div>
        <canvas id="progressChart"></canvas>
      </div>
    </div>
  );
};

export default ProfilePage;
