const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// @route   POST /api/auth/login
// @desc    Mock login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Mock auth for now
  if (username === 'test' && password === 'test') {
    const token = jwt.sign({ id: 1, username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.json({ token, user: { username } });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
