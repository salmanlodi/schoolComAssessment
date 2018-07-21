var express = require('express');
var router = express.Router();
var VerifyToken = require('../services/verifyToken');
var User = require('../models/users')
/* GET users listing. */
// router.get('/', VerifyToken, function(req, res, next) {
//   console.log(req.userId);
//   console.log(req.isAdmin);
  
//   res.send('respond with a resource');
// });

router.get('/', VerifyToken, function(req, res, next){
	if(req.isAdmin){
		User.find({_id:{$ne:req.userId},status:1},{ password: 0,role:0 },function(err,users){		//fetch all fields except passwords and role for security reasons
		 if (err) return res.status(500).send("There was a problem finding the user.");
     if (!users) return res.status(404).send("No user found.");
			res.send(users);
			// next();
		})
	}
	else{
		res.status(403).send({message:'Forbidden for this user'});
	}
})

//soft delete by changing status to inactive i.e 0(zero)
router.delete('/soft', VerifyToken, function(req, res, next){
	if(!req.body._id){
		return res.status(400).send({status:false,message:'Required parameters not passed.'});
	}
	console.log(req.body);
	if(req.isAdmin){
		User.findOneAndUpdate({_id:req.body._id,status:1},{$set:{status:0}},function(err,users){
		 if (err) return res.status(500).send("There was a problem finding the user.");
     if (!users) return res.status(404).send("No user found.");
			res.send({status:true,message:'User successfully deleted'});
			// next();
		})
	}
	else{
		res.status(403).send({message:'Forbidden for this user'})
	}
})

//removing the user from db which is not soft deleted
router.delete('/hard', VerifyToken, function(req, res, next){
	if(!req.body._id){
		return res.status(400).send({status:false,message:'Required parameters not passed.'});
	}
	console.log(req.body);
	if(req.isAdmin){
		User.findByIdAndRemove({_id:req.body._id,status:1},function(err,user){
		 if (err) return res.status(500).send("There was a problem finding the user.");
     if (!user) return res.status(404).send("No user found.");
			res.send({status:true,message:'User successfully deleted'});
			// next();
		})
		// res.send({status:'authorised'})
	}
	else{
		res.status(403).send({message:'Forbidden for this user'})
	}
})

module.exports = router;
