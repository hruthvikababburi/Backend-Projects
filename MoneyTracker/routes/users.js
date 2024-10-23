require('dotenv').config() //loading .env file
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../server')
const { v4: uuidv4 } = require('uuid');

const SECRET_KEY = process.env.SECRET_KEY;  



router.post('/signup', (req, res) => {
    const { username, password } = req.body;
  
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ error: err.message });
  
      const userId = uuidv4();
      const sql = `INSERT INTO users (id, username, password) VALUES (?, ?, ?)`;
  
      db.run(sql, [userId, username, hashedPassword], function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username already exists' });
          }
          return res.status(500).json({ error: err.message });
        }
  
        const token = jwt.sign({ userId, username }, SECRET_KEY, { expiresIn: '1h' });
  
        res.status(201).json({ message: "User registered successfully", userId, token });
      });
    });
  });


router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const sql = `SELECT * FROM users WHERE username = ?`;
  db.get(sql, [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ error: 'Invalid username or password' });
    
    
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!isMatch) return res.status(400).json({ error: 'Invalid username or password' });
      
     
      const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

module.exports = router;