const Router = require('express').Router();
const Chat = require('../models/Chat');
const fetchUser = require('../middleware/fetchUser');

// Endpoint to create one to one chat 
Router.post('/open', fetchUser, async (req, res) => {
    const {userId} = req.body;
    const senderId = req.user.id;
    let success = false;

    // check if members is not empty 
    if(!userId || !senderId) {
        error = "Please insert members";
        return res.status(401).json({success, error});
    }

    try {
        // check if chat exists with same members 
        const existChat = await Chat.findOne({
            isgroup : false,
            $and : [{ members :{ $elemMatch : {$eq : userId}}},
                {members : {$elemMatch : {$eq : senderId}}}]
        }).populate({
            path:'members',
            match: { _id: {$ne: senderId }},
            select: '-password'
        })
        
        if(existChat) {
            console.log('chat existed');
            success = true;
            return res.status(200).json({success, existChat});
        }
        
        let chatData = {
            isgroup : false,
            members : [senderId, userId],
        }
        console.log('creating new chat')
        const newChat = await Chat.create(chatData);
        const chat = await Chat.findOne({
            _id: newChat._id
        }).populate({
            path:'members',
            match: { _id: {$ne: senderId }},
            select: '-password'
        })
        if(chat) {
            success = true;
            return res.status(200).json({success, chat});
        }
        
    } catch(error) {
        res.status(500).json({success, error});
    }
    
})

// Endpoint to access all chat of a logged in user
Router.get('/all', fetchUser, async (req, res) => {
    let success = false;
    userId = req.user.id;
    try {
        const chats = await Chat.find({ 
            members :{ $elemMatch : {$eq : userId}}
        }).populate({
            path:'members',
            match: { _id: {$ne: userId }},
            select: '-password'
        }).populate('lastMessage', '-chat').sort({updatedAt : -1});
        
        success = true;
        res.status(200).json({success, chats });
    } catch(error) {
        res.status(500).json({success, error});
    }

})

// Endpoint to delete a chat 
Router.delete('/delete/:id', (req, res) => {
    if(!req.params.id) {
        return res.status(400).json({success: false, error: 'Chat id is required'})
    }

    Chat.findByIdAndDelete(req.params.id, (err, chat) => {
        let success = false;
        if(!chat) {
            let error = 'Requested chat not found';
            return res.status(404).json({success, error});
        }
        if(err) {
            return res.status(404).json({success, "error":err});
        }
        success = true;
        msg = "Chat deleted successfully";
        res.status(200).json({success, msg});
    });
})

// Endpoint to search a chat or user 
//api/chats?search=name
Router.get('/', fetchUser, async (req, res) => {
    let userId = req.user.id;

    //if keyword is not empty, keyword = $or[{name..},{email..}]
    const keyword = req.query.search ? {
        $or: [
            {name: {$regex: req.query.search, $options: "i"}},
            {email: { $regex: req.query.search, $options: "i"}}
        ]
    }: {}
    
    let success = false;
    try {
        const chats = await Chat.find({ 
            members :{ $elemMatch : {$eq : userId}}
        }).populate({
            path:'members',
            match: keyword,
            select: '-password'
        }).populate('lastMessage', '-chat').sort({updatedAt : -1});
        success = true;
        res.status(200).json({success, chats});

    } catch(error) {
        console.log(error);
        res.status(500).json({success, error});
    }
})

// Endpoint to get chat members excluding the requesting user and groupAdmin
Router.get('/members/:chatId', fetchUser, async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user.id; // Get the requesting user's ID
    let success = false;

    try {
        // Fetch the chat and exclude the groupAdmin and requesting user from members
        const chat = await Chat.findById(chatId)
            .populate({
                path: 'members',
                match: { _id: { $ne: userId } },
                select: '-password'
            });

        if (!chat) {
            return res.status(404).json({ success: false, error: 'Chat not found' });
        }

        success = true;
        res.status(200).json({ success, members });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});




module.exports = Router;