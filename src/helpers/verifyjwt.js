const jwt = require('jsonwebtoken');
const secretConfig = require('../secret.json')

function verifyjwt(req, res, next) {
  const token = req.session.user.token

  if (!token) {
    return res.status(401).json('Unauthorized user');
  }

  try {
    const decoded = jwt.verify(token, secretConfig.secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token not valid' });
  }
}

module.exports = verifyjwt;
