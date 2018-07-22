var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BalancedSchema = new Schema(
{ 
  email:{
   type:String,
   allowNull:false
  },
  name:{
   type:String,
   allowNull:true 
 },
  expression:{
    type: String,
    allowNull:false
 },
  message:{
    type:String,
    allowNull:true
    },
  attempts:{
    type:Number,
    default:1 
  }

});

var balanced = mongoose.model('balanced',BalancedSchema);

module.exports = balanced;


