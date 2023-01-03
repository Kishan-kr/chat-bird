const Router = require('express').Router();
const fetchUser = require('../middleware/fetchUser');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Endpoint to add message 
Router.post('/add', fetchUser, async (req, res) => {
    const {data, chat} = req.body;
    var sender = req.user.id;
    let success = false;

    if(data === "" || data === null) {
        error = "Please insert some message";
        return res.status(400).json({success, error})
    }
    if(chat === "" || chat === null) {
        error = "Please insert a chat";
        return res.status(400).json({success, error})
    }

    try {
        var message = await (await Message.create({
            data, sender, chat
        })).populate([{
            path: 'sender', model: 'User', select: '-password'
        }, {
            path: 'chat', model: 'Chat'
        }]);
        
        await Chat.findByIdAndUpdate(chat, {
            lastMessage : message
        })
        success = true;
        res.status(200).json({success, message});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error occured');
    }
})

// Endpoint to access all messages of a chat
Router.get('/get-all/:chatId', fetchUser, async (req, res) => {
    let success = false;   
    
    if(!req.params.chatId || req.params.chatId === null ) {
        let error = "chatId is not present in url";
        return res.status(400).json({success, error});
    }

    try {
        const messages = await Message.find({
            'chat' : req.params.chatId
        }).populate([{
            path: 'sender', model: 'User', select: '-password'
        }, {
            path: 'chat', model: 'Chat'
        }]).sort({updatedAt : 1});//updatedAt: -1
    
        if(!messages) {
            error = "No message has been found";
            return res.status(400).json({success, error});
        }
        
        success = true;
        res.status(200).json({success, messages});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error occured');
    }
})

// Endpoint to delete message 
Router.delete('/delete/:id', fetchUser, (req, res) => {
    let success = false;    

    try {
        Message.findByIdAndDelete(req.params.id, (err, message) => {
            if(!message) {
                let error = "No message has been found";
                return res.status(404).json({success, error});
            }
            if(err) {
                return res.status(400).json({success, 'error':err});
            }
            
            success = true;
            msg = "message deleted successfully";
            res.status(200).json({success,message, msg});
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error occured');
    }
});

module.exports = Router;
