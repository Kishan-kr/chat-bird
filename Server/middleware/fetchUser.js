const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWTsecret;

const fetchUser = (req, res, next) => {
    const authtoken = req.header('token');
    if(!authtoken || authtoken === null) {
        return res.status(401).json({'error' : 'Unauthorized request'});
    }

    const decoded = jwt.verify(authtoken, secret);
    req.user = decoded.user;
    next();
}

module.exports = fetchUser;