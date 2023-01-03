const express = require("express");
const Router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const genToken = require('../config/generateToken');
const fetchUser = require('../middleware/fetchUser');

// Endpoint to create new user 
Router.post('/create', [
    body('name', 'length of name is too short').isLength({ min: 4 }),
    body('email', 'Email is not valid').isEmail(),
    body('password', "Minimum length of password must be '6'").isLength({ min: 6 })
    .not().isAlpha().withMessage("Password must contain numbers")
    .not().isNumeric().withMessage("Password must contain alphabets")
], async (req, res) => {
    let success = false;
    let anonymous = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

    const { name, email, password, pic } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, 'error': errors.array()[0].msg });
    }
    if(pic !== '') {
       anonymous = pic;
    }
    
    try {
        if (await User.findOne({ email })) {
            let error = 'User already exists with this email id'
            return res.status(403).json({ success, error });
        }

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                console.log(err)
                let error = 'Error in processing password'
                return res.status(400).json({ success, error });
            }

            bcrypt.hash(password, salt, (err, passswordHash) => {
                if (err) {
                    console.log(err);
                    let error = 'Error in processing password'
                    return res.status(400).json({ success, error });
                }

                User.create({
                    name, email, 'password': passswordHash, pic: anonymous
                }).then((user) => {
                    const payload = { 
                        user : {
                            id : user._id}
                    };
                    let token = genToken(payload);
                    success = true;
                    let msg = 'Account created successfully'
                    res.status(200).json({ success, token, msg });
                });
            })
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({success, error});
    }



})

// Endpoint to login 
Router.post('/login', [
    body('email', 'Email is not valid').isEmail(),
    body('password', 'Password must exist').exists()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(401).json({success, error: errors.array()})
    }
    
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            let error = "User doesn't exist";
            return res.status(404).json({ success, error });
        }
    
        if (user && bcrypt.compareSync(password, user.password)) {
            const payload = { 
                user : {
                    id : user._id}
            };
            let token = genToken(payload);
            success = true;
            let msg = 'Logged in successfully'
            return res.status(200).json({ success, token, msg });
        }
        else {
            let error = "Credentials are not correct";
            success = false;
            res.status(401).json({success, error});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success, error});
    }

})

// Endpoint to get user info 
// this must be a 'post' request only, get request will not work 
Router.post('/getuser', fetchUser, async (req, res) => {
    let success = false;
    const userid = req.user.id;

    try {
        User.findById(userid , (err, user) => {
            if(err) {
                return res.status(404).json({success, 'error': err})
            }
            if (!user) {
                let error = 'User not found';
                return res.status(404).json({ success, error });
            }
            success = true;
            res.status(200).json({ success, user });

        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error occured');
    }
})

// Endpoint to search users 
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
        const users = await User.find(keyword).select('-password').find({_id: {$ne: userId}});
        success = true;
        res.status(200).json({success, users});

    } catch(error) {
        console.log(error);
        res.status(500).json({success, error});
    }
})

module.exports = Router;