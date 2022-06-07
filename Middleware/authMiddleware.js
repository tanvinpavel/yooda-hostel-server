const jwt = require('jsonwebtoken');
require('dotenv').config();

const accessValidation = (req, res, next) => {
    const authorizationToken = req.headers.authorization || req.headers.Authorization;
    if(!authorizationToken?.startsWith("Bearer ")) return res.sendStatus(401);
    const token = authorizationToken.replace('Bearer ', '');
    
    jwt.verify(token, process.env.ACCESSTOKEN, (error, decode) => {
        if(error){
            res.status(403).json('authorization failed');
        }else{
            req.userEmail = decode.UserInfo.email;
            req.roles = decode.UserInfo.roles;
            next();
        }
    });
};

module.exports = accessValidation;