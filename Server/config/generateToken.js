require('dotenv').config();
const jsonwebtoken = require('jsonwebtoken');

const generateToken = (payload) => {
    const token = jsonwebtoken.sign(payload, process.env.JWTsecret, {expiresIn: "30d"});
    return token;
}

module.exports = generateToken;