var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  "userId":String,
  "userName":String,
  "userPwd":String,
  "firstName":String,
  "lastName":String,
 
});

module.exports = mongoose.model("User",userSchema);
