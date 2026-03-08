const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    image: {
        type: String,
        default: "Uploads/!NoProfilePic"
    },
    userID: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    emailID: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cartItems: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Painting",
        default: []
    },
    wishList: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Painting",
        default: []
    },
    purchased: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Painting",
        default: []
    },
});

module.exports = mongoose.model('User', userSchema);