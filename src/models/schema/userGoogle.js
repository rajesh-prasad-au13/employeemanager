const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: String,
    useremail: String,
    googleId: String,
    thumbnail: String
});

module.exports = mongoose.model('user', userSchema);    //google login

// module.exports = mongoose.model("Register", adminSchema);     //form login or signup