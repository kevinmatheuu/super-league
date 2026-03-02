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

// Use Routes
app.use('/api/standings', standingsRoute);
app.use('/api/schedule', scheduleRoute); 

// Basic Health Check Route
app.get('/', (req, res) => {
  res.json({ message: "Super League Backend API is running! ⚽" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});