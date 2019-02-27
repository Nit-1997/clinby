//model setup for auth
var mongoose               =  require("mongoose");
var passportLocalMongoose  =  require("passport-local-mongoose");

//user schema 
var userSchema = new mongoose.Schema({
      username:String,
      password:String
});

//Adds a bunch of methods to our user schema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);