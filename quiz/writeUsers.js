// writeUsers.js

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

// Endpoint to add a new user
router.post('/adduser', addMsgToRequest, (req, res) => {
  if (!req.users) {
    return res.status(404).json({ error: { message: 'Users not found', status: 404 } });
  }
  let newuser = req.body;
  req.users.push(newuser);
  fs.writeFile(path.resolve(__dirname, '../data/users.json'), JSON.stringify(req.users), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: { message: 'Failed to write', status: 500 } });
    }
    console.log('User Saved');
    res.send('done');
  });
});

module.exports = router;
