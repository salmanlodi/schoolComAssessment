var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsersSchema = new Schema(
{ 
 // userId:{
 //    type:String,
 //    unique:true
 //    },
 name:String,
 email:{
   type:String,
   unique:true,
   allowNull:false 
 },
 password:{
    type: String,
    allowNull:false
 },
 dob:{
    type:String,
    allowNull:true
    },
 role:{
    type:Boolean,
    default:0 //1: Admin 0:User
  },
  attempts:{
    type:Number,
    default:0
  },
  status:{
      type:Boolean,
      default:1 //1: active 0: inactive
    }
});

var user = mongoose.model('user',UsersSchema);

module.exports = user;


