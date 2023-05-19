const jwt = require('jsonwebtoken');
const { secret } = process.env
// const { secret } = require('../secret.json')

function verifyjwt(req, res, next) {
  if(!req.session.user){
    return res.redirect('/login')
  }

  const token = req.session.user.token

  if (!token) {
    return res.status(401).json('Unauthorized user');
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token not valid' });
  }
}

module.exports = verifyjwt;