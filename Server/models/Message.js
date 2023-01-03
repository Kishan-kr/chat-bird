const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    data : {
        type : String,
        required : true,
        trim : true
    },
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    chat : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Chat"
    },
    status : {
        type : String
    },
}, {timestamps : true});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;