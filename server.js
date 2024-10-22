const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = 3000;

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD, // Your MySQL password
    database: process.env.DB_NAME,   // Your Database Name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Use `pool.promise()` for promise-based queries
const db = pool.promise();

// Connect to the database
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed: ', err);
        return;
    }
    console.log('Connected to the database.');
    connection.release(); // Release the connection back to the pool
});

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';

    db.query(query)
      .then(([results]) => {
          res.json(results);
      })
      .catch(err => {
          return res.status(500).json({ error: err.message });
      });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_speciality FROM providers';

    db.query(query)
      .then(([results]) => {
          res.json(results);
      })
      .catch(err => {
          return res.status(500).json({ error: err.message });
      });
});

// 3. Filter patients by First Name
app.get('/patients/first-name/:firstName', (req, res) => {
    const firstName = req.params.firstName;
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';

    db.query(query, [firstName])
      .then(([results]) => {
          res.json(results);
      })
      .catch(err => {
          return res.status(500).json({ error: err.message });
      });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/speciality/:speciality', (req, res) => {
    const speciality = req.params.speciality;
    const query = 'SELECT first_name, last_name, provider_speciality FROM providers WHERE provider_speciality = ?';

    db.query(query, [speciality])
      .then(([results]) => {
          res.json(results);
      })
      .catch(err => {
          return res.status(500).json({ error: err.message });
      });
});

// Listen to the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
