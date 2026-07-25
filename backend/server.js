const express = require('express');
const cors = require('cors');
require('dotenv').config();

const auditRoutes = require('./routes/audit');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all frontend origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Main API Routes
app.use('/api', auditRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({ message: "Page Pulse API is running 🚀" });
});

app.listen(PORT, () => {
  console.log(`[PagePulse API] Server running on port ${PORT}`);
});