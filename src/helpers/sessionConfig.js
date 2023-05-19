// const { secret } = require('../secret.json')
const { secret } = process.env

const sessionConfig = {
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 365 * 24 * 60 * 60 * 1000
  }
};

module.exports = sessionConfig;