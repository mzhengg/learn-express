// server4.js

const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

const readUsersRouter = require('./readUsers');
const writeUsersRouter = require('./writeUsers');

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/read', readUsersRouter);
app.use('/write', writeUsersRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
