const mongoose = require('mongoose');

const addressSchema = {
    name: String,
    contact: String,
    pincode: String,
    locality: String,
    address: String,
    State: String,
    district: String,
    landmark: String,
    alternateContact: Number,
    addressType: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}

module.exports = mongoose.model('address', addressSchema);