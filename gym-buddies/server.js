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


// CORS configuration
const corsOptions = {
  origin: 'https://gym-buddies.onrender.com',
  credentials: true,
};
app.use(cors(corsOptions));


app.use(express.json());
app.use(morgan('dev'));

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
const JWT_SECRET = process.env.JWT_SECRET;

console.log('Environment Variables:');
console.log('PORT:', PORT);
console.log('DB_URI:', DB_URI);
console.log('JWT_SECRET:', JWT_SECRET);

if (!JWT_SECRET) {
  console.error('Error: Missing JWT_SECRET environment variable');
  process.exit(1); // Exit with error code if JWT_SECRET is not set
}

mongoose.connect(DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(error => {
    console.error('Database connection error:', error);
    process.exit(1); // Exit the process with an error code
  });
