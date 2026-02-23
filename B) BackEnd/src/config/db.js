const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/StrokeStudio");
        console.log('Connection Successful');
    } catch (error) {
        console.error(error);
    }
};

module.exports = connectDB;
