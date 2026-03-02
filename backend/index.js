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

// Use Routes
// This tells Express: "Any request starting with /api/standings should be handled by the standingsRoute file"
app.use('/api/standings', standingsRoute);

// Basic Health Check Route
app.get('/', (req, res) => {
  res.json({ message: "Super League Backend API is running! " });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});