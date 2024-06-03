const mongoose = require('mongoose');

const userSchema = {
    name: String,
    email: String,
    contact: Number,
    password: String,
}

module.exports = mongoose.model('user', userSchema);