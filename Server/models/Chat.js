const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    isgroup : {type : Boolean, default : false},
    members : [{type : mongoose.Schema.Types.ObjectId, ref : "User"}],
    lastMessage : {type : mongoose.Schema.Types.ObjectId, ref : 'Message'},
    groupAdmin : {type : mongoose.Schema.Types.ObjectId, ref : "User"},
}, {timestamps : true});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;