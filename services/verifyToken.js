var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/users');
function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
      return res.status(500).send({ auth: false, message: err.name});
    
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    req.isAdmin = user.role;
    req.name = user.name;
    req.email = user.email;
    next()
    // res.status(200).send(user);
    });
    // next();
  });
}
module.exports = verifyToken;