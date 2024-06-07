const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

dotenv.config();

const userRouter = require('./routes/userRouter');
const workoutRouter = require('./routes/workoutRouter');
const commentRouter = require('./routes/commentRouter');
const measurementRouter = require('./routes/measurementRouter');

const app = express();

const corsOptions = {
  origin: '*', // Allow all origins for testing
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  console.log('Request Body:', req.body); // Log the request body
  next();
});

app.use('/api/users', userRouter);
app.use('/api/workouts', workoutRouter);
app.use('/api/comments', commentRouter);
app.use('/api/measurements', measurementRouter);

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5001;
const DB_URI = process.env.DB_URI;

console.log('DB_URI:', DB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('PORT:', PORT);

mongoose.connect(DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  })
  .catch(error => {
    console.error('Database connection error:', error);
    process.exit(1); // Exit the process with an error code
  });
