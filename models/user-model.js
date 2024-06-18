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
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address'
    }]
}

module.exports = mongoose.model('user', userSchema);