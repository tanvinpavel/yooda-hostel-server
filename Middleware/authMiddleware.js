const jwt = require('jsonwebtoken');
require('dotenv').config();

const accessValidation = (req, res, next) => {
    const authorizationToken = req.headers.authorization || '';
    const token = authorizationToken.replace('Bearer ', '');
    jwt.verify(token, process.env.ACCESSTOKEN, (error, decode) => {
        if(error){
            res.status(403).json('authorization failed');
        }else{
            req.userEmail = decode.email;
            next();
        }
    });
};

module.exports = accessValidation;