const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');  // Import path module

const userRouter = require('./routes/userRouter');
const workoutRouter = require('./routes/workoutRouter');
const commentRouter = require('./routes/commentRouter');
const measurementRouter = require('./routes/measurementRouter');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use('/api/users', userRouter);
app.use('/api/workouts', workoutRouter);
app.use('/api/comments', commentRouter);
app.use('/api/measurements', measurementRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client', 'build')));

// The "catchall" handler: for any request that doesn't match one above,
// send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;

mongoose.connect(DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(error => console.error('Database connection error:', error));
