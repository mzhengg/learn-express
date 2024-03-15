const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
var cors = require('cors');
const port = 8000;

let users;

// Middleware to read user data
const addMsgToRequest = function (req, res, next) {
  fs.readFile(path.resolve(__dirname, '../data/users.json'), function(err, data) {
    if(err) {
      console.error(err);
      return res.status(500).json({ error: { message: 'Internal Server Error', status: 500 } });
    }
    users = JSON.parse(data);
    req.users = users;
    next();
  });
}

app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(addMsgToRequest); // Middleware for reading user data

app.get('/read/usernames', (req, res) => {
  if (!req.users) {
    return res.status(404).json({ error: { message: 'Users not found', status: 404 } });
  }
  let usernames = req.users.map(function(user) {
    return {id: user.id, username: user.username};
  });
  res.send(usernames);
});

app.get('/read/username/:name', (req, res) => {
  const username = req.params.name;
  if (!req.users) {
    return res.status(404).json({ error: { message: 'Users not found', status: 404 } });
  }
  const user = req.users.find(u => u.username === username);
  if (user) {
    res.send({ email: user.email });
  } else {
    res.status(404).json({ error: { message: 'User not found', status: 404 } });
  }
});

app.post('/write/adduser', (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
