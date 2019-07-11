const express = require('express');
const helmet = require('helmet');

const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

const server = express();

server.get('/', (req, res) => {
  const messageOfTheDay = process.env.MOTD;
  res.send(`<h2>Let's write some middleware!</h2>
    <br>
    <h4>${messageOfTheDay}</h4>
  `);
});

server.use(helmet());
server.use(logger);
server.use(express.json());
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

//custom middleware

function logger(req, res, next) {
  console.log(
    `${req.method} to http://localhost/5000${req.path} at `,
    Date.now(),
  );
  next();
}

module.exports = server;

//
