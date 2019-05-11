const mongoose = require("mongoose");

var User = {
    name: { type : String},
    email: { type: String , required: true},
    password: { type: String, required: true}
}

const userSchema = mongoose.Schema({
  user: User
});
module.exports = mongoose.model("User", userSchema);
