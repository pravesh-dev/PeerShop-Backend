const mongoose = require('mongoose');

const userSchema = {
    name: String,
    email: String,
    contact: Number,
    password: String,
    gender: {
        type: String,
        default: 'N/A'
    },
}

module.exports = mongoose.model('user', userSchema);