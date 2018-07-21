var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
// router.use(bodyParser.urlencoded({ extended: false }));
// router.use(bodyParser.json());
var User = require('../models/users');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var VerifyToken = require('../services/verifyToken');
var moment = require('moment');

router.post('/register', function(req, res) {
	if(!req.body.name || !req.body.email || !req.body.password || !req.body.dob){
		return res.status(400).send({status:false,message:'Required parameters not passed'})
	}  
	var regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
console.log('req.body.email.match(regex) :: ' + req.body.email.match(regex));
console.log('!moment(req.body.dob, "YYYY-MM-DD").isValid():'+ !moment(req.body.dob, "YYYY-MM-DD").isValid());
console.log('moment(req.body.dob).diff(moment())>0 :' + moment(req.body.dob).diff(moment())>0);
	// console.log('req.body.email.match(regex) :: ' + req.body.email.match(regex) + '!moment(req.body.dob, "YYYY-MM-DD").isValid():'+ !moment(req.body.dob, "YYYY-MM-DD").isValid() + 'moment(req.body.dob).diff(moment())>0 :' + moment(req.body.dob).diff(moment())>0)
	if(req.body.email.match(regex) == null || !moment(req.body.dob, "YYYY-MM-DD").isValid() || moment(req.body.dob).diff(moment())>0) { // 1st condition for correct email format 2nd for valid date 3rd for checking if dob > today 

		 return res.status(400).send({status:false,message:'Invalid Email/DOB'});
		}
	else 
	{
 	  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
	  var role = req.body.role ? req.body.role : 0
	  User.create({
	    name : req.body.name,
	    email : req.body.email,
	    password : hashedPassword,
	    role:role
	  },
	  function (err, user) {
	    if (err) return res.status(500).send("User already exists with same email.")
	    res.status(200).send({ success: true,message:'User registeration successfull'});
	  }); 
	}
});

router.post('/login', function(req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null , message:'wrong credentials'});
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 7200 // expires in 2 hours
    });

    res.status(200).send({token: token ,message:"success"});
  });
});

module.exports = router;