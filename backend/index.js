const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const standingsRoute = require('./routes/standings');
const scheduleRoute = require('./routes/schedule'); 
const newsRoute = require('./routes/news');
const matchesRoute = require('./routes/matches');
const leaderboardRoute = require('./routes/leaderboard');

// Use Routes
app.use('/api/standings', standingsRoute);
app.use('/api/schedule', scheduleRoute); 
app.use('/api/news', newsRoute);
app.use('/api/matches', matchesRoute);
app.use('/api/leaderboard', leaderboardRoute);

// Basic Health Check Route
app.get('/', (req, res) => {
  res.json({ message: "Super League Backend API is running! ⚽" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});