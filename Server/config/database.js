const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.DATABASE || "mongodb://localhost:27017/chat-bird";

const connectToMongo = () => {
    mongoose.set('strictQuery' , true);
    mongoose.connect(mongoURI, {
        useUnifiedTopology : true
    },(err) => {
        if(err) {
            console.log('Database could not connect :', err);
        }
        console.log("connected mongodb successfully");
    })
};

module.exports = connectToMongo;
