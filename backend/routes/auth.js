const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();
const users = [{ username: 'test', password: bcrypt.hashSync('password', 10) }]; // Sample user

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ message: 'User not found' });

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

  const token = jwt.encode({ username }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;
