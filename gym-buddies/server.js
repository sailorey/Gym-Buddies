const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

const userRouter = require('./routes/userRouter');
const workoutRouter = require('./routes/workoutRouter');
const commentRouter = require('./routes/commentRouter');
const measurementRouter = require('./routes/measurementRouter');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"))

// Routes
app.use('/api/users', userRouter);
app.use('/api/workouts', workoutRouter);
app.use('/api/comments', commentRouter);
app.use('/api/measurements', measurementRouter);

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;

mongoose.connect(DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(error => console.error('Database connection error:', error));