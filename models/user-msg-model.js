const mongoose = require('mongoose');

const messageSchema = {
    name: String,
    email: String,
    message: String
}

module.exports = mongoose.model('userMessage', messageSchema);