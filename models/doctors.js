var mongoose    = require("mongoose");
var DoctorSchema = new mongoose.Schema({
     fullName       : String,
     image      : String,
     consultation   : String,
     special: String,
     location   : String,
     experience : String,
     createdAt  : { type: Date, default: Date.now },      
});

module.exports = mongoose.model("Doctor",DoctorSchema);