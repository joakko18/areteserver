// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { Pool } = require('pg');
const pool = new Pool({
  user: "postgres",
  host: "monorail.proxy.rlwy.net",
  database: "railway",
  password: "DBbcb*Ge246CF525Cc6Gg5a6eE365CD1",
  port: 58971, 
});

// Attempt to connect to the PostgreSQL database pool
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database');
    release(); // Release the client back to the pool
  }
});

// Create an Express application
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies

// Define a route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Route for saving a new message
app.post('/newinterested', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        // Insert the message into the database
        await pool.query('INSERT INTO interesado (name, email, message) VALUES ($1, $2, $3)', [name, email, message]);
        res.status(201).json({ message: 'Message saved successfully' });
    } catch (error) {
        console.error('Error saving message:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
