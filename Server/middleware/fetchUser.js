const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWTsecret;

const fetchUser = (req, res, next) => {
    try {
        const authtoken = req.header('token');
        if(!authtoken || authtoken === null) {
            return res.status(401).json({'error' : 'Unauthorized request'});
        }
    
        const decoded = jwt.verify(authtoken, secret);
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error(error)
        return res.status(401).json({'error' : 'Unauthorized request'});
    }
}

module.exports = fetchUser;