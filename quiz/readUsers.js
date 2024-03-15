// readUsers.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Middleware to read user data
const addMsgToRequest = function (req, res, next) {
  fs.readFile(path.resolve(__dirname, '../data/users.json'), function(err, data) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: { message: 'Internal Server Error', status: 500 } });
    }
    const users = JSON.parse(data);
    req.users = users;
    next();
  });
}

// Endpoint to retrieve all usernames
router.get('/usernames', addMsgToRequest, (req, res) => {
  if (!req.users) {
    return res.status(404).json({ error: { message: 'Users not found', status: 404 } });
  }
  let usernames = req.users.map(function(user) {
    return { id: user.id, username: user.username };
  });
  res.send(usernames);
});

// Endpoint to retrieve user email by username
router.get('/username/:name', addMsgToRequest, (req, res) => {
  if (!req.users) {
    return res.status(404).json({ error: { message: 'Users not found', status: 404 } });
  }
  const username = req.params.name;
  const user = req.users.find(u => u.username === username);
  if (user) {
    res.send({ email: user.email });
  } else {
    res.status(404).json({ error: { message: 'User not found', status: 404 } });
  }
});

module.exports = router;
