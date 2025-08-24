const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./restaurant.db');

// Create tables if not exist
db.run(`
  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS onboarding (
    id INTEGER PRIMARY KEY,
    completed BOOLEAN
  )
`);

// Save profile
app.post('/api/profile', (req, res) => {
  const data = JSON.stringify(req.body);
  db.run('DELETE FROM profile');
  db.run('INSERT INTO profile (data) VALUES (?)', [data], function(err) {
    if (err) return res.status(500).send(err.message);
    res.sendStatus(200);
  });
});

// Get profile
app.get('/api/profile', (req, res) => {
  db.get('SELECT data FROM profile LIMIT 1', (err, row) => {
    if (err) return res.status(500).send(err.message);
    res.json(row ? JSON.parse(row.data) : null);
  });
});

// Set onboarding completed
app.post('/api/onboarding', (req, res) => {
  db.run('DELETE FROM onboarding');
  db.run('INSERT INTO onboarding (id, completed) VALUES (1, ?)', [req.body.completed], function(err) {
    if (err) return res.status(500).send(err.message);
    res.sendStatus(200);
  });
});

// Check onboarding completed
app.get('/api/onboarding', (req, res) => {
  db.get('SELECT completed FROM onboarding WHERE id = 1', (err, row) => {
    if (err) return res.status(500).send(err.message);
    res.json({ completed: row ? !!row.completed : false });
  });
});

// Clear user data
app.delete('/api/user', (req, res) => {
  db.run('DELETE FROM profile');
  db.run('DELETE FROM onboarding');
  res.sendStatus(200);
});

app.listen(3001, () => console.log('Server running on port 3001'));